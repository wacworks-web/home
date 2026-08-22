# お金のウラガワ投稿手順（婚活ドラマ全5話・Macで実行）

このリモート環境には YouTube トークン（`~/.youtube_token.json`）が無いため、
**Macの ~/okane-uragawa 環境で実行**する。動画・素材はすべて本リポジトリにある。

## 0. 素材の取得（Mac）

```bash
cd ~/okane-uragawa
git clone --depth 1 -b claude/ai-short-drama-ep1-r3mqn0 https://github.com/wacworks-web/home.git konkatsu_drama
# 動画: konkatsu_drama/short-drama/ep{1..5}/renders/ の各 full 最新版
#   EP.1: ep1_full_v2.mp4（CTAカード付き）/ EP.2: ep2_full_v2.mp4
#   EP.3: ep3_full_v1.mp4 / EP.4: ep4_full_v1.mp4 / EP.5: ep5_full_v2.mp4
# 説明文: konkatsu_drama/short-drama/youtube/desc_ep{1..5}.txt
# テロップ用: konkatsu_drama/short-drama/youtube/ep{1..5}_lines.json（CTA行込み）
```

## 1. テロップ（推奨・時間があれば）

チャンネルの通常フォーマットに合わせるなら gen_drama_telop でテロップを載せる：

```bash
python full50/gen_drama_telop.py <epN_full.mp4> episodes/drama002/audio/cta.aiff \
  konkatsu_drama/short-drama/youtube/epN_lines.json ""
cd remotion_ver && npx remotion render ShortTelop out/konkatsu_epN.mp4
```

- **hookは必ず空文字 ""**（HANDOFF準拠）
- 注意: 通常の30秒尺ではなく60秒尺。segment数≠行数のfallbackが出たら
  sections_telop.json の phrases を手動補正
- Remotionレンダは同時1本まで。**他セッションのVeoショート制作と取り合いになるので、
  レンダ中は他のレンダ禁止**（HANDOFF §6）
- 時間がなければテロップ無し（素のまま）でも成立はする（セリフ音声入りのため）。
  その場合はYouTube側の自動字幕をONにしておく

## 2. アップロード（公開予約・今日 JST 夜）

タイトルは下表、説明は desc_epN.txt。**--publish-at はUTC**。

| EP | タイトル | 公開JST | --publish-at (UTC) |
|---|---|---|---|
| 1 | 結婚相手の最低年収は5000万円です【婚活ドラマ EP.1】 | 19:30 | 2026-08-22T10:30:00Z |
| 2 | 年収6000万の男に「僕を選ぶ理由は？」と聞かれた女【婚活ドラマ EP.2】 | 20:15 | 2026-08-22T11:15:00Z |
| 3 | 年収で選ぶのはOKで、年齢で選ぶのはNG？【婚活ドラマ EP.3】 | 21:00 | 2026-08-22T12:00:00Z |
| 4 | 条件外の年収800万の彼と過ごした、いちばん楽しい夜【婚活ドラマ EP.4】 | 21:45 | 2026-08-22T12:45:00Z |
| 5 | 選んでいたつもりだった。選ばれていなかった【婚活ドラマ 最終話】 | 22:30 | 2026-08-22T13:30:00Z |

```bash
D=konkatsu_drama/short-drama
python channel/upload_youtube.py $D/ep1/renders/ep1_full_v2.mp4 \
  --title "結婚相手の最低年収は5000万円です【婚活ドラマ EP.1】" \
  --desc $D/youtube/desc_ep1.txt --tags "婚活,年収,ショートドラマ,AIドラマ" \
  --publish-at 2026-08-22T10:30:00Z
python channel/upload_youtube.py $D/ep2/renders/ep2_full_v2.mp4 \
  --title "年収6000万の男に「僕を選ぶ理由は？」と聞かれた女【婚活ドラマ EP.2】" \
  --desc $D/youtube/desc_ep2.txt --tags "婚活,年収,ショートドラマ,AIドラマ" \
  --publish-at 2026-08-22T11:15:00Z
python channel/upload_youtube.py $D/ep3/renders/ep3_full_v1.mp4 \
  --title "年収で選ぶのはOKで、年齢で選ぶのはNG？【婚活ドラマ EP.3】" \
  --desc $D/youtube/desc_ep3.txt --tags "婚活,年収,ショートドラマ,AIドラマ" \
  --publish-at 2026-08-22T12:00:00Z
python channel/upload_youtube.py $D/ep4/renders/ep4_full_v1.mp4 \
  --title "条件外の年収800万の彼と過ごした、いちばん楽しい夜【婚活ドラマ EP.4】" \
  --desc $D/youtube/desc_ep4.txt --tags "婚活,年収,ショートドラマ,AIドラマ" \
  --publish-at 2026-08-22T12:45:00Z
python channel/upload_youtube.py $D/ep5/renders/ep5_full_v2.mp4 \
  --title "選んでいたつもりだった。選ばれていなかった【婚活ドラマ 最終話】" \
  --desc $D/youtube/desc_ep5.txt --tags "婚活,年収,ショートドラマ,AIドラマ" \
  --publish-at 2026-08-22T13:30:00Z
```

- **各アップロード後、videos.list で uploadStatus=processed を必ず確認**
  （processingスタック事故 W0pkvSXXohw の再発防止・HANDOFF準拠）
- YouTube Studio の**「改変コンテンツ（AI生成）」開示を必ずON**

## 3. 台帳と当日枠の調整（HANDOFF §6準拠）

1. **ab_test.json に5件追記**（二重制作防止・22:04夜間cronへの通知を兼ねる）:
```json
{"date":"2026-08-22","name":"konkatsu_ep1","type":"minidrama_seedance_dialogue","style":"konkatsu_series","pub":"19:30","video_id":"<upload後に記入>","view_pct":null}
```
（ep2〜ep5 も同様に pub 20:15 / 21:00 / 21:45 / 22:30 で）
2. **今日の他の予約分は延期**: 公開枠は1日ショート8本まで。既存予約を Data API で確認し、
   今日分の他ショートの publishAt を明日以降へ変更（またはドラマ枠と被らない時間へ）
3. 22:04 の夜間cronは ab_test.json を読んで重複を避ける仕様。上記追記を
   **22:04より前に**済ませること

## 4. 公開後

- 各話の説明欄に前後話のURLを追記（EP.1 に「EP.2はこちら→」等）
- 固定コメント: EP.3「年収で選ぶ vs 年齢で選ぶ、どっち派？」/ EP.5「この結末、ざまあ？美咲の自由？」
- 再生リスト「年収5,000万円の男じゃなきゃ無理【全5話】」を作成して全話を追加
