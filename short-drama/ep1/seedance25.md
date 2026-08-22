# EP.1 Seedance 2.5 制作手順（セリフ音声付き・推奨版）

DRAMA_HANDOFF.md のパイプライン（Replicate `bytedance/seedance-2.5`）準拠。
EP.1（60秒）を **前半30秒 + 後半30秒の2生成**で作り、編集で連結する。

- コスト: $7/30秒 × 2 = **$14/テイク**（720p・音声付き）
- 旧手順（10カット無音+TTS）は `shots.md` に残してあるがフォールバック扱い

## プロンプトの掟（HANDOFF §3準拠・両パートに適用済み）

- セリフはダブルクォートで**日本語のまま**記述
- 末尾に `IMPORTANT: all spoken dialogue must be 100 percent natural native Japanese... Absolutely no English, no Chinese...` 節
- `no background music`（生成BGMは著作権フィルタで生成ごと失敗する）
- `no text, no letters, no readable signs`（テロップは編集で載せる）
- `--ref` は使わない（実写風人物はE005センシティブ判定）。**キャラ固定は言語記述**で、
  前半・後半で一言一句同じ記述を使う（このファイルのプロンプトは統一済み）
- 金額の読み: 「5000万」等はまず素直に書いて生成し、whisper QCで読み間違いが
  出た場合のみ「五千万」等に言い換えて再生成（最大2回）

## Macでの実行コマンド

```bash
cd ~/okane-uragawa
# 前半（0:00-0:30）
python gen_seedance.py ep1_part1.mp4 "$(cat <この一式をMacに置いた場所>/ep1/prompts/part1.txt)" \
  --dur 30 --res 720p --ar 9:16 --audio
# 後半（0:30-1:00）
python gen_seedance.py ep1_part2.mp4 "$(cat .../ep1/prompts/part2.txt)" \
  --dur 30 --res 720p --ar 9:16 --audio
```

- POST時の失敗は gen_seedance.py 側でリトライされないので、失敗したら再実行
- Macを使わない場合: `tools/generate_seedance25.py`（Replicate直叩き・POSTリトライ付き）に
  `REPLICATE_API_TOKEN`（または `~/.replicate_key`）を与えて
  `python generate_seedance25.py --shots ../ep1/shots25.json` でも可

## 生成後のQC（HANDOFF §3-4準拠）

1. 音声抽出 → whisper transcriptions（language判定 + 全文）
2. チェック: 他言語混入 / 言い間違い（→セリフ言い換えて再生成、最大2回）/
   同音ゆらぎ（表記違いだが発音が正しいもの）はOK
3. 映像チェック: 前後半でキャラの顔・髪・服が破綻していないか。
   破綻がひどい場合は破綻した側のみ再生成（プロンプトは変えない）

## 編集（assembly-guide.md の該当部を置き換え）

1. part1 + part2 を連結（**concat は `-c copy` 禁止**。再エンコード連結）
2. 45〜50秒付近のスマホ通知の後に **架空MATCH UIモック**を0.8秒、
   続けて**架空プロフィールUI**（翔太・38歳／会社経営／推定年収5,000万円以上）を約3秒インサート
   （モック仕様は assembly-guide.md §2。実在アプリのUI・ロゴを模倣しない）
3. 字幕: 音声付き生成のため `subtitles.srt` の時刻は実尺とズレる。
   whisper の単語タイムスタンプ（**発話開始+0.05s表示・先出し禁止**）で同期するか、
   CapCut自動キャプション→手直し。文言は subtitles.srt / script.md を正とする
4. テロップ: 冒頭「結婚相手に求める最低年収5,000万円」（0.5〜3秒・中央・特大）、
   ラスト暗転に「年収6,000万円の男とマッチしました。」→「NEXT → EP.2」
5. SE・環境音のみ追加（BGMを足す場合は商用利用可音源）
6. 概要欄/キャプションに必須注記:
   `※映像・音声はAI生成です` `※このドラマはフィクションです。実在の人物・団体とは関係ありません。`
   TikTokの**AI生成コンテンツラベルON**

## 予算メモ（8/22時点・HANDOFF §1/§7より）

- Replicate残高 約$23（共有）。EP.1 1テイク=$14 → 残$9
- **注意: 22:04の夜間cron（別チャンネルのドラマショート自動制作 $7/本）と同じ残高を使う。**
  EP.1生成後は残$9 → cron 1本でほぼ枯渇、残$5未満で6req/分制限、$0で402
- **先に Auto-recharge 設定（replicate.com/account/billing）を推奨。**
  EP.2〜5まで作ると本編だけで計$70 + リテイク分

---

## プロンプト本文

`prompts/part1.txt` / `prompts/part2.txt` に同一内容を保存済み（コマンドから直接読める）。

### 前半 0:00–0:30（part1.txt）

> A cinematic live-action Japanese drama scene, vertical 9:16, modern Tokyo. An upscale quiet cafe by a large window with soft afternoon light. Two women sit across from each other at a white marble table with coffee cups. MISAKI is a beautiful Japanese woman in her early 30s with long dark-brown softly waved hair, polished makeup, an elegant beige silk blouse and small gold earrings, confident and poised. NANA is a Japanese woman in her early 30s with a black shoulder-length bob, natural minimal makeup, a soft gray cardigan over a white top and a simple wedding ring, calm and gentle. Both are fictional faces not resembling any real person, and they keep exactly the same faces, hairstyles and clothes for the entire video. Natural skin texture, shallow depth of field, muted cinematic color grade, subtle handheld camera, alternating two-shots and close-ups.
>
> Nana asks curiously, "結婚相手の年収って、どれくらい欲しいの？" Misaki answers casually with a confident smile, "最低5000万かな。" Nana freezes mid-sip, stunned, then says, "え、5000万？それ最低なの？" Misaki nods, sincere and unapologetic, "うん。東京でいい家に住んで、子供2人育てて、年2回海外旅行したら、そのくらい必要じゃない？" Nana says hesitantly, glancing at her wedding ring, "私の旦那、800万だけど……" Misaki smiles slightly condescendingly, "奈々はそれで幸せならいいと思うよ？でも私は生活レベル落としたくないの。" Nana asks quietly, "美咲は今、年収いくらだっけ？" A short awkward pause. Misaki looks away toward the window and answers in a small voice, "……450万。"
>
> IMPORTANT: all spoken dialogue must be 100 percent natural native Japanese with natural intonation and conversational pacing with short pauses. Absolutely no English, no Chinese, no other languages. no background music. no text, no letters, no captions, no readable signs anywhere.

### 後半 0:30–1:00（part2.txt）

> A cinematic live-action Japanese drama scene, vertical 9:16, modern Tokyo. An upscale quiet cafe by a large window with soft afternoon light. Two women sit across from each other at a white marble table with coffee cups. MISAKI is a beautiful Japanese woman in her early 30s with long dark-brown softly waved hair, polished makeup, an elegant beige silk blouse and small gold earrings, confident and poised. NANA is a Japanese woman in her early 30s with a black shoulder-length bob, natural minimal makeup, a soft gray cardigan over a white top and a simple wedding ring, calm and gentle. Both are fictional faces not resembling any real person, and they keep exactly the same faces, hairstyles and clothes for the entire video. Natural skin texture, shallow depth of field, muted cinematic color grade, subtle handheld camera, alternating two-shots and close-ups.
>
> Nana says flatly, "自分の年収の10倍以上じゃん。" Misaki replies defensively, "男と女は違うでしょ。" Nana tilts her head, "そういうもの？" Misaki lightly flips her hair over her shoulder and says with defiant confidence, "それに私、まだ32だよ？" Nana says nothing and lowers her gaze to her coffee. A smartphone lying face-up on the marble table vibrates and its screen lights up with a soft glow, the screen content is a blurred glow and not readable. Misaki picks it up, surprised, "え……" Nana asks, "どうしたの？" Misaki reads the screen and her surprise slowly turns into a delighted triumphant smile. She turns the phone toward Nana, leaning forward, and says proudly, "ほら。ちゃんといるじゃん。" Nana looks at the phone with an ambiguous unreadable expression.
>
> IMPORTANT: all spoken dialogue must be 100 percent natural native Japanese with natural intonation and conversational pacing with short pauses. Absolutely no English, no Chinese, no other languages. no background music. no text, no letters, no captions, no readable signs anywhere.
