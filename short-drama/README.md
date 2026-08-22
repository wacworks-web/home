# 『年収5,000万円の男じゃなきゃ無理』制作プロジェクト

TikTok 縦型 AI ショートドラマ / 全5話 / 各約60秒
映像生成: **Seedance 1.0**（ByteDance）+ 編集: CapCut など

> 本作品は、SNS等で話題になった婚活・年収に関する議論から着想を得た完全フィクションです。
> 実在の人物・団体とは関係ありません。

## ディレクトリ構成

```
short-drama/
├── README.md              ← このファイル（全体ワークフロー）
├── series-bible.md        ← シリーズ設定資料（キャラ・トーン統一ルール／全話共通）
├── assembly-guide.md      ← 編集・仕上げガイド（CapCut / 字幕 / TikTok書き出し）
├── ep1/
│   ├── script.md          ← EP.1 決定稿（タイムコード付き脚本）
│   ├── shots.md           ← EP.1 カット割り + Seedance プロンプト（人間が読む用）
│   ├── shots.json         ← 同カット割り（生成スクリプトが読む用）
│   └── subtitles.srt      ← EP.1 字幕ファイル（60秒 / CapCut・TikTok読み込み用）
└── tools/
    ├── generate_seedance.py  ← Seedance API 一括生成スクリプト
    └── requirements.txt
```

## 制作ワークフロー（1話あたり）

1. **キャラクター基準画像を作る（初回のみ・全話で使い回す）**
   `series-bible.md` の外見定義プロンプトで、美咲・奈々・翔太の基準画像を
   Seedream 4.0（または任意の画像生成）で作成し、`assets/characters/` に保存する。
   → 全話で顔・服装を統一するための最重要工程。

2. **各カットの動画を Seedance で生成する**
   ```bash
   cd short-drama/tools
   pip install -r requirements.txt

   # fal.ai を使う場合
   export FAL_KEY="xxxx"
   python generate_seedance.py --shots ../ep1/shots.json --provider fal

   # BytePlus ModelArk を使う場合
   export ARK_API_KEY="xxxx"
   python generate_seedance.py --shots ../ep1/shots.json --provider ark
   ```
   生成された mp4 は `ep1/renders/` に保存される。
   基準画像がある場合は `shots.json` の `first_frame_image` にパスまたはURLを
   入れると image-to-video になり、キャラの一貫性が大きく向上する。

3. **音声を付ける**
   Seedance の出力は**無音映像**。セリフは CapCut のテキスト読み上げ、
   もしくは外部TTS（にじボイス等）で作成して当てる。
   口元が大きく映るカットは短くしてあるので、リップシンクのズレは目立ちにくい設計。

4. **編集・字幕・書き出し**
   `assembly-guide.md` の手順で 9:16 / 60秒に組み、`subtitles.srt` を読み込んで
   テロップを整え、TikTok へアップロードする。

## 進行状況

- [x] EP.1「年収5,000万円以下は無理」 — 脚本・カット割り・プロンプト・字幕 完成
- [ ] EP.2「年収6,000万円の男」
- [ ] EP.3「金持ちにも選ぶ権利がある」
- [ ] EP.4「年収800万円の男」
- [ ] EP.5「選んでいたつもりだった」
