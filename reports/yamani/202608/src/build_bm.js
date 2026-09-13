const pptxgen = require('pptxgenjs');
const D = require('./data_bm.js');

const NAVY="0E2038", NAVY2="1B3A5F", ORANGE="B98A1E", INK="1F2733",
      MUTED="6B7280", LINE="DCE1E8", TINT="F3F6FA", WHITE="FFFFFF",
      POS="1F7A4D", NEG="B3261E", SLATE="45566B";
const JP="Meiryo";
const W=13.333, H=7.5;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "WAC WORKS";

const FOOT = "Confidential  |  BAGMANIA 楽天市場店  /  2026年8月度 分析レポート";

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
    D.brands.map(r=>[r[0],r[1],r[2],r[3]]).concat([D.brandTotal.slice(0,4)]),
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
    D.brands.map(r=>[r[0],r[1],r[2],r[4],r[5],r[6],r[7]]).concat([[
      D.brandTotal[0],D.brandTotal[1],D.brandTotal[2],D.brandTotal[4],D.brandTotal[5],D.brandTotal[6],""]]),
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
  table(s, ["カテゴリ","売上 2026","売上 2025","前年比"], D.catAll, topt(0.55));
  table(s, ["カテゴリ","売上 2026","売上 2025","前年比"], D.catAll2, topt(6.83));
  note(s,0.55,6.1,12.22,"▶  総括",[
    "合計 ¥14,026,000 → ¥13,575,750（前年比 97%）。主力のレディース財布が -10.8%（-¥893K）で全体を押し下げた一方、メンズ財布 +50.4% /",
    "ハンドバッグ +107.3% / 名刺入れ +35.7% / メンズコインケース +161.4% と、財布以外・メンズ領域が伸長。商品構成の多角化が進んでいる。"
  ],0.85,9.5);
}

/* ---------- 10. 商品別TOP10 ---------- */
{
  const s = page("商品別売上ランキング TOP10（2026年8月）","BAGMANIA 楽天市場店 / 店舗分析レポート / 2026年8月度",
    "JILL STUARTがTOP8を独占。口金タイプが後退しL字ファスナーが伸長。");
  table(s, ["順位","商品コード","商品名","売上金額","件数","前年比"], D.top10,
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
  table(s, ["順位","2026年キーワード","アクセス","2025年キーワード（対応値）","前年比"], D.kw,
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
  table(s, ["参照元","2026/08","シェア","2025/08","前年比"], D.ref,
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
  D.up.forEach((r,i)=>{
    const y=1.68+i*0.68;
    s.addShape(pres.ShapeType.roundRect,{x:0.55,y,w:6.03,h:0.58,fill:{color:"F0F8F3"},line:{color:"CBE4D6",width:1},rectRadius:0.04});
    s.addText(r[0],{x:0.73,y:y+0.05,w:1.3,h:0.24,fontFace:"Calibri",fontSize:9.5,bold:true,color:POS,isTextBox:true,margin:0,valign:"middle"});
    s.addText(r[1],{x:0.73,y:y+0.28,w:3.25,h:0.24,fontFace:JP,fontSize:8.5,color:INK,isTextBox:true,margin:0,valign:"middle"});
    s.addText(r[2],{x:3.72,y:y+0.16,w:2.68,h:0.28,fontFace:JP,fontSize:9,bold:true,color:NAVY,isTextBox:true,margin:0,align:"right",valign:"middle"});
  });
  s.addText("▼  落ち商品（前年から消滅・減少）", { x:6.75, y:1.28, w:6, h:0.3, fontFace:JP,
    fontSize:12.5, bold:true, color:NEG, isTextBox:true, margin:0 });
  D.down.forEach((r,i)=>{
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
  table(s, ["カテゴリ","売上(2026/08)","件数","売上(2025/08)","件数","売上前年比"], D.catJS,
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

pres.writeFile({ fileName: "/tmp/claude-0/-home-user-home/7cd269b9-76ec-5b62-a114-e98ebb274bdd/scratchpad/BAGMANIA_202608.pptx" })
  .then(f=>console.log("written:",f));
