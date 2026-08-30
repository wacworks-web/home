const pptxgen = require("pptxgenjs");
const D = require("./data.js");
const A = require("./data_ad.js");

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
pres.title = "dr365_Qoo10_2026年8月メガポ_レポート";

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
  s.addText("dr365様  Qoo10 メガポ 振り返りレポート", {x:7.38, y:2.62, w:5.55, h:0.62,
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
  s.addNotes("dr365様 Qoo10 2026年8月メガポ（8/1〜8/9）の振り返り。比較対象は7月メガポ（7/1〜7/9）。");
}

/* ---------------- 3. Executive summary ---------------- */
{
  const s = pres.addSlide();
  head(s, "エグゼクティブサマリー ─ 2026年8月メガポ（8/1〜9）", "比較：2026年7月メガポ（7/1〜9）");
  const cw=(CW-4*0.16)/5;
  const cards=[
    ["売上金額","¥447,380","9日間合計（7月比 +5.8%）",INK],
    ["売上件数","128件","平均14.2件/日（+5.8%）",INK],
    ["訪問者数","1,265","平均141人/日（+11.1%）",INK],
    ["平均客単価","¥3,495","前月比ほぼ横ばい（+¥1）",INK],
    ["購入顧客数","125名","新規75.2%（+6.9pt）",UP]
  ];
  cards.forEach((c,i)=> stat(s, M+i*(cw+0.16), 1.15, cw, 1.35, c[0], c[1], c[2], c[3]));
  card(s, M, 2.72, CW, 3.50, W);
  s.addText("■ 総評", {x:M+0.28, y:2.85, w:4, h:0.32, isTextBox:true, margin:0,
    fontFace:F, fontSize:12.5, bold:true, color:AMBER});
  bullets(s, M+0.28, 3.25, CW-0.56, 2.90, [
    "8月メガポ期間（8/1〜9）売上¥447,380を達成。7月同期間（¥422,818）比で +5.8%、+¥24,562の成長。前年同月（¥234,300）比では +91.0% と大幅な伸長。",
    "V.C. UVデイエッセンスNが売上1位（¥142,120 / 40件）。7月比 +¥60,401（+74%）の躍進で、単月で全体の31.8%を占める最大の牽引役に。",
    "V.C. プレエッセンスNが2位（¥100,040 / 20件）。客単価¥5,002の高単価商品が7月比 +5% と安定推移し、収益面を下支え。",
    "★ TOP2で売上の54.1%。前月までの「A.Z.セラムショット主導」から、V.C.ライン主導の売上構造へ明確に転換した。",
    "新規顧客94名・新規比率75.2%（7月68.3%から +6.9pt）。フォロワーは1,124名（9日間で +20名）と過去最高を更新。",
    "▼ 一方でリピーターは38名→31名（-18.4%）、「アゼライン酸」KWは101→77件（-24%）と減少。次回メガ割に向けた最重要課題。"
  ], 11);
  footer(s);
  s.addNotes("売上・集客とも前月比プラス。新規獲得は好調だがリピート育成と成分KWの回復が課題。");
}

/* ---------------- 4. KPI比較 ---------------- */
{
  const s = pres.addSlide();
  head(s, "★ 7月vs8月 KPI比較サマリー（メガポ同日比較）", "8/1〜8/9  vs  7/1〜7/9");
  const cw=(CW-4*0.16)/5;
  const chips=[
    ["売上金額","7月  ¥422,818","8月  ¥447,380","▲ +5.8%","up"],
    ["売上件数","7月  121件","8月  128件","▲ +5.8%","up"],
    ["訪問者数","7月  1,139","8月  1,265","▲ +11.1%","up"],
    ["CVR","7月  10.62%","8月  10.12%","▼ -0.51pt","down"],
    ["客単価","7月  ¥3,494","8月  ¥3,495","→ 横ばい","flat"]
  ];
  chips.forEach((c,i)=> chip(s, M+i*(cw+0.16), 1.15, cw, 1.20, c[0], c[1], c[2], c[3], c[4]));
  const rows=[hrow(["指標","7月メガポ（7/1-9）","8月メガポ（8/1-9）","差分","評価"])];
  D.kpi.forEach(r=> rows.push([r[0], r[1], r[2], r[3], ev(r[4], r[5])]));
  tbl(s, rows, {x:M, y:2.62, w:CW, colW:[3.0,2.55,2.55,2.0,2.03], rowH:0.375});
  s.addText("★ 集客（訪問者+11.1%・PV+14.8%）が売上（+5.8%）を上回って伸びており、上流の流入拡大に対し下流の転換が追いついていない状態。CVR 10.12% は Qoo10平均の2.5倍以上で水準は良好。",
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
    else rows.push(r.map((c,j)=> j===8&&c ? {text:c, options:{color:AMBER, bold:true}} : c));
  });
  tbl(s, rows, {x:M, y:1.15, w:CW, colW:[1.30,1.55,0.95,1.05,1.05,1.20,1.05,1.20,2.78], rowH:0.325});
  card(s, M, 4.98, CW, 1.88, W);
  s.addText("▲ ハイライト", {x:M+0.28, y:5.10, w:4, h:0.3, isTextBox:true, margin:0,
    fontFace:F, fontSize:12, bold:true, color:AMBER});
  bullets(s, M+0.28, 5.46, CW-0.56, 1.25, [
    "8/7（金）¥81,616・22件・CVR16.30% が期間最高。訪問135人に対し高効率で転換し、単日で期間売上の18.2%を占めた。",
    "前半（8/1〜3）¥168,600 と 後半（8/7〜9）¥194,858 の二山構造。中盤（8/4〜6）は¥83,922に落ち込み、ここの底上げが次回の最大の伸びしろ。"
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
    "顧客数+4.2%に対し新規+14.6%。今回の成長は新規獲得エンジンが主導しており、集客面は健全に機能している。",
    "一方リピーターは-18.4%。7月は6月メガ割直後の再購入が上乗せされていた反動と推察され、8月単体で見れば平常水準への回帰。",
    "新規比率75.2%は5月（76.8%）とほぼ同水準に回帰。7月の68.3%が例外値であり、構造的な悪化ではない。",
    "1人あたり売上は¥3,523→¥3,579（+1.6%）と微増。UVデイエッセンスNの複数個購入が客単価を下支えした。",
    "★ 次回メガ割の最大テーマは「8月に獲得した新規94名のリピート転換」。獲得した新規を離脱させない育成設計が急務。"
  ], 11);
  footer(s);
}

/* ---------------- 9. チャネル別流入 ---------------- */
{
  const s = pres.addSlide();
  head(s, "チャネル別流入分析（PV）─ 7月vs8月 TOP10比較", "合計PV 1,493 → 1,714（+14.8%）");
  const rows=[hrow(["チャネル","7月 PV","8月 PV","増減","8月構成比","評価"])];
  D.channels.forEach((r,i)=>{
    const base=[{text:r[0], options:{align:"left"}}, r[1], r[2], r[3], r[4], ev(r[5], r[6])];
    rows.push(i===D.channels.length-1 ? base.map(c=>{
      const o = typeof c==="string"?{text:c}:c;
      return {text:o.text, options:{...(o.options||{}), bold:true, color:INK, fill:{color:AMBER_SOFT}}};
    }) : base);
  });
  tbl(s, rows, {x:M, y:1.15, w:7.75, colW:[2.55,0.95,0.95,0.85,1.20,1.25], rowH:0.285});
  const ix=M+8.05, iw=CW-8.05;
  const hi=[
    ["★ ショップ流入 +45.5%","167→243PV。ショップページ経由の回遊が最大の伸び。",UP],
    ["★ お気に入り +22.0%","304→371PV。構成比21.6%でリピート基盤が着実に厚みを増す。",UP],
    ["★ 外部Google +65.6%","32→53PV。外部SEOが新規認知の入口として機能。",UP],
    ["▼ 商品詳細ページ -40.5%","42→25PV。商品間の相互回遊が弱化。レコメンド強化の余地。",DOWN]
  ];
  hi.forEach((c,i)=>{
    const y=1.15+i*1.14;
    card(s, ix, y, iw, 1.02, W);
    s.addText(c[0], {x:ix+0.2, y:y+0.12, w:iw-0.4, h:0.3, isTextBox:true, margin:0,
      fontFace:F, fontSize:11, bold:true, color:c[2], valign:"middle"});
    s.addText(c[1], {x:ix+0.2, y:y+0.44, w:iw-0.4, h:0.5, isTextBox:true, margin:0,
      fontFace:F, fontSize:9, color:MUTED, valign:"top", lineSpacingMultiple:1.15});
  });
  card(s, M, 5.78, CW, 1.08, W);
  bullets(s, M+0.28, 5.90, CW-0.56, 0.85, [
    "検索（27.3%）＋お気に入り（21.6%）＋ダイレクト（14.3%）＋ショップ（14.2%）の4本柱。指名・再訪型の流入が全体の50%超を占め、ブランド資産が着実に積み上がる構造。",
    "ただし検索は+4.2%と伸びが鈍化し、構成比は30.1%→27.3%へ低下。次回メガ割では広告入札とKW拡張で検索流入の再加速が必要。"
  ], 9.5);
  footer(s);
}

/* ---------------- 11. 商品別ランキング ---------------- */
{
  const s = pres.addSlide();
  head(s, "商品別売上ランキング ─ 2026年8月メガポ", "全12SKU / 売上¥447,380");
  const cw=(CW-3*0.16)/4;
  const cards=[
    ["1位 売上","¥142,120","V.C. UVデイエッセンス N（31.8%）",UP],
    ["2位 売上","¥100,040","V.C. プレエッセンス N（22.4%）",INK],
    ["TOP2合計シェア","54.1%","V.C.ライン主導の構造へ転換",INK],
    ["販売商品数","12SKU","TOP3で売上の68.4%",INK]
  ];
  cards.forEach((c,i)=> stat(s, M+i*(cw+0.16), 1.15, cw, 1.25, c[0], c[1], c[2], c[3]));
  const rows=[hrow(["順位","商品名","売上金額","件数","客単価","構成比"])];
  D.rank8.forEach((r,i)=>{
    const base=[r[0], {text:r[1], options:{align:"left"}}, r[2], r[3], r[4], r[5]];
    rows.push(i===D.rank8.length-1 ? base.map(c=>{
      const o = typeof c==="string"?{text:c}:c;
      return {text:o.text, options:{...(o.options||{}), bold:true, color:INK, fill:{color:AMBER_SOFT}}};
    }) : base);
  });
  tbl(s, rows, {x:M, y:2.58, w:CW, colW:[0.85,5.28,1.75,1.15,1.45,1.65], rowH:0.30});
  s.addText("★ TOP3で売上の68.4%。V.C. UVデイエッセンスN（季節需要）/ V.C. プレエッセンスN（高単価）/ A.Z. セラムショット（成分指名）の3軸構造。7月まで首位だったA.Z.が3位に後退し、V.C.ラインへ重心が移った。",
    {x:M, y:6.30, w:CW, h:0.56, isTextBox:true, margin:0, fontFace:F, fontSize:10.5, color:INK2, valign:"top", lineSpacingMultiple:1.2});
  footer(s);
}

/* ---------------- 12. 商品別比較 ---------------- */
{
  const s = pres.addSlide();
  head(s, "★ 7月vs8月 商品別売上比較", "メガポ同日比較");
  const rows=[hrow(["商品名","7月 売上","7月 件数","8月 売上","8月 件数","売上増減","評価"])];
  D.prodCmp.forEach(r=> rows.push([{text:r[0], options:{align:"left"}}, r[1], r[2], r[3], r[4], r[5], ev(r[6], r[7])]));
  tbl(s, rows, {x:M, y:1.15, w:CW, colW:[4.28,1.45,1.05,1.45,1.05,1.50,1.35], rowH:0.34});
  const hw=(CW-0.3)/2;
  card(s, M, 4.35, hw, 2.50, W);
  s.addText("★ 伸長した商品", {x:M+0.24, y:4.46, w:hw-0.48, h:0.3, isTextBox:true, margin:0,
    fontFace:F, fontSize:11.5, bold:true, color:UP});
  bullets(s, M+0.24, 4.82, hw-0.48, 1.95, [
    "UVデイエッセンスN：¥82k→¥142k（+74%）。盛夏の紫外線ピーク需要を完全に捕捉し、単月で全体の約1/3を占める。",
    "モイストフォーミングウォッシュ：¥40k→¥52k（+31%）。5月投入の新商品が定番化フェーズへ移行。",
    "プレエッセンスN：¥95k→¥100k（+5%）。¥5,002の高単価を維持しつつ着実に積み上げ。"
  ], 9.5);
  card(s, M+hw+0.3, 4.35, hw, 2.50, W);
  s.addText("▼ 減少した商品", {x:M+hw+0.54, y:4.46, w:hw-0.48, h:0.3, isTextBox:true, margin:0,
    fontFace:F, fontSize:11.5, bold:true, color:DOWN});
  bullets(s, M+hw+0.54, 4.82, hw-0.48, 1.95, [
    "A.Z.セラムショット：-10%。PV 381→359、「アゼライン酸」KWが101→77件へ減少したことが直接要因。",
    "ディープリペアクリーム：-50%、メルトスクラブウォッシュ：-27%。高単価クリーム・洗顔カテゴリの需要がUV／フォーミングへ移動。",
    "対策：UV需要が落ちる秋以降を見据え、A.Z.と保湿ラインの再強化を先行して着手する。"
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
  title:"★ V.C. UVデイエッセンス N ─ 詳細分析",
  right:"商品番号 1194113791 / 30g",
  stats:[
    ["8月売上","¥142,120","全体の31.8% / No.1",UP],
    ["販売件数","40件","7月23件比 +74%",UP],
    ["1個単価","¥3,553","中価格 × 季節需要",INK],
    ["PV / CVR","392 / 10.20%","全SKU中トップ効率",INK]
  ],
  chan:[["検索結果","92"],["└ KW Plus","43"],["└ ランクUP","43"],["└ 一般","6"],
        ["ダイレクト","76"],["お気に入り","66"],["ショップ","47"],["カート","31"],
        ["外部サイト","29"],["その他","51"],["合計","392"]],
  overview:"【商品概要】日焼け止め兼美容液。ビタミンC配合・ウォータープルーフ処方。SPF/PA と美容液を1本で兼ねる「時短スキンケア」訴求の主力商品。",
  analysis:[
    "7月23件→8月40件（+74%）。盛夏の紫外線需要ピークを捕捉し、単月で全体の31.8%を占める最大商品に。",
    "PV392でCVR 10.20%。流入量・転換率とも全SKU中トップで、投資効率が最も高い。",
    "▼ 検索92PVのうち広告（KW Plus 43 / パワーランクアップ 43）が86PVで94%。自然検索はわずか6PVで広告依存度が高い。",
    "関連KW：「日焼け止め」6件、「dr365 日焼け止め」3件、「dr365 uv」2件、「dr365 公式 日焼け止め」2件。"
  ],
  actions:[
    ["自然検索の獲得（最優先）","検索流入の94%が広告依存。商品タイトル先頭に「日焼け止め」「UV」「SPF」を配置し、一般検索6PV→30PV超へ。"],
    ["秋冬需要への転換設計","9月以降のUV需要減を見越し「年中使えるビタミンC美容液UV」への訴求切替を先行実施。"],
    ["セット販売（UV + プレエッセンスN）","TOP2の併売。朝のスキンケア完結セットとして¥8,500帯を新設し客単価を引き上げ。"],
    ["ダイレクト76PVの受け皿強化","指名再訪が多いため、商品ページ上部にリピート用まとめ買い（2個/3個）導線を設置。"]
  ]
});

productSlide({
  title:"★ V.C. プレエッセンス N ─ 詳細分析",
  right:"商品番号 1147122231 / 30ml",
  stats:[
    ["8月売上","¥100,040","全体の22.4% / No.2",UP],
    ["販売件数","20件","7月19件比 +5%",UP],
    ["1個単価","¥5,002","全SKU中 最高単価",INK],
    ["PV / CVR","249 / 8.03%","7月 9.79% から微減",INK]
  ],
  chan:[["検索結果","78"],["└ KW Plus","29"],["└ ランクUP","44"],["└ 一般","5"],
        ["お気に入り","47"],["ショップ","29"],["ダイレクト","29"],["カート","25"],
        ["外部サイト","8"],["その他","33"],["合計","249"]],
  overview:"【商品概要】導入美容液（ブースター）。洗顔後の一番手に使い、後続のスキンケアの浸透を高める設計。毛穴・肌あれ・透明感を訴求。",
  analysis:[
    "単価¥5,002は全SKU中最高。20件で¥100,040と、件数の少なさを単価でカバーする収益貢献型の商品。",
    "PVは194→249（+28%）と伸びた一方、CVRは9.79%→8.03%へ微減。比較検討層の流入が増えた影響と推察。",
    "検索78PVのうちパワーランクアップ44PVが最大。広告経由の露出が指名検索を押し上げる好循環。",
    "KW「dr365 v.c.プレエッセンス」11件（7月7件）、「dr365 v.c. プレエッセンス n」3件（新規）、「導入美容液」6件（7月4件）と指名・カテゴリとも拡大。"
  ],
  actions:[
    ["「導入美容液」KWの刈り取り","6件→20件へ。「先行美容液」「ブースター美容液」を商品タグ・タイトルへ追加し受け皿を拡張。"],
    ["使用順序コンテンツの整備","導入美容液は使い方訴求がCVRを左右。ページ上部に「洗顔→プレエッセンス→UV」の図解を配置。"],
    ["高単価ゆえのカゴ落ち対策","カート25PVに対し20件。2本セット／定期購入で1回あたりの負担を下げ、離脱を抑制。"],
    ["UVデイエッセンスとのバンドル","TOP2併売でCVR8%台を底上げ。朝ケア完結セットとして両商品ページから相互送客。"]
  ]
});

/* ---------------- AD-1. 広告パフォーマンス ---------------- */
{
  const s = pres.addSlide();
  head(s, "広告パフォーマンス ─ AD アナリティクス（8/1〜9）", "出典：Qoo10 広告レポート");
  const cw=(CW-4*0.16)/5;
  [["広告費","13,200","Qcash / 9日間合計",INK],
   ["広告売上","¥91,450","メガポ期間合計",INK],
   ["ROAS","693%","広告費の約7倍を回収",UP],
   ["広告経由 購入","24件","広告CVR 7.48%",INK],
   ["全体売上への寄与","20.4%","¥447,380中 ¥91,450",UP]
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
    "★ キーワードプラスは費用の78.8%で売上の72.2%を創出。CTR 8.32%・CVR 9.14%と主力メニューとして機能している。",
    "パワーランクアップは露出の89.4%（imp 19,904）を占めるがCTR 0.62%。低単価ゆえROAS 906%は高く、認知獲得の枠として維持しつつ商品を絞る運用が有効。"
  ], 9);
  footer(s);
  s.addNotes("広告費13,200に対し広告売上91,450、ROAS693%。予算配分と配信期間の平準化が次の論点。");
}

/* ---------------- AD-2. 商品別 広告パフォーマンス ---------------- */
{
  const s = pres.addSlide();
  head(s, "商品別 広告パフォーマンス ─ 予算配分の検証", "8/1〜9 / 広告出稿 全4商品");
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
  tbl(s, rows, {x:M, y:1.15, w:CW, colW:[3.30,1.05,1.25,1.05,1.05,1.00,0.90,0.85,0.85,0.833], rowH:0.40});
  s.addText("■ 商品 × 広告メニュー別", {x:M, y:3.72, w:5, h:0.26, isTextBox:true, margin:0,
    fontFace:F, fontSize:10.5, bold:true, color:AMBER, valign:"middle"});
  const pm=[hrow(["商品","メニュー","広告費","広告売上","ROAS","CTR"])];
  A.prodMenu.forEach(r=> pm.push([{text:r[0], options:{align:"left"}}, r[1], r[2], r[3],
    {text:r[4], options:{bold:true, color: parseFloat(r[4].replace(/[,%]/g,''))>=1000?UP:INK2}}, r[5]]));
  tbl(s, pm, {x:M, y:4.04, w:6.55, colW:[2.00,1.45,0.72,0.93,0.80,0.65], rowH:0.30, fontSize:9});
  const ix=M+6.85, iw=CW-6.85;
  card(s, ix, 4.87, iw, 1.26, W);
  s.addText("■ 次回メガ割に向けた打ち手", {x:ix+0.24, y:4.95, w:iw-0.48, h:0.26, isTextBox:true, margin:0,
    fontFace:F, fontSize:11, bold:true, color:AMBER, valign:"middle"});
  ["A.Z.の広告費を縮小",
   "縮小分をプレエッセンスN・UVデイエッセンスNへ振替"
  ].forEach((t,i)=>{
    const y=5.27+i*0.38;
    s.addShape(pres.ShapeType.ellipse,{x:ix+0.24, y:y+0.02, w:0.235, h:0.235, fill:{color:AMBER}, line:{width:0}});
    s.addText(String(i+1),{x:ix+0.24, y:y+0.02, w:0.235, h:0.235, isTextBox:true, margin:0,
      align:"center", valign:"middle", fontFace:F, fontSize:8, bold:true, color:W});
    s.addText(t,{x:ix+0.57, y:y-0.01, w:iw-0.81, h:0.32, isTextBox:true, margin:0,
      fontFace:F, fontSize:9.5, color:INK2, valign:"top", lineSpacingMultiple:1.12});
  });
  footer(s);
  s.addNotes("A.Z.に予算の6割を投下しROAS211%。ROAS2,000%帯のTOP2へ振り替えるのが最大の改善余地。");
}

/* ---------------- 最終. 次回メガ割に向けた改善アクション（優先4施策） ---------------- */
{
  const s = pres.addSlide();
  head(s, "次回メガ割に向けた改善アクション ─ 優先4施策", "8月メガポ実績＋商品企画にもとづく");
  const cw=(CW-0.30)/2;
  const acts=[
    ["V.C. プレエッセンス N のメガ割適用",
     "売上2位 ¥100,040（構成比22.4%）。客単価¥5,002は全SKU最高、広告ROASも2,501%で最高効率。にもかかわらずメガ割が適用できておらず、最大の伸びしろを取り逃している。",
     "GWP付与等で定価を¥6,000へ引き上げ、メガ割適用後¥5,200で販売（商品企画ご提案①）。セール期間のみ単品ページを差し替え、適用金額から20%OFFを実施する。",
     "目標： プレエッセンスN 売上 ≧ ¥150,000"],
    ["ビタミン美容液を軸としたセット商品の造成",
     "Qoo10のスキンケア上位店舗は「本品＋本品」「〇〇セット」＋GWPで30〜58%OFFを訴求。dr365もTOP2（UVデイエッセンス×プレエッセンス）の併売余地が大きい。",
     "「毛穴集中ケア フルラインセット」等をセール限定で造成し、GWPで価格を調整してメガ割適用（商品企画ご提案②）。TOP2の併売で客単価を引き上げる。",
     "目標： 客単価 ≧ ¥4,000"],
    ["広告予算をROASの高い商品へ再配分",
     "商品別ROASはプレエッセンスN 2,501%・UVデイエッセンスN 1,554%に対し、A.Z. セラムショットは211%。広告全体ではROAS 693%・広告売上¥91,450（全体売上の20.4%）。",
     "A.Z.の広告費を縮小し、縮小分をプレエッセンスN・UVデイエッセンスNへ振替。CTR 8.32%のキーワードプラスを主軸に、指名KW中心の運用へ寄せる。",
     "目標： 広告ROAS ≧ 900%"],
    ["新規94名のリピート転換と残カート回収",
     "新規比率75.2%（94名）と獲得は好調な一方、リピーターは31名（-18.4%）と減少。残カートは121件（カート249 − 注文128）が未回収のまま残っている。",
     "メガ割直前に8月新規94名へクーポンを配布。残カート121件へリマインドを配信し、お気に入り371PVの基盤へ開始前の先出し告知を行う。",
     "目標： リピーター ≧ 45名 ／ CVR ≧ 11.0%"]
  ];
  acts.forEach((a,i)=>{
    const x = M + (i%2)*(cw+0.30), y = 1.30 + Math.floor(i/2)*2.85;
    card(s, x, y, cw, 2.70, W);
    s.addShape(pres.ShapeType.ellipse,{x:x+0.26, y:y+0.15, w:0.36, h:0.36, fill:{color:AMBER}, line:{width:0}});
    s.addText(String(i+1), {x:x+0.26, y:y+0.15, w:0.36, h:0.36, isTextBox:true, margin:0,
      align:"center", valign:"middle", fontFace:F, fontSize:11, bold:true, color:W});
    s.addText(a[0], {x:x+0.72, y:y+0.13, w:cw-0.98, h:0.40, isTextBox:true, margin:0,
      fontFace:F, fontSize:12, bold:true, color:INK, valign:"middle"});
    s.addText("根 拠", {x:x+0.26, y:y+0.60, w:1.2, h:0.22, isTextBox:true, margin:0,
      fontFace:F, fontSize:8.5, bold:true, color:MUTED, valign:"middle"});
    s.addText(a[1], {x:x+0.26, y:y+0.82, w:cw-0.52, h:0.62, isTextBox:true, margin:0,
      fontFace:F, fontSize:9, color:INK2, valign:"top", lineSpacingMultiple:1.18});
    s.addText("打ち手", {x:x+0.26, y:y+1.48, w:1.2, h:0.22, isTextBox:true, margin:0,
      fontFace:F, fontSize:8.5, bold:true, color:MUTED, valign:"middle"});
    s.addText(a[2], {x:x+0.26, y:y+1.70, w:cw-0.52, h:0.62, isTextBox:true, margin:0,
      fontFace:F, fontSize:9, color:INK2, valign:"top", lineSpacingMultiple:1.18});
    s.addShape(pres.ShapeType.roundRect,{x:x+0.26, y:y+2.32, w:cw-0.52, h:0.30,
      fill:{color:UP}, line:{width:0}, rectRadius:0.05});
    s.addText(a[3], {x:x+0.26, y:y+2.32, w:cw-0.52, h:0.30, isTextBox:true, margin:0,
      align:"center", valign:"middle", fontFace:F, fontSize:9.5, bold:true, color:W});
  });
  footer(s);
  s.addNotes("①②は商品企画（メガ割向けセット商品）より。優先順は①単品のメガ割適用 → ②セット商品の造成。");
}

pres.writeFile({fileName:"dr365_Qoo10_2026年8月メガポ_レポート.pptx"}).then(f=>console.log("WROTE",f));
