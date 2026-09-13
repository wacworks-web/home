const pptxgen = require('pptxgenjs');
const D = require('./data.js');

const NAVY="0E2038", NAVY2="1B3A5F", ORANGE="E8703A", INK="1F2733",
      MUTED="6B7280", LINE="DCE1E8", TINT="F3F6FA", WHITE="FFFFFF",
      POS="1F7A4D", NEG="B3261E", SLATE="45566B";
const JP="Meiryo";
const W=13.333, H=7.5;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "WAC WORKS";

const FOOT = "Confidential  |  YAMANIGOLF 楽天市場店  /  2026年8月度 分析レポート";

function page(title, sub, notes){
  const s = pres.addSlide();
  s.background = { color: WHITE };
  s.addText(title, { x:0.55, y:0.34, w:12.2, h:0.52, fontFace:JP, fontSize:26, bold:true,
                     color:NAVY, isTextBox:true, margin:0, valign:"middle" });
  s.addText(sub, { x:0.57, y:0.86, w:12.2, h:0.3, fontFace:JP, fontSize:10.5,
                   color:MUTED, isTextBox:true, margin:0, valign:"middle" });
  s.addText(FOOT, { x:0.55, y:6.98, w:12.2, h:0.28, fontFace:JP, fontSize:8,
                    color:"9AA4B2", isTextBox:true, margin:0, align:"right", valign:"middle" });
  if(notes) s.addNotes(notes);
  return s;
}

// KPI card
function kpi(s, x, y, w, h, label, value, delta, deltaColor){
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, fill:{color:TINT}, line:{color:LINE,width:1},
    rectRadius:0.06, shadow:{ type:"outer", color:"9AA4B2", blur:6, offset:1, angle:90, opacity:0.18 } });
  s.addText(label, { x:x+0.2, y:y+0.14, w:w-0.4, h:0.26, fontFace:JP, fontSize:10.5, color:MUTED,
    isTextBox:true, margin:0, valign:"middle" });
  s.addText(value, { x:x+0.2, y:y+0.4, w:w-0.4, h:0.52, fontFace:JP, fontSize:25, bold:true,
    color:NAVY, isTextBox:true, margin:0, valign:"middle" });
  s.addText(delta, { x:x+0.2, y:y+0.94, w:w-0.4, h:0.26, fontFace:JP, fontSize:9.5,
    color:deltaColor||SLATE, isTextBox:true, margin:0, valign:"middle" });
}

// compact month-over-month card
function mini(s, x, y, w, label, from, to, delta, col){
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h:0.86, fill:{color:WHITE}, line:{color:LINE,width:1}, rectRadius:0.05 });
  s.addText(label, { x:x+0.18, y:y+0.09, w:w-0.36, h:0.24, fontFace:JP, fontSize:9.5, color:MUTED,
    isTextBox:true, margin:0, valign:"middle" });
  s.addText(delta, { x:x+w-1.55, y:y+0.09, w:1.37, h:0.24, fontFace:JP, fontSize:11, bold:true,
    color:col, isTextBox:true, margin:0, align:"right", valign:"middle" });
  s.addText(from+"   →   "+to, { x:x+0.18, y:y+0.36, w:w-0.36, h:0.32, fontFace:JP, fontSize:13.5,
    bold:true, color:NAVY, isTextBox:true, margin:0, valign:"middle" });
  return s;
}

// commentary block
function note(s, x, y, w, heading, lines, h, fs){
  const F = fs || 9.5;
  const bh = h || (0.42 + lines.length*0.29);
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h:bh, fill:{color:"FAFBFD"}, line:{color:LINE,width:1}, rectRadius:0.05 });
  s.addText(heading, { x:x+0.22, y:y+0.1, w:w-0.44, h:0.28, fontFace:JP, fontSize:11, bold:true,
    color:ORANGE, isTextBox:true, margin:0, valign:"middle" });
  s.addText(lines.map((t,i)=>({ text:t, options:{ breakLine: i<lines.length-1 } })),
    { x:x+0.22, y:y+0.4, w:w-0.44, h:bh-0.5, fontFace:JP, fontSize:F, color:INK,
      isTextBox:true, margin:0, lineSpacingMultiple:1.22, valign:"top" });
  return bh;
}

const TH = { fill:{color:NAVY}, color:WHITE, bold:true, fontSize:9.5 };
function table(s, head, rows, opt){
  const body = [];
  body.push(head.map((t,i)=>({ text:t, options:{...TH, align:(opt.align&&opt.align[i])||"left"} })));
  rows.forEach((r,ri)=>{
    const line = r.map((c,ci)=>({
      text: String(c),
      options: {
        fontSize: opt.fontSize||9,
        color: (opt.cellColor?opt.cellColor(ri,ci,r):INK),
        bold: (opt.cellBold?opt.cellBold(ri,ci,r):false),
        align: (opt.align&&opt.align[ci])||"left",
        fill: { color: (ri%2 ? WHITE : TINT) }
      }
    }));
    body.push(line);
  });
  s.addTable(body, { x:opt.x, y:opt.y, w:opt.w, colW:opt.colW, rowH:opt.rowH||0.245,
    border:{ type:"solid", color:LINE, pt:0.5 }, fontFace:JP, valign:"middle", autoPage:false });
}

const yoyColor = (v)=> {
  const n = parseFloat(String(v).replace(/[^0-9.\-+]/g,''));
  if(String(v).includes('NEW')||String(v).includes('新規')) return ORANGE;
  if(String(v).includes('消滅')) return NEG;
  if(String(v).startsWith('-')) return NEG;
  if(String(v).startsWith('+')) return POS;
  if(!isNaN(n)) return n>=100?POS:NEG;
  return INK;
};

/* ---------- 1. SECTION DIVIDER ---------- */
{
  const s = pres.addSlide();
  s.background = { color: NAVY };
  s.addText("SECTION 01", { x:0.9, y:1.75, w:6, h:0.4, fontFace:"Calibri", fontSize:14,
    bold:true, color:ORANGE, charSpacing:4, isTextBox:true, margin:0 });
  s.addText("YAMANIGOLF", { x:0.9, y:2.2, w:9, h:0.95, fontFace:"Calibri", fontSize:52,
    bold:true, color:WHITE, isTextBox:true, margin:0 });
  s.addText("楽天市場店 ／ 2026年8月度", { x:0.92, y:3.18, w:9, h:0.5, fontFace:JP, fontSize:20,
    color:"BFD0E3", isTextBox:true, margin:0 });
  s.addText([
    {text:"店舗KPIサマリー  /  前年同月比較  /  月次売上推移  /  RPP広告パフォーマンス", options:{breakLine:true}},
    {text:"アクセス・転換率分析  /  ブランド別売上分析  /  ブランド別売上前年比", options:{breakLine:true}},
    {text:"カテゴリ別売上前年比（全ブランド / Tommy Hilfiger Golf）  /  商品別売上ランキング TOP10", options:{breakLine:true}},
    {text:"検索キーワード分析  /  流入参照元分析  /  前年対比 伸び・落ち商品  /  まとめと推奨アクション", options:{}}
  ], { x:0.92, y:4.15, w:11.5, h:1.5, fontFace:JP, fontSize:11, color:"8EA6C2",
       isTextBox:true, margin:0, lineSpacingMultiple:1.4 });
  s.addText("Confidential  |  YAMANIGOLF 楽天市場店", { x:0.9, y:6.85, w:11.5, h:0.3,
    fontFace:JP, fontSize:8.5, color:"5E7A8F", isTextBox:true, margin:0 });
  s.addNotes("SECTION 01 の扉。YAMANIGOLF 楽天市場店の2026年8月度実績を15枚で報告する。");
}

/* ---------- 2. KPIサマリー ---------- */
{
  const s = page("2026年8月  店舗KPIサマリー","YAMANIGOLF 楽天市場店 / 店舗分析レポート / 2026年8月度",
    "売上は前年比+35.7%と大幅増収。客単価+14.0%が牽引し、CVRは-0.04ptで微減。");
  const cw=2.95, gap=0.21;
  kpi(s,0.55,1.35,cw,1.32,"売上","¥9,706,322","前年 ¥7,150,460  /  +35.7%",POS);
  kpi(s,0.55+(cw+gap),1.35,cw,1.32,"アクセス","84,921人","前年 68,060  /  +24.8%",POS);
  kpi(s,0.55+2*(cw+gap),1.35,cw,1.32,"CVR（転換率）","0.99%","前年 1.03%  /  -0.04pt",NEG);
  kpi(s,0.55+3*(cw+gap),1.35,cw,1.32,"客単価","¥11,583","前年 ¥10,157  /  +14.0%",POS);
  note(s,0.55,2.95,12.22,"■  2026年8月のハイライト",[
    "● 売上は前年比 +35.7%（¥7,150K → ¥9,706K）と大幅増収。アクセス +24.8% / 客単価 +14.0% がともに寄与。",
    "● 客単価 ¥11,583（前年 +14.0%）が大幅改善。7月 ¥9,402 → 8月 ¥11,583（+23.2%）と高単価キャディバッグへのシフトが奏功。",
    "● CVR 0.99%（前年 1.03% / -0.04pt）。7月 1.35% からは -0.36pt 低下、高単価・低回転商材への構成シフトが主因。",
    "● キャディバッグ ¥1,380K → ¥2,828K（+104.9%）が最大の牽引役。秋冬モデル新作の先行投入が効いた。",
    "● PEARLY GATES +157% / Sun Mountain 新規 ¥859K / MASTER BUNNY +101% / ProSENDR +522% / New Era +567%。",
    "● 一方 TOMMY HILFIGER Golf -35%（¥2,119K → ¥1,371K）/ new balance -46% が後退、主力2ブランドの立て直しが課題。"
  ]);
  s.addText("前月比（2026年7月 → 2026年8月）", { x:0.55, y:5.3, w:6, h:0.28, fontFace:JP, fontSize:11,
    bold:true, color:NAVY, isTextBox:true, margin:0, valign:"middle" });
  mini(s,0.55,5.66,cw,"売上","¥11.81M","¥9.71M","-17.8%",NEG);
  mini(s,0.55+(cw+gap),5.66,cw,"アクセス","92,812","84,921","-8.5%",NEG);
  mini(s,0.55+2*(cw+gap),5.66,cw,"CVR","1.35%","0.99%","-0.36pt",NEG);
  mini(s,0.55+3*(cw+gap),5.66,cw,"客単価","¥9,402","¥11,583","+23.2%",POS);
}

/* ---------- 3. 前年同月比較 ---------- */
{
  const s = page("前年同月比較（2026年8月 vs 2025年8月）","YAMANIGOLF 楽天市場店 / 店舗分析レポート / 2026年8月度",
    "全指標のうち売上・アクセス・客単価が前年超え。CVRのみ微減。");
  table(s, ["指標","2026年8月","2025年8月","前年比"], [
    ["売上金額","¥9,706,322","¥7,150,460","+35.7%"],
    ["アクセス人数","84,921","68,060","+24.8%"],
    ["転換率","0.99%","1.03%","-0.04pt"],
    ["客単価","¥11,583","¥10,157","+14.0%"],
    ["売上件数（推計）","838件","704件","+19.0%"]
  ], { x:0.55, y:1.4, w:7.4, colW:[2.3,1.75,1.75,1.6], rowH:0.4, fontSize:11,
       align:["left","right","right","right"],
       cellBold:(ri,ci)=>ci===3, cellColor:(ri,ci,r)=> ci===3 ? yoyColor(r[3]) : INK });
  note(s,8.2,1.4,4.58,"■  考察",[
    "● 売上・アクセス・客単価の3指標が同時に",
    "  前年を上回り、大幅増収。",
    "",
    "● 特に客単価 +14.0% の改善が大きい。",
    "  7月に落ち込んだ単価水準（¥9,402）から",
    "  V字回復した。夏物冷感グッズ中心の低単価",
    "  構成から、秋冬キャディバッグ中心の高単価",
    "  構成へ切り替わったことによる。",
    "",
    "● CVR は前年比 -0.04pt の微減にとどまるが、",
    "  7月 1.35% からは -0.36pt と大きく低下。",
    "  高額商材は検討期間が長く、単月CVRは",
    "  下がりやすい。",
    "",
    "● アクセスの伸び（+24.8%）が売上を支えた",
    "  構図で、集客基盤そのものは拡大している。"
  ], 4.95, 9.5);
  note(s,0.55,3.95,7.4,"■  売上構造の変化（商品分析ベース / 売上増 +¥2,184K の内訳）",[
    "▲ 増加要因",
    "・キャディバッグ  +¥1,448K（最大要因・全体増加額の約66%）",
    "・カートバッグ・ラウンドバッグ  +¥191K  /  帽子・バイザー  +¥182K",
    "・ボストンバッグ  +¥135K  /  ドライバー用  +¥118K  /  トラベルカバー  +¥99K",
    "",
    "▼ 減少要因",
    "・シャツ・ポロシャツ  -¥289K  /  メンズシューズ  -¥252K",
    "・傘・パラソル  -¥154K  /  トートバッグ  -¥107K  /  パンツ  -¥57K"
  ], 2.4);
}

/* ---------- 4. 月次売上推移 ---------- */
{
  const s = page("月次売上推移（直近13ヶ月）","YAMANIGOLF 楽天市場店 / 店舗分析レポート / 2026年8月度",
    "13ヶ月推移。2026年8月は前年同月比+35.7%だが、前月比では-17.8%。");
  table(s, ["月","売上","CVR","客単価"], D.monthly.map(r=>r.slice(0,4)),
    { x:0.55, y:1.4, w:4.6, colW:[1.0,1.6,0.95,1.05], rowH:0.36, fontSize:9.5,
      align:["left","right","right","right"],
      cellBold:(ri)=>ri===12, cellColor:(ri)=> ri===12 ? ORANGE : INK });
  s.addChart(pres.ChartType.bar, [{
      name:"月次売上（百万円）",
      labels: D.monthly.map(r=>r[0].slice(5)),
      values: D.monthly.map(r=>r[4])
    }], { x:5.45, y:1.40, w:7.35, h:3.95,
      barDir:"col", chartColors:["7E96B4","7E96B4","7E96B4","7E96B4","7E96B4","7E96B4","7E96B4","7E96B4","7E96B4","7E96B4","7E96B4","7E96B4",ORANGE],
      varyColors:true, showTitle:true, title:"月次売上 推移（百万円）", titleFontSize:12,
      titleColor:NAVY, titleFontFace:JP,
      showValue:true, dataLabelPosition:"outEnd", dataLabelFontSize:9, dataLabelColor:SLATE,
      dataLabelFontFace:JP, dataLabelFormatCode:"0.0",
      catAxisLabelColor:SLATE, catAxisLabelFontSize:9, catAxisLabelFontFace:JP,
      valAxisLabelColor:SLATE, valAxisLabelFontSize:9, valAxisHidden:false,
      valGridLine:{ color:"EDF0F4", size:1 }, catGridLine:{ style:"none" },
      showLegend:false, valAxisMaxVal:16, barGapWidthPct:45 });
  note(s,5.45,5.5,7.35,"■  推移の読み方",[
    "● 2026/08（オレンジ）は ¥9.71M。前年同月 ¥7.15M から +35.7% と伸長。",
    "● 前月 2026/07 ¥11.81M からは -17.8%。夏枯れの季節要因に加え、7月の",
    "  冷感グッズ特需の反動が出た。",
    "● CVR は 1.35%（13ヶ月中最高）→ 0.99% へ低下する一方、客単価は",
    "  ¥9,402 → ¥11,583 へ回復。単価と転換率はトレードオフの関係にある。"
  ], 1.3, 8.5);
}

/* ---------- 5. RPP広告 ---------- */
{
  const s = page("RPP広告パフォーマンス","YAMANIGOLF 楽天市場店 / 店舗分析レポート / 2026年8月度",
    "ROAS 372.3%を維持。広告経由売上が月次売上の60.5%を占める。");
  const cw=3.92, gap=0.23;
  kpi(s,0.55,1.35,cw,1.28,"有効予算","¥1,580,000","消化率: 99.87%",SLATE);
  kpi(s,0.55+(cw+gap),1.35,cw,1.28,"クリック数","57,006","CTR 0.17%",SLATE);
  kpi(s,0.55+2*(cw+gap),1.35,cw,1.28,"広告費（実績額）","¥1,577,960","CPC ¥28 / 割引後 ¥1,263,960",SLATE);
  kpi(s,0.55,2.78,cw,1.28,"ROAS（720時間）","372.3%","前月 373.0% と同水準",POS);
  kpi(s,0.55+(cw+gap),2.78,cw,1.28,"広告経由売上","¥5,875,210","月次売上の 60.5%",POS);
  kpi(s,0.55+2*(cw+gap),2.78,cw,1.28,"CPA（注文獲得単価）","¥3,507","売上件数 450件 / CVR 0.78%",NEG);
  note(s,0.55,4.24,12.22,"■  考察",[
    "● ROAS(720h) 372.3% で前月（373.0%）とほぼ同水準を維持。予算は ¥2,040,000 → ¥1,580,000 に -23% 縮小したが、消化率 99.87% でフル活用。",
    "● 広告経由売上 ¥5,875,210 は月次売上 ¥9,706,322 の 60.5% を占め、前月（51.1%）から +9.4pt 上昇。RPP 依存度が高まっている点は要注視。",
    "● CPC ¥28（前月 ¥33）で改善、CTR 0.17%（前月 0.18%）は横ばい。予算縮小により入札競争の激しい枠を外せた効果。",
    "● 一方 CPA ¥3,507（前月 ¥2,765）と +27% 悪化、広告CVR も 1.18% → 0.78% へ低下。高単価キャディバッグ中心の構成で検討期間が伸びたことが影響。",
    "● ROAS は維持できているため、獲得単価の悪化は客単価上昇（¥3,507 の CPA に対し広告経由客単価 ¥13,056）で十分吸収できている。"
  ]);
  s.addText("※ ROAS(720時間) は楽天RPPレポートの「実績額（合計）」基準。割引後実績額 ¥1,263,960 で計算した場合は 464.9%。",
    { x:0.55, y:6.58, w:12.22, h:0.28, fontFace:JP, fontSize:8.5, color:MUTED, isTextBox:true, margin:0 });
}

/* ---------- 6. アクセス・転換率 ---------- */
{
  const s = page("アクセス・転換率分析","YAMANIGOLF 楽天市場店 / 店舗分析レポート / 2026年8月度",
    "アクセス+24.8%と大幅拡大。楽天市場トップ+86.5%が最大の伸び。");
  const cw=3.92, gap=0.23;
  kpi(s,0.55,1.35,cw,1.32,"アクセス数","84,921人","前年比 +24.8%",POS);
  kpi(s,0.55+(cw+gap),1.35,cw,1.32,"CVR（転換率）","0.99%","前年 1.03% / -0.04pt",NEG);
  kpi(s,0.55+2*(cw+gap),1.35,cw,1.32,"客単価","¥11,583","前年 ¥10,157 / +14.0%",POS);
  note(s,0.55,2.95,12.22,"■  考察",[
    "● アクセス数は前年比 +24.8%（68,060 → 84,921 人）と大幅拡大。参照元ベースでも 61,370 → 78,968 人（+28.7%）で整合。",
    "● 伸びの牽引は 楽天市場トップ +86.5%（5,032 → 9,385）、店舗商品ページ +43.0%（6,071 → 8,680）、楽天サーチ +14.7%（27,517 → 31,567）。",
    "● Criteoリタゲ（ads.as.criteo.com + sin.creativecdn.com + cat.jp2）は 1,797 → 3,539 人（+96.9%）と倍増。外部リタゲ投資が効いている。",
    "● CVR 0.99% は前年比 -0.04pt の微減だが、前月 1.35% からは -0.36pt。高単価キャディバッグへの構成シフトで検討期間が長期化したため。",
    "● 客単価 ¥11,583（+14.0%）。7月の夏物冷感グッズ中心（¥9,402）から、秋冬キャディバッグ中心へ切り替わり単価が回復。",
    "● TikTok 流入は 1,357 → 0 で完全消滅が継続。Instagram は 328 → 420（+28.0%）とわずかに回復も、SNS 全体では依然低水準。"
  ]);
  s.addText("前月比（2026年7月 → 2026年8月）", { x:0.55, y:5.05, w:6, h:0.28, fontFace:JP, fontSize:11,
    bold:true, color:NAVY, isTextBox:true, margin:0, valign:"middle" });
  mini(s,0.55,5.41,cw,"アクセス数","92,812","84,921","-8.5%",NEG);
  mini(s,0.55+(cw+gap),5.41,cw,"CVR","1.35%","0.99%","-0.36pt",NEG);
  mini(s,0.55+2*(cw+gap),5.41,cw,"客単価","¥9,402","¥11,583","+23.2%",POS);
}

/* ---------- 7. ブランド別売上分析 ---------- */
{
  const s = page("ブランド別売上分析（2026年8月）","YAMANIGOLF 楽天市場店 / 店舗分析レポート / 2026年8月度",
    "PEARLY GATESが+157%で首位。Sun Mountainが新規で4位に。");
  table(s, ["ブランド","売上金額","件数","構成比"],
    D.brands.map(r=>[r[0],r[1],r[2],r[3]]).concat([D.brandTotal.slice(0,4)]),
    { x:0.55, y:1.4, w:6.05, colW:[2.55,1.45,0.95,1.1], rowH:0.29, fontSize:9,
      align:["left","right","right","right"],
      cellBold:(ri)=>ri===14, cellColor:(ri)=> ri===14 ? NAVY : INK });
  const cards=[
    ["1st  PEARLY GATES","¥1,918,970","99件  /  22.7%","前年比 257%（¥747K → ¥1,919K） ▲▲",POS],
    ["2nd  Admiral GOLF","¥1,671,050","237件  /  19.8%","前年比 104%（横ばい、冷感ベスト継続）",SLATE],
    ["3rd  TOMMY HILFIGER Golf","¥1,370,960","184件  /  16.2%","前年比 65%（¥2,119K → ¥1,371K） ▼",NEG],
    ["4th  Sun Mountain","¥859,000","62件  /  10.2%","新規参入継続（前年 ¥0） ▲▲",POS],
    ["5th  Psycho Bunny","¥775,400","90件  /  9.2%","前年比 99%（横ばい）",SLATE]
  ];
  cards.forEach((c,i)=>{
    const y=1.4+i*1.06;
    s.addShape(pres.ShapeType.roundRect,{x:6.85,y,w:5.93,h:0.95,fill:{color: i===0?"FFF3EC":TINT},
      line:{color: i===0?ORANGE:LINE,width:1},rectRadius:0.05});
    s.addText(c[0],{x:7.05,y:y+0.08,w:3.6,h:0.28,fontFace:JP,fontSize:11,bold:true,color:NAVY,isTextBox:true,margin:0,valign:"middle"});
    s.addText(c[1],{x:10.6,y:y+0.06,w:2.0,h:0.32,fontFace:JP,fontSize:14,bold:true,color:NAVY,isTextBox:true,margin:0,align:"right",valign:"middle"});
    s.addText(c[2],{x:7.05,y:y+0.38,w:3.6,h:0.24,fontFace:JP,fontSize:9,color:MUTED,isTextBox:true,margin:0,valign:"middle"});
    s.addText(c[3],{x:7.05,y:y+0.63,w:5.55,h:0.26,fontFace:JP,fontSize:9.5,color:c[4],isTextBox:true,margin:0,valign:"middle"});
  });
  s.addText("※ 商品分析レポート（売上上位1,000商品）ベース。店舗売上 ¥9,706,322 に対する捕捉率 87.0%。",
    { x:0.55, y:6.62, w:6.05, h:0.28, fontFace:JP, fontSize:8.5, color:MUTED, isTextBox:true, margin:0 });
}

/* ---------- 8. ブランド別売上前年比 ---------- */
{
  const s = page("ブランド別売上前年比","YAMANIGOLF 楽天市場店 / 店舗分析レポート / 2026年8月度",
    "PEARLY GATES +157%、Sun Mountain新規が牽引。TOMMY HILFIGER -35%が最大の減少。");
  s.addText("2026年8月 vs 2025年8月", { x:0.55, y:1.22, w:6, h:0.26, fontFace:JP, fontSize:10,
    color:SLATE, isTextBox:true, margin:0 });
  table(s, ["ブランド","売上(2026/08)","件数","売上(2025/08)","件数","売上前年比","備考"],
    D.brands.map(r=>[r[0],r[1],r[2],r[4],r[5],r[6],r[7]]).concat([[
      D.brandTotal[0],D.brandTotal[1],D.brandTotal[2],D.brandTotal[4],D.brandTotal[5],D.brandTotal[6],""]]),
    { x:0.55, y:1.48, w:12.22, colW:[3.0,1.72,0.9,1.72,0.9,1.38,2.6], rowH:0.265, fontSize:9,
      align:["left","right","right","right","right","right","left"],
      cellBold:(ri,ci)=> ci===5 || ri===14,
      cellColor:(ri,ci,r)=> ri===14 ? NAVY : (ci===5 ? yoyColor(r[5]) : INK) });
  s.addText("▶  総括", { x:0.55, y:6.18, w:2, h:0.26, fontFace:JP, fontSize:11, bold:true,
    color:ORANGE, isTextBox:true, margin:0, valign:"middle" });
  s.addText("PEARLY GATES +157% / MASTER BUNNY +101% / New Era +567% / ProSENDR +522% で伸長、Sun Mountain は新規 ¥859K を上乗せ。TOMMY HILFIGER Golf -35% / new balance -46% が後退し、構成比1位が TOMMY HILFIGER から PEARLY GATES へ入れ替わった。",
    { x:0.55, y:6.46, w:12.22, h:0.46, fontFace:JP, fontSize:9.5, color:INK, isTextBox:true, margin:0, valign:"top" });
}

/* ---------- 9. カテゴリ別（全ブランド） ---------- */
{
  const s = page("カテゴリ別売上前年比 — 全ブランド","YAMANIGOLF 楽天市場店 / 店舗分析レポート / 2026年8月度",
    "キャディバッグ+104.9%が牽引。シャツ・ポロシャツ-29.4%、メンズシューズ-56.4%が後退。");
  s.addText("2026年8月 vs 2025年8月", { x:0.55, y:1.22, w:6, h:0.26, fontFace:JP, fontSize:10,
    color:SLATE, isTextBox:true, margin:0 });
  const topt = (x)=>({ x, y:1.55, w:5.95, colW:[2.6,1.25,1.25,0.85], rowH:0.295, fontSize:9,
      align:["left","right","right","right"],
      cellBold:(ri,ci)=>ci===3, cellColor:(ri,ci,r)=> ci===3 ? yoyColor(r[3]) : INK });
  table(s, ["カテゴリ","売上 2026","売上 2025","前年比"], D.catAll, topt(0.55));
  table(s, ["カテゴリ","売上 2026","売上 2025","前年比"], D.catAll2, topt(6.83));
  note(s,0.55,6.35,12.22,"▶  総括",[
    "合計 ¥6,257,440 → ¥8,440,950（前年比 135%）。キャディバッグ ¥2,828K（構成比 33.5%）が単独で +¥1,448K を稼ぎ、全体の増加額の約66%を占める。シャツ・ポロシャツ -29.4% / メンズシューズ -56.4% / 傘・パラソル -69.4% / トートバッグ -72.7% が主な減少要因。"
  ],0.88);
}

/* ---------- 10. 商品別TOP10 ---------- */
{
  const s = page("商品別売上ランキング TOP10（2026年8月）","YAMANIGOLF 楽天市場店 / 店舗分析レポート / 2026年8月度",
    "TOP10中9商品が新規。キャディバッグが7商品を占める。");
  table(s, ["順位","商品コード","商品名","売上金額","件数","前年比"], D.top10,
    { x:0.55, y:1.45, w:12.22, colW:[0.75,1.6,6.3,1.6,0.87,1.1], rowH:0.34, fontSize:9.5,
      align:["center","left","left","right","right","right"],
      cellBold:(ri,ci)=>ci===3||ci===5,
      cellColor:(ri,ci,r)=> ci===5 ? yoyColor(r[5]) : INK });
  note(s,0.55,5.62,12.22,"▶  分析",[
    "● TOP10 のうち 9商品が「新規」。秋冬キャディバッグ新作の先行投入が8月売上を作った構図で、前年同月の商品構成とはほぼ入れ替わっている。",
    "● 1位 PEARLY GATES ビッグニコキャディバッグ ¥612,000（7件・単価 ¥87,429）が突出。2〜3位 Sun Mountain 2型で計 ¥481,000、5・7位 MASTER BUNNY 2型で ¥358,000。",
    "● 非バッグでは 4位 ProSENDR WIDENER（練習器）¥228,000、9位 Admiral GOLF 冷感ベスト ¥122,400（16件）が健闘。"
  ]);
}

/* ---------- 11. 検索KW ---------- */
{
  const s = page("検索キーワード分析（2026年8月）","YAMANIGOLF 楽天市場店 / 店舗分析レポート / 2026年8月度",
    "サンマウンテン関連が首位躍進。ブランド×キャディバッグKWが軒並み急伸。");
  s.addText("楽天サーチ経由の上位キーワード比較（2026年8月 vs 2025年8月）", { x:0.55, y:1.22, w:8, h:0.26,
    fontFace:JP, fontSize:10, color:SLATE, isTextBox:true, margin:0 });
  table(s, ["順位","2026年キーワード","アクセス","2025年キーワード（対応値）","前年比"], D.kw,
    { x:0.55, y:1.55, w:12.22, colW:[0.75,4.3,1.25,4.62,1.3], rowH:0.335, fontSize:10,
      align:["center","left","right","left","right"],
      cellBold:(ri,ci)=>ci===4, cellColor:(ri,ci,r)=> ci===4 ? yoyColor(r[4]) : INK });
  note(s,0.55,5.3,12.22,"■  分析・考察",[
    "● 「サンマウンテン キャディバッグ」506（前年圏外）が首位、「サンマウンテン」261 も3位に新規参入。Sun Mountain の商品拡張が指名検索を新規に生み出した。",
    "● ブランド×キャディバッグの複合KWが軒並み急伸：パーリーゲイツ +243%/+393%、ジャックバニー +420%、マスターバニー +19%。高単価バッグ需要の顕在化を裏付ける。",
    "● 「ゴルフ ボストンバッグ」193 /「トラビスマシュー キャディバッグ」138 が新規TOP圏入り。バッグカテゴリ全体で検索流入が拡大している。",
    "● 一方 ニューバランス関連KWは大幅減（ニューバランスゴルフシューズ 300→180 / -40%、ニューバランス ゴルフシューズ 278→106 / -62%）。シューズ2型の",
    "  販売終了（-¥215K）と連動しており、new balance -46% の直接要因。後継モデルの投入と SEO 再構築が必要。「ping」も前年10位から圏外へ後退。"
  ], 1.56, 9.5);
}

/* ---------- 12. 流入参照元 ---------- */
{
  const s = page("流入参照元分析（2026年8月）","YAMANIGOLF 楽天市場店 / 店舗分析レポート / 2026年8月度",
    "楽天市場トップ+86.5%が最大の伸び。Criteoリタゲが倍増、TikTokは消滅継続。");
  s.addText("アクセス総数（参照元基準）: 78,968 人  ／  前年 61,370 人  ／  +28.7%", { x:0.55, y:1.22, w:9, h:0.26,
    fontFace:JP, fontSize:10.5, bold:true, color:NAVY, isTextBox:true, margin:0 });
  table(s, ["参照元","2026/08","シェア","2025/08","前年比"], D.ref,
    { x:0.55, y:1.58, w:7.0, colW:[2.75,1.15,0.95,1.15,1.0], rowH:0.33, fontSize:9.5,
      align:["left","right","right","right","right"],
      cellBold:(ri,ci)=>ci===4, cellColor:(ri,ci,r)=> ci===4 ? yoyColor(r[4]) : INK });
  note(s,7.8,1.58,4.98,"■  注目ポイント",[
    "● 楽天市場トップ +86.5%（5,032 → 9,385）が最大の伸び幅。",
    "  楽天内アルゴリズム評価・特集掲載の効果が継続。",
    "",
    "● 楽天サーチは +14.7% と拡大するも、シェアは 44.8% →",
    "  40.0% へ -4.8pt 低下。流入源が分散し、単一依存が",
    "  緩和された健全な構造変化。",
    "",
    "● Criteoリタゲ合計 1,797 → 3,539 人（+96.9%）で倍増。",
    "  高単価キャディバッグの検討層の再訪を確保できている。",
    "",
    "● android-app://chrome +222.8%（991 → 3,199）。",
    "  Androidアプリ経由の流入計測が拡大。",
    "",
    "● TikTok 1,357 → 0 で完全消滅が継続、Facebook -16.5%。",
    "  Instagram は +28.0%（328 → 420）とわずかに回復するも、",
    "  SNS 流入全体は 1,988 → 673 人（-66%）。SNS 施策の",
    "  再構築は引き続き最優先の課題。",
    "",
    "● Google -1.7% / Yahoo -3.0% と外部検索はほぼ横ばい。"
  ], 4.9);
}

/* ---------- 13. 伸び・落ち商品 ---------- */
{
  const s = page("前年対比 伸び・落ち商品","YAMANIGOLF 楽天市場店 / 店舗分析レポート / 2026年8月度",
    "新作キャディバッグが伸長を独占。前年主力バッグの販売終了が減少要因。");
  s.addText("▲  伸び商品（新規・前年比プラス）", { x:0.55, y:1.28, w:6, h:0.3, fontFace:JP,
    fontSize:12.5, bold:true, color:POS, isTextBox:true, margin:0 });
  D.up.forEach((r,i)=>{
    const y=1.68+i*0.68;
    s.addShape(pres.ShapeType.roundRect,{x:0.55,y,w:6.03,h:0.58,fill:{color:"F0F8F3"},line:{color:"CBE4D6",width:1},rectRadius:0.04});
    s.addText(r[0],{x:0.73,y:y+0.05,w:1.3,h:0.24,fontFace:"Calibri",fontSize:9.5,bold:true,color:POS,isTextBox:true,margin:0,valign:"middle"});
    s.addText(r[1],{x:0.73,y:y+0.28,w:3.6,h:0.24,fontFace:JP,fontSize:9,color:INK,isTextBox:true,margin:0,valign:"middle"});
    s.addText(r[2],{x:4.2,y:y+0.16,w:2.2,h:0.28,fontFace:JP,fontSize:10,bold:true,color:NAVY,isTextBox:true,margin:0,align:"right",valign:"middle"});
  });
  s.addText("▼  落ち商品（前年から消滅・減少）", { x:6.75, y:1.28, w:6, h:0.3, fontFace:JP,
    fontSize:12.5, bold:true, color:NEG, isTextBox:true, margin:0 });
  D.down.forEach((r,i)=>{
    const y=1.68+i*0.68;
    s.addShape(pres.ShapeType.roundRect,{x:6.75,y,w:6.03,h:0.58,fill:{color:"FCF1F0"},line:{color:"EFD2CF",width:1},rectRadius:0.04});
    s.addText(r[0],{x:6.93,y:y+0.05,w:1.3,h:0.24,fontFace:"Calibri",fontSize:9.5,bold:true,color:NEG,isTextBox:true,margin:0,valign:"middle"});
    s.addText(r[1],{x:6.93,y:y+0.28,w:3.6,h:0.24,fontFace:JP,fontSize:9,color:INK,isTextBox:true,margin:0,valign:"middle"});
    s.addText(r[2],{x:10.2,y:y+0.16,w:2.4,h:0.28,fontFace:JP,fontSize:9.5,bold:true,color:NAVY,isTextBox:true,margin:0,align:"right",valign:"middle"});
  });
  note(s,0.55,5.88,12.23,"▶  分析",[
    "● 伸び商品は秋冬キャディバッグ新作が独占。前年に存在しなかった商品群が +¥1,563K を新規に積み上げた。",
    "● 落ち商品は前年主力だったキャディバッグ5型と new balance 574 v3 SL ゴルフシューズ2型が揃って販売終了。計 -¥762K の消滅。",
    "● 商品入替は機能しているが、new balance のシューズは後継モデルが未投入。検索需要（KW -40〜62%）も連動して失っている点は要対応。"
  ]);
}

/* ---------- 14. まとめと推奨アクション ---------- */
{
  const s = page("まとめと推奨アクション","YAMANIGOLF 楽天市場店 / 店舗分析レポート / 2026年8月度",
    "増収基調は継続。TOMMY HILFIGER / new balance の立て直しとSNS再構築が次の課題。");
  s.addShape(pres.ShapeType.roundRect,{x:0.55,y:1.32,w:6.03,h:5.0,fill:{color:"F0F8F3"},line:{color:"CBE4D6",width:1},rectRadius:0.06});
  s.addText("✓  成果・ポジティブ指標",{x:0.8,y:1.46,w:5.5,h:0.32,fontFace:JP,fontSize:13,bold:true,color:POS,isTextBox:true,margin:0,valign:"middle"});
  s.addText([
    "●  売上 ¥9,706,322、前年比 +35.7% で大幅増収",
    "●  アクセス 84,921人（+24.8%）で大幅拡大",
    "●  客単価 ¥11,583（+14.0%）、7月比 +23.2% でV字回復",
    "●  キャディバッグ ¥2,828K（+104.9%）が売上を牽引",
    "●  PEARLY GATES +157%（¥747K → ¥1,919K）",
    "●  Sun Mountain 新規 ¥859K / MASTER BUNNY +101%",
    "●  ProSENDR +522% / New Era +567% で新規カテゴリ確立",
    "●  楽天市場トップ +86.5% / Criteoリタゲ +96.9%",
    "●  RPP ROAS 372.3% を予算 -23% でも維持、CPC ¥33→¥28",
    "●  サンマウンテン関連KWが検索1位・3位に新規躍進"
  ].map((t,i,a)=>({text:t,options:{breakLine:i<a.length-1}})),
    {x:0.8,y:1.9,w:5.55,h:4.3,fontFace:JP,fontSize:10,color:INK,isTextBox:true,margin:0,lineSpacingMultiple:1.36,valign:"top"});

  s.addShape(pres.ShapeType.roundRect,{x:6.75,y:1.32,w:6.03,h:5.0,fill:{color:"FFF6F0"},line:{color:"F2D9C8",width:1},rectRadius:0.06});
  s.addText("△  課題・推奨アクション",{x:7.0,y:1.46,w:5.5,h:0.32,fontFace:JP,fontSize:13,bold:true,color:ORANGE,isTextBox:true,margin:0,valign:"middle"});
  s.addText([
    "●  TOMMY HILFIGER Golf -35%（構成比1位→3位）が最大の課題",
    "   → シャツ・ポロシャツ -52% / キャディバッグ -53%。秋冬主力の",
    "     ページ強化と新作投入計画の前倒しを推奨",
    "●  new balance -46%、574 v3 SL の後継モデル投入が急務",
    "   → 指名KW -40〜62% と連動。空いた検索枠の奪還が必要",
    "●  CVR 0.99%（7月 1.35% から -0.36pt）",
    "   → 高単価バッグのLP・サイズ比較・レビュー導線を強化",
    "●  広告依存度 60.5%（前月 51.1% / +9.4pt）",
    "   → CPA ¥3,507（+27%）。ROAS維持できる範囲で入札を再調整",
    "●  SNS流入 -66%（TikTok 0 継続 / Facebook -17%）",
    "   → SNS 施策の全面再構築は引き続き最優先",
    "●  傘・パラソル -69% / トートバッグ -73% / メンズシューズ -56%",
    "   → 縮小カテゴリの品揃え見直し"
  ].map((t,i,a)=>({text:t,options:{breakLine:i<a.length-1}})),
    {x:7.0,y:1.9,w:5.55,h:4.3,fontFace:JP,fontSize:10,color:INK,isTextBox:true,margin:0,lineSpacingMultiple:1.3,valign:"top"});
}

/* ---------- 15. カテゴリ別 Tommy Hilfiger ---------- */
{
  const s = page("カテゴリ別売上前年比 — Tommy Hilfiger Golf","YAMANIGOLF 楽天市場店 / 店舗分析レポート / 2026年8月度",
    "主力ブランドの詳細分析。ウェア・バッグの2本柱が同時に半減。");
  s.addText("2026年8月 vs 2025年8月", { x:0.55, y:1.22, w:6, h:0.26, fontFace:JP, fontSize:10,
    color:SLATE, isTextBox:true, margin:0 });
  table(s, ["カテゴリ","売上(2026/08)","件数","売上(2025/08)","件数","売上前年比"], D.catTH,
    { x:0.55, y:1.5, w:7.25, colW:[2.5,1.2,0.65,1.2,0.65,1.05], rowH:0.28, fontSize:8.5,
      align:["left","right","right","right","right","right"],
      cellBold:(ri,ci)=>ci===5, cellColor:(ri,ci,r)=> ci===5 ? yoyColor(r[5]) : INK });
  note(s,8.02,1.5,4.76,"■  分析・考察",[
    "Tommy Hilfiger Golf 合計：",
    "¥2,119,460 → ¥1,370,960（前年比 65% / -35%）",
    "",
    "● 主力のシャツ・ポロシャツが -52.4%（¥533K → ¥254K）。",
    "  件数も 60件 → 30件 と半減。夏物ウェアの残存在庫と",
    "  値引き施策の縮小が影響したとみられる。",
    "",
    "● キャディバッグ -53.2%（¥372K → ¥174K）。他ブランドが",
    "  秋冬新作を先行投入するなか、THG は投入が遅れた。",
    "",
    "● 帽子・バイザー -46.9% / パンツ -38.6% と、ウェア系が",
    "  軒並み前年割れ。",
    "",
    "● 一方、ボストンバッグ +283%、アンダーウェア +250%、",
    "  スカート +83%、ベルト +35% は伸長。小物・レディース",
    "  ラインには拡大余地がある。",
    "",
    "▶ 推奨：秋冬キャディバッグ／モックネックの投入前倒しと、",
    "  伸びているボストンバッグ・アンダーウェアの露出拡大。"
  ], 4.95);
  s.addText("※ 表は売上上位15カテゴリを掲載", { x:0.55, y:6.5, w:7.25, h:0.26, fontFace:JP,
    fontSize:8.5, color:MUTED, isTextBox:true, margin:0 });
}

pres.writeFile({ fileName: "/tmp/claude-0/-home-user-home/7cd269b9-76ec-5b62-a114-e98ebb274bdd/scratchpad/YAMANIGOLF_202608.pptx" })
  .then(f=>console.log("written:",f));
