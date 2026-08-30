const pptxgen = require("pptxgenjs");
const D = require("./data.js");

const INK="16263F", INK2="24344F", AMBER="E09B2D", AMBER_SOFT="FBEFD9",
      UP="1F7A5C", DOWN="C0442E", MUTED="6B7688", CARD="F3F5F8",
      LINE="DDE3EA", W="FFFFFF", TEAL="1F6F6B";
const F="Meiryo";
const SW=13.333, SH=7.5, M=0.6, CW=SW-2*M;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "株式会社Wacworks";
pres.title = "dr365_Qoo10_2026年8月メガポ_レポート";

let page = 0;
const TOTAL = 17;

function sh(o){ return {type:"outer", color:"9AA6B5", blur:6, offset:1, angle:90, opacity:0.18, ...o}; }

function footer(s, dark){
  page++;
  s.addText("Copyright © Wacworks Inc. All Rights Reserved.", {
    x:M, y:7.0, w:6, h:0.3, isTextBox:true, margin:0,
    fontFace:F, fontSize:8, color: dark?"7C8AA3":"9AA6B5", valign:"middle"});
  s.addText(`${page} / ${TOTAL}`, {
    x:SW-M-1.6, y:7.0, w:1.6, h:0.3, isTextBox:true, margin:0, align:"right",
    fontFace:F, fontSize:8, color: dark?"7C8AA3":"9AA6B5", valign:"middle"});
}

function head(s, title, right){
  s.addText(title, {x:M, y:0.30, w:CW-3.6, h:0.62, isTextBox:true, margin:0,
    fontFace:F, fontSize:23, bold:true, color:INK, valign:"middle"});
  if(right) s.addText(right, {x:SW-M-3.6, y:0.38, w:3.6, h:0.46, isTextBox:true, margin:0,
    align:"right", fontFace:F, fontSize:10, color:MUTED, valign:"middle"});
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
  s.addShape(pres.ShapeType.ellipse,{x:9.9, y:-1.5, w:5.4, h:5.4, fill:{color:INK2}, line:{width:0}});
  s.addShape(pres.ShapeType.ellipse,{x:11.6, y:4.6, w:3.2, h:3.2, fill:{color:"1E3A5F"}, line:{width:0}});
  s.addText("dr365", {x:M+0.1, y:1.92, w:9, h:1.32, isTextBox:true, margin:0,
    fontFace:F, fontSize:52, bold:true, color:W, charSpacing:1});
  s.addText("Qoo10  2026年8月メガポ  運用振り返りレポート", {x:M+0.1, y:3.32, w:10.5, h:0.6, isTextBox:true, margin:0,
    fontFace:F, fontSize:21, color:AMBER});
  s.addShape(pres.ShapeType.roundRect,{x:M+0.1, y:4.0, w:8.5, h:0.72, fill:{color:INK2}, line:{width:0}, rectRadius:0.08});
  s.addText("対象期間: 2026年8月1日〜9日（メガポ期間 9日間）  /  比較: 2026年7月1日〜9日（メガポ期間）",
    {x:M+0.3, y:4.0, w:8.1, h:0.72, isTextBox:true, margin:0, fontFace:F, fontSize:11, color:"D6DEE9", valign:"middle"});
  s.addText("作成：株式会社Wacworks   |   2026年8月", {x:M+0.1, y:5.35, w:8, h:0.4, isTextBox:true, margin:0,
    fontFace:F, fontSize:11, color:"8FA0B8"});
  footer(s, true);
  s.addNotes("dr365様 Qoo10 2026年8月メガポ（8/1〜8/9）の振り返り。比較対象は7月メガポ（7/1〜7/9）。");
}

/* ---------------- 2. 目次 ---------------- */
{
  const s = pres.addSlide();
  head(s, "目次");
  const toc = [
    "エグゼクティブサマリー","★ 7月vs8月 KPI比較サマリー","売上推移（8月日別表）",
    "★ 7月vs8月 売上・件数比較（日別）","注文・顧客データ（8月）","★ 7月vs8月 顧客・新規/リピート比較",
    "チャネル別流入分析（7月vs8月 TOP10）","★ 7月vs8月 CVR・ファネル比較","商品別売上ランキング（8月）",
    "★ 7月vs8月 商品別売上比較","★ V.C. UVデイエッセンスN 詳細","★ V.C. プレエッセンスN 詳細",
    "検索キーワード分析（7月vs8月）","次回メガ割に向けた改善アクション","Next Step・総括"
  ];
  toc.forEach((t,i)=>{
    const col = i<8?0:1;
    const row = i<8?i:i-8;
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
  const cards=[
    ["売上金額","¥447,380","9日間合計（7月比 +5.8%）",INK],
    ["売上件数","128件","平均14.2件/日（+5.8%）",INK],
    ["訪問者数","1,265","平均141人/日（+11.1%）",INK],
    ["平均客単価","¥3,495","前月比ほぼ横ばい（+¥1）",INK],
    ["購入顧客数","125名","新規75.2%（+6.9pt）",AMBER]
  ];
  cards.forEach((c,i)=> stat(s, M+i*(cw+0.16), 1.15, cw, 1.35, c[0], c[1], c[2], c[3]));
  card(s, M, 2.72, CW, 4.13, W);
  s.addText("■ 総評", {x:M+0.28, y:2.85, w:4, h:0.32, isTextBox:true, margin:0,
    fontFace:F, fontSize:12.5, bold:true, color:AMBER});
  bullets(s, M+0.28, 3.25, CW-0.56, 3.45, [
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

/* ---------------- 6. 日別比較 chart ---------------- */
{
  const s = pres.addSlide();
  head(s, "★ 7月vs8月 売上・件数比較（メガポ同日）", "メガポ開始からの経過日数で比較");
  s.addChart(pres.ChartType.bar, [
    {name:"7月メガポ 売上", labels:D.labels, values:D.rev7},
    {name:"8月メガポ 売上", labels:D.labels, values:D.rev8}
  ], {
    x:M, y:1.20, w:8.55, h:4.35,
    barDir:"col", barGapWidthPct:55, chartColors:[ "A9B6C6", AMBER ],
    showLegend:true, legendPos:"t", legendFontSize:10, legendColor:INK2,
    showTitle:false, showValue:false,
    catAxisLabelColor:INK2, catAxisLabelFontSize:10, catAxisLabelFontFace:F,
    valAxisLabelColor:MUTED, valAxisLabelFontSize:9, valAxisLabelFontFace:F,
    valAxisMaxVal:90000, valGridLine:{color:"E8ECF1", size:1}, catGridLine:{style:"none"},
    dataLabelFontFace:F, valAxisLabelFormatCode:"¥#,##0"
  });
  const rx = M+8.85, rw = CW-8.85;
  stat(s, rx, 1.20, rw, 1.25, "8月メガポ 合計", "¥447,380", "128件 / 訪問1,265 / CVR 10.12%", INK);
  stat(s, rx, 2.60, rw, 1.25, "7月メガポ 合計", "¥422,818", "121件 / 訪問1,139 / CVR 10.62%", MUTED);
  stat(s, rx, 4.00, rw, 1.55, "前月差", "+¥24,562", "+7件 / +126人 / -0.51pt\n売上伸長率 +5.8%", UP);
  card(s, M, 5.75, CW, 1.1, W);
  s.addText("▲ 8月は 1〜3日目（¥168,600）と 7〜9日目（¥194,858）に山があり、7月の「初日集中型」（初日¥73,206）から分散型へ。4〜6日目の谷（¥83,922）が改善余地で、中盤のタイムセール・クーポン投下が次回の打ち手。",
    {x:M+0.28, y:5.88, w:CW-0.56, h:0.85, isTextBox:true, margin:0, fontFace:F, fontSize:10.5, color:INK2, valign:"top", lineSpacingMultiple:1.2});
  footer(s);
}

/* ---------------- 7. 注文・顧客データ ---------------- */
{
  const s = pres.addSlide();
  head(s, "注文・顧客データ ─ 2026年8月メガポ", "8/1〜8/9");
  const cw=(CW-3*0.16)/4;
  const cards=[
    ["購入顧客（合計）","125名","9日間（7月120名比 +4.2%）",INK],
    ["新規顧客","94名","75.2%（7月68.3%比 +6.9pt）",AMBER],
    ["リピーター","31名","24.8%（7月31.7%比 -6.9pt）",DOWN],
    ["フォロワー数","1,124名","期末時点（+20名/9日）",UP]
  ];
  cards.forEach((c,i)=> stat(s, M+i*(cw+0.16), 1.15, cw, 1.25, c[0], c[1], c[2], c[3]));
  const rows=[hrow(["日付","新規","リピート","合計","フォロワー","ショップPV"])];
  D.cust8.forEach((r,i)=> rows.push(i===D.cust8.length-1?totalRow(r):r));
  tbl(s, rows, {x:M, y:2.58, w:7.15, colW:[1.35,1.05,1.25,1.05,1.30,1.15], rowH:0.325});
  const ix=M+7.45, iw=CW-7.45;
  const ins=[
    ["★ 8/7（金）が最大の顧客獲得日","21名獲得（新規18/リピート3）。新規比率85.7%は期間中最高で、広告露出が新規に効いた1日。",AMBER],
    ["新規比率75.2%へ回復","7月68.3%から+6.9pt。5月（76.8%）の水準に戻り、新規流入の裾野は着実に拡大。",UP],
    ["▼ リピーター31名（-7名）","7月38名から減少。6月メガ割直後の再購入需要が一巡した反動。育成導線の設計が課題。",DOWN],
    ["フォロワー1,124名で過去最高","+20名/9日は7月（+6名）の3.3倍ペース。お気に入り流入371PVと連動し資産が蓄積。",UP]
  ];
  ins.forEach((c,i)=>{
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

/* ---------------- 10. CVR・ファネル ---------------- */
{
  const s = pres.addSlide();
  head(s, "★ 7月vs8月 CVR・ファネル比較", "メガポ同日比較");
  const rows=[hrow(["指標","7月メガポ","8月メガポ","差分","評価"])];
  D.funnel.forEach(r=> rows.push([r[0], r[1], r[2], r[3], ev(r[4], r[5])]));
  tbl(s, rows, {x:M, y:1.15, w:6.6, colW:[1.75,1.25,1.25,1.15,1.20], rowH:0.40});
  // funnel bars
  const fx=M+6.95, fw=CW-6.95;
  card(s, fx, 1.15, fw, 2.40, W);
  s.addText("■ ファネル推移（7月 → 8月）", {x:fx+0.22, y:1.24, w:fw-0.44, h:0.28, isTextBox:true, margin:0,
    fontFace:F, fontSize:10.5, bold:true, color:AMBER, valign:"middle"});
  const steps=[["PV",1493,1714],["訪問者",1139,1265],["カート",229,249],["購入",121,128]];
  const maxv=1714, barMax=fw-2.95;
  steps.forEach((st,i)=>{
    const y=1.60+i*0.47;
    s.addText(st[0], {x:fx+0.22, y, w:0.82, h:0.4, isTextBox:true, margin:0,
      fontFace:F, fontSize:9.5, color:INK2, valign:"middle"});
    s.addShape(pres.ShapeType.roundRect,{x:fx+1.06, y:y+0.045, w:Math.max(0.12,barMax*st[1]/maxv), h:0.145,
      fill:{color:"A9B6C6"}, line:{width:0}, rectRadius:0.03});
    s.addShape(pres.ShapeType.roundRect,{x:fx+1.06, y:y+0.215, w:Math.max(0.12,barMax*st[2]/maxv), h:0.145,
      fill:{color:AMBER}, line:{width:0}, rectRadius:0.03});
    s.addText(`${st[1].toLocaleString()} → ${st[2].toLocaleString()}`,
      {x:fx+fw-1.75, y, w:1.55, h:0.4, isTextBox:true, margin:0, align:"right",
       fontFace:F, fontSize:9, color:MUTED, valign:"middle"});
  });
  card(s, M, 3.72, CW, 3.13, W);
  s.addText("■ 分析", {x:M+0.28, y:3.84, w:4, h:0.3, isTextBox:true, margin:0,
    fontFace:F, fontSize:12.5, bold:true, color:AMBER});
  bullets(s, M+0.28, 4.20, CW-0.56, 2.55, [
    "PV+14.8%・訪問者+11.1%と集客は伸長。一方カート+8.7%、注文+5.8%と、ファネルの下流にいくほど伸び率が縮小している。",
    "CVR 10.12% はQoo10平均（2〜4%）の2.5倍以上。0.51ptの低下は流入増に伴う自然な希釈であり、水準としては極めて健全。",
    "カート転換率（カート数/訪問者）は20.1%→19.7%とほぼ横ばい。カート→注文は52.8%→51.4%で、残カート121件が回収可能な母数として残る。",
    "★ 次回メガ割は「訪問者1,400・CVR11.0%・注文150件」を目標に、残カートの回収（リマインド／クーポン投下）を主要施策に据える。"
  ], 11);
  footer(s);
}

/* ---------------- 11. 商品別ランキング ---------------- */
{
  const s = pres.addSlide();
  head(s, "商品別売上ランキング ─ 2026年8月メガポ", "全12SKU / 売上¥447,380");
  const cw=(CW-3*0.16)/4;
  const cards=[
    ["1位 売上","¥142,120","V.C. UVデイエッセンス N（31.8%）",AMBER],
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
    ["8月売上","¥142,120","全体の31.8% / No.1",AMBER],
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
    ["8月売上","¥100,040","全体の22.4% / No.2",AMBER],
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

/* ---------------- 15. KW分析 ---------------- */
{
  const s = pres.addSlide();
  head(s, "検索キーワード分析 ─ 7月vs8月比較", "検索流入 449PV → 468PV（+4.2%）");
  const rows=[hrow(["検索ワード","7月","8月","増減","タイプ","評価"])];
  D.kw.forEach(r=> rows.push([{text:r[0], options:{align:"left"}}, r[1], r[2], r[3], r[4], ev(r[5], r[6])]));
  tbl(s, rows, {x:M, y:1.15, w:7.75, colW:[2.85,0.72,0.72,0.72,1.55,1.19], rowH:0.268, fontSize:9});
  const ix=M+8.05, iw=CW-8.05;
  const hi=[
    ["★ ブランド指名 +29%","「dr365」156→202、「dr365 公式」35→50。指名検索は過去最高水準。",UP],
    ["▼ アゼライン酸 -24%","101→77件。A.Z.セラムショットの売上-10%と直接連動している。",DOWN],
    ["★ 効能KWが新規発生","「毛穴シミケア」「エイジングケア ハリ たるみ」「肌再生クリーム」が新規出現。",UP],
    ["▼ カテゴリ指名が減少","「dr365 日焼け止め」-73%、「dr365 クレンジング」-80%。ブランド単体KWへ集約が進行。",DOWN]
  ];
  hi.forEach((c,i)=>{
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
    "「アゼライン酸」の落ち込みが売上減に直結。Keyword Plusの入札上限を引き上げ、「アゼライン酸 クリーム/セラム/毛穴」の組合せKWを再拡張する。",
    "新規発生した効能KW（毛穴シミケア／エイジングケア／肌再生クリーム）は購買意欲が高い層。該当商品ページに効能訴求コピーを追加し受け皿を作る。"
  ], 9.5);
  footer(s);
}

/* ---------------- 16. 改善アクション ---------------- */
{
  const s = pres.addSlide();
  head(s, "次回メガ割に向けた改善アクション ─ 4軸", "8月メガポ実績にもとづく優先施策");
  const qs=[
    ["① 流入チャネル改善",[
      "Keyword Plus：「アゼライン酸」の入札上限を引上げ（101→77件の減少を回復）",
      "自然検索の獲得：UVデイエッセンスの一般検索6PV→30PV超へタイトル最適化",
      "ショップ流入+45%を維持：ショップページのメガ割特集枠を常設化",
      "商品詳細ページ-40%の回復：関連商品レコメンド枠を全SKUに設置",
      "外部Google+66%を継続：成分・効能テーマのSEO記事を追加投入"]],
    ["② KW・検索対策",[
      "成分KWの再獲得：「アゼライン酸 クリーム/セラム/毛穴」を再拡張",
      "効能KWを新設：「毛穴シミケア」「エイジングケア ハリ たるみ」「肌再生クリーム」",
      "カテゴリ語の再配置：「dr365＋日焼け止め/クレンジング」を商品タイトルへ",
      "「導入美容液」「先行美容液」「ブースター」をプレエッセンスNの属性タグへ",
      "完全商品名（V.C. UVデイエッセンスN 等）を商品タイトル先頭へ移動"]],
    ["③ 商品別 優先順位",[
      "UVデイエッセンスN：在庫確保が最優先（8月40件→メガ割60件を想定）",
      "プレエッセンスN：UVとのバンドルで高単価併売を設計",
      "A.Z.セラムショット：成分KW広告の再強化で反転を狙う",
      "モイストフォーミングウォッシュ：+31%の伸びを定番化フェーズへ",
      "減少商品（ディープリペア/メルトスクラブ）：秋冬の保湿訴求で再活性"]],
    ["④ メガ割本番施策",[
      "8月新規94名へメガ割直前クーポンを配布し、リピート転換を促進",
      "残カート121件へのリマインド・クーポン投下で取りこぼしを回収",
      "メガ割専用LP：TOP2（UV × プレエッセンス）の限定セットを主役に配置",
      "お気に入り登録促進（371PVの基盤をさらに拡大）",
      "レビュー特典でUVデイエッセンスの口コミ数を積み増し"]]
  ];
  qs.forEach((q,i)=>{
    const x = M + (i%2)*(CW/2+0.15)/1, y = 1.30 + Math.floor(i/2)*2.78;
    const qw = (CW-0.3)/2;
    const qx = M + (i%2)*(qw+0.3);
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
  s.addText("Next Step・総括 ─ 2026年8月メガポ", {x:M, y:0.34, w:CW, h:0.6, isTextBox:true, margin:0,
    fontFace:F, fontSize:23, bold:true, color:W, valign:"middle"});
  s.addText("【8月メガポ 実績総括】", {x:M, y:1.05, w:6, h:0.32, isTextBox:true, margin:0,
    fontFace:F, fontSize:11.5, bold:true, color:AMBER, valign:"middle"});
  const cw=(CW-3*0.16)/4;
  const st=[["売上","¥447,380","7月比 +5.8%"],["件数","128件","7月比 +7件"],
            ["顧客数","125名","新規 75.2%"],["CVR","10.12%","▼ -0.51pt"]];
  st.forEach((c,i)=>{
    const x=M+i*(cw+0.16);
    s.addShape(pres.ShapeType.roundRect,{x, y:1.45, w:cw, h:1.05, fill:{color:INK2}, line:{width:0}, rectRadius:0.07});
    s.addText(c[0], {x:x+0.2, y:1.53, w:cw-0.4, h:0.26, isTextBox:true, margin:0,
      fontFace:F, fontSize:9.5, color:"8FA0B8", valign:"middle"});
    s.addText(c[1], {x:x+0.2, y:1.79, w:cw-0.4, h:0.44, isTextBox:true, margin:0,
      fontFace:F, fontSize:20, bold:true, color:W, valign:"middle"});
    s.addText(c[2], {x:x+0.2, y:2.22, w:cw-0.4, h:0.24, isTextBox:true, margin:0,
      fontFace:F, fontSize:9, color:"8FA0B8", valign:"middle"});
  });
  s.addText("■ 次回メガ割に向けた優先3課題", {x:M, y:2.68, w:8, h:0.32, isTextBox:true, margin:0,
    fontFace:F, fontSize:12.5, bold:true, color:AMBER, valign:"middle"});
  const pr=[
    ["【最優先①】 UVデイエッセンスN・プレエッセンスNの2枚看板に集中投資",
     "8月に躍進したTOP2（合計¥242,160＝売上の54.1%）へ在庫・広告・LPを集中。バンドル販売の新設でメガ割本番のTOP2合計¥350,000以上を狙う。",
     "目標: TOP2売上 ≧ ¥350,000"],
    ["【最優先②】 新規94名のリピート転換と「アゼライン酸」KWの再獲得",
     "リピーター-18.4%と成分KW-24%が最大の減少要因。新規への直前クーポン配布と成分KW入札強化で、獲得と再購入の両面を同時に回復させる。",
     "目標: リピーター ≧ 45名 ／「アゼライン酸」KW ≧ 100件"],
    ["【優先③】 カート放棄の回収でCVRを11%台へ",
     "残カート121件（カート249 − 注文128）が最大の伸びしろ。リマインド配信とクーポン投下で回収し、CVR 10.12%→11.0%、注文150件を目指す。",
     "目標: CVR ≧ 11.0% ／ 注文 ≧ 150件"]
  ];
  pr.forEach((p,i)=>{
    const y=3.10+i*1.28;
    s.addShape(pres.ShapeType.roundRect,{x:M, y, w:CW, h:1.16, fill:{color:INK2}, line:{width:0}, rectRadius:0.07});
    s.addText(p[0], {x:M+0.28, y:y+0.09, w:CW-4.0, h:0.3, isTextBox:true, margin:0,
      fontFace:F, fontSize:11.5, bold:true, color:W, valign:"middle"});
    s.addText(p[1], {x:M+0.28, y:y+0.42, w:CW-4.0, h:0.64, isTextBox:true, margin:0,
      fontFace:F, fontSize:9.5, color:"B8C4D4", valign:"top", lineSpacingMultiple:1.18});
    s.addShape(pres.ShapeType.roundRect,{x:SW-M-3.45, y:y+0.30, w:3.17, h:0.56, fill:{color:AMBER}, line:{width:0}, rectRadius:0.06});
    s.addText(p[2], {x:SW-M-3.45, y:y+0.30, w:3.17, h:0.56, isTextBox:true, margin:0,
      align:"center", valign:"middle", fontFace:F, fontSize:10, bold:true, color:INK});
  });
  footer(s, true);
}

pres.writeFile({fileName:"dr365_Qoo10_2026年8月メガポ_レポート.pptx"}).then(f=>console.log("WROTE",f));
