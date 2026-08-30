const pptxgen = require("pptxgenjs");
const D = require("./data_htl.js");
const A = require("./data_ad_htl.js");

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
const TOTAL = 13;

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

/* ---------------- AD-1. 広告パフォーマンス ---------------- */
{
  const s = pres.addSlide();
  head(s, "広告パフォーマンス ─ AD アナリティクス（8/1〜9）", "出典：Qoo10 広告レポート");
  const cw=(CW-4*0.16)/5;
  [["広告費","7,100","Qcash / 9日間合計",INK],
   ["広告売上","¥38,366","メガポ期間合計",INK],
   ["ROAS","540%","広告費の約5倍を回収",UP],
   ["広告経由 購入","7件","広告CVR 7.69%",INK],
   ["全体売上への寄与","6.3%","¥604,819中 ¥38,366",INK]
  ].forEach((c,i)=> stat(s, M+i*(cw+0.16), 1.15, cw, 1.30, c[0], c[1], c[2], c[3]));
  const rows=[hrow(["日付","広告費","広告売上","ROAS","クリック","購入"])];
  A.daily.forEach((r,i)=>{
    const base=[r[0], r[1], r[2], r[3], r[4], r[6]];
    rows.push(i===A.daily.length-1 ? totalRow(base) : base);
  });
  tbl(s, rows, {x:M, y:2.60, w:6.55, colW:[1.05,1.05,1.30,1.10,1.00,1.05], rowH:0.30});
  const ix=M+6.85, iw=CW-6.85;
  s.addText("■ 広告メニュー別", {x:ix, y:2.60, w:iw, h:0.26, isTextBox:true, margin:0,
    fontFace:F, fontSize:10.5, bold:true, color:AMBER, valign:"middle"});
  const mr=[hrow(["メニュー","広告費","広告売上","ROAS","CTR"])];
  A.menu.forEach((r,i)=>{
    const base=[{text:r[0], options:{align:"left"}}, r[1], r[2], r[3], r[6]];
    mr.push(i===A.menu.length-1 ? base.map(c=>{
      const o=typeof c==="string"?{text:c}:c;
      return {text:o.text, options:{...(o.options||{}), bold:true, color:INK, fill:{color:AMBER_SOFT}}};
    }) : base);
  });
  tbl(s, mr, {x:ix, y:2.92, w:iw, colW:[1.70,0.82,1.06,0.80,0.90], rowH:0.32, fontSize:9});
  card(s, M, 6.05, CW, 0.81, W);
  bullets(s, M+0.28, 6.15, CW-0.56, 0.62, [
    "★ パワーランクアップは費用1,400（19.7%）で広告売上の89.8%（¥34,455）を創出。ROAS 2,461%・CVR 10.34%と、露出量に対する費用効率が非常に高い。",
    "キーワードプラスは費用5,700（80.3%）でROAS 69%。CTR 4.71%と関心は取れているため、出稿商品と入札の見直しで改善余地がある。"
  ], 9);
  footer(s);
  s.addNotes("広告費7,100に対し広告売上38,366、ROAS540%。メニュー間で効率差が大きい点が論点。");
}

/* ---------------- AD-2. 商品別 広告パフォーマンス ---------------- */
{
  const s = pres.addSlide();
  head(s, "商品別 広告パフォーマンス ─ 予算配分の検証", "8/1〜9 / 広告出稿 全3商品");
  const rows=[hrow(["商品名","広告費","広告売上","ROAS","インプ","クリック","CTR","カート","購入","CVR"])];
  A.prod.forEach(r=>{
    const base=[{text:r[0], options:{align:"left"}}, r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], r[9]];
    if(r[10]==="total") rows.push(base.map(c=>{
      const o=typeof c==="string"?{text:c}:c;
      return {text:o.text, options:{...(o.options||{}), bold:true, color:INK, fill:{color:AMBER_SOFT}}};
    }));
    else rows.push(base.map((c,j)=> j===3
      ? {text:r[3], options:{bold:true, color: r[10]==="up"?UP:r[10]==="down"?DOWN:INK2}} : c));
  });
  tbl(s, rows, {x:M, y:1.15, w:CW, colW:[3.30,1.05,1.25,1.05,1.05,1.00,0.90,0.85,0.85,0.833], rowH:0.44});
  s.addText("■ 商品 × 広告メニュー別", {x:M, y:3.30, w:5, h:0.26, isTextBox:true, margin:0,
    fontFace:F, fontSize:10.5, bold:true, color:AMBER, valign:"middle"});
  const pm=[hrow(["商品","メニュー","広告費","広告売上","ROAS","CTR"])];
  A.prodMenu.forEach(r=> pm.push([{text:r[0], options:{align:"left"}}, r[1], r[2], r[3],
    {text:r[4], options:{bold:true, color: (parseFloat(r[4].replace(/[,%]/g,''))>=1000)?UP:INK2}}, r[5]]));
  tbl(s, pm, {x:M, y:3.62, w:6.55, colW:[2.00,1.45,0.72,0.93,0.80,0.65], rowH:0.32, fontSize:9});
  const ix=M+6.85, iw=CW-6.85;
  card(s, ix, 3.62, iw, 1.92, W);
  s.addText("■ メニュー間で効率差が大きい", {x:ix+0.24, y:3.72, w:iw-0.48, h:0.28, isTextBox:true, margin:0,
    fontFace:F, fontSize:11, bold:true, color:AMBER, valign:"middle"});
  bullets(s, ix+0.24, 4.04, iw-0.48, 1.40, [
    "シャンプー＆トリートメント セットはパワーランクアップでROAS 3,246%・CVR 20.00%と突出。",
    "ウォータートリートメントも同メニューでROAS 1,676%。一方キーワードプラスは費用3,900でROAS 100%。",
    "ヘアミルクセラムはCTR 7.69%と関心は高いが購入ゼロ。商品ページ側の見直しが必要。"
  ], 8.5);
  card(s, ix, 5.62, iw, 1.24, W);
  s.addText("■ 次回メガ割に向けた打ち手", {x:ix+0.24, y:5.70, w:iw-0.48, h:0.26, isTextBox:true, margin:0,
    fontFace:F, fontSize:11, bold:true, color:AMBER, valign:"middle"});
  ["キーワードプラスの費用を縮小しパワーランクアップへ振替",
   "出稿はTOP2商品（セット・ウォータートリートメント）へ集中"
  ].forEach((t,i)=>{
    const y=6.02+i*0.38;
    s.addShape(pres.ShapeType.ellipse,{x:ix+0.24, y:y+0.02, w:0.235, h:0.235, fill:{color:AMBER}, line:{width:0}});
    s.addText(String(i+1),{x:ix+0.24, y:y+0.02, w:0.235, h:0.235, isTextBox:true, margin:0,
      align:"center", valign:"middle", fontFace:F, fontSize:8, bold:true, color:W});
    s.addText(t,{x:ix+0.57, y:y-0.01, w:iw-0.81, h:0.32, isTextBox:true, margin:0,
      fontFace:F, fontSize:9.5, color:INK2, valign:"top", lineSpacingMultiple:1.12});
  });
  footer(s);
}

/* ---------------- 最終. 次回メガ割に向けた改善アクション（優先3施策） ---------------- */
{
  const s = pres.addSlide();
  head(s, "次回メガ割に向けた改善アクション ─ 優先3施策", "8月メガポ実績＋商品企画にもとづく");
  const cw=(CW-2*0.30)/3;
  const acts=[
    ["ウォータートリートメントを軸にしたセット商品の造成",
     "ウォータートリートメント単品が売上の46.0%（¥278,124）を占める最主力。リピート比率も61.9%とファン基盤が厚く、客単価向上の余地が大きい（現状¥4,999）。",
     ["「ウォータートリートメント＋シャンプー or トリートメント」のセットページを新設（商品企画ご提案②）",
      "「ウォータートリートメント2個セット」を20%OFF・Qoo10専用商品として作成（ご提案①）",
      "GWPをメガ割期間限定で付与し、セットへの購買意欲を高める"],
     "目標： 客単価 ≧ ¥5,500"],
    ["広告予算をROASの高いメニューへ再配分",
     "パワーランクアップは費用1,400（19.7%）で広告売上の89.8%・ROAS 2,461%。一方キーワードプラスは費用5,700（80.3%）でROAS 69%。広告全体ではROAS 540%・広告売上¥38,366。",
     ["キーワードプラスの費用を縮小し、パワーランクアップへ振替",
      "ウォータートリートメントのキーワードプラス（費用3,900・ROAS 100%）を優先的に見直す",
      "出稿はTOP2商品（セット・ウォータートリートメント）へ集中させる"],
     "目標： 広告ROAS ≧ 900%"],
    ["メガ割向けクリエイティブと回遊動線の整備",
     "商品詳細ページは91→43PV（-52.7%）、カートは189→78PV（-58.7%）と回遊系が半減。商品企画でも単品ページからセットページへの回遊動線設置が前提となっている。",
     ["セール用の割引率・セール価格を入れたメガ割用サムネイル／バナーを全SKU分制作",
      "単品ページからセット商品ページへの回遊バナーを設置し、相互送客を行う",
      "ショップページにメガ割特集枠を常設し、期間中のトップバナーを差し替え"],
     "目標： 商品詳細ページ ≧ 90PV ／ CVR ≧ 11.2%"]
  ];
  acts.forEach((a,i)=>{
    const x = M + i*(cw+0.30), y = 1.25;
    card(s, x, y, cw, 5.35, W);
    s.addShape(pres.ShapeType.ellipse,{x:x+0.26, y:y+0.16, w:0.36, h:0.36, fill:{color:AMBER}, line:{width:0}});
    s.addText(String(i+1), {x:x+0.26, y:y+0.16, w:0.36, h:0.36, isTextBox:true, margin:0,
      align:"center", valign:"middle", fontFace:F, fontSize:11, bold:true, color:W});
    s.addText(a[0], {x:x+0.72, y:y+0.12, w:cw-0.98, h:0.64, isTextBox:true, margin:0,
      fontFace:F, fontSize:11.5, bold:true, color:INK, valign:"middle", lineSpacingMultiple:1.12});
    s.addText("根 拠", {x:x+0.26, y:y+0.88, w:1.2, h:0.22, isTextBox:true, margin:0,
      fontFace:F, fontSize:8.5, bold:true, color:MUTED, valign:"middle"});
    s.addText(a[1], {x:x+0.26, y:y+1.10, w:cw-0.52, h:1.18, isTextBox:true, margin:0,
      fontFace:F, fontSize:9, color:INK2, valign:"top", lineSpacingMultiple:1.20});
    s.addText("打ち手", {x:x+0.26, y:y+2.32, w:1.2, h:0.22, isTextBox:true, margin:0,
      fontFace:F, fontSize:8.5, bold:true, color:MUTED, valign:"middle"});
    let cy=y+2.56;
    a[2].forEach(t=>{
      s.addShape(pres.ShapeType.ellipse,{x:x+0.28, y:cy+0.075, w:0.075, h:0.075, fill:{color:AMBER}, line:{width:0}});
      s.addText(t, {x:x+0.46, y:cy-0.02, w:cw-0.72, h:0.66, isTextBox:true, margin:0,
        fontFace:F, fontSize:9, color:INK2, valign:"top", lineSpacingMultiple:1.20});
      cy += 0.66;
    });
    s.addShape(pres.ShapeType.roundRect,{x:x+0.26, y:y+4.66, w:cw-0.52, h:0.52,
      fill:{color:UP}, line:{width:0}, rectRadius:0.05});
    s.addText(a[3], {x:x+0.30, y:y+4.66, w:cw-0.60, h:0.52, isTextBox:true, margin:0,
      align:"center", valign:"middle", fontFace:F, fontSize:9.5, bold:true, color:W, lineSpacingMultiple:1.10});
  });
  footer(s);
  s.addNotes("①は商品企画（HTL メガ割向けセット商品）ご提案①②より。希望順は②セット＞①2個セット。");
}

pres.writeFile({fileName:"HTL_Qoo10_2026年8月メガポ_レポート.pptx"}).then(f=>console.log("WROTE",f));
