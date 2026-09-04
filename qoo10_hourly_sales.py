#!/usr/bin/env python3
"""Qoo10 QSM Open API (ebayjapan.qapi) を使って、指定ブランド（例: LAGOM）の
注文データを取得し、2つの日付の「時間別売上」を比較するツール。

使い方の概要:
    python qoo10_hourly_sales.py --date1 2025-09-04 --date2 2025-06-05

認証情報はコマンドライン引数には渡さず、環境変数か設定ファイル(config.json)から
読み込みます。詳しくは README.md を参照してください。

注意: Claude の実行環境からは api.qoo10.jp へ到達できないため、
このスクリプトはネットワーク制限のないローカル環境で実行してください。
"""
from __future__ import annotations

import argparse
import csv
import json
import os
import sys
import time
from collections import defaultdict
from datetime import datetime

import requests

API_BASE = "https://api.qoo10.jp/GMKT.INC.Front.QAPIService/ebayjapan.qapi"
QAPI_VERSION = "1.0"
# GetShippingInfo_v3 は 1回のリクエストで 1つの ShippingStatus しか返さないため、
# 全ステータスをループして OrderNo で重複排除する。
SHIPPING_STATUSES = ["1", "2", "3", "4", "5"]
# SearchCondition: どの日付で期間フィルタするか。1=注文日, 2=決済日 が有力（要公式ドキュメント確認）。
DATE_BASIS = {"order": "1", "payment": "2"}

# 注文日時のパースで試すフォーマット
_DT_FORMATS = [
    "%Y-%m-%d %H:%M:%S",
    "%Y/%m/%d %H:%M:%S",
    "%Y-%m-%d %H:%M",
    "%Y/%m/%d %H:%M",
    "%Y-%m-%dT%H:%M:%S",
    "%Y-%m-%d",
    "%Y/%m/%d",
]


class Qoo10Error(RuntimeError):
    pass


def load_config(config_path: str | None) -> dict:
    """認証情報を環境変数と設定ファイルから読み込む。環境変数を優先。"""
    cfg: dict = {}
    if config_path and os.path.exists(config_path):
        with open(config_path, encoding="utf-8") as f:
            cfg.update(json.load(f))
    for key in ("api_key", "cert_key", "user_id", "pwd"):
        env = os.environ.get("QOO10_" + key.upper())
        if env:
            cfg[key] = env
    return cfg


def create_certification_key(api_key: str, user_id: str, pwd: str) -> str:
    """QSMログイン情報とAPIキーから認証キー(certification key)を発行する。"""
    headers = {"GiosisCertificationKey": api_key}
    data = {
        "v": QAPI_VERSION,
        "returnType": "json",
        "method": "CertificationAPI.CreateCertificationKey",
        "user_id": user_id,
        "pwd": pwd,
    }
    resp = requests.post(API_BASE, headers=headers, data=data, timeout=30)
    resp.raise_for_status()
    body = resp.json()
    if str(body.get("ResultCode")) != "0":
        raise Qoo10Error(
            f"認証キー発行に失敗: ResultCode={body.get('ResultCode')} "
            f"ResultMsg={body.get('ResultMsg') or body.get('ResultMessage')}"
        )
    cert = body.get("ResultObject")
    if isinstance(cert, dict):
        # 念のため：オブジェクトで返る場合のフォールバック
        cert = cert.get("CertificationKey") or cert.get("ResultObject") or ""
    if not cert:
        raise Qoo10Error(f"認証キーがレスポンスに含まれていません: {body}")
    return str(cert)


def _to_yyyymmdd(date_str: str) -> str:
    return datetime.strptime(date_str, "%Y-%m-%d").strftime("%Y%m%d")


def fetch_orders(cert_key: str, date_str: str, search_condition: str) -> list[dict]:
    """指定日の注文レコードを全ステータス分取得し、OrderNoで重複排除して返す。"""
    ymd = _to_yyyymmdd(date_str)
    headers = {"GiosisCertificationKey": cert_key, "QAPIVersion": QAPI_VERSION}
    seen: dict[str, dict] = {}
    for status in SHIPPING_STATUSES:
        data = {
            "returnType": "json",
            "method": "ShippingBasic.GetShippingInfo_v3",
            "ShippingStatus": status,
            "SearchStartDate": ymd,
            "SearchEndDate": ymd,
            "SearchCondition": search_condition,
        }
        for attempt in range(3):
            try:
                resp = requests.post(API_BASE, headers=headers, data=data, timeout=60)
                resp.raise_for_status()
                break
            except requests.RequestException as exc:
                if attempt == 2:
                    raise Qoo10Error(f"注文取得に失敗(status={status}): {exc}") from exc
                time.sleep(2 ** attempt)
        body = resp.json()
        if str(body.get("ResultCode")) != "0":
            raise Qoo10Error(
                f"注文取得に失敗(status={status}): ResultCode={body.get('ResultCode')} "
                f"ResultMsg={body.get('ResultMsg') or body.get('ResultMessage')}"
            )
        rows = body.get("ResultObject") or []
        if isinstance(rows, dict):
            rows = [rows]
        for row in rows:
            order_no = str(row.get("OrderNo") or row.get("orderNo") or "")
            if not order_no:
                continue
            seen[order_no] = row
        time.sleep(0.3)  # 軽いレート制御
    return list(seen.values())


def _row_amount(row: dict) -> float:
    total = row.get("Total") or row.get("OrderPrice")
    if total not in (None, ""):
        try:
            return float(total)
        except (TypeError, ValueError):
            pass
    sell = row.get("SellPrice") or 0
    qty = row.get("OrderQty") or row.get("Quantity") or 0
    try:
        return float(sell) * float(qty)
    except (TypeError, ValueError):
        return 0.0


def _row_hour(row: dict, date_field: str) -> int | None:
    raw = row.get(date_field) or row.get("OrderDate") or row.get("PaymentDate")
    if not raw:
        return None
    raw = str(raw).strip()
    for fmt in _DT_FORMATS:
        try:
            dt = datetime.strptime(raw, fmt)
        except ValueError:
            continue
        if fmt in ("%Y-%m-%d", "%Y/%m/%d"):
            return None  # 時刻情報なし
        return dt.hour
    return None


def _is_valid_sale(row: dict) -> bool:
    claim = row.get("ClaimStatus")
    if claim not in (None, "", "0", 0):
        return False  # キャンセル・返品・クレーム等は除外
    return True


def aggregate_hourly(rows: list[dict], date_field: str) -> tuple[dict, dict, int]:
    """時間別の売上額と件数を集計。時刻不明レコード数も返す。"""
    amount = defaultdict(float)
    count = defaultdict(int)
    unknown = 0
    for row in rows:
        if not _is_valid_sale(row):
            continue
        hour = _row_hour(row, date_field)
        if hour is None:
            unknown += 1
            continue
        amount[hour] += _row_amount(row)
        count[hour] += 1
    return amount, count, unknown


def _fmt_money(v: float) -> str:
    return f"{v:,.0f}"


def print_comparison(date1: str, date2: str, agg1, agg2) -> None:
    amt1, cnt1, unk1 = agg1
    amt2, cnt2, unk2 = agg2
    print()
    print(f"時間別売上比較  {date1}  vs  {date2}")
    print("=" * 78)
    header = f"{'時間':>4} | {date1+' 売上':>16} {'件数':>5} | {date2+' 売上':>16} {'件数':>5} | {'差額':>14}"
    print(header)
    print("-" * len(header))
    total1 = total2 = 0.0
    tc1 = tc2 = 0
    for h in range(24):
        a1, c1 = amt1.get(h, 0.0), cnt1.get(h, 0)
        a2, c2 = amt2.get(h, 0.0), cnt2.get(h, 0)
        total1 += a1
        total2 += a2
        tc1 += c1
        tc2 += c2
        print(
            f"{h:02d}時 | {_fmt_money(a1):>16} {c1:>5} | "
            f"{_fmt_money(a2):>16} {c2:>5} | {_fmt_money(a1 - a2):>14}"
        )
    print("-" * len(header))
    print(
        f"合計 | {_fmt_money(total1):>16} {tc1:>5} | "
        f"{_fmt_money(total2):>16} {tc2:>5} | {_fmt_money(total1 - total2):>14}"
    )
    if unk1 or unk2:
        print()
        print(
            f"注意: 時刻情報を取得できなかった注文があります "
            f"({date1}: {unk1}件, {date2}: {unk2}件)。"
            " APIの OrderDate が日付のみの可能性があります。README を参照してください。"
        )


def write_csv(path: str, date1: str, date2: str, agg1, agg2) -> None:
    amt1, cnt1, _ = agg1
    amt2, cnt2, _ = agg2
    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f)
        w.writerow(
            ["hour", f"{date1}_amount", f"{date1}_count", f"{date2}_amount", f"{date2}_count", "amount_diff"]
        )
        for h in range(24):
            a1, a2 = amt1.get(h, 0.0), amt2.get(h, 0.0)
            w.writerow([f"{h:02d}", f"{a1:.0f}", cnt1.get(h, 0), f"{a2:.0f}", cnt2.get(h, 0), f"{a1 - a2:.0f}"])
    print(f"\nCSVを書き出しました: {path}")


def parse_args(argv: list[str]) -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Qoo10 時間別売上比較ツール")
    p.add_argument("--date1", required=True, help="比較対象日1 (YYYY-MM-DD)")
    p.add_argument("--date2", required=True, help="比較対象日2 (YYYY-MM-DD)")
    p.add_argument(
        "--date-basis",
        choices=["order", "payment"],
        default="order",
        help="集計の基準日 (order=注文日, payment=決済日). デフォルト: order",
    )
    p.add_argument("--config", default="config.json", help="認証情報の設定ファイル (デフォルト: config.json)")
    p.add_argument("--csv", dest="csv_out", help="結果を書き出すCSVファイルのパス")
    return p.parse_args(argv)


def main(argv: list[str]) -> int:
    args = parse_args(argv)
    cfg = load_config(args.config)

    cert_key = cfg.get("cert_key")
    if not cert_key:
        api_key, user_id, pwd = cfg.get("api_key"), cfg.get("user_id"), cfg.get("pwd")
        if not (api_key and user_id and pwd):
            print(
                "認証情報が不足しています。config.json か環境変数で、\n"
                " 1) cert_key (発行済みの認証キー) を指定するか、\n"
                " 2) api_key + user_id + pwd を指定してください。\n"
                "詳しくは README.md を参照してください。",
                file=sys.stderr,
            )
            return 2
        print("認証キーを発行しています...", file=sys.stderr)
        cert_key = create_certification_key(api_key, user_id, pwd)

    search_condition = DATE_BASIS[args.date_basis]
    date_field = "OrderDate" if args.date_basis == "order" else "PaymentDate"

    print(f"{args.date1} の注文を取得中...", file=sys.stderr)
    rows1 = fetch_orders(cert_key, args.date1, search_condition)
    print(f"  {len(rows1)} 件取得", file=sys.stderr)
    print(f"{args.date2} の注文を取得中...", file=sys.stderr)
    rows2 = fetch_orders(cert_key, args.date2, search_condition)
    print(f"  {len(rows2)} 件取得", file=sys.stderr)

    agg1 = aggregate_hourly(rows1, date_field)
    agg2 = aggregate_hourly(rows2, date_field)

    print_comparison(args.date1, args.date2, agg1, agg2)
    if args.csv_out:
        write_csv(args.csv_out, args.date1, args.date2, agg1, agg2)
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
