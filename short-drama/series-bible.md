# シリーズ設定資料（全話共通・制作バイブル）

『年収5,000万円の男じゃなきゃ無理』
TikTok 縦型 / 全5話 / 各約60秒 / 婚活・恋愛・価値観・社会風刺

**基本テーマ:** 「相手に条件を求めるなら、自分も相手から選ばれる側である」

> 完全フィクション。実在の人物・団体とは関係ありません。
> 実在人物に似せない／実在の番組映像・ロゴ等を使用しない。

---

## 1. 登場人物と外見定義（全話でこの記述を一言一句変えずに使う）

Seedance は話をまたぐとキャラがブレるため、**下記の英語定義文をすべてのプロンプトに
そのまま埋め込む**こと。基準画像を作ったら image-to-video を優先する。

### 美咲（32）主人公
- 設定: SNSフォロワー3万人。容姿に自信。年収450万。結婚相手の最低条件は年収5,000万円。
  悪人ではないが「自分が選ぶ側」だと思っている。
- 演技トーン: 自信・軽い上から目線。ただし嫌味になりすぎない。本人は本気。
- 外見定義（英語・共通挿入文）:

```
MISAKI: a beautiful Japanese woman in her early 30s, long dark-brown softly
waved hair, flawless polished makeup, elegant beige silk blouse and small gold
earrings, confident poised posture, fictional face not resembling any real person
```

### 奈々（32）友人・既婚
- 設定: 夫の年収800万。現実的で穏やか。美咲を否定はしないが静かに事実を返す。
- 演技トーン: 落ち着き・戸惑い・沈黙で語る。
- 外見定義（英語・共通挿入文）:

```
NANA: a Japanese woman in her early 30s, black shoulder-length bob hair,
natural minimal makeup, soft gray cardigan over a white top, simple wedding
ring, calm gentle demeanor, fictional face not resembling any real person
```

### 翔太（38）会社経営者（EP.2〜3, 5）
- 設定: 年収約6,000万。清潔感。感情的にならず淡々と話す。論破しない。
- 外見定義（英語・共通挿入文）:

```
SHOTA: a Japanese man in his late 30s, short neat black hair, clean-shaven,
well-fitted navy suit with no tie, white shirt, calm composed expression,
quiet confidence, fictional face not resembling any real person
```

### 年収800万の男性（EP.4）
- 気さくで感じが良い。カジュアルなジャケット。

```
KENJI: a friendly Japanese man in his mid 30s, short black hair, casual smart
jacket over a plain t-shirt, warm easygoing smile, fictional face not
resembling any real person
```

---

## 2. 全話共通の映像スタイル定義（全プロンプト末尾に付ける）

```
STYLE: vertical 9:16 cinematic live-action Japanese drama, modern Tokyo,
photorealistic, natural skin texture, soft realistic lighting, shallow depth
of field, muted cinematic color grade, handheld subtle camera movement,
no text, no captions, no logos
```

- 9:16縦型 / 実写映画風 / 日本人キャスト / 現代の東京
- 過剰なAI感を出さない（過度な美肌・不自然な光沢を避ける）
- 会話中心・1カット5〜10秒（Seedanceの生成上限に合わせる）
- 冒頭1〜2秒で必ず強いセリフ
- **映像内には文字を焼き込まない**（`no text` 指定）。テロップは編集時に載せる

## 3. 音声・字幕ポリシー

- Seedance出力は無音。セリフはTTS（CapCut読み上げ／にじボイス等）で後付け。
- 声を全話で統一するため、**各キャラのTTSボイスIDを一度決めたら固定**し、
  下表に記録する。

| キャラ | TTSサービス | ボイスID/名前 | メモ |
|---|---|---|---|
| 美咲 | （初回制作時に記入） | | 明るめ・自信のあるトーン |
| 奈々 | | | 落ち着いた低め |
| 翔太 | | | 淡々・低音 |

- 字幕は無音視聴前提で設計: 画面下1/3に大きく、白文字+黒縁取り。
  キーワード（金額など）は黄色で強調。
- リップシンク対策: 話者の口元アップは避け、リアクションショット・
  引きの画・聞き手の顔を多用する（カット割りに反映済み）。

## 4. 各話の役割（演出方針）

| 話 | タイトル | 役割 |
|---|---|---|
| EP.1 | 年収5,000万円以下は無理 | 価値観の提示。美咲を「本気でそう信じている人」として描く |
| EP.2 | 年収6,000万円の男 | 立場の反転。「僕が選ぶ理由は？」で引き |
| EP.3 | 金持ちにも選ぶ権利がある | **最大のコメント発生ポイント**。年収vs年齢の対立軸 |
| EP.4 | 年収800万円の男 | 幸せの可能性と、それを自ら手放す美咲。逆に振られる |
| EP.5 | 選んでいたつもりだった | 反省させない結末。条件を貫く自由と、その結果 |

### 演出上の禁止事項
- 美咲を露骨な悪役にしない（コメント欄の対立を生むため両論の余白を残す）
- 翔太は論破・説教しない。淡々と事実を返すだけ
- EP.5 で美咲を改心させない。「編集する」ボタンの上で指を止めて、閉じる
