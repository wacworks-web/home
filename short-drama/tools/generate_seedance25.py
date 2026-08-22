#!/usr/bin/env python3
"""Seedance 2.5 (Replicate) 生成スクリプト — Mac以外の環境用フォールバック。

Macでは ~/okane-uragawa/gen_seedance.py を使うこと（実績あり）。
本スクリプトは Replicate API を直接叩く。DRAMA_HANDOFF.md の教訓を反映:
  - POST自体もリトライする（3回・20秒待ち）
  - ポーリングは最大10分、一時的な接続断はリトライ
  - 音声付き生成前提（プロンプト側に no background music 等を記述済み）

認証: 環境変数 REPLICATE_API_TOKEN、なければ ~/.replicate_key を読む。

使い方:
  python generate_seedance25.py --shots ../ep1/shots25.json [--only ep1_part1] [--take 2]
"""

import argparse
import json
import os
import sys
import time
from pathlib import Path

import requests

MODEL = "bytedance/seedance-2.5"
API = f"https://api.replicate.com/v1/models/{MODEL}/predictions"
POST_RETRIES = 3
POST_RETRY_WAIT = 20
POLL_INTERVAL = 10
POLL_TIMEOUT = 10 * 60


def get_token() -> str:
    tok = os.environ.get("REPLICATE_API_TOKEN")
    if not tok:
        keyfile = Path.home() / ".replicate_key"
        if keyfile.exists():
            tok = keyfile.read_text().strip()
    if not tok:
        sys.exit("ERROR: REPLICATE_API_TOKEN か ~/.replicate_key を用意してください")
    return tok


def create_prediction(headers: dict, payload: dict) -> dict:
    last = None
    for attempt in range(1, POST_RETRIES + 1):
        try:
            r = requests.post(API, json=payload, headers=headers, timeout=60)
            if r.status_code == 402:
                sys.exit("ERROR: Replicate残高切れ(402)。replicate.com/account/billing でチャージしてください")
            r.raise_for_status()
            return r.json()
        except SystemExit:
            raise
        except Exception as e:
            last = e
            print(f"  POST失敗 (attempt {attempt}/{POST_RETRIES}): {e}", file=sys.stderr)
            time.sleep(POST_RETRY_WAIT)
    raise RuntimeError(f"POSTが{POST_RETRIES}回失敗: {last}")


def poll(headers: dict, url: str) -> dict:
    start = time.time()
    while time.time() - start < POLL_TIMEOUT:
        try:
            s = requests.get(url, headers=headers, timeout=60).json()
        except Exception as e:
            print(f"  poll接続エラー、リトライ: {e}", file=sys.stderr)
            time.sleep(POLL_INTERVAL)
            continue
        status = s.get("status")
        if status == "succeeded":
            return s
        if status in ("failed", "canceled"):
            raise RuntimeError(f"生成失敗: {s.get('error')}")
        time.sleep(POLL_INTERVAL)
    raise TimeoutError("10分以内に完了しませんでした")


def download(url: str, dest: Path) -> None:
    r = requests.get(url, stream=True, timeout=300)
    r.raise_for_status()
    with open(dest, "wb") as f:
        for chunk in r.iter_content(chunk_size=1 << 16):
            f.write(chunk)
    print(f"  saved -> {dest} ({dest.stat().st_size / 1e6:.1f} MB)")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--shots", required=True, help="shots25.json のパス")
    ap.add_argument("--only", nargs="*", help="指定 id のみ生成（リテイク用）")
    ap.add_argument("--take", type=int, default=1)
    args = ap.parse_args()

    headers = {"Authorization": f"Bearer {get_token()}", "Content-Type": "application/json"}
    shots_path = Path(args.shots).resolve()
    data = json.loads(shots_path.read_text(encoding="utf-8"))
    out_dir = shots_path.parent / data.get("defaults", {}).get("output_dir", "renders")
    out_dir.mkdir(parents=True, exist_ok=True)

    shots = data["shots"]
    if args.only:
        shots = [s for s in shots if s["id"] in set(args.only)]

    failed = []
    for shot in shots:
        dest = out_dir / f"{shot['id']}_take{args.take}.mp4"
        if dest.exists():
            print(f"[skip] {dest.name} は既に存在（--take を変えてください）")
            continue
        prompt = shot["prompt"]
        if shot.get("prompt_file"):
            prompt = (shots_path.parent / shot["prompt_file"]).read_text(encoding="utf-8").strip()
        inputs = dict(data.get("defaults", {}).get("input", {}))
        inputs.update(shot.get("input", {}))
        inputs["prompt"] = prompt
        print(f"[gen ] {shot['id']} ({inputs.get('duration')}s) ...")
        try:
            pred = create_prediction(headers, {"input": inputs})
            result = poll(headers, pred["urls"]["get"])
            out = result["output"]
            url = out[0] if isinstance(out, list) else out
            download(url, dest)
        except SystemExit:
            raise
        except Exception as e:
            print(f"  FAILED: {e}", file=sys.stderr)
            failed.append(shot["id"])

    if failed:
        print(f"\n失敗: {' '.join(failed)}  → --only {' '.join(failed)} でリテイク")
        sys.exit(1)
    print(f"\n全パート完了。出力先: {out_dir}")


if __name__ == "__main__":
    main()
