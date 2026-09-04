# Qoo10 時間別売上比較ツール

Qoo10 QSM Open API (`ebayjapan.qapi`) を使って、指定ブランド（例: LAGOM）の注文データを取得し、**2つの日付の時間別売上を比較**する Python スクリプトです。

例: `LAGOM の 9/4 と 6/5 の時間別売上比較`

## なぜローカルで実行するのか

Claude の実行環境（クラウド）からは、egress ポリシーにより `api.qoo10.jp` へ到達できません（403 でブロック）。そのため Claude がこの場で直接 API を叩くことはできず、**ネットワーク制限のないローカル環境（またはサーバー）で実行**していただく形になります。

## セットアップ

```bash
pip install -r requirements.txt
cp config.example.json config.json
# config.json に LAGOM の認証情報を記入する（下記参照）
```

### 認証情報の設定

`config.json`（または環境変数）に、次のどちらかを設定します。

1. **発行済みの認証キーがある場合**（スプレッドシートに Certification Key がある場合）
   - `cert_key` に認証キーを設定するだけでOKです。

2. **QSMログイン情報から認証キーを発行する場合**
   - `api_key` + `user_id` + `pwd`（QSMのログインID/パスワード）を設定します。スクリプトが `CertificationAPI.CreateCertificationKey` で認証キーを自動発行します。

環境変数で渡すこともできます（`config.json` より優先されます）:

```bash
export QOO10_CERT_KEY="..."      # または
export QOO10_API_KEY="..."
export QOO10_USER_ID="..."
export QOO10_PWD="..."
```

> **セキュリティ注意**: `config.json` と `.env` は `.gitignore` 済みで、リポジトリにはコミットされません。APIキー・認証キーは秘密情報です。共有・貼り付けに注意し、漏洩した場合はローテーションしてください。

## 使い方

```bash
# 注文日ベースで 2025-09-04 と 2025-06-05 の時間別売上を比較
python qoo10_hourly_sales.py --date1 2025-09-04 --date2 2025-06-05

# 決済日ベースにする
python qoo10_hourly_sales.py --date1 2025-09-04 --date2 2025-06-05 --date-basis payment

# 結果をCSVにも書き出す
python qoo10_hourly_sales.py --date1 2025-09-04 --date2 2025-06-05 --csv result.csv
```

出力は 0〜23 時の時間帯ごとに、両日の売上額・件数・差額を表形式で表示し、合計行も出します。`--csv` を付けると同じ内容をCSVでも書き出します。

## 仕組み

- 認証: `CertificationAPI.CreateCertificationKey`（`api_key` + `user_id` + `pwd`）で認証キーを取得。以降の呼び出しは HTTPヘッダ `GiosisCertificationKey` に認証キーを付与。
- 注文取得: `ShippingBasic.GetShippingInfo_v3` を使用。`ShippingStatus` は1回のリクエストで1状態しか返さないため、1〜5をループして `OrderNo` で重複排除します。`ClaimStatus` が 0 以外（キャンセル・返品・クレーム）は集計から除外します。
- 期間指定: `SearchStartDate` / `SearchEndDate`（`YYYYMMDD` 形式）で対象日を指定。`SearchCondition` で基準日（注文日/決済日）を切り替えます。
- 時間別集計: 各注文の `OrderDate`（または `PaymentDate`）の時刻から時間帯を判定し、`Total`（無ければ `SellPrice × OrderQty`）を合算します。

## 注意・未確定事項

以下は公開実装から検証済みですが、一部は**公式ドキュメントでの確認を推奨**します。

- `ShippingStatus`（1〜5）の正確な状態対応、`SearchCondition`（1=注文日 / 2=決済日 と推定）の正確なコード対応。
- `OrderDate` に時刻（時分秒）が含まれるか。もし日付のみだった場合、時間別集計ができず「時刻不明」として警告表示します。その場合は時刻を含む別フィールドの有無を公式ドキュメントで確認してください。
- API のレート制限・1リクエストあたりの最大期間。本ツールは1日単位で取得し、軽いウェイトを挟んでいます。

問題が出た場合は、まず1日・1ステータスで生レスポンスを確認するのがおすすめです。
