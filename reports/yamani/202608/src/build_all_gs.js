const pptxgen = require('pptxgenjs');
const D1 = require('./data.js');
const D2 = require('./data_bm.js');
const D3 = require('./data_yh.js');
const D4 = require('./data_az.js');

const NAVY="0E2038", NAVY2="1B3A5F", INK="1F2733",
      MUTED="6B7280", LINE="DCE1E8", TINT="F3F6FA", WHITE="FFFFFF",
      POS="1F7A4D", NEG="B3261E", SLATE="45566B";
let ORANGE="E8703A";
const JP="Noto Sans JP";
const W=13.333, H=7.5;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "WAC WORKS";

let FOOT = "Confidential  |  WAC WORKS  /  2026年8月度 店舗分析レポート";

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


/* ========== COVER ========== */
{
  const s = pres.addSlide();
  s.background = { color: NAVY };
  s.addText("WAC WORKS — 店舗分析レポート", { x:0.9, y:1.55, w:11, h:0.4, fontFace:JP, fontSize:14,
    bold:true, color:"E8703A", charSpacing:2, isTextBox:true, margin:0 });
  s.addText("ヤマニ様 4店舗 月次振り返り", { x:0.9, y:2.05, w:11, h:0.85, fontFace:JP, fontSize:40,
    bold:true, color:WHITE, isTextBox:true, margin:0 });
  s.addText("2026 年 8 月度", { x:0.92, y:3.0, w:9, h:0.5, fontFace:JP, fontSize:22,
    color:"BFD0E3", isTextBox:true, margin:0 });
  s.addText("■  構成", { x:0.92, y:3.95, w:4, h:0.3, fontFace:JP, fontSize:12, bold:true,
    color:"E8703A", isTextBox:true, margin:0 });
  s.addText([
    {text:"SECTION 01    YAMANIGOLF 楽天市場店                          /  15 slides", options:{breakLine:true}},
    {text:"SECTION 02    BAG MANIA 楽天市場店                             /  15 slides", options:{breakLine:true}},
    {text:"SECTION 03    BAG MANIA Yahoo!ショッピング店            /  12 slides", options:{breakLine:true}},
    {text:"SECTION 04    BAG MANIA Amazon ベンダー                    /   7 slides", options:{}}
  ], { x:0.92, y:4.35, w:11.5, h:1.5, fontFace:JP, fontSize:12, color:"8EA6C2",
       isTextBox:true, margin:0, lineSpacingMultiple:1.5 });
  s.addText("Confidential  |  WAC WORKS  /  2026年8月度 店舗分析レポート", { x:0.9, y:6.85, w:11.5, h:0.3,
    fontFace:JP, fontSize:8.5, color:"5E7A8F", isTextBox:true, margin:0 });
  s.addNotes("ヤマニ様 2026年8月度 4店舗統合レポートの表紙。");
}

/* ========== 4チャネル横断サマリー ========== */
{
  ORANGE = "E8703A";
  const s = page("4チャネル横断サマリー（2026年8月）","ヤマニ様 4店舗 / 店舗分析レポート / 2026年8月度",
    "4チャネル合計 ¥55.4M（前年比 +14.9%）。Amazonが最大規模、Yahooが最大の伸び率。");
  table(s, ["チャネル","売上","前年比","客単価","転換率","広告費","広告ROAS","広告経由比率"], [
    ["YAMANIGOLF 楽天市場店","¥9,706,322","+35.7%","¥11,583","0.99%","¥1,577,960","372%","60.5%"],
    ["BAG MANIA 楽天市場店","¥14,905,535","-3.2%","¥12,600","0.89%","¥2,767,357","271%","50.2%"],
    ["BAG MANIA Yahoo!店","¥7,167,305","+39.7%","¥12,400","1.65%","¥1,080,261","397%","59.8%"],
    ["BAG MANIA Amazon（上代）","¥23,619,924","+15.0%","¥10,668","—","¥860,421","999%","36.4%"],
    ["合計","¥55,399,086","+14.9%","—","—","¥6,285,999","418%","47.4%"]
  ], { x:0.55, y:1.45, w:12.22, colW:[3.0,1.65,1.1,1.25,1.05,1.6,1.25,1.32], rowH:0.42, fontSize:10.5,
       align:["left","right","right","right","right","right","right","right"],
       cellBold:(ri,ci)=> ri===4 || ci===2,
       cellColor:(ri,ci,r)=> ri===4 ? NAVY : (ci===2 ? yoyColor(r[2]) : INK) });
  note(s,0.55,4.05,12.22,"■  4チャネルを並べて見えること",[
    "● 合計 ¥48,220,721 → ¥55,399,086（+14.9%）。4チャネルのうち3チャネルが増収で、唯一 BAG MANIA 楽天店（-3.2%）が横ばい。",
    "● 規模では Amazon が ¥23.6M（上代）で全体の 42.6% を占め最大。伸び率では Yahoo +39.7% が最大、次いで YAMANIGOLF +35.7%。",
    "● 転換率は Yahoo 1.65% が突出（楽天2店の約1.8倍）。Yahoo はアプリ経由が売上の 79.5% を占め、アプリ内での露出が転換の高さを支えている。",
    "● 広告効率は Amazon 999% が圧倒的。次いで Yahoo 397% / YAMANIGOLF 372% / BAG MANIA楽天 271%。楽天2店は広告効率の改善余地が大きい。",
    "● 広告依存度は全チャネルで高水準（36〜61%）。合計 ¥6,285,999 の広告費で ¥26,247,854（全売上の 47.4%）を生んでおり、",
    "  広告を止めた場合の売上耐性が構造的な課題。特に Amazon は自然検索 -7.0% と土台が細っている点が最大のリスク。"
  ]);
  s.addText("※ Amazonは上代（下代は ¥14,970,830）。楽天・Yahooとは価格ベースが異なるため単純比較には注意。転換率は楽天=CVR / Yahoo=購買率（注文者数÷訪問者数）。広告ROASは各媒体レポートの定義に準拠。",
    { x:0.55, y:6.45, w:12.22, h:0.46, fontFace:JP, fontSize:8, color:MUTED, isTextBox:true, margin:0, valign:"top" });
}


/* ================= build.js ================= */
ORANGE = "E8703A";
FOOT = "Confidential  |  YAMANIGOLF 楽天市場店  /  2026年8月度 分析レポート";
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
  table(s, ["月","売上","CVR","客単価"], D1.monthly.map(r=>r.slice(0,4)),
    { x:0.55, y:1.4, w:4.6, colW:[1.0,1.6,0.95,1.05], rowH:0.36, fontSize:9.5,
      align:["left","right","right","right"],
      cellBold:(ri)=>ri===12, cellColor:(ri)=> ri===12 ? ORANGE : INK });
  s.addChart(pres.ChartType.bar, [{
      name:"月次売上（百万円）",
      labels: D1.monthly.map(r=>r[0].slice(5)),
      values: D1.monthly.map(r=>r[4])
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
    D1.brands.map(r=>[r[0],r[1],r[2],r[3]]).concat([D1.brandTotal.slice(0,4)]),
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
    D1.brands.map(r=>[r[0],r[1],r[2],r[4],r[5],r[6],r[7]]).concat([[
      D1.brandTotal[0],D1.brandTotal[1],D1.brandTotal[2],D1.brandTotal[4],D1.brandTotal[5],D1.brandTotal[6],""]]),
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
  table(s, ["カテゴリ","売上 2026","売上 2025","前年比"], D1.catAll, topt(0.55));
  table(s, ["カテゴリ","売上 2026","売上 2025","前年比"], D1.catAll2, topt(6.83));
  note(s,0.55,6.35,12.22,"▶  総括",[
    "合計 ¥6,257,440 → ¥8,440,950（前年比 135%）。キャディバッグ ¥2,828K（構成比 33.5%）が単独で +¥1,448K を稼ぎ、全体の増加額の約66%を占める。シャツ・ポロシャツ -29.4% / メンズシューズ -56.4% / 傘・パラソル -69.4% / トートバッグ -72.7% が主な減少要因。"
  ],0.88);
}

/* ---------- 10. 商品別TOP10 ---------- */
{
  const s = page("商品別売上ランキング TOP10（2026年8月）","YAMANIGOLF 楽天市場店 / 店舗分析レポート / 2026年8月度",
    "TOP10中9商品が新規。キャディバッグが7商品を占める。");
  table(s, ["順位","商品コード","商品名","売上金額","件数","前年比"], D1.top10,
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
  table(s, ["順位","2026年キーワード","アクセス","2025年キーワード（対応値）","前年比"], D1.kw,
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
  table(s, ["参照元","2026/08","シェア","2025/08","前年比"], D1.ref,
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
  D1.up.forEach((r,i)=>{
    const y=1.68+i*0.68;
    s.addShape(pres.ShapeType.roundRect,{x:0.55,y,w:6.03,h:0.58,fill:{color:"F0F8F3"},line:{color:"CBE4D6",width:1},rectRadius:0.04});
    s.addText(r[0],{x:0.73,y:y+0.05,w:1.3,h:0.24,fontFace:"Calibri",fontSize:9.5,bold:true,color:POS,isTextBox:true,margin:0,valign:"middle"});
    s.addText(r[1],{x:0.73,y:y+0.28,w:3.6,h:0.24,fontFace:JP,fontSize:9,color:INK,isTextBox:true,margin:0,valign:"middle"});
    s.addText(r[2],{x:4.2,y:y+0.16,w:2.2,h:0.28,fontFace:JP,fontSize:10,bold:true,color:NAVY,isTextBox:true,margin:0,align:"right",valign:"middle"});
  });
  s.addText("▼  落ち商品（前年から消滅・減少）", { x:6.75, y:1.28, w:6, h:0.3, fontFace:JP,
    fontSize:12.5, bold:true, color:NEG, isTextBox:true, margin:0 });
  D1.down.forEach((r,i)=>{
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
  table(s, ["カテゴリ","売上(2026/08)","件数","売上(2025/08)","件数","売上前年比"], D1.catTH,
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


/* ================= build_bm.js ================= */
ORANGE = "B98A1E";
FOOT = "Confidential  |  BAGMANIA 楽天市場店  /  2026年8月度 分析レポート";
/* ---------- 1. SECTION DIVIDER ---------- */
{
  const s = pres.addSlide();
  s.background = { color: NAVY };
  s.addText("SECTION 02", { x:0.9, y:1.7, w:6, h:0.4, fontFace:"Calibri", fontSize:14,
    bold:true, color:ORANGE, charSpacing:4, isTextBox:true, margin:0 });
  s.addText("BAG MANIA", { x:0.9, y:2.15, w:9, h:0.95, fontFace:"Calibri", fontSize:52,
    bold:true, color:WHITE, isTextBox:true, margin:0 });
  s.addText("楽天市場店 ／ 2026年8月度", { x:0.92, y:3.13, w:9, h:0.5, fontFace:JP, fontSize:20,
    color:"BFD0E3", isTextBox:true, margin:0 });
  s.addText([
    {text:"店舗KPIサマリー  /  前年同月比較  /  月次売上推移  /  RPP広告パフォーマンス", options:{breakLine:true}},
    {text:"アクセス・転換率分析  /  ブランド別売上分析  /  ブランド別売上前年比", options:{breakLine:true}},
    {text:"カテゴリ別売上前年比（全ブランド / JILL STUART）  /  商品別売上ランキング TOP10", options:{breakLine:true}},
    {text:"検索キーワード分析  /  流入参照元分析  /  前年対比 伸び・落ち商品  /  まとめと推奨アクション", options:{}}
  ], { x:0.92, y:4.1, w:11.5, h:1.5, fontFace:JP, fontSize:11, color:"8EA6C2",
       isTextBox:true, margin:0, lineSpacingMultiple:1.4 });
  s.addText("Confidential  |  BAGMANIA 楽天市場店", { x:0.9, y:6.85, w:11.5, h:0.3,
    fontFace:JP, fontSize:8.5, color:"5E7A8F", isTextBox:true, margin:0 });
  s.addNotes("SECTION 02 の扉。BAG MANIA 楽天市場店の2026年8月度実績を15枚で報告する。");
}

/* ---------- 2. KPIサマリー ---------- */
{
  const s = page("2026年8月  店舗KPIサマリー","BAGMANIA 楽天市場店 / 店舗分析レポート / 2026年8月度",
    "アクセス-27.9%の大幅減をCVR+0.26ptで吸収し、売上は-3.2%に踏みとどまった。");
  const cw=2.95, gap=0.21;
  kpi(s,0.55,1.35,cw,1.32,"売上","¥14,905,535","前年 ¥15,405,720  /  -3.2%",NEG);
  kpi(s,0.55+(cw+gap),1.35,cw,1.32,"アクセス","132,898人","前年 184,280  /  -27.9%",NEG);
  kpi(s,0.55+2*(cw+gap),1.35,cw,1.32,"CVR（転換率）","0.89%","前年 0.63%  /  +0.26pt",POS);
  kpi(s,0.55+3*(cw+gap),1.35,cw,1.32,"客単価","¥12,600","前年 ¥13,327  /  -5.5%",NEG);
  note(s,0.55,2.95,12.22,"■  2026年8月のハイライト",[
    "● 売上 ¥14,905,535（前年比 -3.2%）でほぼ前年並みを維持。アクセス -27.9% の大幅減を CVR +0.26pt が打ち消した。",
    "● CVR 0.89% は直近13ヶ月で最高水準（前年 0.63% / 前月 0.87%）。流入は減ったが購買意欲の高い層が残っている。",
    "● アクセス減の最大要因は SNS の消失：Instagram 7,287 → 782（-89.3%）/ Facebook 1,067 → 0。SNS計 -90.6% で、",
    "  アクセス減 -24,834人のうち約 30%（-7,572人）を占める。楽天内流入も一律 -15〜16% で縮小。",
    "● ブランドは JILL STUART +4%（構成比 42.7% で首位継続）/ BEAMS +67% / PATRICK COX +11% / Pinky&Dianne +7% が伸長。",
    "● 一方 MARGARET HOWELL -29% / UNGARO -30% / MANIUNO -42% が後退。中堅ブランドの落ち込みが売上減の主因。"
  ]);
  s.addText("前月比（2026年7月 → 2026年8月）", { x:0.55, y:5.3, w:6, h:0.28, fontFace:JP, fontSize:11,
    bold:true, color:NAVY, isTextBox:true, margin:0, valign:"middle" });
  mini(s,0.55,5.66,cw,"売上","¥16.44M","¥14.91M","-9.4%",NEG);
  mini(s,0.55+(cw+gap),5.66,cw,"アクセス","154,796","132,898","-14.1%",NEG);
  mini(s,0.55+2*(cw+gap),5.66,cw,"CVR","0.87%","0.89%","+0.02pt",POS);
  mini(s,0.55+3*(cw+gap),5.66,cw,"客単価","¥12,190","¥12,600","+3.4%",POS);
}

/* ---------- 3. 前年同月比較 ---------- */
{
  const s = page("前年同月比較（2026年8月 vs 2025年8月）","BAGMANIA 楽天市場店 / 店舗分析レポート / 2026年8月度",
    "アクセス-27.9%に対し売上-3.2%。転換率の改善が減少を吸収した。");
  table(s, ["指標","2026年8月","2025年8月","前年比"], [
    ["売上金額","¥14,905,535","¥15,405,720","-3.2%"],
    ["アクセス人数","132,898","184,280","-27.9%"],
    ["転換率","0.89%","0.63%","+0.26pt"],
    ["客単価","¥12,600","¥13,327","-5.5%"],
    ["売上件数（推計）","1,183件","1,156件","+2.3%"]
  ], { x:0.55, y:1.4, w:7.4, colW:[2.3,1.75,1.75,1.6], rowH:0.4, fontSize:11,
       align:["left","right","right","right"],
       cellBold:(ri,ci)=>ci===3, cellColor:(ri,ci,r)=> ci===3 ? yoyColor(r[3]) : INK });
  note(s,8.2,1.4,4.58,"■  考察",[
    "● アクセスが -27.9%（-51,382人）と大きく減る",
    "  一方で、売上は -3.2% にとどまった。",
    "  CVR +0.26pt / 売上件数 +2.3% が示すとおり、",
    "  「買う人」の数はむしろ増えている。",
    "",
    "● つまり8月に失ったのは購買につながらない",
    "  低質な流入。SNS（Instagram / Facebook）",
    "  経由の -7,572人がその中心で、",
    "  売上インパクトは限定的だった。",
    "",
    "● ただしアクセス基盤そのものは縮小しており、",
    "  楽天サーチ -15.9% / 店舗商品ページ -16.0% /",
    "  楽天市場トップ -15.0% と楽天内も一律で減少。",
    "  中期的には集客の立て直しが必要。",
    "",
    "● 客単価 -5.5% は名刺入れ・キーケースなど",
    "  小物カテゴリの構成比上昇による。"
  ], 4.95, 9.5);
  note(s,0.55,3.95,7.4,"■  売上構造の変化（商品分析ベース / 売上 -¥450K の内訳）",[
    "▲ 増加要因",
    "・メンズ財布  +¥366K  /  ハンドバッグ  +¥288K  /  名刺入れ  +¥168K",
    "・メンズコインケース  +¥58K  /  ボストンバッグ  +¥48K  /  キーケース  +¥28K",
    "",
    "▼ 減少要因",
    "・レディース財布  -¥893K（最大要因・主力カテゴリ）",
    "・トートバッグ  -¥245K  /  UNGARO 口金財布系  -¥330K",
    "・ボディバッグ・ウエストポーチ  -¥129K  /  ショルダーバッグ  -¥100K"
  ], 2.4);
}

/* ---------- 4. 月次売上推移 ---------- */
{
  const s = page("月次売上推移（直近13ヶ月）","BAGMANIA 楽天市場店 / 店舗分析レポート / 2026年8月度",
    "Q4セール期と3月決算期にピーク。8月は端境期で13ヶ月中の底値圏。");
  table(s, ["月","売上","CVR","客単価"], D2.monthly.map(r=>r.slice(0,4)),
    { x:0.55, y:1.4, w:4.6, colW:[1.0,1.6,0.95,1.05], rowH:0.36, fontSize:9.5,
      align:["left","right","right","right"],
      cellBold:(ri)=>ri===12, cellColor:(ri)=> ri===12 ? ORANGE : INK });
  s.addChart(pres.ChartType.bar, [{
      name:"月次売上（百万円）",
      labels: D2.monthly.map(r=>r[0].slice(5)),
      values: D2.monthly.map(r=>r[4])
    }], { x:5.45, y:1.40, w:7.35, h:3.95,
      barDir:"col", chartColors:["7E96B4","7E96B4","7E96B4","7E96B4","7E96B4","7E96B4","7E96B4","7E96B4","7E96B4","7E96B4","7E96B4","7E96B4",ORANGE],
      varyColors:true, showTitle:true, title:"月次売上 推移（百万円）", titleFontSize:12,
      titleColor:NAVY, titleFontFace:JP,
      showValue:true, dataLabelPosition:"outEnd", dataLabelFontSize:9, dataLabelColor:SLATE,
      dataLabelFontFace:JP, dataLabelFormatCode:"0.0",
      catAxisLabelColor:SLATE, catAxisLabelFontSize:9, catAxisLabelFontFace:JP,
      valAxisLabelColor:SLATE, valAxisLabelFontSize:9,
      valGridLine:{ color:"EDF0F4", size:1 }, catGridLine:{ style:"none" },
      showLegend:false, valAxisMinVal:0, valAxisMaxVal:36, barGapWidthPct:45 });
  note(s,5.45,5.5,7.35,"■  推移の読み方",[
    "● 2026/08（ゴールド）は ¥14.91M で13ヶ月中の底値圏。売上ピークは 2026/03 ¥32.73M、",
    "  2025/12 ¥29.52M で、Q4セール期と3月決算期に需要が集中する構造。",
    "● 8月は前年 ¥15.41M → -3.2%、前月 ¥16.44M → -9.4%。端境期で例年どおりの水準。",
    "● 注目すべきは CVR。0.53%（2026/02）を底に 6ヶ月連続で改善し、8月 0.89% は13ヶ月中最高。",
    "  流入規模は縮小しているが、転換効率は着実に上がっている。"
  ], 1.3, 8.5);
}

/* ---------- 5. RPP広告 ---------- */
{
  const s = page("RPP広告パフォーマンス","BAGMANIA 楽天市場店 / 店舗分析レポート / 2026年8月度",
    "ROAS 270.5%で前月から-36.5pt悪化。CPAは+35%上昇。");
  const cw=3.92, gap=0.23;
  kpi(s,0.55,1.35,cw,1.28,"有効予算","¥3,000,000","消化率: 92.24%",SLATE);
  kpi(s,0.55+(cw+gap),1.35,cw,1.28,"クリック数","101,633","CTR 0.10%",SLATE);
  kpi(s,0.55+2*(cw+gap),1.35,cw,1.28,"広告費（実績額）","¥2,767,357","CPC ¥28 / 割引後も同額",SLATE);
  kpi(s,0.55,2.78,cw,1.28,"ROAS（720時間）","270.5%","前月 307.0% / -36.5pt",NEG);
  kpi(s,0.55+(cw+gap),2.78,cw,1.28,"広告経由売上","¥7,486,655","月次売上の 50.2%",SLATE);
  kpi(s,0.55+2*(cw+gap),2.78,cw,1.28,"CPA（注文獲得単価）","¥4,522","売上件数 612件 / CVR 0.60%",NEG);
  note(s,0.55,4.24,12.22,"■  考察",[
    "● ROAS(720h) 270.5% で前月（307.0%）から -36.5pt 悪化。予算は ¥3,000,000 据え置きだが、消化率が 88.29% → 92.24% へ上昇し",
    "  広告費は ¥2,648,932 → ¥2,767,357（+4.5%）に増加。にもかかわらず広告経由売上は ¥8,132,531 → ¥7,486,655（-7.9%）へ減少した。",
    "● CPC ¥28（前月 ¥21）で +33% 上昇、CPA ¥4,522（前月 ¥3,349）も +35% 悪化。クリック単価の高騰が効率悪化の主因。",
    "● 広告CVR 0.60%（前月 0.62%）は横ばい。店舗全体のCVRが 0.89% と改善しているのに対し広告経由が伸びていない点に注目。",
    "  → オーガニックの方が転換効率が高く、広告予算をそのまま積むより入札の選別を強めるほうが合理的。",
    "● 広告依存度 50.2%（前月 49.4%）はほぼ横ばい。売上の半分を RPP が支える構造は継続している。"
  ]);
  s.addText("※ 2026年8月は割引後実績額と実績額がともに ¥2,767,357 で同額。ROAS(720時間) はこの実績額基準。",
    { x:0.55, y:6.58, w:12.22, h:0.28, fontFace:JP, fontSize:8.5, color:MUTED, isTextBox:true, margin:0 });
}

/* ---------- 6. アクセス・転換率 ---------- */
{
  const s = page("アクセス・転換率分析","BAGMANIA 楽天市場店 / 店舗分析レポート / 2026年8月度",
    "アクセス-27.9%、うち約30%はSNS消失。CVRは13ヶ月中最高の0.89%。");
  const cw=3.92, gap=0.23;
  kpi(s,0.55,1.35,cw,1.32,"アクセス数","132,898人","前年比 -27.9%",NEG);
  kpi(s,0.55+(cw+gap),1.35,cw,1.32,"CVR（転換率）","0.89%","前年 0.63% / +0.26pt",POS);
  kpi(s,0.55+2*(cw+gap),1.35,cw,1.32,"客単価","¥12,600","前年 ¥13,327 / -5.5%",NEG);
  note(s,0.55,2.95,12.22,"■  考察",[
    "● アクセス数 132,898人（-27.9%）。参照元ベースでも 156,607 → 131,773 人（-15.9%）で、いずれも大幅減。",
    "● 減少の中心は SNS。Instagram 7,287 → 782（-89.3%）、Facebook 1,067 → 0（消滅）で SNS計 -90.6%（-7,572人）。",
    "  参照元ベースの減少 -24,834人のうち約 30% を SNS が占める。残りは楽天内流入の一律縮小（サーチ -15.9% 等）。",
    "● CVR 0.89% は前年 +0.26pt、直近13ヶ月で最高。売上件数も +2.3% と増えており、失った流入は購買に結びついていなかった層。",
    "● 客単価 ¥12,600（-5.5%）。名刺入れ +35.7% / キーケース +5.5% など小物カテゴリの構成比上昇が単価を押し下げた。",
    "● Criteoリタゲ合計は 5,210 → 4,141 人（-20.5%）。sin.creativecdn.com -43.2% の落ち込みが大きく、配信量の見直しが必要。"
  ]);
  s.addText("前月比（2026年7月 → 2026年8月）", { x:0.55, y:5.05, w:6, h:0.28, fontFace:JP, fontSize:11,
    bold:true, color:NAVY, isTextBox:true, margin:0, valign:"middle" });
  mini(s,0.55,5.41,cw,"アクセス数","154,796","132,898","-14.1%",NEG);
  mini(s,0.55+(cw+gap),5.41,cw,"CVR","0.87%","0.89%","+0.02pt",POS);
  mini(s,0.55+2*(cw+gap),5.41,cw,"客単価","¥12,190","¥12,600","+3.4%",POS);
}

/* ---------- 7. ブランド別売上分析 ---------- */
{
  const s = page("ブランド別売上分析（2026年8月）","BAGMANIA 楽天市場店 / 店舗分析レポート / 2026年8月度",
    "JILL STUARTが構成比42.7%で首位継続。BEAMS +67%が最大の伸び。");
  table(s, ["ブランド","売上金額","件数","構成比"],
    D2.brands.map(r=>[r[0],r[1],r[2],r[3]]).concat([D2.brandTotal.slice(0,4)]),
    { x:0.55, y:1.4, w:6.05, colW:[2.55,1.45,0.95,1.1], rowH:0.335, fontSize:9.5,
      align:["left","right","right","right"],
      cellBold:(ri)=>ri===10, cellColor:(ri)=> ri===10 ? NAVY : INK });
  const cards=[
    ["1st  JILL STUART","¥5,803,100","536件  /  42.7%","前年比 104%（¥5.59M → ¥5.80M） ▲",POS],
    ["2nd  Pinky&Dianne","¥1,872,800","160件  /  13.8%","前年比 107%（堅調） ▲",POS],
    ["3rd  MARGARET HOWELL","¥1,656,000","101件  /  12.2%","前年比 71%（¥2.33M → ¥1.66M） ▼",NEG],
    ["4th  PATRICK COX","¥1,250,500","115件  /  9.2%","前年比 111%（伸長） ▲",POS],
    ["5th  BEAMS","¥1,084,300","131件  /  8.0%","前年比 167%（¥650K → ¥1,084K） ▲▲",POS]
  ];
  cards.forEach((c,i)=>{
    const y=1.4+i*1.06;
    s.addShape(pres.ShapeType.roundRect,{x:6.85,y,w:5.93,h:0.95,fill:{color: i===0?"FBF5E6":TINT},
      line:{color: i===0?ORANGE:LINE,width:1},rectRadius:0.05});
    s.addText(c[0],{x:7.05,y:y+0.08,w:3.6,h:0.28,fontFace:JP,fontSize:11,bold:true,color:NAVY,isTextBox:true,margin:0,valign:"middle"});
    s.addText(c[1],{x:10.6,y:y+0.06,w:2.0,h:0.32,fontFace:JP,fontSize:14,bold:true,color:NAVY,isTextBox:true,margin:0,align:"right",valign:"middle"});
    s.addText(c[2],{x:7.05,y:y+0.38,w:3.6,h:0.24,fontFace:JP,fontSize:9,color:MUTED,isTextBox:true,margin:0,valign:"middle"});
    s.addText(c[3],{x:7.05,y:y+0.63,w:5.55,h:0.26,fontFace:JP,fontSize:9.5,color:c[4],isTextBox:true,margin:0,valign:"middle"});
  });
  s.addText("※ 商品分析レポート（売上上位1,000商品）ベース。店舗売上 ¥14,905,535 に対する捕捉率 91.1%。",
    { x:0.55, y:5.62, w:6.05, h:0.28, fontFace:JP, fontSize:8.5, color:MUTED, isTextBox:true, margin:0 });
  s.addText("▶  上位3ブランドで構成比 68.7%。JILL STUART 単独で 42.7% と依存度が高く、同ブランドの主力商品入替が店舗全体の売上を直接左右する構造。",
    { x:0.55, y:6.0, w:6.05, h:0.8, fontFace:JP, fontSize:9, color:INK, isTextBox:true, margin:0, valign:"top" });
}

/* ---------- 8. ブランド別売上前年比 ---------- */
{
  const s = page("ブランド別売上前年比","BAGMANIA 楽天市場店 / 店舗分析レポート / 2026年8月度",
    "BEAMS +67%が最大の伸び。MARGARET HOWELL -29% / UNGARO -30%が後退。");
  s.addText("2026年8月 vs 2025年8月", { x:0.55, y:1.22, w:6, h:0.26, fontFace:JP, fontSize:10,
    color:SLATE, isTextBox:true, margin:0 });
  table(s, ["ブランド","売上(2026/08)","件数","売上(2025/08)","件数","売上前年比","備考"],
    D2.brands.map(r=>[r[0],r[1],r[2],r[4],r[5],r[6],r[7]]).concat([[
      D2.brandTotal[0],D2.brandTotal[1],D2.brandTotal[2],D2.brandTotal[4],D2.brandTotal[5],D2.brandTotal[6],""]]),
    { x:0.55, y:1.55, w:12.22, colW:[3.0,1.72,0.9,1.72,0.9,1.38,2.6], rowH:0.335, fontSize:10,
      align:["left","right","right","right","right","right","left"],
      cellBold:(ri,ci)=> ci===5 || ri===10,
      cellColor:(ri,ci,r)=> ri===10 ? NAVY : (ci===5 ? yoyColor(r[5]) : INK) });
  note(s,0.55,5.68,12.22,"▶  総括",[
    "● 上位2ブランド（JILL STUART +4% / Pinky&Dianne +7%）と BEAMS +67% / PATRICK COX +11% が伸長し、全体では -3% に踏みとどまった。",
    "● 後退したのは中堅ブランド。MARGARET HOWELL -29%（-¥677K）/ UNGARO -30%（-¥330K）/ MANIUNO -42%（-¥167K）の3ブランドで",
    "  計 -¥1,174K の減少となり、全体の売上減 -¥450K を上回る。上位ブランドの伸びがこれを相殺した構図。",
    "● BEAMS は DESIGN シリーズの二つ折り財布2型（新規 計 ¥410K）が寄与。ブランド構成の入れ替えが進行している。"
  ], 1.2, 9.5);
}

/* ---------- 9. カテゴリ別（全ブランド） ---------- */
{
  const s = page("カテゴリ別売上前年比 — 全ブランド","BAGMANIA 楽天市場店 / 店舗分析レポート / 2026年8月度",
    "主力のレディース財布-10.8%。メンズ財布・ハンドバッグ・名刺入れが伸長。");
  s.addText("2026年8月 vs 2025年8月", { x:0.55, y:1.22, w:6, h:0.26, fontFace:JP, fontSize:10,
    color:SLATE, isTextBox:true, margin:0 });
  const topt = (x)=>({ x, y:1.55, w:5.95, colW:[2.6,1.25,1.25,0.85], rowH:0.36, fontSize:9,
      align:["left","right","right","right"],
      cellBold:(ri,ci)=>ci===3, cellColor:(ri,ci,r)=> ci===3 ? yoyColor(r[3]) : INK });
  table(s, ["カテゴリ","売上 2026","売上 2025","前年比"], D2.catAll, topt(0.55));
  table(s, ["カテゴリ","売上 2026","売上 2025","前年比"], D2.catAll2, topt(6.83));
  note(s,0.55,6.1,12.22,"▶  総括",[
    "合計 ¥14,026,000 → ¥13,575,750（前年比 97%）。主力のレディース財布が -10.8%（-¥893K）で全体を押し下げた一方、メンズ財布 +50.4% /",
    "ハンドバッグ +107.3% / 名刺入れ +35.7% / メンズコインケース +161.4% と、財布以外・メンズ領域が伸長。商品構成の多角化が進んでいる。"
  ],0.85,9.5);
}

/* ---------- 10. 商品別TOP10 ---------- */
{
  const s = page("商品別売上ランキング TOP10（2026年8月）","BAGMANIA 楽天市場店 / 店舗分析レポート / 2026年8月度",
    "JILL STUARTがTOP8を独占。口金タイプが後退しL字ファスナーが伸長。");
  table(s, ["順位","商品コード","商品名","売上金額","件数","前年比"], D2.top10,
    { x:0.55, y:1.45, w:12.22, colW:[0.75,1.6,6.3,1.6,0.87,1.1], rowH:0.34, fontSize:9.5,
      align:["center","left","left","right","right","right"],
      cellBold:(ri,ci)=>ci===3||ci===5,
      cellColor:(ri,ci,r)=> ci===5 ? yoyColor(r[5]) : INK });
  note(s,0.55,5.62,12.22,"▶  分析",[
    "● TOP10 のうち 8商品が JILL STUART。1位 グローリア 折り財布 ¥720,000（60件）、2位 エターナル L字ファスナー折り財布 ¥624,000（+73.3%）。",
    "● 留め具タイプで明暗が分かれた。L字ファスナー系（2位 +73.3% / 5位 +38.9%）とラウンドファスナー（6位 +26.3%）が伸長する一方、",
    "  口金（がま口）系は 3位 -39.7% / 8位 -68.1% と大幅減。同じシリーズ内でも留め具によって前年比が逆方向に振れている。",
    "● 4位 グローリア 名刺入れ +168.2%（59件）が財布以外で最大の伸び。9位 BEAMS DESIGN Aggressive 二つ折り財布 ¥270,000 が新規ランクイン。"
  ]);
}

/* ---------- 11. 検索KW ---------- */
{
  const s = page("検索キーワード分析（2026年8月）","BAGMANIA 楽天市場店 / 店舗分析レポート / 2026年8月度",
    "一般KWが急増、ブランド指名KWが軒並み減少。流入構造が転換している。");
  s.addText("楽天サーチ経由の上位キーワード比較（2026年8月 vs 2025年8月）", { x:0.55, y:1.22, w:8, h:0.26,
    fontFace:JP, fontSize:10, color:SLATE, isTextBox:true, margin:0 });
  table(s, ["順位","2026年キーワード","アクセス","2025年キーワード（対応値）","前年比"], D2.kw,
    { x:0.55, y:1.55, w:12.22, colW:[0.75,4.3,1.25,4.62,1.3], rowH:0.335, fontSize:10,
      align:["center","left","right","left","right"],
      cellBold:(ri,ci)=>ci===4, cellColor:(ri,ci,r)=> ci===4 ? yoyColor(r[4]) : INK });
  note(s,0.55,5.3,12.22,"■  分析・考察",[
    "● 流入の質が入れ替わった。一般KWが急伸：「財布 レディース」+211.4%（886 → 2,759）で首位、「キーケース」+568.2%（151 → 1,009）、",
    "  「長財布 レディース」+83.5%、「二つ折り財布 レディース」+117.3%。カテゴリ名検索での露出が大きく取れている。",
    "● 逆にブランド指名KWは軒並み減少：「ジルスチュアート 財布」-40.4%（2,745 → 1,636、前年1位から陥落）、「マーガレットハウエル 財布」",
    "  -28.3%、「ピンキー&ダイアン 財布」-42.2%（514 → 297）、「パトリックコックス 財布」-21.8%。前年2位「財布 レディース 二つ折」も -72.3%。",
    "● 一般KWは競合と並ぶ土俵のため、指名検索より転換率が落ちやすい。にもかかわらず CVR 0.89% と改善している点は商品ページ側の強さを示す。",
    "  一方で指名検索の減少はブランド想起の弱まりを意味し、中期的な集客リスク。SNS 消失（Instagram -89%）との関連が疑われる。"
  ], 1.56, 9.5);
}

/* ---------- 12. 流入参照元 ---------- */
{
  const s = page("流入参照元分析（2026年8月）","BAGMANIA 楽天市場店 / 店舗分析レポート / 2026年8月度",
    "SNS -90.6%が最大の減少要因。楽天内流入も一律-15〜16%で縮小。");
  s.addText("アクセス総数（参照元基準）: 131,773 人  ／  前年 156,607 人  ／  -15.9%", { x:0.55, y:1.22, w:9, h:0.26,
    fontFace:JP, fontSize:10.5, bold:true, color:NAVY, isTextBox:true, margin:0 });
  table(s, ["参照元","2026/08","シェア","2025/08","前年比"], D2.ref,
    { x:0.55, y:1.58, w:7.0, colW:[2.75,1.15,0.95,1.15,1.0], rowH:0.33, fontSize:9.5,
      align:["left","right","right","right","right"],
      cellBold:(ri,ci)=>ci===4, cellColor:(ri,ci,r)=> ci===4 ? yoyColor(r[4]) : INK });
  note(s,7.8,1.58,4.98,"■  注目ポイント",[
    "● SNS の消失が最大の減少要因。",
    "  Instagram 7,287 → 782（-89.3%）",
    "  Facebook 1,067 → 0（消滅）",
    "  SNS計 8,354 → 782（-90.6% / -7,572人）で、",
    "  参照元減少 -24,834人の約30%を占める。",
    "",
    "● 楽天内流入も一律で縮小。楽天サーチ -15.9% /",
    "  店舗商品ページ -16.0% / 楽天市場トップ",
    "  -15.0% と、ほぼ同じ減少率。シェア構成は",
    "  前年とほぼ変わらず（楽天サーチ 33.0% で同率）、",
    "  流入全体が等比で縮んだ形。",
    "",
    "● Criteoリタゲ合計 5,210 → 4,141 人（-20.5%）。",
    "  ads.as.criteo.com は +8.4% と伸びたが、",
    "  sin.creativecdn.com が -43.2% と大きく減少。",
    "",
    "● android-app://chrome +79.2%（3,199 → 5,734）。",
    "  Android アプリ経由の計測が拡大。",
    "",
    "● Yahoo -25.5% / Google -3.2%。外部検索は",
    "  Yahoo の落ち込みが目立つ。"
  ], 4.9);
}

/* ---------- 13. 伸び・落ち商品 ---------- */
{
  const s = page("前年対比 伸び・落ち商品","BAGMANIA 楽天市場店 / 店舗分析レポート / 2026年8月度",
    "L字ファスナー・かぶせ型が伸長、口金（がま口）型が全面的に後退。");
  s.addText("▲  伸び商品（新規・前年比プラス）", { x:0.55, y:1.28, w:6, h:0.3, fontFace:JP,
    fontSize:12.5, bold:true, color:POS, isTextBox:true, margin:0 });
  D2.up.forEach((r,i)=>{
    const y=1.68+i*0.68;
    s.addShape(pres.ShapeType.roundRect,{x:0.55,y,w:6.03,h:0.58,fill:{color:"F0F8F3"},line:{color:"CBE4D6",width:1},rectRadius:0.04});
    s.addText(r[0],{x:0.73,y:y+0.05,w:1.3,h:0.24,fontFace:"Calibri",fontSize:9.5,bold:true,color:POS,isTextBox:true,margin:0,valign:"middle"});
    s.addText(r[1],{x:0.73,y:y+0.28,w:3.25,h:0.24,fontFace:JP,fontSize:8.5,color:INK,isTextBox:true,margin:0,valign:"middle"});
    s.addText(r[2],{x:3.72,y:y+0.16,w:2.68,h:0.28,fontFace:JP,fontSize:9,bold:true,color:NAVY,isTextBox:true,margin:0,align:"right",valign:"middle"});
  });
  s.addText("▼  落ち商品（前年から消滅・減少）", { x:6.75, y:1.28, w:6, h:0.3, fontFace:JP,
    fontSize:12.5, bold:true, color:NEG, isTextBox:true, margin:0 });
  D2.down.forEach((r,i)=>{
    const y=1.68+i*0.68;
    s.addShape(pres.ShapeType.roundRect,{x:6.75,y,w:6.03,h:0.58,fill:{color:"FCF1F0"},line:{color:"EFD2CF",width:1},rectRadius:0.04});
    s.addText(r[0],{x:6.93,y:y+0.05,w:1.3,h:0.24,fontFace:"Calibri",fontSize:9.5,bold:true,color:NEG,isTextBox:true,margin:0,valign:"middle"});
    s.addText(r[1],{x:6.93,y:y+0.28,w:3.7,h:0.24,fontFace:JP,fontSize:8.5,color:INK,isTextBox:true,margin:0,valign:"middle"});
    s.addText(r[2],{x:10.2,y:y+0.16,w:2.4,h:0.28,fontFace:JP,fontSize:9,bold:true,color:NAVY,isTextBox:true,margin:0,align:"right",valign:"middle"});
  });
  note(s,0.55,5.88,12.23,"▶  分析 — 留め具タイプの明確な移行",[
    "● 落ち商品6件のうち5件が「口金（がま口）」タイプ。JILL STUART 3型（グローリア -68% / ルナティ 消滅 / エターナル -40%）と",
    "  U by ungaro 2型（-81% / 消滅）で、計 -¥1,674K。ブランドを跨いで同じ形状が同時に落ちており、需要そのものの移行と判断できる。",
    "● 対して伸び商品は L字ファスナー（エターナル +73% / Honey 新規）とかぶせ型（Honey 長財布 新規）、BEAMS の二つ折り2型。",
    "  → 秋冬の仕入・ページ強化は L字ファスナー／かぶせ型に寄せ、口金型は在庫消化と露出縮小に切り替えるのが妥当。"
  ]);
}

/* ---------- 14. まとめと推奨アクション ---------- */
{
  const s = page("まとめと推奨アクション","BAGMANIA 楽天市場店 / 店舗分析レポート / 2026年8月度",
    "転換効率は改善。課題は集客基盤の縮小と中堅ブランドの後退。");
  s.addShape(pres.ShapeType.roundRect,{x:0.55,y:1.32,w:6.03,h:5.0,fill:{color:"F0F8F3"},line:{color:"CBE4D6",width:1},rectRadius:0.06});
  s.addText("✓  成果・ポジティブ指標",{x:0.8,y:1.46,w:5.5,h:0.32,fontFace:JP,fontSize:13,bold:true,color:POS,isTextBox:true,margin:0,valign:"middle"});
  s.addText([
    "●  CVR 0.89%（+0.26pt）で直近13ヶ月の最高水準",
    "●  売上件数 +2.3%（1,156件 → 1,183件）と実数で増加",
    "●  アクセス -27.9% に対し売上 -3.2% に踏みとどまる",
    "●  JILL STUART +4%（構成比 42.7%）で首位継続",
    "●  BEAMS +67%（¥650K → ¥1,084K）が最大の伸び",
    "●  PATRICK COX +11% / Pinky&Dianne +7% / Mila schon +51%",
    "●  メンズ財布 +50% / ハンドバッグ +107% / 名刺入れ +36%",
    "●  JILL STUART 名刺入れ +239% / キーケース +43% /",
    "     トートバッグ +416% と財布以外への拡張が進行",
    "●  一般KW が急伸（財布 レディース +211% / キーケース +568%）"
  ].map((t,i,a)=>({text:t,options:{breakLine:i<a.length-1}})),
    {x:0.8,y:1.9,w:5.55,h:4.3,fontFace:JP,fontSize:10,color:INK,isTextBox:true,margin:0,lineSpacingMultiple:1.36,valign:"top"});

  s.addShape(pres.ShapeType.roundRect,{x:6.75,y:1.32,w:6.03,h:5.0,fill:{color:"FDF8EC"},line:{color:"EADFC2",width:1},rectRadius:0.06});
  s.addText("△  課題・推奨アクション",{x:7.0,y:1.46,w:5.5,h:0.32,fontFace:JP,fontSize:13,bold:true,color:ORANGE,isTextBox:true,margin:0,valign:"middle"});
  s.addText([
    "●  SNS流入 -90.6%（Instagram -89% / Facebook 消滅）",
    "   → アクセス減の約30%。SNS運用の再開・再構築が最優先",
    "●  ブランド指名KW が全面減（ジルスチュアート 財布 -40%）",
    "   → SNS消失と連動した想起低下。指名検索の回復施策が必要",
    "●  口金（がま口）財布が全面後退（5型で -¥1,674K）",
    "   → L字ファスナー／かぶせ型へ仕入・露出をシフト",
    "●  MARGARET HOWELL -29% / UNGARO -30% / MANIUNO -42%",
    "   → 中堅3ブランドで -¥1,174K。品揃え刷新か縮小の判断を",
    "●  RPP ROAS 270.5%（-36.5pt）/ CPA ¥4,522（+35%）",
    "   → CPC ¥21→¥28 の高騰。入札の選別強化で効率を戻す",
    "●  Criteoリタゲ -20.5%（sin.creativecdn.com -43.2%）",
    "   → 配信設定の確認が必要",
    "●  客単価 -5.5% → 小物比率上昇。高単価バッグの露出強化"
  ].map((t,i,a)=>({text:t,options:{breakLine:i<a.length-1}})),
    {x:7.0,y:1.9,w:5.55,h:4.3,fontFace:JP,fontSize:10,color:INK,isTextBox:true,margin:0,lineSpacingMultiple:1.3,valign:"top"});
}

/* ---------- 15. カテゴリ別 JILL STUART ---------- */
{
  const s = page("カテゴリ別売上前年比 — JILL STUART","BAGMANIA 楽天市場店 / 店舗分析レポート / 2026年8月度",
    "主力ブランドの詳細。財布は-9.7%だが小物・バッグが大幅伸長。");
  s.addText("2026年8月 vs 2025年8月", { x:0.55, y:1.22, w:6, h:0.26, fontFace:JP, fontSize:10,
    color:SLATE, isTextBox:true, margin:0 });
  table(s, ["カテゴリ","売上(2026/08)","件数","売上(2025/08)","件数","売上前年比"], D2.catJS,
    { x:0.55, y:1.5, w:7.25, colW:[2.5,1.2,0.65,1.2,0.65,1.05], rowH:0.36, fontSize:9,
      align:["left","right","right","right","right","right"],
      cellBold:(ri,ci)=>ci===5, cellColor:(ri,ci,r)=> ci===5 ? yoyColor(r[5]) : INK });
  note(s,8.02,1.5,4.76,"■  分析・考察",[
    "JILL STUART 合計：",
    "¥5,590,500 → ¥5,803,100（前年比 104% / +3.8%）",
    "",
    "● 主力のレディース財布は -9.7%（¥4,794K →",
    "  ¥4,329K）。件数も 364件 → 327件 と減少。",
    "  口金タイプ3型の後退が直接の要因。",
    "",
    "● それを財布以外が補った。名刺入れ +139%",
    "  （¥210K → ¥500K・81件）、キーケース +43%、",
    "  トートバッグ +416%、ハンドバッグ +244%、",
    "  ショルダーバッグは新規 ¥85K。",
    "",
    "● 結果、財布の構成比は 85.8% → 74.6% へ",
    "  -11.2pt 低下。単一カテゴリ依存が緩和され、",
    "  ブランドとしての幅が出てきている。",
    "",
    "▶ 推奨：伸びている名刺入れ・キーケース・バッグ",
    "  を独立導線で強化しつつ、財布は L字ファスナー",
    "  系へ主力を移す。"
  ], 4.95);
  s.addText("※ 商品分析レポート（売上上位1,000商品）ベース", { x:0.55, y:5.3, w:7.25, h:0.26, fontFace:JP,
    fontSize:8.5, color:MUTED, isTextBox:true, margin:0 });
}


/* ================= build_yh.js ================= */
ORANGE = "0E7C7B";
FOOT = "Confidential  |  BAGMANIA Yahoo!ショッピング店  /  2026年8月度 分析レポート";
/* ---------- 1. SECTION DIVIDER ---------- */
{
  const s = pres.addSlide();
  s.background = { color: NAVY };
  s.addText("SECTION 03", { x:0.9, y:1.7, w:6, h:0.4, fontFace:"Calibri", fontSize:14,
    bold:true, color:ORANGE, charSpacing:4, isTextBox:true, margin:0 });
  s.addText("BAG MANIA", { x:0.9, y:2.15, w:9, h:0.9, fontFace:"Calibri", fontSize:48,
    bold:true, color:WHITE, isTextBox:true, margin:0 });
  s.addText("Yahoo! ショッピング店 ／ 2026年8月度", { x:0.92, y:3.1, w:9, h:0.5, fontFace:JP, fontSize:20,
    color:"BFD0E3", isTextBox:true, margin:0 });
  s.addText([
    {text:"店舗KPIサマリー  /  前年同月比較  /  アクセス・転換率分析  /  月次売上推移", options:{breakLine:true}},
    {text:"Yahoo広告パフォーマンス  /  商品別売上ランキング TOP10  /  ブランド別売上分析", options:{breakLine:true}},
    {text:"デバイス別売上・優良配送分析  /  まとめと推奨アクション", options:{}}
  ], { x:0.92, y:4.1, w:11.5, h:1.2, fontFace:JP, fontSize:11, color:"8EA6C2",
       isTextBox:true, margin:0, lineSpacingMultiple:1.4 });
  s.addText("Confidential  |  BAGMANIA Yahoo!ショッピング店", { x:0.9, y:6.85, w:11.5, h:0.3,
    fontFace:JP, fontSize:8.5, color:"5E7A8F", isTextBox:true, margin:0 });
  s.addNotes("SECTION 03 の扉。BAG MANIA Yahoo!ショッピング店の2026年8月度実績。");
}

/* ---------- 2. KPIサマリー ---------- */
{
  const s = page("2026年8月  店舗KPIサマリー","BAGMANIA Yahoo!ショッピング店 / 店舗分析レポート / 2026年8月度",
    "売上+39.7%で3チャネル中最大の伸び率。成長はアプリ経由が牽引。");
  const cw=2.95, gap=0.21;
  kpi(s,0.55,1.35,cw,1.32,"売上","¥7,167,305","前年 ¥5,129,320  /  +39.7%",POS);
  kpi(s,0.55+(cw+gap),1.35,cw,1.32,"訪問者数","35,012人","前年 27,823  /  +25.8%",POS);
  kpi(s,0.55+2*(cw+gap),1.35,cw,1.32,"購買率","1.65%","前年 1.43%  /  +0.22pt",POS);
  kpi(s,0.55+3*(cw+gap),1.35,cw,1.32,"客単価","¥12,400","前年 ¥12,888  /  -3.8%",NEG);
  note(s,0.55,2.95,12.22,"■  2026年8月のハイライト",[
    "● 売上 ¥7,167,305（前年比 +39.7%）。楽天 BAG MANIA -3.2% / YAMANIGOLF +35.7% と比べ、3店舗で最大の伸び率。",
    "● 訪問者 +25.8% / セッション +27.1% / PV +25.0% と集客が全方位で拡大。購買率 1.65%（+0.22pt）も改善し、注文数は 585件（+44.4%）。",
    "● 成長の実体はアプリ。アプリ経由売上 ¥5,697,870（+60.0%）で構成比 79.5%（前年 69.4% / +10.1pt）。",
    "  一方 スマホWeb -6.4% / PC -6.2% と非アプリ経路は縮小しており、伸びは完全にアプリ由来。",
    "● 優良配送も拡大。売上 ¥1,615,565（+56.5%）/ 注文 143件（+64.4%）で、売上シェア 22.54%（+2.41pt）。",
    "● 客単価 ¥12,400（-3.8%）はやや低下。Yahoo広告は ROAS 397%（前月 463.9%）と効率が落ちた点が唯一の懸念。"
  ]);
  s.addText("前月比（2026年7月 → 2026年8月）", { x:0.55, y:5.3, w:6, h:0.28, fontFace:JP, fontSize:11,
    bold:true, color:NAVY, isTextBox:true, margin:0, valign:"middle" });
  mini(s,0.55,5.66,cw,"売上","¥7.91M","¥7.17M","-9.4%",NEG);
  mini(s,0.55+(cw+gap),5.66,cw,"訪問者数","31,309","35,012","+11.8%",POS);
  mini(s,0.55+2*(cw+gap),5.66,cw,"購買率","2.06%","1.65%","-0.41pt",NEG);
  mini(s,0.55+3*(cw+gap),5.66,cw,"客単価","¥12,280","¥12,400","+1.0%",POS);
}

/* ---------- 3. 前年同月比較 ---------- */
{
  const s = page("前年同月比較（2026年8月 vs 2025年8月）","BAGMANIA Yahoo!ショッピング店 / 店舗分析レポート / 2026年8月度",
    "主要指標が全面的に前年超え。客単価のみ微減。");
  table(s, ["指標","2026年8月","2025年8月","前年比"], [
    ["売上金額","¥7,167,305","¥5,129,320","+39.7%"],
    ["注文件数","585件","405件","+44.4%"],
    ["注文者数","578人","398人","+45.2%"],
    ["訪問者数","35,012","27,823","+25.8%"],
    ["セッション数","56,473","44,446","+27.1%"],
    ["ページビュー","120,896","96,718","+25.0%"],
    ["購買率","1.65%","1.43%","+0.22pt"],
    ["客単価","¥12,400","¥12,888","-3.8%"]
  ], { x:0.55, y:1.4, w:7.4, colW:[2.3,1.75,1.75,1.6], rowH:0.33, fontSize:10.5,
       align:["left","right","right","right"],
       cellBold:(ri,ci)=>ci===3, cellColor:(ri,ci,r)=> ci===3 ? yoyColor(r[3]) : INK });
  note(s,8.2,1.4,4.58,"■  考察",[
    "● 売上・注文・集客のすべてが前年を上回る、",
    "  3店舗で唯一の全面プラス。",
    "",
    "● 注文件数 +44.4% が売上 +39.7% を上回る。",
    "  客単価 -3.8% を件数の伸びが補った形で、",
    "  「買う人が増えた」ことによる素直な増収。",
    "",
    "● 購買率 1.65% は楽天 BAG MANIA（0.89%）の",
    "  約1.85倍。Yahoo は購入意欲の高い顧客が",
    "  集まる構造が継続している。",
    "",
    "● ただし前月 2026/07 の 2.06% からは",
    "  -0.41pt 低下。訪問者が +11.8% 増えた分、",
    "  相対的に転換率が薄まった。",
    "",
    "● 平均滞在時間 199秒（-2.0%）/ 回遊 3.45ページ",
    "  （-0.9%）は横ばい。サイト内行動は安定。"
  ], 4.95, 9.5);
  note(s,0.55,4.35,7.4,"■  売上増 +¥2,038K の内訳（デバイス別）",[
    "・アプリ  ¥3,560,790 → ¥5,697,870  （+¥2,137K / +60.0%）",
    "・スマホWeb  ¥1,144,315 → ¥1,071,675  （-¥73K / -6.4%）",
    "・PC  ¥424,215 → ¥397,760  （-¥26K / -6.2%）",
    "",
    "▶ 増加分はアプリ単独で +¥2,137K。非アプリ経路の -¥99K を差し引いて +¥2,038K。",
    "  Yahoo の成長はアプリ内の露出獲得によるものと断定できる。"
  ], 2.0);
}

/* ---------- 4. アクセス・転換率分析 ---------- */
{
  const s = page("アクセス・転換率分析","BAGMANIA Yahoo!ショッピング店 / 店舗分析レポート / 2026年8月度",
    "集客が全方位で拡大。購買率は楽天の約1.85倍を維持。");
  const cw=3.92, gap=0.23;
  kpi(s,0.55,1.35,cw,1.32,"訪問者数","35,012人","前年比 +25.8%",POS);
  kpi(s,0.55+(cw+gap),1.35,cw,1.32,"購買率","1.65%","前年 1.43% / +0.22pt",POS);
  kpi(s,0.55+2*(cw+gap),1.35,cw,1.32,"客単価","¥12,400","前年 ¥12,888 / -3.8%",NEG);
  note(s,0.55,2.95,12.22,"■  考察",[
    "● 訪問者 35,012人（+25.8%）／ セッション 56,473（+27.1%）／ PV 120,896（+25.0%）と、集客指標が揃って拡大。",
    "  PV の伸び（+25.0%）が訪問者の伸び（+25.8%）とほぼ同率で、1人あたりの回遊量は変わらないまま母数が増えた健全な拡大。",
    "● 購買率 1.65%（前年 +0.22pt）。楽天 BAG MANIA の 0.89% に対し約1.85倍で、Yahoo の高転換体質は継続。",
    "● 一方、前月 2026/07 の 2.06% からは -0.41pt。訪問者が +11.8% 増えた分だけ相対的に転換率が薄まった形で、",
    "  注文件数自体は 659件 → 585件（-11.2%）と減少している点には注意が必要。",
    "● 客単価 ¥12,400（-3.8%）。名刺入れ（平均単価 ¥6,566）など小物の販売増が単価を押し下げた。",
    "● 平均滞在時間 199秒（-2.0%）／ 平均回遊ページ数 3.45（-0.9%）はほぼ横ばいで、サイト内の行動品質は維持されている。"
  ]);
  s.addText("前月比（2026年7月 → 2026年8月）", { x:0.55, y:5.05, w:6, h:0.28, fontFace:JP, fontSize:11,
    bold:true, color:NAVY, isTextBox:true, margin:0, valign:"middle" });
  mini(s,0.55,5.41,cw,"訪問者数","31,309","35,012","+11.8%",POS);
  mini(s,0.55+(cw+gap),5.41,cw,"購買率","2.06%","1.65%","-0.41pt",NEG);
  mini(s,0.55+2*(cw+gap),5.41,cw,"注文件数","659件","585件","-11.2%",NEG);
}

/* ---------- 5. 月次売上推移 ---------- */
{
  const s = page("月次売上推移（直近13ヶ月）","BAGMANIA Yahoo!ショッピング店 / 店舗分析レポート / 2026年8月度",
    "Q4セール期と3月決算期にピーク。8月は前年比+39.7%で底上げ。");
  table(s, ["月","売上","購買率","客単価"], D3.monthly.map(r=>r.slice(0,4)),
    { x:0.55, y:1.4, w:4.6, colW:[1.0,1.6,0.95,1.05], rowH:0.36, fontSize:9.5,
      align:["left","right","right","right"],
      cellBold:(ri)=>ri===12, cellColor:(ri)=> ri===12 ? ORANGE : INK });
  s.addChart(pres.ChartType.bar, [{
      name:"月次売上（百万円）",
      labels: D3.monthly.map(r=>r[0].slice(5)),
      values: D3.monthly.map(r=>r[4])
    }], { x:5.45, y:1.40, w:7.35, h:3.95,
      barDir:"col", chartColors:["7E96B4","7E96B4","7E96B4","7E96B4","7E96B4","7E96B4","7E96B4","7E96B4","7E96B4","7E96B4","7E96B4","7E96B4",ORANGE],
      varyColors:true, showTitle:true, title:"月次売上 推移（百万円）", titleFontSize:12,
      titleColor:NAVY, titleFontFace:JP,
      showValue:true, dataLabelPosition:"outEnd", dataLabelFontSize:9, dataLabelColor:SLATE,
      dataLabelFontFace:JP, dataLabelFormatCode:"0.0",
      catAxisLabelColor:SLATE, catAxisLabelFontSize:9, catAxisLabelFontFace:JP,
      valAxisLabelColor:SLATE, valAxisLabelFontSize:9,
      valGridLine:{ color:"EDF0F4", size:1 }, catGridLine:{ style:"none" },
      showLegend:false, valAxisMinVal:0, valAxisMaxVal:16, barGapWidthPct:45 });
  note(s,5.45,5.5,7.35,"■  推移の読み方",[
    "● 2026/08（ティール）は ¥7.17M。前年同月 ¥5.13M から +39.7% と大きく底上げされた。",
    "● 売上ピークは 2026/03 ¥14.06M、2025/12 ¥11.08M、2026/01 ¥10.40M。Q4セール期と",
    "  3月決算期に需要が集中する構造は楽天店と共通。",
    "● 前月 ¥7.91M からは -9.4%。ただし前年同月の水準（¥5.13M）を大きく上回っており、",
    "  年間を通じたベースラインそのものが切り上がっている。"
  ], 1.3, 8.5);
}

/* ---------- 6. Yahoo広告 ---------- */
{
  const s = page("Yahoo広告パフォーマンス","BAGMANIA Yahoo!ショッピング店 / 店舗分析レポート / 2026年8月度",
    "ROAS 397%と高効率を維持も、前月463.9%からは-66.9pt。");
  const cw=3.92, gap=0.23;
  kpi(s,0.55,1.35,cw,1.28,"表示回数","4,346,242","CTR 0.71%",SLATE);
  kpi(s,0.55+(cw+gap),1.35,cw,1.28,"クリック数","30,840","CPC ¥35（前月 ¥37）",POS);
  kpi(s,0.55+2*(cw+gap),1.35,cw,1.28,"広告費（配信実績）","¥1,080,261","請求額 ¥1,077,339",SLATE);
  kpi(s,0.55,2.78,cw,1.28,"ROAS","397%","前月 463.9% / -66.9pt",NEG);
  kpi(s,0.55+(cw+gap),2.78,cw,1.28,"広告経由売上","¥4,288,966","月次売上の 59.8%",SLATE);
  kpi(s,0.55+2*(cw+gap),2.78,cw,1.28,"CPA（注文獲得単価）","¥3,052","売上件数 354件 / CVR 1.15%",NEG);
  note(s,0.55,4.24,12.22,"■  考察",[
    "● ROAS 397% は絶対水準としては高効率（楽天 BAG MANIA 270.5% / YAMANIGOLF 372.3% を上回る）だが、前月 463.9% から -66.9pt 低下。",
    "● 広告費 ¥1,080,261（前月 ¥1,019,816 / +5.9%）に対し広告経由売上は ¥4,730,803 → ¥4,288,966（-9.3%）へ減少。投下を増やしたが回収が落ちた。",
    "● CPC ¥35（前月 ¥37）は改善、CTR 0.71%（前月 0.70%）も横ばい。つまりクリックまでの効率は落ちていない。",
    "● 悪化しているのはクリック後。広告CVR 1.15%（前月 1.44% / -0.29pt）、CPA ¥3,052（前月 ¥2,575 / +18.5%）。",
    "  店舗全体の購買率も 2.06% → 1.65% と同方向に動いており、広告固有ではなく8月の需要全体が薄かった可能性が高い。",
    "● 広告依存度 59.8%（前月 59.8%）で横ばい。売上の約6割を広告が支える構造は変わっていない。"
  ]);
  s.addText("※ 広告費はYahoo広告レポートの「利用金額（配信実績）」基準。請求額 ¥1,077,339 との差は ¥2,922。CVR・CPA は売上件数 354件から算出。",
    { x:0.55, y:6.58, w:12.22, h:0.28, fontFace:JP, fontSize:8.5, color:MUTED, isTextBox:true, margin:0 });
}

/* ---------- 7. 商品別TOP10 ---------- */
{
  const s = page("商品別売上ランキング TOP10（2026年8月）","BAGMANIA Yahoo!ショッピング店 / 店舗分析レポート / 2026年8月度",
    "JILL STUARTがTOP10中8商品。訪問者あたりの効率に大きな差。");
  table(s, ["順位","商品コード","商品名","売上金額","注文数","訪問者数","購買率","前年比"], D3.top10,
    { x:0.55, y:1.45, w:12.22, colW:[0.65,1.42,4.62,1.35,0.8,1.05,1.05,1.28], rowH:0.34, fontSize:9.5,
      align:["center","left","left","right","right","right","right","right"],
      cellBold:(ri,ci)=>ci===3||ci===6||ci===7,
      cellColor:(ri,ci,r)=> ci===7 ? yoyColor(r[7]) : (ci===6 ? (parseFloat(r[6])>=3 ? POS : INK) : INK) });
  note(s,0.55,5.42,12.22,"▶  分析",[
    "● TOP10 のうち 8商品が JILL STUART。1位 グローリア 折り財布 ¥288,900（22件）、2位 グローリア 口金折り財布 ¥270,200（19件）。",
    "● 注目は購買率の差。7位 グローリア 名刺入れ 4.46% / 8位 PINKY&DIANNE パドロック L字 4.07% / 6位 インプルーブ ラウンド長財布 3.70% と、",
    "  上位商品（1位 1.78% / 3位 1.65%）の2倍以上。集客量は少ないが転換効率が突出しており、露出を増やす余地が最も大きい。",
    "● 特に 6位 インプルーブ ラウンドファスナー長財布 は訪問者189人・購買率3.70%・客単価 ¥18,657 と、少ない流入で高単価を取れている。",
    "● 前年比では 3位 エターナル L字ファスナー +220.2% が突出。一方 2位 グローリア 口金折り財布 は -13.6% で、留め具タイプによる明暗は楽天店と同傾向。",
    "● 6・9・10位の3商品が新規（インプルーブ2型・BEAMS DESIGN 1型）。新シリーズ投入が上位を押し上げている。"
  ], 1.45, 9);
}

/* ---------- 8. ブランド別売上分析 ---------- */
{
  const s = page("ブランド別売上分析（2026年8月）","BAGMANIA Yahoo!ショッピング店 / 店舗分析レポート / 2026年8月度",
    "JILL STUART 37.6%で首位。楽天店（42.7%）より分散した構成。");
  table(s, ["ブランド","売上金額","注文数","構成比","平均単価"],
    D3.brands.concat([D3.brandTotal]),
    { x:0.55, y:1.4, w:6.6, colW:[2.2,1.35,0.85,0.95,1.25], rowH:0.37, fontSize:10,
      align:["left","right","right","right","right"],
      cellBold:(ri)=>ri===10, cellColor:(ri)=> ri===10 ? NAVY : INK });
  note(s,7.3,1.4,5.48,"■  分析・考察",[
    "● 上位3ブランドで構成比 64.6%。楽天 BAG MANIA",
    "  （上位3で 68.7%、JILL STUART 単独 42.7%）より",
    "  分散しており、Yahoo のほうがブランドバランスが良い。",
    "",
    "● JILL STUART 37.6%（222件・平均単価 ¥12,126）で",
    "  首位だが、楽天店ほどの一極集中ではない。",
    "",
    "● MANIUNO は構成比 4.0% ながら平均単価 ¥20,446 で",
    "  全ブランド中最高。MARGARET HOWELL ¥17,176 と",
    "  合わせて高単価帯の受け皿として機能している。",
    "",
    "● 逆に BEAMS は平均単価 ¥8,438 と最も低いが",
    "  注文70件で5位。低単価・高回転で件数を稼ぐ役割。",
    "",
    "● チャネルごとにブランドの効き方が違う点も重要。",
    "  LANVIN は楽天店 3.8% に対し Yahoo では 6.6%、",
    "  MANIUNO も 1.7% → 4.0% と Yahoo で構成比が高い。",
    "  → チャネル別の品揃え・露出配分を検討する余地がある。"
  ], 4.9, 9.5);
  s.addText("※ Yahooストア管理ツールの商品レポート（親商品行）を集計。合計は店舗売上 ¥7,167,305 と完全一致（捕捉率 100%）。2025年8月も同じ方法で集計し ¥5,129,320 と一致。",
    { x:0.55, y:6.0, w:6.6, h:0.62, fontFace:JP, fontSize:8, color:MUTED, isTextBox:true, margin:0, valign:"top" });
}

/* ---------- 8b. ブランド別売上前年比 ---------- */
{
  const s = page("ブランド別売上前年比","BAGMANIA Yahoo!ショッピング店 / 店舗分析レポート / 2026年8月度",
    "取扱終了のNOMADOIを除く全ブランドが前年超え。BEAMS +102% / LANVIN +110%。");
  s.addText("2026年8月 vs 2025年8月", { x:0.55, y:1.22, w:6, h:0.26, fontFace:JP, fontSize:10,
    color:SLATE, isTextBox:true, margin:0 });
  table(s, ["ブランド","売上(2026/08)","注文数","売上(2025/08)","注文数","売上前年比","備考"],
    D3.brandYoY.concat([D3.brandYoYTotal]),
    { x:0.55, y:1.5, w:12.22, colW:[3.0,1.72,0.9,1.72,0.9,1.38,2.6], rowH:0.285, fontSize:9.5,
      align:["left","right","right","right","right","right","left"],
      cellBold:(ri,ci)=> ci===5 || ri===11,
      cellColor:(ri,ci,r)=> ri===11 ? NAVY : (ci===5 ? yoyColor(r[5]) : INK) });
  note(s,0.55,5.72,12.22,"▶  総括",[
    "● 合計 ¥5,129,320 → ¥7,167,305（前年比 140%）。取扱終了の NOMADOI と その他 を除く全ブランドが前年を上回った、きわめて素直な成長。",
    "● 増加額では JILL STUART +¥882K が最大（構成比 35.3% → 37.6%）。次いで BEAMS +¥298K / PATRICK COX +¥263K / LANVIN +¥247K。",
    "● 伸び率では MANIUNO +149% / LANVIN +110% / BEAMS +102% / PATRICK COX +61% と、中堅ブランドが軒並み2桁〜3桁成長。",
    "  同じブランドが楽天店では MARGARET HOWELL -29% / UNGARO -30% / MANIUNO -42% と後退しており、チャネルによって明暗が完全に分かれている。"
  ], 1.18, 9.5);
}

/* ---------- 8c. 伸び・落ち商品 ---------- */
{
  const s = page("前年対比 伸び・落ち商品","BAGMANIA Yahoo!ショッピング店 / 店舗分析レポート / 2026年8月度",
    "前年主力6型が消滅し、新規5型が入れ替わる大規模な商品入替。");
  s.addText("▲  伸び商品（新規・前年比プラス）", { x:0.55, y:1.28, w:6, h:0.3, fontFace:JP,
    fontSize:12.5, bold:true, color:POS, isTextBox:true, margin:0 });
  D3.up.forEach((r,i)=>{
    const y=1.68+i*0.68;
    s.addShape(pres.ShapeType.roundRect,{x:0.55,y,w:6.03,h:0.58,fill:{color:"F0F8F3"},line:{color:"CBE4D6",width:1},rectRadius:0.04});
    s.addText(r[0],{x:0.73,y:y+0.05,w:1.3,h:0.24,fontFace:"Calibri",fontSize:9.5,bold:true,color:POS,isTextBox:true,margin:0,valign:"middle"});
    s.addText(r[1],{x:0.73,y:y+0.28,w:3.25,h:0.24,fontFace:JP,fontSize:8.5,color:INK,isTextBox:true,margin:0,valign:"middle"});
    s.addText(r[2],{x:3.72,y:y+0.16,w:2.68,h:0.28,fontFace:JP,fontSize:9,bold:true,color:NAVY,isTextBox:true,margin:0,align:"right",valign:"middle"});
  });
  s.addText("▼  落ち商品（前年から消滅）", { x:6.75, y:1.28, w:6, h:0.3, fontFace:JP,
    fontSize:12.5, bold:true, color:NEG, isTextBox:true, margin:0 });
  D3.down.forEach((r,i)=>{
    const y=1.68+i*0.68;
    s.addShape(pres.ShapeType.roundRect,{x:6.75,y,w:6.03,h:0.58,fill:{color:"FCF1F0"},line:{color:"EFD2CF",width:1},rectRadius:0.04});
    s.addText(r[0],{x:6.93,y:y+0.05,w:1.3,h:0.24,fontFace:"Calibri",fontSize:9.5,bold:true,color:NEG,isTextBox:true,margin:0,valign:"middle"});
    s.addText(r[1],{x:6.93,y:y+0.28,w:3.25,h:0.24,fontFace:JP,fontSize:8.5,color:INK,isTextBox:true,margin:0,valign:"middle"});
    s.addText(r[2],{x:9.92,y:y+0.16,w:2.68,h:0.28,fontFace:JP,fontSize:9,bold:true,color:NAVY,isTextBox:true,margin:0,align:"right",valign:"middle"});
  });
  note(s,0.55,5.88,12.23,"▶  分析 — 商品入替が売上を作った月",[
    "● 落ち商品は6型すべてが「消滅」（計 -¥567,300）。前年の主力だった JILL STUART ルナティ 口金折り財布、PINKY&DIANNE のラウンド長財布2型、",
    "  MARGARET HOWELL idea の2型、BEAMS DESIGN ROUTINE バックパックが揃って取扱終了となっている。",
    "● 対して伸び商品は新規5型で計 +¥528,900。特に JILL STUART「インプルーブ」シリーズ3型（ラウンド長財布・口金折り財布・L字折り財布）で ¥321,400 を占める。",
    "● ほぼ1対1の商品入替に加えて既存商品が伸びた結果、店舗全体で +¥2,038K（+39.7%）。入替は成功と評価できる。"
  ]);
}

/* ---------- 9. デバイス別・優良配送 ---------- */
{
  const s = page("デバイス別売上・優良配送分析","BAGMANIA Yahoo!ショッピング店 / 店舗分析レポート / 2026年8月度",
    "成長はアプリ単独。売上の79.5%がアプリ経由で、前年比+60.0%。");
  s.addText("■  デバイス別売上（2026年8月 vs 2025年8月）", { x:0.55, y:1.22, w:7, h:0.28,
    fontFace:JP, fontSize:11, bold:true, color:ORANGE, isTextBox:true, margin:0, valign:"middle" });
  table(s, ["デバイス","売上 2026/08","構成比","売上 2025/08","構成比","前年比"], D3.device,
    { x:0.55, y:1.58, w:7.4, colW:[1.5,1.45,0.9,1.45,0.9,1.2], rowH:0.36, fontSize:10,
      align:["left","right","right","right","right","right"],
      cellBold:(ri,ci)=>ci===5, cellColor:(ri,ci,r)=> ci===5 ? yoyColor(r[5]) : INK });
  s.addText("■  デバイス別 PV と PVあたり売上", { x:0.55, y:3.35, w:7, h:0.28,
    fontFace:JP, fontSize:11, bold:true, color:ORANGE, isTextBox:true, margin:0, valign:"middle" });
  table(s, ["デバイス","PV 2026","PV 2025","PV前年比","PV単価 26","PV単価 25","前年比"], D3.devicePv,
    { x:0.55, y:3.7, w:7.4, colW:[1.3,1.0,1.0,1.05,1.05,1.0,1.0], rowH:0.36, fontSize:9.5,
      align:["left","right","right","right","right","right","right"],
      cellBold:(ri,ci)=>ci===6, cellColor:(ri,ci,r)=> ci===6 ? yoyColor(r[6]) : INK });
  s.addText("■  優良配送（2026年8月 vs 2025年8月）", { x:0.55, y:5.45, w:7, h:0.28,
    fontFace:JP, fontSize:11, bold:true, color:ORANGE, isTextBox:true, margin:0, valign:"middle" });
  table(s, ["指標","2026年8月","2025年8月","前年比"], D3.yuryo,
    { x:0.55, y:5.8, w:7.4, colW:[2.3,1.75,1.75,1.6], rowH:0.28, fontSize:9.5,
      align:["left","right","right","right"],
      cellBold:(ri,ci)=>ci===3, cellColor:(ri,ci,r)=> ci===3 ? yoyColor(r[3]) : INK });
  note(s,8.2,1.58,4.58,"■  分析・考察",[
    "▶ Yahoo の成長はアプリ単独で説明できる。",
    "",
    "● アプリ経由売上 ¥3,560,790 → ¥5,697,870",
    "  （+60.0% / +¥2,137K）。売上構成比は",
    "  69.4% → 79.5% へ +10.1pt 上昇した。",
    "",
    "● 対してスマホWeb -6.4% / PC -6.2% と",
    "  非アプリは縮小。売上増 +¥2,038K は",
    "  アプリの +¥2,137K から非アプリの -¥99K を",
    "  引いた値で、増加分はすべてアプリ由来。",
    "",
    "● 質も上がっている。アプリの PVあたり売上は",
    "  ¥53.4 → ¥63.0（+18.0%）。PV +35.7% を",
    "  上回る売上 +60.0% で、露出が増えただけ",
    "  でなく転換も改善した。",
    "",
    "● 優良配送は売上 +56.5% / 注文 +64.4%、",
    "  シェア 22.54%（+2.41pt）。アプリ内の",
    "  検索順位・訴求に効く施策として、",
    "  対象商品の拡大は引き続き有効。",
    "",
    "▶ 推奨：アプリ向けの露出施策（優良配送対象",
    "  拡大・アプリ限定クーポン）に集中投下。",
    "  PC/スマホWeb は維持に留めてよい。"
  ], 5.3);
}

/* ---------- 10. まとめと推奨アクション ---------- */
{
  const s = page("まとめと推奨アクション","BAGMANIA Yahoo!ショッピング店 / 店舗分析レポート / 2026年8月度",
    "3店舗で唯一の全面プラス。アプリ経路への集中と広告効率の回復が次の課題。");
  s.addShape(pres.ShapeType.roundRect,{x:0.55,y:1.32,w:6.03,h:5.0,fill:{color:"F0F8F3"},line:{color:"CBE4D6",width:1},rectRadius:0.06});
  s.addText("✓  成果・ポジティブ指標",{x:0.8,y:1.46,w:5.5,h:0.32,fontFace:JP,fontSize:13,bold:true,color:POS,isTextBox:true,margin:0,valign:"middle"});
  s.addText([
    "●  売上 ¥7,167,305、前年比 +39.7% で3店舗中最大の伸び",
    "●  注文件数 585件（+44.4%）/ 注文者数 578人（+45.2%）",
    "●  訪問者 35,012人（+25.8%）/ セッション +27.1% / PV +25.0%",
    "●  購買率 1.65%（+0.22pt）、楽天 BAG MANIA の約1.85倍",
    "●  アプリ経由売上 +60.0%、構成比 79.5%（+10.1pt）",
    "●  アプリ PVあたり売上 ¥53.4 → ¥63.0（+18.0%）と質も改善",
    "●  優良配送 売上 +56.5% / 注文 +64.4% / シェア +2.41pt",
    "●  ROAS 397% は3店舗中で最高水準（楽天BM 270.5%）",
    "●  ブランド構成が楽天店より分散（上位3で 64.6%）",
    "●  MANIUNO ¥20,446 / MARGARET HOWELL ¥17,176 の高単価帯が機能"
  ].map((t,i,a)=>({text:t,options:{breakLine:i<a.length-1}})),
    {x:0.8,y:1.9,w:5.55,h:4.3,fontFace:JP,fontSize:9.5,color:INK,isTextBox:true,margin:0,lineSpacingMultiple:1.4,valign:"top"});

  s.addShape(pres.ShapeType.roundRect,{x:6.75,y:1.32,w:6.03,h:5.0,fill:{color:"EAF4F4"},line:{color:"C3DCDC",width:1},rectRadius:0.06});
  s.addText("△  課題・推奨アクション",{x:7.0,y:1.46,w:5.5,h:0.32,fontFace:JP,fontSize:13,bold:true,color:ORANGE,isTextBox:true,margin:0,valign:"middle"});
  s.addText([
    "●  購買率 2.06% → 1.65%（前月比 -0.41pt）",
    "   → 注文件数も 659件 → 585件（-11.2%）。要因の特定が必要",
    "●  Yahoo広告 ROAS 463.9% → 397%（-66.9pt）",
    "   → CPC ¥35 は改善済み。悪化はクリック後（CVR 1.44%→1.15%）",
    "   → 商品ページ・在庫・価格の見直しを優先",
    "●  CPA ¥2,575 → ¥3,052（+18.5%）",
    "   → 広告費は +5.9% 増だが経由売上 -9.3%。投下量の再検討を",
    "●  広告依存度 59.8% と高止まり",
    "   → オーガニック（アプリ内検索）の強化で依存度を下げる",
    "●  スマホWeb -6.4% / PC -6.2% と非アプリ経路が縮小",
    "   → アプリに集中投下し、PC/スマホWeb は維持に留める判断を",
    "●  客単価 ¥12,400（-3.8%）→ 小物比率上昇",
    "   → 高単価ブランド（MANIUNO・MARGARET HOWELL）の露出拡大",
    "●  高購買率商品（名刺入れ 4.46% 等）が低露出のまま",
    "   → 訪問者数の少ない高効率商品への集客を強化"
  ].map((t,i,a)=>({text:t,options:{breakLine:i<a.length-1}})),
    {x:7.0,y:1.9,w:5.55,h:4.3,fontFace:JP,fontSize:9.5,color:INK,isTextBox:true,margin:0,lineSpacingMultiple:1.3,valign:"top"});
}


/* ================= build_az.js ================= */
ORANGE = "146EB4";
FOOT = "Confidential  |  BAGMANIA Amazon (ベンダー)  /  2026年8月度 分析レポート";
/* ---------- 1. SECTION DIVIDER ---------- */
{
  const s = pres.addSlide();
  s.background = { color: NAVY };
  s.addText("SECTION 04", { x:0.9, y:1.7, w:6, h:0.4, fontFace:"Calibri", fontSize:14,
    bold:true, color:ORANGE, charSpacing:4, isTextBox:true, margin:0 });
  s.addText("BAG MANIA", { x:0.9, y:2.15, w:9, h:0.9, fontFace:"Calibri", fontSize:48,
    bold:true, color:WHITE, isTextBox:true, margin:0 });
  s.addText("Amazon ベンダー ／ 2026年8月度", { x:0.92, y:3.1, w:9, h:0.5, fontFace:JP, fontSize:20,
    color:"BFD0E3", isTextBox:true, margin:0 });
  s.addText([
    {text:"店舗KPIサマリー  /  前年同月比較  /  週次推移と広告投下バランス", options:{breakLine:true}},
    {text:"Amazon広告パフォーマンス  /  JILL STUART 実績  /  まとめと推奨アクション", options:{}}
  ], { x:0.92, y:4.1, w:11.5, h:0.9, fontFace:JP, fontSize:11, color:"8EA6C2",
       isTextBox:true, margin:0, lineSpacingMultiple:1.4 });
  s.addText("Confidential  |  BAGMANIA Amazon (ベンダー)  |  Source: 【ヤマニ様】amazonベンダー_運用レポート", { x:0.9, y:6.85, w:11.5, h:0.3,
    fontFace:JP, fontSize:8.5, color:"5E7A8F", isTextBox:true, margin:0 });
  s.addNotes("SECTION 04 の扉。BAG MANIA Amazonベンダーの2026年8月度実績。");
}

/* ---------- 2. KPIサマリー ---------- */
{
  const s = page("2026年8月  店舗KPIサマリー（Amazon）","BAGMANIA Amazon ベンダー / 店舗分析レポート / 2026年8月度",
    "上代+15.0%で4チャネル中最大規模。ただし増収は全額が広告由来。");
  const cw=2.95, gap=0.21;
  kpi(s,0.55,1.35,cw,1.32,"売上（上代）","¥23,619,924","前年 ¥20,535,221  /  +15.0%",POS);
  kpi(s,0.55+(cw+gap),1.35,cw,1.32,"売上件数","2,214件","前年 1,940  /  +14.1%",POS);
  kpi(s,0.55+2*(cw+gap),1.35,cw,1.32,"客単価","¥10,668","前年 ¥10,585  /  +0.8%",POS);
  kpi(s,0.55+3*(cw+gap),1.35,cw,1.32,"広告費","¥860,421","前年 ¥602,659  /  +42.8%",NEG);
  note(s,0.55,2.95,12.22,"■  2026年8月のハイライト",[
    "● 上代売上 ¥23,619,924（前年比 +15.0%）。楽天BM ¥14.9M / YAMANIGOLF ¥9.7M / Yahoo ¥7.2M を大きく上回り、4チャネル中最大規模。",
    "● ただし増収の中身に注意が必要。広告経由売上 ¥4,373,712 → ¥8,597,023（+96.6%）と倍増した一方、",
    "  自然検索売上は ¥16,161,509 → ¥15,022,901（-7.0%）と減少。売上増 +¥3,085K は広告経由の +¥4,223K を、自然検索の -¥1,139K が相殺した形。",
    "● 結果、広告経由売上の構成比は 21.3% → 36.4%（+15.1pt）へ急上昇。広告依存度が1年で大きく高まった。",
    "● 広告運用自体は改善。ROAS 726% → 999% / CPC ¥25 → ¥18 / ACOS 13.78% → 10.01%。インプ +104% / クリック +100% と露出を倍にしつつ単価を下げられている。",
    "● 一方で全体ROAS（上代÷広告費）は 3,407% → 2,745%、TACOS は 2.93% → 3.64% に上昇。店舗全体としての広告コスト率は悪化している。"
  ]);
  s.addText("前月比（2026年7月 → 2026年8月）", { x:0.55, y:5.3, w:6, h:0.28, fontFace:JP, fontSize:11,
    bold:true, color:NAVY, isTextBox:true, margin:0, valign:"middle" });
  mini(s,0.55,5.66,cw,"売上（上代）","¥26.81M","¥23.62M","-11.9%",NEG);
  mini(s,0.55+(cw+gap),5.66,cw,"売上件数","2,512","2,214","-11.9%",NEG);
  mini(s,0.55+2*(cw+gap),5.66,cw,"広告費","¥991,673","¥860,421","-13.2%",POS);
  mini(s,0.55+3*(cw+gap),5.66,cw,"ROAS（広告）","963%","999%","+36pt",POS);
  s.addText("※ 売上は日別実績の合計値。運用レポートのサマリ欄（¥22,828,454）は集計式が8月31日を含んでおらず ¥791,470 少ない。詳細は最終ページ注記。",
    { x:0.55, y:6.72, w:12.22, h:0.26, fontFace:JP, fontSize:8, color:MUTED, isTextBox:true, margin:0 });
}

/* ---------- 3. 前年同月比較 ---------- */
{
  const s = page("前年同月比較（2026年8月 vs 2025年8月）","BAGMANIA Amazon ベンダー / 店舗分析レポート / 2026年8月度",
    "増収は全額が広告由来。自然検索は-7.0%で縮小している。");
  table(s, ["指標","2026年8月","2025年8月","前年比"], D4.yoy,
    { x:0.55, y:1.4, w:7.4, colW:[2.3,1.75,1.75,1.6], rowH:0.33, fontSize:10.5,
      align:["left","right","right","right"],
      cellBold:(ri,ci)=>ci===3, cellColor:(ri,ci,r)=> ci===3 ? yoyColor(r[3]) : INK });
  note(s,8.2,1.4,4.58,"■  考察",[
    "● 上代 +15.0% は4チャネル中で最大の規模。",
    "  件数 +14.1% が伴っており、実需の拡大。",
    "",
    "● ただし成長の質には課題がある。",
    "  売上増  +¥3,085K",
    "  ＝ 広告経由  +¥4,223K",
    "   ＋ 自然検索  -¥1,139K",
    "  広告を倍増させて増収を作り、",
    "  オーガニックは目減りしている。",
    "",
    "● 広告経由の構成比は 21.3% → 36.4%。",
    "  売上の3分の1以上が広告依存となった。",
    "",
    "● 客単価 ¥10,668（+0.8%）はほぼ横ばい。",
    "  単価ではなく件数で伸ばした月。",
    "",
    "▶ 広告効率そのものは大きく改善しているため、",
    "  短期の判断としては正しい投下。ただし",
    "  自然検索の低下が続くと広告費なしでは",
    "  売上が維持できない構造になる。"
  ], 4.95, 9.5);
  note(s,0.55,4.35,7.4,"■  売上構成の変化（上代ベース）",[
    "2025年8月：  自然検索 ¥16,161,509（78.7%） ＋ 広告経由 ¥4,373,712（21.3%）",
    "2026年8月：  自然検索 ¥15,022,901（63.6%） ＋ 広告経由 ¥8,597,023（36.4%）",
    "",
    "▶ 自然検索は金額でも構成比でも低下。Amazonの検索順位・レビュー・在庫など、",
    "  広告に頼らない土台の見直しが中期の最優先テーマ。"
  ], 1.7);
}

/* ---------- 4. 週次推移 ---------- */
{
  const s = page("週次推移と広告投下バランス（2026年8月）","BAGMANIA Amazon ベンダー / 店舗分析レポート / 2026年8月度",
    "月末3日に広告費を集中投下、ROASは1,201%→558%まで低下。");
  s.addChart(pres.ChartType.bar, [
    { name:"自然検索売上（百万円）", labels: D4.wkChart.labels, values: D4.wkChart.organic },
    { name:"広告経由売上（百万円）", labels: D4.wkChart.labels, values: D4.wkChart.ad }
  ], { x:0.55, y:1.35, w:6.5, h:3.4, barDir:"col", barGrouping:"stacked",
       chartColors:["8DA2BC", ORANGE],
       showTitle:true, title:"週次 売上構成（百万円）", titleFontSize:11, titleColor:NAVY, titleFontFace:JP,
       showValue:true, dataLabelPosition:"ctr", dataLabelFontSize:8, dataLabelColor:"FFFFFF",
       dataLabelFontFace:JP, dataLabelFormatCode:"0.0",
       catAxisLabelColor:SLATE, catAxisLabelFontSize:8.5, catAxisLabelFontFace:JP,
       valAxisLabelColor:SLATE, valAxisLabelFontSize:8.5, valAxisMinVal:0, valAxisMaxVal:6,
       valGridLine:{ color:"EDF0F4", size:1 }, catGridLine:{ style:"none" },
       showLegend:true, legendPos:"b", legendFontSize:8.5, legendColor:SLATE, barGapWidthPct:55 });
  table(s, ["期間","上代","自然検索","広告経由","広告費","ROAS","件数"], D4.weekly,
    { x:7.25, y:1.35, w:5.78, colW:[1.00,0.90,0.90,0.90,0.80,0.66,0.62], rowH:0.29, fontSize:7.5,
      align:["left","right","right","right","right","right","right"],
      cellBold:(ri,ci)=> ri===5 || ci===5,
      cellColor:(ri,ci,r)=> ri===5 ? NAVY : (ci===5 ? (parseFloat(r[5].replace(',',''))>=1000?POS:NEG) : INK) });
  note(s,7.25,3.62,5.70,"■  注目ポイント",[
    "● 広告費の日平均が月内で急変している。",
    "  8/1–8/7   ¥21,464/日",
    "  8/29–8/31 ¥58,153/日（2.7倍）",
    "",
    "● それに伴い ROAS は 1,201% → 1,298% →",
    "  1,093% → 903% → 558% と一貫して低下。",
    "  月末3日間の ROAS 558% は月平均 999% の",
    "  約半分で、投下量の増加が効率を大きく",
    "  押し下げている。",
    "",
    "● 売上のピークは第2週（8/8–8/14）¥5.82M。",
    "  最終3日間を除けば週あたり ¥5.0〜5.8M で",
    "  安定しており、需要側の変動は小さい。"
  ], 2.88, 8.5);
  note(s,0.55,4.95,6.5,"■  考察",[
    "● 週次で見ると自然検索売上は ¥3.2〜3.6M/週 でほぼ一定。",
    "  売上の振れ幅は広告経由（¥1.79M〜2.20M）で生まれている。",
    "",
    "▶ 月末の追加投下は効率が悪い。予算を月内で均すか、",
    "  ROAS 下限を決めて自動的に絞る運用へ切り替えたい。"
  ], 1.55, 9);
}

/* ---------- 5. Amazon広告 ---------- */
{
  const s = page("Amazon広告パフォーマンス（2026年8月）","BAGMANIA Amazon ベンダー / 店舗分析レポート / 2026年8月度",
    "露出を倍にしながらCPC-28%。広告単体の効率は大幅改善。");
  const cw=3.92, gap=0.23;
  kpi(s,0.55,1.35,cw,1.28,"インプレッション","9,074,580","前年比 +104.0%",POS);
  kpi(s,0.55+(cw+gap),1.35,cw,1.28,"クリック数","48,040","CTR 0.53% / 前年比 +100.4%",POS);
  kpi(s,0.55+2*(cw+gap),1.35,cw,1.28,"CPC","¥18","前年 ¥25 / -28.0%",POS);
  kpi(s,0.55,2.78,cw,1.28,"ROAS（広告）","999%","前年 726% / +273pt",POS);
  kpi(s,0.55+(cw+gap),2.78,cw,1.28,"広告経由売上","¥8,597,023","上代の 36.4%（前年 21.3%）",SLATE);
  kpi(s,0.55+2*(cw+gap),2.78,cw,1.28,"ACOS（広告）","10.01%","前年 13.78% / -3.77pt",POS);
  table(s, ["指標","2026年8月","2025年8月","前年比"], D4.ad.filter(r=>["CTR","広告費","広告経由売上","ROAS（全体・上代）","TACOS（上代）"].includes(r[0])),
    { x:0.55, y:4.28, w:6.3, colW:[2.1,1.5,1.5,1.2], rowH:0.27, fontSize:9.5,
      align:["left","right","right","right"],
      cellBold:(ri,ci)=>ci===3, cellColor:(ri,ci,r)=> ci===3 ? yoyColor(r[3]) : INK });
  s.addText("※ インプレッション・クリック数・CPC・ROAS（広告）・ACOS（広告）は上部カードに記載。",
    { x:0.55, y:6.12, w:6.3, h:0.26, fontFace:JP, fontSize:8, color:MUTED, isTextBox:true, margin:0 });
  note(s,7.1,4.28,5.68,"■  考察",[
    "● 広告単体の効率は全指標で改善。インプ +104% /",
    "  クリック +100% と露出を倍にしながら CPC は",
    "  ¥25 → ¥18（-28.0%）へ低下。",
    "● ROAS 999%（+273pt）/ ACOS 10.01%（-3.77pt）で、",
    "  4チャネル中で圧倒的に高い広告効率。",
    "  （楽天BM 270.5% / YAMANIGOLF 372.3% / Yahoo 397%）",
    "● 一方 全体ROAS は 3,407% → 2,745%、TACOS は",
    "  2.93% → 3.64%。広告を増やした分だけ店舗全体の",
    "  コスト率は上がっている。",
    "▶ 広告の伸びしろはまだあるが、自然検索が減っている",
    "  状態での増額は TACOS 悪化に直結する。"
  ], 2.6, 8);
}

/* ---------- 6. JILL STUART ---------- */
{
  const s = page("JILL STUART 実績（2026年8月）","BAGMANIA Amazon ベンダー / 店舗分析レポート / 2026年8月度",
    "上代+7.0%で伸長も、店舗全体の伸び(+15.0%)には届かず構成比は低下。");
  table(s, ["指標","2026年8月","2025年8月","前年比"], D4.js,
    { x:0.55, y:1.45, w:7.4, colW:[2.3,1.75,1.75,1.6], rowH:0.42, fontSize:11,
      align:["left","right","right","right"],
      cellBold:(ri,ci)=>ci===3, cellColor:(ri,ci,r)=> ci===3 ? yoyColor(r[3]) : INK });
  note(s,8.2,1.45,4.58,"■  分析・考察",[
    "● JILL STUART 上代 ¥10,341,803（+7.0%）。",
    "  Amazon 全体 ¥23,619,924 の 43.8% を占める",
    "  最大ブランドで、この1ブランドの動きが",
    "  Amazon全体を左右する構造。",
    "",
    "● ただし伸び率は店舗全体（+15.0%）を下回り、",
    "  構成比は 47.1% → 43.8%（-3.3pt）へ低下。",
    "  他ブランドが相対的に伸びたことを示す。",
    "",
    "● 件数 +3.2% に対し上代 +7.0%。客単価は",
    "  ¥10,624 → ¥11,013（+3.7%）で、単価の",
    "  高い商品が売れるようになっている。",
    "",
    "● 前月 2026年7月 ¥12,550,949 からは -17.6%。",
    "  Amazon全体の前月比 -11.9% より落ち込みが",
    "  大きく、8月は JILL STUART が全体の",
    "  足を引っ張った形。",
    "",
    "▶ 楽天（構成比 42.7%）/ Yahoo（37.6%）でも",
    "  首位であり、3チャネル共通の主力。"
  ], 4.85, 9.5);
  note(s,0.55,3.9,7.4,"■  本版で作成できていないスライド",[
    "運用レポートの「商品別_全体実績（ブランド別）」は、2026年8月・7月とも",
    "JILL STUART の1行のみ入力済みで、他ブランドが未入力のため作成を見送っています。",
    "",
    "・ブランド別売上 単月前年比（7月度版 3枚目相当）",
    "・ブランド別 Amazon広告実績（同 4枚目相当）",
    "・BEAMS DESIGN 運用方針 / 競合ASIN・指名KW TOP15（同 5・6枚目相当）",
    "　※「ビームスデザイン広告実績」シートは7月時点のデータのままです。"
  ], 2.35, 9);
}

/* ---------- 7. まとめと推奨アクション ---------- */
{
  const s = page("まとめと推奨アクション","BAGMANIA Amazon ベンダー / 店舗分析レポート / 2026年8月度",
    "4チャネル最大規模。広告効率は良いが、自然検索の縮小が中期リスク。");
  s.addShape(pres.ShapeType.roundRect,{x:0.55,y:1.32,w:6.03,h:4.3,fill:{color:"F0F8F3"},line:{color:"CBE4D6",width:1},rectRadius:0.06});
  s.addText("✓  成果・ポジティブ指標",{x:0.8,y:1.46,w:5.5,h:0.32,fontFace:JP,fontSize:13,bold:true,color:POS,isTextBox:true,margin:0,valign:"middle"});
  s.addText([
    "●  上代売上 ¥23,619,924（+15.0%）で4チャネル中最大規模",
    "●  売上件数 2,214件（+14.1%）と実数で拡大",
    "●  広告 ROAS 999%（+273pt）/ ACOS 10.01%（-3.77pt）",
    "●  CPC ¥25 → ¥18（-28.0%）。露出を倍にしつつ単価を低減",
    "●  インプレッション +104.0% / クリック +100.4%",
    "●  広告経由売上 ¥8,597,023（+96.6%）でほぼ倍増",
    "●  広告効率は4チャネル中で圧倒的に高い",
    "     （楽天BM 270.5% / YAMANIGOLF 372.3% / Yahoo 397%）",
    "●  JILL STUART 上代 +7.0%、客単価 +3.7% で単価改善",
    "●  客単価 ¥10,668（+0.8%）で水準を維持"
  ].map((t,i,a)=>({text:t,options:{breakLine:i<a.length-1}})),
    {x:0.8,y:1.9,w:5.55,h:3.6,fontFace:JP,fontSize:9,color:INK,isTextBox:true,margin:0,lineSpacingMultiple:1.3,valign:"top"});

  s.addShape(pres.ShapeType.roundRect,{x:6.75,y:1.32,w:6.03,h:4.3,fill:{color:"EAF1F8"},line:{color:"C6D8E9",width:1},rectRadius:0.06});
  s.addText("△  課題・推奨アクション",{x:7.0,y:1.46,w:5.5,h:0.32,fontFace:JP,fontSize:13,bold:true,color:ORANGE,isTextBox:true,margin:0,valign:"middle"});
  s.addText([
    "●  自然検索売上 -7.0%（¥16,162K → ¥15,023K）",
    "   → 増収は全額が広告由来。土台が細っている",
    "   → 検索順位・レビュー・在庫・A+ の見直しを最優先",
    "●  広告経由 構成比 21.3% → 36.4%（+15.1pt）",
    "   → 広告を止めた時の売上耐性が1年で大きく低下",
    "●  全体ROAS 3,407% → 2,745% / TACOS 2.93% → 3.64%",
    "   → 店舗全体の広告コスト率は悪化。増額は慎重に",
    "●  月末3日に広告費を集中投下（日平均2.7倍）",
    "   → ROAS 558% と月平均999%の半分。予算を月内で均す",
    "   → もしくは ROAS 下限を設定して自動で絞る運用へ",
    "●  JILL STUART 構成比 -3.3pt / 前月比 -17.6%",
    "   → 全体の前月比 -11.9% より落ち込みが大きい",
    "●  運用レポートのブランド別実績が未入力",
    "   → ブランド別の打ち手が立てられない。入力の運用化を"
  ].map((t,i,a)=>({text:t,options:{breakLine:i<a.length-1}})),
    {x:7.0,y:1.9,w:5.55,h:3.6,fontFace:JP,fontSize:9,color:INK,isTextBox:true,margin:0,lineSpacingMultiple:1.24,valign:"top"});

  note(s,0.55,5.75,12.23,"■  数値の取り扱いについて（重要）",[
    "本資料の2026年8月売上は日別実績の合計値 ¥23,619,924 を採用しています。運用レポートのサマリ欄は ¥22,828,454 ですが、合計式の範囲が8月31日（¥791,470）を含んでいません。",
    "同じ事象は2026年7月にも発生しており（サマリ ¥26,145,820 / 日別合計 ¥26,805,720・差 ¥659,900）、7月度版の資料もこの影響を受けています。2026年6月・2025年8月は一致しており問題ありません。",
    "根拠：全月で「自然検索売上＋広告経由売上＝上代」が成立するのは日別合計側のみです（2026年8月：¥15,022,901＋¥8,597,023＝¥23,619,924）。運用レポート側の修正をご検討ください。"
  ], 1.18, 8);
}


pres.writeFile({ fileName: "/tmp/claude-0/-home-user-home/7cd269b9-76ec-5b62-a114-e98ebb274bdd/scratchpad/WACWORKS_202608_ALL_GS.pptx" }).then(f=>console.log("written:",f));
