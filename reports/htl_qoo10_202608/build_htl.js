const pptxgen = require("pptxgenjs");
const D = require("./data_htl.js");

// Wacworks house palette (extracted from the ByUR proposal deck)
const INK="191F4D",      // primary navy
      INK2="44496E",     // secondary navy
      AMBER="191F4D",    // section labels / badges  (house style: navy, not amber)
      AMBER_SOFT="E8EBF2",// total-row + chip tint
      UP="2E75B6",       // positive delta (house blue)
      DOWN="C00000",     // negative delta (house red)
      MUTED="767C8A", CARD="F4F5F8", LINE="D4D6DE", RULE="8C929E",
      W="FFFFFF", TEAL="2E75B6";
const LOGO_DARK="assets/logo_dark.png", LOGO_WHITE="assets/logo_white.png",
      TITLE_BG="assets/title_bg.jpg";
const F="Meiryo";
const SW=13.333, SH=7.5, M=0.6, CW=SW-2*M;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "株式会社Wacworks";
pres.title = "HTL_Qoo10_2026年8月メガポ_レポート";

let page = 0;
const TOTAL = 17;

function sh(o){ return {type:"outer", color:"9AA6B5", blur:6, offset:1, angle:90, opacity:0.18, ...o}; }

function footer(s, dark){
  page++;
  s.addText("Copyright © Wacworks Inc. All Rights Reserved.", {
    x:0.33, y:7.10, w:6, h:0.3, isTextBox:true, margin:0,
    fontFace:F, fontSize:8, color: dark?"8892A8":"9AA0AC", valign:"middle"});
  s.addText(`${page} / ${TOTAL}`, {
    x:SW-0.33-1.6, y:7.10, w:1.6, h:0.3, isTextBox:true, margin:0, align:"right",
    fontFace:F, fontSize:8, color: dark?"8892A8":"9AA0AC", valign:"middle"});
}

function head(s, title, right){
  // house style: small navy tick, title, hairline rule, Wacworks mark top-right
  s.addShape(pres.ShapeType.rect, {x:0.33, y:0.25, w:0.15, h:0.54,
    fill:{color:INK}, line:{color:INK, width:0}});
  s.addText(title, {x:M, y:0.22, w:9.60, h:0.56, isTextBox:true, margin:0,
    fontFace:F, fontSize:24, bold:true, color:INK, valign:"middle"});
  s.addImage({path:LOGO_DARK, x:SW-0.35-2.55, y:0.24, w:2.55, h:0.474});
  s.addShape(pres.ShapeType.line, {x:0.33, y:0.86, w:SW-0.66, h:0,
    line:{color:RULE, width:0.75}});
  if(right) s.addText(right, {x:SW-M-5.2, y:0.87, w:5.2, h:0.23, isTextBox:true, margin:0,
    align:"right", fontFace:F, fontSize:9.5, color:MUTED, valign:"middle"});
}

function card(s, x, y, w, h, fill){
  s.addShape(pres.ShapeType.roundRect, {x,y,w,h, fill:{color:fill||CARD},
    line:{color:LINE, width:0.75}, rectRadius:0.07, shadow:sh({})});
}

// big stat card
function stat(s, x, y, w, h, label, value, sub, accent){
  card(s,x,y,w,h);
  s.addText(label, {x:x+0.18, y:y+0.12, w:w-0.36, h:0.3, isTextBox:true, margin:0,
    fontFace:F, fontSize:10, color:MUTED, valign:"middle"});
  s.addText(value, {x:x+0.18, y:y+0.40, w:w-0.36, h:0.52, isTextBox:true, margin:0,
    fontFace:F, fontSize:21, bold:true, color:accent||INK, valign:"middle"});
  if(sub) s.addText(sub, {x:x+0.18, y:y+0.93, w:w-0.36, h:Math.max(0.32,h-1.01), isTextBox:true, margin:0,
    fontFace:F, fontSize:9, color:MUTED, valign:"top"});
}

// 7月→8月 comparison chip
function chip(s, x, y, w, h, label, from, to, delta, dir){
  card(s,x,y,w,h);
  s.addText(label, {x:x+0.15, y:y+0.08, w:w-0.3, h:0.26, isTextBox:true, margin:0,
    fontFace:F, fontSize:9.5, color:MUTED, valign:"middle"});
  s.addText(from, {x:x+0.15, y:y+0.30, w:w-0.3, h:0.26, isTextBox:true, margin:0,
    fontFace:F, fontSize:10, color:MUTED, valign:"middle"});
  s.addText(to, {x:x+0.15, y:y+0.55, w:w-0.3, h:0.34, isTextBox:true, margin:0,
    fontFace:F, fontSize:14.5, bold:true, color:INK, valign:"middle"});
  s.addText(delta, {x:x+0.15, y:y+0.88, w:w-0.3, h:0.28, isTextBox:true, margin:0,
    fontFace:F, fontSize:11, bold:true, color: dir==="up"?UP:dir==="down"?DOWN:MUTED, valign:"middle"});
}

function ev(t, dir){ return {text:t, options:{color: dir==="up"?UP:dir==="down"?DOWN:MUTED, bold:true}}; }

function bullets(s, x, y, w, h, items, size, color){
  const rows = items.map((t,i)=>({
    text:t, options:{bullet:{code:"25CF"}, breakLine:i<items.length-1}
  }));
  s.addText(rows, {x, y, w, h, isTextBox:true, margin:0, fontFace:F,
    fontSize:size||11, color:color||INK2, lineSpacingMultiple:1.22, paraSpaceAfter:6, valign:"top"});
}

// numbered list inside an action card
function numList(s, x, y, w, items){
  let cy=y;
  items.forEach((t,i)=>{
    s.addShape(pres.ShapeType.ellipse,{x:x, y:cy+0.035, w:0.235, h:0.235, fill:{color:AMBER}, line:{color:AMBER,width:0}});
    s.addText(String(i+1),{x:x, y:cy+0.035, w:0.235, h:0.235, isTextBox:true, margin:0,
      align:"center", valign:"middle", fontFace:F, fontSize:8, bold:true, color:W});
    s.addText(t,{x:x+0.33, y:cy-0.01, w:w-0.33, h:0.42, isTextBox:true, margin:0,
      fontFace:F, fontSize:9.5, color:INK2, valign:"top", lineSpacingMultiple:1.12});
    cy += 0.41;
  });
}

function tbl(s, rows, opts){
  s.addTable(rows, {
    fontFace:F, fontSize:10, color:INK2, valign:"middle", align:"center",
    border:{type:"solid", pt:0.5, color:LINE},
    autoPage:false, ...opts });
}
function hrow(cells){
  return cells.map(t=>({text:t, options:{bold:true, color:W, fill:{color:INK}, fontSize:9.5}}));
}
function totalRow(cells){
  return cells.map(t=>({text:t, options:{bold:true, color:INK, fill:{color:AMBER_SOFT}}}));
}

/* ---------------- 1. Title ---------------- */
{
  const s = pres.addSlide();
  s.background = {color:INK};
  s.addImage({path:TITLE_BG, x:0, y:0, w:SW, h:SH});
  s.addShape(pres.ShapeType.rect, {x:0, y:0, w:SW, h:SH,
    fill:{color:INK, transparency:5}, line:{color:INK, width:0}});
  s.addImage({path:LOGO_WHITE, x:1.58, y:2.37, w:4.14, h:2.86});
  s.addShape(pres.ShapeType.line, {x:6.67, y:2.37, w:0, h:2.95,
    line:{color:"9AA0B4", width:0.75}});
  s.addText("HTL様  Qoo10 メガポ 振り返りレポート", {x:7.38, y:2.62, w:5.55, h:0.62,
    isTextBox:true, margin:0, fontFace:F, fontSize:19.5, bold:true, color:W, valign:"middle"});
  s.addText("2026年8月メガポ 運用振り返り", {x:7.38, y:3.30, w:5.30, h:0.40,
    isTextBox:true, margin:0, fontFace:F, fontSize:13, color:"C9CEDC", valign:"middle"});
  s.addShape(pres.ShapeType.rect, {x:7.38, y:3.90, w:5.30, h:0.02,
    fill:{color:"5B6182"}, line:{color:"5B6182", width:0}});
  s.addText("対象期間: 2026年8月1日〜9日（メガポ期間 9日間）", {x:7.38, y:4.02, w:5.30, h:0.30,
    isTextBox:true, margin:0, fontFace:F, fontSize:10.5, color:"C9CEDC", valign:"middle"});
  s.addText("比較: 2026年7月1日〜9日（メガポ期間）", {x:7.38, y:4.30, w:5.30, h:0.30,
    isTextBox:true, margin:0, fontFace:F, fontSize:10.5, color:"C9CEDC", valign:"middle"});
  s.addText("作成：株式会社Wacworks   |   2026年8月", {x:7.38, y:4.78, w:5.30, h:0.32,
    isTextBox:true, margin:0, fontFace:F, fontSize:10, color:"8892A8", valign:"middle"});
  footer(s, true);
  s.addNotes("HTL様（ヘアセオリーラボ）Qoo10 2026年8月メガポ（8/1〜8/9）の振り返り。比較対象は7月メガポ（7/1〜7/9）。");
}

/* ---------------- 2. 目次 ---------------- */
{
  const s = pres.addSlide();
  head(s, "目次");
  const toc = [
    "エグゼクティブサマリー","★ 7月vs8月 KPI比較サマリー","売上推移（8月日別表）",
    "★ 7月vs8月 売上・件数比較（日別）","注文・顧客データ（8月）","★ 7月vs8月 顧客・新規/リピート比較",
    "チャネル別流入分析（7月vs8月 TOP10）","★ 7月vs8月 CVR・ファネル比較","商品別売上ランキング（8月）",
    "★ 7月vs8月 商品別売上比較","★ セラムイン ウォータートリートメント 詳細","★ シャンプー＆トリートメント セット 詳細",
    "検索キーワード分析（7月vs8月）","次回メガ割に向けた改善アクション","Next Step・総括"
  ];
  toc.forEach((t,i)=>{
    const col = i<8?0:1, row = i<8?i:i-8;
    const x = M + col*6.25, y = 1.25 + row*0.68;
    s.addShape(pres.ShapeType.roundRect,{x, y, w:0.62, h:0.5, fill:{color:AMBER_SOFT}, line:{width:0}, rectRadius:0.06});
    s.addText(String(i+3).padStart(2,"0"), {x, y, w:0.62, h:0.5, isTextBox:true, margin:0,
      align:"center", valign:"middle", fontFace:F, fontSize:12, bold:true, color:AMBER});
    s.addText(t, {x:x+0.78, y, w:5.3, h:0.5, isTextBox:true, margin:0,
      fontFace:F, fontSize:11.5, color:INK2, valign:"middle"});
  });
  footer(s);
}

/* ---------------- 3. Executive summary ---------------- */
{
  const s = pres.addSlide();
  head(s, "エグゼクティブサマリー ─ 2026年8月メガポ（8/1〜9）", "比較：2026年7月メガポ（7/1〜9）");
  const cw=(CW-4*0.16)/5;
  [["売上金額","¥604,819","9日間合計（7月比 -20.4%）",DOWN],
   ["売上件数","121件","平均13.4件/日（-21.4%）",DOWN],
   ["訪問者数","1,099","平均122人/日（-19.8%）",DOWN],
   ["平均客単価","¥4,999","7月比 +1.4%（+¥68）",UP],
   ["購入顧客数","113名","リピート61.9%（+22.3pt）",UP]
  ].forEach((c,i)=> stat(s, M+i*(cw+0.16), 1.15, cw, 1.35, c[0], c[1], c[2], c[3]));
  card(s, M, 2.72, CW, 3.50, W);
  s.addText("■ 総評", {x:M+0.28, y:2.85, w:4, h:0.32, isTextBox:true, margin:0,
    fontFace:F, fontSize:12.5, bold:true, color:AMBER});
  bullets(s, M+0.28, 3.25, CW-0.56, 2.90, [
    "8月メガポ期間（8/1〜9）売上¥604,819。7月同期間（¥759,378）比で -20.4%、-¥154,559の減少となった。",
    "▼ 減少の主因は集客。訪問者-19.8%・PV-22.6%と流入が縮小し、売上減とほぼ同率で推移している。",
    "★ 一方でCVR 11.01%（-0.22pt）と客単価¥4,999（+1.4%）は維持。「入ってきた顧客の買う力」は落ちていない。",
    "★ 最大の構造変化は顧客層。新規は90→43名（-52.2%）と半減した反面、リピーターは59→70名（+18.6%）に増加し、リピート比率が39.6%→61.9%へ逆転した。",
    "▼ サイト内回遊の急減が顕著。カート流入-58.7%、商品詳細ページ-52.7%、カテゴリページ-42.4%と、回遊系チャネルが軒並み半減。",
    "▼ ブランド指名KW「ヘアセオリーラボ」57→35件（-38.6%）。認知系の流入縮小が新規減に直結している。"
  ], 11);
  footer(s);
  s.addNotes("売上減の主因は新規集客の縮小。CVR・客単価・リピート基盤は良好で、回復の起点は新規流入の再獲得。");
}

/* ---------------- 4. KPI比較 ---------------- */
{
  const s = pres.addSlide();
  head(s, "★ 7月vs8月 KPI比較サマリー（メガポ同日比較）", "8/1〜8/9  vs  7/1〜7/9");
  const cw=(CW-4*0.16)/5;
  [["売上金額","7月  ¥759,378","8月  ¥604,819","▼ -20.4%","down"],
   ["売上件数","7月  154件","8月  121件","▼ -21.4%","down"],
   ["訪問者数","7月  1,371","8月  1,099","▼ -19.8%","down"],
   ["CVR","7月  11.23%","8月  11.01%","→ -0.22pt","flat"],
   ["客単価","7月  ¥4,931","8月  ¥4,999","▲ +1.4%","up"]
  ].forEach((c,i)=> chip(s, M+i*(cw+0.16), 1.15, cw, 1.20, c[0], c[1], c[2], c[3], c[4]));
  const rows=[hrow(["指標","7月メガポ（7/1-9）","8月メガポ（8/1-9）","差分","評価"])];
  D.kpi.forEach(r=> rows.push([r[0], r[1], r[2], r[3], ev(r[4], r[5])]));
  tbl(s, rows, {x:M, y:2.62, w:CW, colW:[3.0,2.55,2.55,2.0,2.03], rowH:0.375});
  s.addText("★ 売上-20.4%に対し訪問者-19.8%・PV-22.6%とほぼ同率で減少。CVR（-0.22pt）と客単価（+1.4%）は維持されており、「転換力」ではなく「流入量」が課題であることが明確。",
    {x:M, y:6.12, w:CW, h:0.72, isTextBox:true, margin:0, fontFace:F, fontSize:10.5, color:INK2, valign:"top", lineSpacingMultiple:1.2});
  footer(s);
}

/* ---------------- 5. 売上推移 日別 ---------------- */
{
  const s = pres.addSlide();
  head(s, "売上推移 ─ 2026年8月メガポ 日別（表）", "8/1〜8/9（9日間）");
  const rows=[hrow(["日付","売上金額","件数","訪問者","CVR","客単価","顧客数","新規/リピ","備考"])];
  D.daily8.forEach((r,i)=>{
    if(i===D.daily8.length-1) rows.push(totalRow(r));
    else rows.push(r.map((c,j)=> j===8&&c ? {text:c, options:{color:UP, bold:true}} : c));
  });
  tbl(s, rows, {x:M, y:1.15, w:CW, colW:[1.30,1.55,0.95,1.05,1.05,1.20,1.05,1.20,2.78], rowH:0.325});
  card(s, M, 4.98, CW, 1.88, W);
  s.addText("▲ ハイライト", {x:M+0.28, y:5.10, w:4, h:0.3, isTextBox:true, margin:0,
    fontFace:F, fontSize:12, bold:true, color:AMBER});
  bullets(s, M+0.28, 5.46, CW-0.56, 1.25, [
    "初日8/1（土）¥162,835・32件が期間最高で、単日で期間売上の26.9%。8/6（木）はCVR21.43%と期間最高効率（訪問98人で21件）。",
    "▼ 前半3日（¥300,549）に対し中盤8/3〜5は¥121,519、8/7（金）は¥16,266・3件と急落。初日集中型で、2日目以降の失速が売上減の直接要因。"
  ], 10.5);
  footer(s);
}

/* ---------------- 6. 日別比較 chart ---------------- */
{
  const s = pres.addSlide();
  head(s, "★ 7月vs8月 売上・件数比較（メガポ同日）", "メガポ開始からの経過日数で比較");
  s.addChart(pres.ChartType.bar, [
    {name:"7月メガポ 売上", labels:D.labels, values:D.rev7},
    {name:"8月メガポ 売上", labels:D.labels, values:D.rev8}
  ], {
    x:M, y:1.20, w:8.55, h:4.35,
    barDir:"col", barGapWidthPct:55, chartColors:[ "A9B6C6", INK ],
    showLegend:true, legendPos:"t", legendFontSize:10, legendColor:INK2,
    showTitle:false, showValue:false,
    catAxisLabelColor:INK2, catAxisLabelFontSize:10, catAxisLabelFontFace:F,
    valAxisLabelColor:MUTED, valAxisLabelFontSize:9, valAxisLabelFontFace:F,
    valAxisMaxVal:180000, valGridLine:{color:"E8ECF1", size:1}, catGridLine:{style:"none"},
    dataLabelFontFace:F, valAxisLabelFormatCode:"¥#,##0"
  });
  const rx = M+8.85, rw = CW-8.85;
  stat(s, rx, 1.20, rw, 1.25, "8月メガポ 合計", "¥604,819", "121件 / 訪問1,099 / CVR 11.01%", INK);
  stat(s, rx, 2.60, rw, 1.25, "7月メガポ 合計", "¥759,378", "154件 / 訪問1,371 / CVR 11.23%", MUTED);
  stat(s, rx, 4.00, rw, 1.55, "前月差", "-¥154,559", "-33件 / -272人 / -0.22pt\n売上伸長率 -20.4%", DOWN);
  card(s, M, 5.75, CW, 1.1, W);
  s.addText("▲ 7月は9日間を通じて¥52,177〜¥123,544と平準化していたのに対し、8月は初日¥162,835に突出し以降失速。特に3〜5日目と7日目の落ち込みが大きく、期間を通じた露出の継続性が7月より弱かった。",
    {x:M+0.28, y:5.88, w:CW-0.56, h:0.85, isTextBox:true, margin:0, fontFace:F, fontSize:10.5, color:INK2, valign:"top", lineSpacingMultiple:1.2});
  footer(s);
}

/* ---------------- 7. 注文・顧客データ ---------------- */
{
  const s = pres.addSlide();
  head(s, "注文・顧客データ ─ 2026年8月メガポ", "8/1〜8/9");
  const cw=(CW-3*0.16)/4;
  [["購入顧客（合計）","113名","9日間（7月149名比 -24.2%）",DOWN],
   ["新規顧客","43名","38.1%（7月60.4%比 -22.3pt）",DOWN],
   ["リピーター","70名","61.9%（7月39.6%比 +22.3pt）",UP],
   ["フォロワー数","2,070名","期末時点（+12名/9日）",UP]
  ].forEach((c,i)=> stat(s, M+i*(cw+0.16), 1.15, cw, 1.25, c[0], c[1], c[2], c[3]));
  const rows=[hrow(["日付","新規","リピート","合計","フォロワー","ショップPV"])];
  D.cust8.forEach((r,i)=> rows.push(i===D.cust8.length-1?totalRow(r):r));
  tbl(s, rows, {x:M, y:2.58, w:7.15, colW:[1.35,1.05,1.25,1.05,1.30,1.15], rowH:0.325});
  const ix=M+7.45, iw=CW-7.45;
  [["★ リピート主導へ構造転換","リピーター70名は7月59名から+18.6%。新規半減のなかで購入顧客の6割超を占め、売上を下支えした。",UP],
   ["▼ 新規43名（-52.2%）","7月90名から半減。ブランド指名KW-38.6%・検索流入-25.3%と連動しており、認知獲得の縮小が直接の要因。",DOWN],
   ["★ 8/1（土）が突出","30名獲得（新規10/リピート20）。メガポ初日にリピーターが集中し、単日で期間顧客の26.5%を占めた。",UP],
   ["フォロワー2,070名で過去最高","+12名/9日は7月（+8名）を上回るペース。母数2,000超のファン基盤は着実に積み上がっている。",UP]
  ].forEach((c,i)=>{
    const y=2.58+i*1.02;
    card(s, ix, y, iw, 0.92, W);
    s.addText(c[0], {x:ix+0.2, y:y+0.09, w:iw-0.4, h:0.28, isTextBox:true, margin:0,
      fontFace:F, fontSize:10.5, bold:true, color:c[2], valign:"middle"});
    s.addText(c[1], {x:ix+0.2, y:y+0.36, w:iw-0.4, h:0.5, isTextBox:true, margin:0,
      fontFace:F, fontSize:9, color:MUTED, valign:"top", lineSpacingMultiple:1.15});
  });
  footer(s);
}

/* ---------------- 8. 顧客比較 ---------------- */
{
  const s = pres.addSlide();
  head(s, "★ 7月vs8月 顧客・新規/リピート比較", "メガポ同日比較");
  const rows=[hrow(["指標","7月（7/1-9）","8月（8/1-9）","差分","前期比"])];
  D.custCmp.forEach(r=> rows.push([r[0], r[1], r[2], r[3], ev(r[4], r[5])]));
  tbl(s, rows, {x:M, y:1.15, w:CW, colW:[3.2,2.5,2.5,2.0,1.93], rowH:0.36});
  card(s, M, 4.13, CW, 2.72, W);
  s.addText("■ 考察", {x:M+0.28, y:4.24, w:4, h:0.3, isTextBox:true, margin:0,
    fontFace:F, fontSize:12.5, bold:true, color:AMBER});
  bullets(s, M+0.28, 4.60, CW-0.56, 2.22, [
    "顧客数-24.2%の内訳は、新規-47名・リピーター+11名。減少はすべて新規側で起きており、既存顧客はむしろ増えている。",
    "リピート比率39.6%→61.9%（+22.3pt）と主従が逆転。フォロワー2,070名・お気に入り流入446PVという資産が実際の購買に結びついている証左。",
    "1人あたり売上は¥5,097→¥5,352（+5.0%）。単価の高いリピーター比率が上がったことで、顧客単価は改善した。",
    "▼ ただしリピート依存は中長期のリスク。新規流入が細ったままではリピート母数自体が先細りするため、新規獲得の回復が最優先課題。",
    "★ 次回メガ割は「リピート基盤（2,070名）を維持しながら、新規を7月水準の90名へ戻す」ことが目標。"
  ], 11);
  footer(s);
}

/* ---------------- 9. チャネル別流入 ---------------- */
{
  const s = pres.addSlide();
  head(s, "チャネル別流入分析（PV）─ 7月vs8月 TOP10比較", "合計PV 1,815 → 1,404（-22.6%）");
  const rows=[hrow(["チャネル","7月 PV","8月 PV","増減","8月構成比","評価"])];
  D.channels.forEach((r,i)=>{
    const base=[{text:r[0], options:{align:"left"}}, r[1], r[2], r[3], r[4], ev(r[5], r[6])];
    rows.push(i===D.channels.length-1 ? base.map(c=>{
      const o = typeof c==="string"?{text:c}:c;
      return {text:o.text, options:{...(o.options||{}), bold:true, color:INK, fill:{color:AMBER_SOFT}}};
    }) : base);
  });
  tbl(s, rows, {x:M, y:1.15, w:7.75, colW:[2.55,0.95,0.95,0.85,1.20,1.25], rowH:0.255, fontSize:9});
  const ix=M+8.05, iw=CW-8.05;
  [["★ お気に入りが最大流入","446PV・構成比31.8%。-12.9%と全体（-22.6%）より減少幅が小さく、ファン基盤の底堅さを示す。",UP],
   ["▼ カート流入 -58.7%","189→78PV。カゴ落ち復帰の動線が大きく縮小し、回遊系の落ち込みで最大。",DOWN],
   ["▼ 商品詳細ページ -52.7%","91→43PV。商品間の相互回遊が半減。レコメンド・関連商品導線の再設計が必要。",DOWN],
   ["★ 外部Google +8.0%","75→81PV。全体が減るなかで唯一伸びたチャネル。外部SEOは新規回復の足がかり。",UP]
  ].forEach((c,i)=>{
    const y=1.15+i*1.14;
    card(s, ix, y, iw, 1.02, W);
    s.addText(c[0], {x:ix+0.2, y:y+0.12, w:iw-0.4, h:0.3, isTextBox:true, margin:0,
      fontFace:F, fontSize:11, bold:true, color:c[2], valign:"middle"});
    s.addText(c[1], {x:ix+0.2, y:y+0.44, w:iw-0.4, h:0.5, isTextBox:true, margin:0,
      fontFace:F, fontSize:9, color:MUTED, valign:"top", lineSpacingMultiple:1.15});
  });
  card(s, M, 6.02, CW, 0.84, W);
  bullets(s, M+0.28, 6.12, CW-0.56, 0.68, [
    "お気に入り（31.8%）＋ダイレクト（14.5%）＋ショップ（9.6%）で全体の56%。指名・再訪型に大きく偏っており、リピート構造とチャネル構造が一致している。",
    "▼ 検索は115PV・構成比8.2%まで縮小。広告（Keyword Plus -23.3%／パワーランクアップ -28.8%）と自然検索が揃って減っており、次回は検索面の回復が最優先。"
  ], 9);
  footer(s);
}

/* ---------------- 10. CVR・ファネル ---------------- */
{
  const s = pres.addSlide();
  head(s, "★ 7月vs8月 CVR・ファネル比較", "メガポ同日比較");
  const rows=[hrow(["指標","7月メガポ","8月メガポ","差分","評価"])];
  D.funnel.forEach(r=> rows.push([r[0], r[1], r[2], r[3], ev(r[4], r[5])]));
  tbl(s, rows, {x:M, y:1.15, w:6.6, colW:[1.75,1.25,1.25,1.15,1.20], rowH:0.40});
  const fx=M+6.95, fw=CW-6.95;
  card(s, fx, 1.15, fw, 2.40, W);
  s.addText("■ ファネル推移（7月 → 8月）", {x:fx+0.22, y:1.24, w:fw-0.44, h:0.28, isTextBox:true, margin:0,
    fontFace:F, fontSize:10.5, bold:true, color:AMBER, valign:"middle"});
  const steps=[["PV",1815,1404],["訪問者",1371,1099],["カート",273,221],["購入",154,121]];
  const maxv=1815, barMax=fw-2.95;
  steps.forEach((st,i)=>{
    const y=1.60+i*0.47;
    s.addText(st[0], {x:fx+0.22, y, w:0.82, h:0.4, isTextBox:true, margin:0,
      fontFace:F, fontSize:9.5, color:INK2, valign:"middle"});
    s.addShape(pres.ShapeType.roundRect,{x:fx+1.06, y:y+0.045, w:Math.max(0.12,barMax*st[1]/maxv), h:0.145,
      fill:{color:"A9B6C6"}, line:{width:0}, rectRadius:0.03});
    s.addShape(pres.ShapeType.roundRect,{x:fx+1.06, y:y+0.215, w:Math.max(0.12,barMax*st[2]/maxv), h:0.145,
      fill:{color:INK}, line:{width:0}, rectRadius:0.03});
    s.addText(`${st[1].toLocaleString()} → ${st[2].toLocaleString()}`,
      {x:fx+fw-1.75, y, w:1.55, h:0.4, isTextBox:true, margin:0, align:"right",
       fontFace:F, fontSize:9, color:MUTED, valign:"middle"});
  });
  card(s, M, 3.72, CW, 3.13, W);
  s.addText("■ 分析", {x:M+0.28, y:3.84, w:4, h:0.3, isTextBox:true, margin:0,
    fontFace:F, fontSize:12.5, bold:true, color:AMBER});
  bullets(s, M+0.28, 4.20, CW-0.56, 2.55, [
    "PV-22.6%・訪問者-19.8%・カート-19.0%・注文-21.4%と、ファネル全層がほぼ同率で縮小。特定段階のボトルネックではなく、入口の流入量そのものが減っている。",
    "カート転換率（カート数/訪問者）は19.9%→20.1%と微増、CVRも-0.22ptにとどまる。サイト・商品ページの説得力は7月と同水準を保っている。",
    "カート→注文は56.4%→54.8%（-1.6pt）。残カート100件が回収余地として残り、ここは即効性のある打ち手が効く。",
    "★ 次回メガ割は「訪問者1,400・CVR11.0%・注文150件」を目標に、①検索・広告での新規流入回復 ②残カート回収 の2点に絞って投下する。"
  ], 11);
  footer(s);
}

/* ---------------- 11. 商品別ランキング ---------------- */
{
  const s = pres.addSlide();
  head(s, "商品別売上ランキング ─ 2026年8月メガポ", "全7SKU / 売上¥604,819");
  const cw=(CW-3*0.16)/4;
  [["1位 売上","¥278,124","セラムイン ウォータートリートメント（46.0%）",UP],
   ["2位 売上","¥181,776","シャンプー＆トリートメント セット（30.1%）",INK],
   ["TOP2合計シェア","76.0%","2商品への依存度が高い構造",INK],
   ["販売商品数","7SKU","TOP3で売上の85.7%",INK]
  ].forEach((c,i)=> stat(s, M+i*(cw+0.16), 1.15, cw, 1.25, c[0], c[1], c[2], c[3]));
  const rows=[hrow(["順位","商品名","売上金額","件数","客単価","構成比"])];
  D.rank8.forEach((r,i)=>{
    const base=[r[0], {text:r[1], options:{align:"left"}}, r[2], r[3], r[4], r[5]];
    rows.push(i===D.rank8.length-1 ? base.map(c=>{
      const o = typeof c==="string"?{text:c}:c;
      return {text:o.text, options:{...(o.options||{}), bold:true, color:INK, fill:{color:AMBER_SOFT}}};
    }) : base);
  });
  tbl(s, rows, {x:M, y:2.58, w:CW, colW:[0.85,5.28,1.75,1.15,1.45,1.65], rowH:0.40});
  s.addText("★ TOP2で売上の76.0%を占める集中構造。主力のウォータートリートメント（-25.1%）とセット品（-14.3%）が揃って落ちたことが、全体-20.4%の大半を説明する。一方でシャンプー単品は+400%と伸長。",
    {x:M, y:6.20, w:CW, h:0.62, isTextBox:true, margin:0, fontFace:F, fontSize:10.5, color:INK2, valign:"top", lineSpacingMultiple:1.2});
  footer(s);
}

/* ---------------- 12. 商品別比較 ---------------- */
{
  const s = pres.addSlide();
  head(s, "★ 7月vs8月 商品別売上比較", "メガポ同日比較");
  const rows=[hrow(["商品名","7月 売上","7月 件数","8月 売上","8月 件数","売上増減","評価"])];
  D.prodCmp.forEach(r=> rows.push([{text:r[0], options:{align:"left"}}, r[1], r[2], r[3], r[4], r[5], ev(r[6], r[7])]));
  tbl(s, rows, {x:M, y:1.15, w:CW, colW:[4.28,1.45,1.05,1.45,1.05,1.50,1.35], rowH:0.36});
  const hw=(CW-0.3)/2;
  card(s, M, 4.35, hw, 2.50, W);
  s.addText("★ 伸長した商品", {x:M+0.24, y:4.46, w:hw-0.48, h:0.3, isTextBox:true, margin:0,
    fontFace:F, fontSize:11.5, bold:true, color:UP});
  bullets(s, M+0.24, 4.82, hw-0.48, 1.95, [
    "セラムイン シャンプー 300ml：¥4.3k→¥21.5k（+400%）。PV34でCVR14.71%と全SKU中最高。単品需要の掘り起こしに成功。",
    "ヘアミルクセラム：¥55.4k→¥58.7k（+5.9%）。全体が2割減のなかで唯一の増収を確保し、アウトバス需要の受け皿に。",
    "→ いずれも低PV・高CVR。露出を増やせば伸びしろが大きい2商品。"
  ], 9.5);
  card(s, M+hw+0.3, 4.35, hw, 2.50, W);
  s.addText("▼ 減少した商品", {x:M+hw+0.54, y:4.46, w:hw-0.48, h:0.3, isTextBox:true, margin:0,
    fontFace:F, fontSize:11.5, bold:true, color:DOWN});
  bullets(s, M+hw+0.54, 4.82, hw-0.48, 1.95, [
    "ウォータートリートメント：-25.1%（-¥93k）。PVが1,038→733（-29.4%）と流入減が直撃。CVRは8.96%→9.41%と改善。",
    "セラムイン オイル：-63.6%が最大の下落率。PV135→67と半減し、アウトバス需要がヘアミルクへ移動した可能性。",
    "対策：主力2品は流入回復が最優先。オイルはヘアミルクとの使い分け（質感・仕上がり別）訴求で再定義する。"
  ], 9.5);
  footer(s);
}

/* ---------------- 13 & 14. product detail ---------------- */
function productSlide(cfg){
  const s = pres.addSlide();
  head(s, cfg.title, cfg.right);
  const cw=(CW-3*0.16)/4;
  cfg.stats.forEach((c,i)=> stat(s, M+i*(cw+0.16), 1.15, cw, 1.25, c[0], c[1], c[2], c[3]));
  // channel table
  s.addText("■ チャネル別PV（8月）", {x:M, y:2.55, w:6, h:0.3, isTextBox:true, margin:0,
    fontFace:F, fontSize:11.5, bold:true, color:AMBER});
  const rows=[hrow(cfg.chan.map(c=>c[0])), cfg.chan.map(c=>c[1])];
  tbl(s, rows, {x:M, y:2.90, w:CW, rowH:0.33, fontSize:9.5});
  const hw=(CW-0.3)/2;
  card(s, M, 3.75, hw, 3.10, W);
  s.addText("■ 商品特性・分析", {x:M+0.24, y:3.86, w:hw-0.48, h:0.3, isTextBox:true, margin:0,
    fontFace:F, fontSize:11.5, bold:true, color:AMBER});
  s.addText(cfg.overview, {x:M+0.24, y:4.20, w:hw-0.48, h:0.66, isTextBox:true, margin:0,
    fontFace:F, fontSize:9.5, color:MUTED, valign:"top", lineSpacingMultiple:1.18});
  bullets(s, M+0.24, 4.92, hw-0.48, 1.85, cfg.analysis, 9.5);
  card(s, M+hw+0.3, 3.75, hw, 3.10, W);
  s.addText("■ 次回メガ割に向けた打ち手", {x:M+hw+0.54, y:3.86, w:hw-0.48, h:0.3, isTextBox:true, margin:0,
    fontFace:F, fontSize:11.5, bold:true, color:AMBER});
  let cy=4.24;
  cfg.actions.forEach((a,i)=>{
    s.addShape(pres.ShapeType.ellipse,{x:M+hw+0.54, y:cy+0.03, w:0.26, h:0.26, fill:{color:AMBER}, line:{width:0}});
    s.addText(String(i+1),{x:M+hw+0.54, y:cy+0.03, w:0.26, h:0.26, isTextBox:true, margin:0,
      align:"center", valign:"middle", fontFace:F, fontSize:8.5, bold:true, color:W});
    s.addText([{text:a[0]+"\n", options:{bold:true, color:INK, fontSize:9.8}},
               {text:a[1], options:{color:MUTED, fontSize:9}}],
      {x:M+hw+0.90, y:cy-0.02, w:hw-0.84, h:0.62, isTextBox:true, margin:0,
       fontFace:F, valign:"top", lineSpacingMultiple:1.15});
    cy += 0.64;
  });
  footer(s);
}

productSlide({
  title:"★ セラムイン ウォータートリートメント ─ 詳細分析",
  right:"商品番号 1175373902 / 200ml",
  stats:[
    ["8月売上","¥278,124","全体の46.0% / No.1",UP],
    ["販売件数","69件","7月93件比 -25.8%",DOWN],
    ["1個単価","¥4,031","主力ボリューム価格帯",INK],
    ["PV / CVR","733 / 9.41%","7月 8.96% から改善",INK]
  ],
  chan:[["お気に入り","286"],["ダイレクト","71"],["検索結果","64"],["└ ランクUP","34"],
        ["└ KW Plus","21"],["Myページ","59"],["カート","40"],["ショップ","36"],
        ["ホーム","30"],["外部サイト","28"],["合計","733"]],
  overview:"【商品概要】洗い流さないウォータータイプのトリートメント。うねり・くせ・広がりのケアを訴求する、売上構成比46%の最主力商品。",
  analysis:[
    "PVが1,038→733（-29.4%）と大きく減少し、売上-25.1%の直接要因に。件数も93→69件へ。",
    "★ 一方でCVRは8.96%→9.41%へ改善。流入は減ったが、来訪者あたりの購買力はむしろ上がっている。",
    "★ お気に入り286PV（全PVの39.0%）が最大流入。リピーター増加と整合し、ファン層に支えられた商品。",
    "▼ 検索は64PVのみ（全体の8.7%）。うち広告55PV・自然検索9PVで、新規流入の入口として機能していない。"
  ],
  actions:[
    ["検索面の回復（最優先）","「ウォータートリートメント」KWが6→14件と伸長中。商品タイトル先頭に配置し、Keyword Plusの入札も同KWへ集中。"],
    ["悩み系KWの獲得","「くせ毛 シャンプー」が新規発生。「うねり」「広がり」「梅雨 髪」など悩みKWを属性タグ・タイトルへ追加。"],
    ["お気に入り層への先出し告知","286PVの基盤へメガ割開始前にクーポンを配布し、初日集中をさらに強化。"],
    ["まとめ買い導線の設置","¥4,031の消耗品でリピート率が高い。2本・3本セットを新設し、客単価と再購入間隔を同時に改善。"]
  ]
});

productSlide({
  title:"★ シャンプー＆トリートメント セット ─ 詳細分析",
  right:"商品番号 1155729990 / 各300ml",
  stats:[
    ["8月売上","¥181,776","全体の30.1% / No.2",UP],
    ["販売件数","24件","7月28件比 -14.3%",DOWN],
    ["1個単価","¥7,574","全SKU中 最高単価",INK],
    ["PV / CVR","255 / 9.41%","7月 9.36% から微増",INK]
  ],
  chan:[["お気に入り","62"],["ダイレクト","44"],["外部サイト","25"],["└ Google","24"],
        ["検索結果","23"],["ショップ","21"],["カート","20"],["商品カタログ","16"],
        ["商品詳細","15"],["その他","29"],["合計","255"]],
  overview:"【商品概要】シャンプーとトリートメントのライン使いセット。単価¥7,574は全SKU中最高で、件数の少なさを単価で補う収益貢献型の商品。",
  analysis:[
    "売上-14.3%と、主力（-25.1%）や全体（-20.4%）より減少幅が小さく、相対的に堅調。",
    "★ CVR 9.41%（7月9.36%）を維持。高単価にもかかわらず転換率は主力商品と同水準で、セット訴求が機能している。",
    "★ 外部サイト25PVのうちGoogle24PVが占め、外部検索が新規接点として効いている数少ない商品。",
    "単品のセラムイン シャンプー（+400%）・トリートメント（-50%）と合わせ、ライン商品全体では単品需要が伸びセット需要が縮む傾向。"
  ],
  actions:[
    ["セット vs 単品の整理","単品シャンプーが+400%と伸長。セットの価格メリット（実質割引率）をページ上部に明示し、単品からの引き上げを図る。"],
    ["Google流入の受け皿強化","外部検索が効いている唯一の商品。「シャンプー トリートメント セット」等のSEO記事から本商品へ送客する導線を追加。"],
    ["ライン使いの効果訴求","使用前後の質感比較・使用イメージを商品ページ上部に配置し、高単価の納得感を補強。"],
    ["定期購入・リピート設計","¥7,574の消耗品セット。使い切りサイクル（約1.5〜2か月）に合わせたリマインド配信で再購入を促進。"]
  ]
});

/* ---------------- 15. KW分析 ---------------- */
{
  const s = pres.addSlide();
  head(s, "検索キーワード分析 ─ 7月vs8月比較", "検索流入 154PV → 115PV（-25.3%）");
  const rows=[hrow(["検索ワード","7月","8月","増減","タイプ","評価"])];
  D.kw.forEach(r=> rows.push([{text:r[0], options:{align:"left"}}, r[1], r[2], r[3], r[4], ev(r[5], r[6])]));
  tbl(s, rows, {x:M, y:1.15, w:7.75, colW:[3.90,0.48,0.48,0.55,1.30,1.04], rowH:0.268, fontSize:9});
  const ix=M+8.05, iw=CW-8.05;
  [["▼ ブランド指名 -38.6%","「ヘアセオリーラボ」57→35件。認知系流入の縮小が新規-52%に直結している。",DOWN],
   ["★ カテゴリKWが伸長","「ウォータートリートメント」6→14件（+133%）。商品カテゴリでの探され方が定着してきた。",UP],
   ["★ 英字表記が急増","「hairtheorylab」1→8件。表記ゆれでの流入。英字・スペースなし表記もタグへ登録すべき。",UP],
   ["★ 悩み・効能KWが新規発生","「くせ毛 シャンプー」「シャンプー 艶 コシ」「ハリコシ髪」が新規出現。購買意欲の高い層。",UP]
  ].forEach((c,i)=>{
    const y=1.15+i*1.13;
    card(s, ix, y, iw, 1.01, W);
    s.addText(c[0], {x:ix+0.2, y:y+0.11, w:iw-0.4, h:0.3, isTextBox:true, margin:0,
      fontFace:F, fontSize:11, bold:true, color:c[2], valign:"middle"});
    s.addText(c[1], {x:ix+0.2, y:y+0.43, w:iw-0.4, h:0.5, isTextBox:true, margin:0,
      fontFace:F, fontSize:9, color:MUTED, valign:"top", lineSpacingMultiple:1.15});
  });
  card(s, M, 5.72, CW, 1.14, W);
  s.addText("■ KW施策まとめ（次回メガ割に向けて）", {x:M+0.28, y:5.80, w:6, h:0.28, isTextBox:true, margin:0,
    fontFace:F, fontSize:10.5, bold:true, color:AMBER, valign:"middle"});
  bullets(s, M+0.28, 6.10, CW-0.56, 0.68, [
    "ブランド指名の減少をカテゴリKWで補う局面。伸びている「ウォータートリートメント」「ヘアミルク」を商品タイトル先頭・属性タグへ配置し、指名以外の入口を広げる。",
    "表記ゆれ（hairtheorylab／hair theory lab／hair-theory-lab）と悩みKW（くせ毛・うねり・ハリコシ・艶）をタグに追加。Keyword Plusは減った予算を主力2商品のカテゴリKWへ集中させる。"
  ], 9.5);
  footer(s);
}

/* ---------------- 16. 改善アクション ---------------- */
{
  const s = pres.addSlide();
  head(s, "次回メガ割に向けた改善アクション ─ 4軸", "8月メガポ実績にもとづく優先施策");
  const qs=[
    ["① 流入チャネル改善",[
      "Keyword Plus：削減された広告流入（-23.3%）を主力2商品へ再配分",
      "パワーランクアップ -28.8% の回復：上位表示枠の出稿を再開",
      "外部Google +8.0% を伸ばす：唯一伸びたチャネルへコンテンツSEOを追加",
      "商品詳細ページ -52.7% の回復：関連商品レコメンド枠を全SKUに設置",
      "カート流入 -58.7% の回収：カゴ落ちリマインドの配信設計を再構築"]],
    ["② KW・検索対策",[
      "伸長KW「ウォータートリートメント」を商品タイトル先頭へ",
      "表記ゆれ登録：hairtheorylab / hair theory lab / hair-theory-lab",
      "悩みKW新設：「くせ毛」「うねり」「広がり」「ハリコシ」「艶」",
      "「ヘアミルク」「セラムシャンプー」などカテゴリ語を属性タグへ",
      "ブランド指名KWの回復：SNS・外部記事での露出を再強化"]],
    ["③ 商品別 優先順位",[
      "ウォータートリートメント：PV 733→1,000へ回復が最重要（売上46%）",
      "シャンプー＆トリートメントセット：Google流入の受け皿を強化",
      "セラムイン シャンプー：+400%・CVR14.7%。露出拡大で伸びしろ大",
      "ヘアミルクセラム：唯一の増収商品。アウトバスの主役へ育成",
      "セラムイン オイル（-63.6%）：ヘアミルクとの使い分け訴求で再定義"]],
    ["④ メガ割本番施策",[
      "リピーター70名・フォロワー2,070名へ直前クーポンを先出し配布",
      "残カート100件へのリマインド・クーポン投下で確実に回収",
      "新規獲得の回復：メガ割専用LPとレビュー特典で初回購入を後押し",
      "初日集中の是正：中盤（3〜5日目）にタイムセール・追加クーポンを投下",
      "まとめ買い／セット販売で客単価¥4,999をさらに引き上げ"]]
  ];
  qs.forEach((q,i)=>{
    const qw = (CW-0.3)/2;
    const qx = M + (i%2)*(qw+0.3), y = 1.30 + Math.floor(i/2)*2.78;
    card(s, qx, y, qw, 2.62, W);
    s.addText(q[0], {x:qx+0.24, y:y+0.10, w:qw-0.48, h:0.34, isTextBox:true, margin:0,
      fontFace:F, fontSize:12, bold:true, color:AMBER, valign:"middle"});
    numList(s, qx+0.24, y+0.50, qw-0.48, q[1]);
  });
  footer(s);
}

/* ---------------- 17. Next Step ---------------- */
{
  const s = pres.addSlide();
  s.background = {color:INK};
  s.addText("Next Step・総括 ─ 2026年8月メガポ", {x:M, y:0.28, w:9.4, h:0.6, isTextBox:true, margin:0,
    fontFace:F, fontSize:24, bold:true, color:W, valign:"middle"});
  s.addImage({path:LOGO_WHITE, x:SW-0.42-1.30, y:0.20, w:1.30, h:0.90});
  s.addShape(pres.ShapeType.line, {x:0.33, y:0.98, w:SW-0.66, h:0, line:{color:"5B6182", width:0.75}});
  s.addText("【8月メガポ 実績総括】", {x:M, y:1.10, w:6, h:0.30, isTextBox:true, margin:0,
    fontFace:F, fontSize:11.5, bold:true, color:"C9CEDC", valign:"middle"});
  const cw=(CW-3*0.16)/4;
  [["売上","¥604,819","7月比 -20.4%"],["件数","121件","7月比 -33件"],
   ["顧客数","113名","リピート 61.9%"],["CVR","11.01%","→ -0.22pt"]].forEach((c,i)=>{
    const x=M+i*(cw+0.16);
    s.addShape(pres.ShapeType.roundRect,{x, y:1.45, w:cw, h:1.05, fill:{color:INK2}, line:{width:0}, rectRadius:0.07});
    s.addText(c[0], {x:x+0.2, y:1.53, w:cw-0.4, h:0.26, isTextBox:true, margin:0,
      fontFace:F, fontSize:9.5, color:"A6AEC4", valign:"middle"});
    s.addText(c[1], {x:x+0.2, y:1.79, w:cw-0.4, h:0.44, isTextBox:true, margin:0,
      fontFace:F, fontSize:20, bold:true, color:W, valign:"middle"});
    s.addText(c[2], {x:x+0.2, y:2.22, w:cw-0.4, h:0.24, isTextBox:true, margin:0,
      fontFace:F, fontSize:9, color:"A6AEC4", valign:"middle"});
  });
  s.addText("■ 次回メガ割に向けた優先3課題", {x:M, y:2.68, w:8, h:0.32, isTextBox:true, margin:0,
    fontFace:F, fontSize:12.5, bold:true, color:"C9CEDC", valign:"middle"});
  [["【最優先①】 新規流入の回復 ─ 検索・広告面の立て直し",
    "新規90→43名（-52.2%）が売上減の最大要因。検索流入-25.3%・ブランド指名KW-38.6%と連動しており、広告の再配分とカテゴリKW・悩みKWの拡張で7月水準へ戻す。",
    "目標: 新規 ≧ 90名 ／ 検索 ≧ 155PV"],
   ["【最優先②】 主力2商品のPV回復 ─ 売上の76%を占める集中構造",
    "ウォータートリートメント（PV -29.4%）とセット品が揃って減少。CVRは維持できているため、露出さえ戻せば売上は連動して回復する見込み。",
    "目標: 主力2商品PV ≧ 1,300"],
   ["【優先③】 回遊導線の再構築と残カート回収",
    "カート流入-58.7%・商品詳細-52.7%とサイト内回遊が半減。レコメンド枠設置とカゴ落ちリマインドで残カート100件を回収し、CVR11%台を維持したまま件数を積む。",
    "目標: 注文 ≧ 150件 ／ CVR ≧ 11.0%"]
  ].forEach((p,i)=>{
    const y=3.10+i*1.28;
    s.addShape(pres.ShapeType.roundRect,{x:M, y, w:CW, h:1.16, fill:{color:INK2}, line:{width:0}, rectRadius:0.07});
    s.addText(p[0], {x:M+0.28, y:y+0.09, w:CW-4.0, h:0.3, isTextBox:true, margin:0,
      fontFace:F, fontSize:11.5, bold:true, color:W, valign:"middle"});
    s.addText(p[1], {x:M+0.28, y:y+0.42, w:CW-4.0, h:0.64, isTextBox:true, margin:0,
      fontFace:F, fontSize:9.5, color:"C2C8D8", valign:"top", lineSpacingMultiple:1.18});
    s.addShape(pres.ShapeType.roundRect,{x:SW-M-3.45, y:y+0.30, w:3.17, h:0.56, fill:{color:UP}, line:{width:0}, rectRadius:0.06});
    s.addText(p[2], {x:SW-M-3.45, y:y+0.30, w:3.17, h:0.56, isTextBox:true, margin:0,
      align:"center", valign:"middle", fontFace:F, fontSize:10, bold:true, color:W});
  });
  footer(s, true);
}

pres.writeFile({fileName:"HTL_Qoo10_2026年8月メガポ_レポート.pptx"}).then(f=>console.log("WROTE",f));
