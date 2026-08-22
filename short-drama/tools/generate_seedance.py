#!/usr/bin/env python3
"""Seedance 1.0 一括動画生成スクリプト。

shots.json を読み、各カットを Seedance API で生成して mp4 を保存する。
プロバイダは 2 系統をサポート:

  fal  : fal.ai (https://fal.ai/models/fal-ai/bytedance/seedance/v1/pro/text-to-video)
         環境変数 FAL_KEY が必要
  ark  : BytePlus ModelArk (https://docs.byteplus.com/en/docs/ModelArk/)
         環境変数 ARK_API_KEY が必要（モデルIDは --model で上書き可）

使い方:
  pip install -r requirements.txt
  export FAL_KEY=...            # または export ARK_API_KEY=...
  python generate_seedance.py --shots ../ep1/shots.json --provider fal
  python generate_seedance.py --shots ../ep1/shots.json --provider fal --resolution 720p   # 試作用に安く
  python generate_seedance.py --shots ../ep1/shots.json --only ep1_cut03 ep1_cut06         # リテイク

shots.json の shot に first_frame_image (URL) を指定すると image-to-video になり、
キャラクターの一貫性が向上する（fal はURL必須。ローカル画像は先にアップロードする）。
"""

import argparse
import json
import os
import sys
import time
from pathlib import Path

import requests

POLL_INTERVAL = 5  # seconds
TIMEOUT = 15 * 60  # seconds per shot


def die(msg: str) -> None:
    print(f"ERROR: {msg}", file=sys.stderr)
    sys.exit(1)


def download(url: str, dest: Path) -> None:
    r = requests.get(url, stream=True, timeout=120)
    r.raise_for_status()
    with open(dest, "wb") as f:
        for chunk in r.iter_content(chunk_size=1 << 16):
            f.write(chunk)
    print(f"  saved -> {dest} ({dest.stat().st_size / 1e6:.1f} MB)")


# ---------------------------------------------------------------- fal.ai
def generate_fal(shot: dict, defaults: dict, args) -> str:
    key = os.environ.get("FAL_KEY") or die("環境変数 FAL_KEY を設定してください")
    variant = "image-to-video" if shot.get("first_frame_image") else "text-to-video"
    endpoint = f"https://queue.fal.run/fal-ai/bytedance/seedance/v1/pro/{variant}"
    payload = {
        "prompt": shot["prompt"],
        "aspect_ratio": defaults.get("aspect_ratio", "9:16"),
        "resolution": args.resolution or defaults.get("resolution", "1080p"),
        "duration": str(shot.get("duration", 5)),
    }
    if shot.get("first_frame_image"):
        payload["image_url"] = shot["first_frame_image"]

    headers = {"Authorization": f"Key {key}", "Content-Type": "application/json"}
    r = requests.post(endpoint, json=payload, headers=headers, timeout=60)
    r.raise_for_status()
    req = r.json()
    status_url = req["status_url"]
    response_url = req["response_url"]

    start = time.time()
    while True:
        if time.time() - start > TIMEOUT:
            raise TimeoutError(f"{shot['id']}: 生成がタイムアウトしました")
        s = requests.get(status_url, headers=headers, timeout=60).json()
        status = s.get("status")
        if status == "COMPLETED":
            break
        if status in ("FAILED", "ERROR"):
            raise RuntimeError(f"{shot['id']}: 生成失敗 {s}")
        time.sleep(POLL_INTERVAL)

    result = requests.get(response_url, headers=headers, timeout=60).json()
    return result["video"]["url"]


# ------------------------------------------------------- BytePlus ModelArk
def generate_ark(shot: dict, defaults: dict, args) -> str:
    key = os.environ.get("ARK_API_KEY") or die("環境変数 ARK_API_KEY を設定してください")
    base = os.environ.get("ARK_BASE_URL", "https://ark.ap-southeast.bytepluses.com/api/v3")
    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}

    resolution = args.resolution or defaults.get("resolution", "1080p")
    ratio = defaults.get("aspect_ratio", "9:16")
    text = (
        f"{shot['prompt']} "
        f"--ratio {ratio} --resolution {resolution} --duration {shot.get('duration', 5)}"
    )
    content = [{"type": "text", "text": text}]
    if shot.get("first_frame_image"):
        content.append({"type": "image_url", "image_url": {"url": shot["first_frame_image"]}})

    r = requests.post(
        f"{base}/contents/generations/tasks",
        json={"model": args.model, "content": content},
        headers=headers,
        timeout=60,
    )
    r.raise_for_status()
    task_id = r.json()["id"]

    start = time.time()
    while True:
        if time.time() - start > TIMEOUT:
            raise TimeoutError(f"{shot['id']}: 生成がタイムアウトしました")
        s = requests.get(f"{base}/contents/generations/tasks/{task_id}", headers=headers, timeout=60).json()
        status = s.get("status")
        if status == "succeeded":
            return s["content"]["video_url"]
        if status in ("failed", "cancelled"):
            raise RuntimeError(f"{shot['id']}: 生成失敗 {s}")
        time.sleep(POLL_INTERVAL)


def main() -> None:
    ap = argparse.ArgumentParser(description="Seedance 一括生成")
    ap.add_argument("--shots", required=True, help="shots.json のパス")
    ap.add_argument("--provider", choices=["fal", "ark"], default="fal")
    ap.add_argument("--model", default="seedance-1-0-pro-250528", help="ark用モデルID")
    ap.add_argument("--resolution", help="720p / 1080p（省略時は shots.json の defaults）")
    ap.add_argument("--only", nargs="*", help="指定した shot id のみ生成（リテイク用）")
    ap.add_argument("--take", type=int, default=1, help="テイク番号（ファイル名に付く）")
    args = ap.parse_args()

    shots_path = Path(args.shots).resolve()
    data = json.loads(shots_path.read_text(encoding="utf-8"))
    defaults = data.get("defaults", {})
    out_dir = shots_path.parent / defaults.get("output_dir", "renders")
    out_dir.mkdir(parents=True, exist_ok=True)

    shots = data["shots"]
    if args.only:
        shots = [s for s in shots if s["id"] in set(args.only)]
        if not shots:
            die(f"--only に一致する shot がありません: {args.only}")

    gen = generate_fal if args.provider == "fal" else generate_ark
    failed = []
    for shot in shots:
        dest = out_dir / f"{shot['id']}_take{args.take}.mp4"
        if dest.exists():
            print(f"[skip] {dest.name} は既に存在します（--take を変えてください）")
            continue
        print(f"[gen ] {shot['id']} ({shot.get('duration', 5)}s) ...")
        try:
            url = gen(shot, defaults, args)
            download(url, dest)
        except Exception as e:  # 1カット失敗しても残りは続行
            print(f"  FAILED: {e}", file=sys.stderr)
            failed.append(shot["id"])

    print()
    if failed:
        print(f"失敗したカット: {' '.join(failed)}")
        print(f"リテイク: python {Path(__file__).name} --shots {shots_path} --only {' '.join(failed)}")
        sys.exit(1)
    print(f"全カット完了。出力先: {out_dir}")


if __name__ == "__main__":
    main()
