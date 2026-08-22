# EP.1 カット割り & Seedance プロンプト

全10カット。各カットを Seedance 1.0（9:16 / 1080p）で個別生成し、編集で60秒に組む。

**運用ルール**
- プロンプトは自己完結（キャラ定義+スタイル定義を毎回フル記載）。変更・省略しない。
- 生成尺は 5s か 10s。編集で使用尺にトリムする（余裕をもたせてある）。
- セリフ音声はTTSで後付け。口元が大きく映る時間を短くしてあるため、
  「話している雰囲気」の生成で十分成立する。
- スマホ画面の中身（MATCH画面・プロフィール）は **AI生成しない**。
  画面は光っているだけにして、編集時に架空UIのモック画像を重ねる
  （AI生成だと文字が崩れるため。モック仕様は assembly-guide.md 参照）。
- 各カット、良テイクが出るまで2〜4回生成し直す前提で見積もる。

共通挿入ブロック（以下のプロンプト内では [MISAKI] [NANA] [STYLE] と表記するが、
`shots.json` には展開済みの全文が入っている）:

- `[MISAKI]` = a beautiful Japanese woman in her early 30s, long dark-brown softly waved hair, flawless polished makeup, elegant beige silk blouse and small gold earrings, confident poised posture, fictional face not resembling any real person
- `[NANA]` = a Japanese woman in her early 30s, black shoulder-length bob hair, natural minimal makeup, soft gray cardigan over a white top, simple wedding ring, calm gentle demeanor, fictional face not resembling any real person
- `[STYLE]` = vertical 9:16 cinematic live-action Japanese drama, modern Tokyo, photorealistic, natural skin texture, soft realistic lighting, shallow depth of field, muted cinematic color grade, handheld subtle camera movement, no text, no captions, no logos

舞台（全カット共通）: upscale quiet Tokyo cafe, window seat, white marble table,
large window with soft afternoon light, two cups of coffee / cafe latte.

---

## Cut 1 ｜ 0:00–0:03 ｜ 生成5s ｜ 2ショット（つかみ）
- 内容: 窓際の席。奈々が尋ね、美咲が即答。奈々がカップを持ったまま止まる。
- セリフ: 奈々「結婚相手の年収？どれくらい欲しいの？」／美咲「最低5,000万かな。」
- テロップ: 「結婚相手に求める最低年収5,000万円」
- プロンプト:
> Two Japanese women sitting across from each other at a white marble table by a large window in an upscale quiet Tokyo cafe, soft afternoon light. [MISAKI] on the right speaks casually with a confident smile. [NANA] on the left is lifting her coffee cup toward her mouth and suddenly freezes mid-sip, eyes widening slightly. Medium two-shot, eye level. [STYLE]

## Cut 2 ｜ 0:03–0:08 ｜ 生成5s ｜ 奈々アップ
- 内容: 固まった奈々。ゆっくりカップを下ろし、聞き返す。
- セリフ: 奈々「……5,000万？」／美咲「うん。」／奈々「それ最低なの？」
- プロンプト:
> Close-up of [NANA] in an upscale Tokyo cafe by a window, holding a coffee cup frozen in mid-air, stunned expression, blinking slowly, then slowly lowering the cup to the marble table while staring at the person across from her in disbelief. [STYLE]

## Cut 3 ｜ 0:08–0:15 ｜ 生成10s ｜ 美咲ミディアム
- 内容: 美咲が理由を滔々と語る。指を折って数える仕草。悪気はなく本気。
- セリフ: 美咲「だって東京でいい家住んで、子供2人育てて、年2回海外旅行したら、そのくらい必要じゃない？」
- プロンプト:
> Medium shot over the shoulder of a woman with bob hair, focusing on [MISAKI] sitting at a marble cafe table, talking earnestly and confidently, elegantly counting points on her fingers, natural conversational gestures, sincere unapologetic expression, upscale Tokyo cafe window light behind her. [STYLE]

## Cut 4 ｜ 0:15–0:22 ｜ 生成10s ｜ 奈々ミディアム
- 内容: 奈々が控えめに言う。視線が一瞬、自分の結婚指輪に落ちる。
- セリフ: 奈々「私の旦那、800万だけど……」／美咲「奈々はそれで幸せならいいと思うよ？」
- プロンプト:
> Medium close-up of [NANA] at a marble cafe table, speaking hesitantly with a faint awkward smile, briefly glancing down at the simple wedding ring on her hand and touching it, then looking back up quietly, upscale Tokyo cafe, soft window light. [STYLE]

## Cut 5 ｜ 0:22–0:30 ｜ 生成10s ｜ 美咲ミディアム（上から目線）
- 内容: 美咲、少し上から目線で微笑み、優雅にコーヒーを一口。
- セリフ: 美咲「でも私は生活レベル落としたくない。」／奈々（OFF）「美咲って今、年収いくらだっけ？」
- プロンプト:
> Medium shot of [MISAKI] at a marble cafe table, giving a slightly condescending but friendly smile, tilting her head with confidence, then elegantly sipping her coffee, poised and self-assured, upscale Tokyo cafe with soft afternoon window light. [STYLE]

## Cut 6 ｜ 0:30–0:37 ｜ 生成10s ｜ 2ショット（沈黙→白状）
- 内容: 一瞬の沈黙。美咲が目を逸らし、小さな声で答える。
- セリフ: 美咲「……450万。」／奈々「自分の10倍以上じゃん。」
- プロンプト:
> Two-shot of [MISAKI] and [NANA] facing each other at a marble cafe table, an awkward pause in the conversation, [MISAKI] breaks eye contact and looks away toward the window, discomfort flickering across her face, then answers quietly with slightly pursed lips, [NANA] watches her calmly. Upscale Tokyo cafe. [STYLE]

## Cut 7 ｜ 0:37–0:45 ｜ 生成10s ｜ 美咲→奈々の切り返し
- 内容: 美咲が開き直って髪を払う。奈々は何も言わず視線を落とす。
- セリフ: 美咲「男と女は違うでしょ。」／奈々「そういうもの？」／美咲「それに私、まだ32だよ？」
- プロンプト:
> Medium shot of [MISAKI] at a marble cafe table regaining her confidence, lightly flipping her long dark-brown hair over her shoulder, speaking with defiant self-assurance, while [NANA] partially visible in the foreground stays silent and slowly lowers her gaze to her coffee cup, subtle tension. Upscale Tokyo cafe. [STYLE]

## Cut 8 ｜ 0:45–0:50 ｜ 生成5s ｜ インサート（スマホ通知）
- 内容: マーブルのテーブル上でスマホが光って震える。美咲の手が取り上げる。
- セリフ: 美咲「え……」／奈々（OFF）「どうしたの？」
- 編集: 画面内容は架空UIモックを合成（MATCH表示）。効果音+バイブ音を追加。
- プロンプト:
> Insert close-up shot of a smartphone lying face-up on a white marble cafe table next to a coffee cup, the screen lights up brightly with a glowing notification and the phone vibrates slightly, then a woman's elegant hand with polished nails reaches in and picks up the phone, screen content is a soft glowing blur. Upscale Tokyo cafe. [STYLE]

## Cut 9 ｜ 0:50–0:56 ｜ 生成5s ｜ 美咲アップ（表情変化）
- 内容: スマホの光を受けた美咲の顔。驚き→勝ち誇った笑顔へ変化。
- 編集: 直前に架空プロフィールUI（翔太・38歳／会社経営／推定年収5,000万円以上）をフルカットで挿入。
- プロンプト:
> Close-up of [MISAKI]'s face softly lit by the glow of the smartphone she is holding, in an upscale Tokyo cafe, her surprised expression slowly transforming into a delighted triumphant smile, eyes sparkling as she reads the screen. [STYLE]

## Cut 10 ｜ 0:56–1:00 ｜ 生成5s ｜ ラスト2ショット
- 内容: 美咲がスマホ画面を奈々に向けて見せ、勝ち誇った笑顔。奈々は曖昧な表情。→ 暗転。
- セリフ: 美咲「ほら。」「ちゃんといるじゃん。」
- テロップ: 「年収6,000万円の男とマッチしました。」→「NEXT → EP.2」
- プロンプト:
> Two-shot at a marble cafe table, [MISAKI] holds up her smartphone and turns the screen toward [NANA] with a proud triumphant smile, leaning forward slightly, while [NANA] looks at the phone with an ambiguous unreadable expression, upscale Tokyo cafe, soft afternoon window light. [STYLE]

---

## 想定生成コストの目安
10カット × 平均7.5s × リテイク約3回 ≒ 225秒分の生成。
1080p課金の従量制なので、まず 720p でテイク選定→採用カットのみ 1080p で
再生成する運用にすると安く済む（`--resolution` を切り替えるだけ）。
