const pptxgen = require('pptxgenjs');
const D = require('./data_yh.js');

const NAVY="0E2038", NAVY2="1B3A5F", ORANGE="0E7C7B", INK="1F2733",
      MUTED="6B7280", LINE="DCE1E8", TINT="F3F6FA", WHITE="FFFFFF",
      POS="1F7A4D", NEG="B3261E", SLATE="45566B";
const JP="Meiryo";
const W=13.333, H=7.5;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "WAC WORKS";

const FOOT = "Confidential  |  BAGMANIA Yahoo!ショッピング店  /  2026年8月度 分析レポート";

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
  table(s, ["月","売上","購買率","客単価"], D.monthly.map(r=>r.slice(0,4)),
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
  table(s, ["順位","商品コード","商品名","売上金額","注文数","訪問者数","購買率","前年比"], D.top10,
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
    D.brands.concat([D.brandTotal]),
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
    D.brandYoY.concat([D.brandYoYTotal]),
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
  D.up.forEach((r,i)=>{
    const y=1.68+i*0.68;
    s.addShape(pres.ShapeType.roundRect,{x:0.55,y,w:6.03,h:0.58,fill:{color:"F0F8F3"},line:{color:"CBE4D6",width:1},rectRadius:0.04});
    s.addText(r[0],{x:0.73,y:y+0.05,w:1.3,h:0.24,fontFace:"Calibri",fontSize:9.5,bold:true,color:POS,isTextBox:true,margin:0,valign:"middle"});
    s.addText(r[1],{x:0.73,y:y+0.28,w:3.25,h:0.24,fontFace:JP,fontSize:8.5,color:INK,isTextBox:true,margin:0,valign:"middle"});
    s.addText(r[2],{x:3.72,y:y+0.16,w:2.68,h:0.28,fontFace:JP,fontSize:9,bold:true,color:NAVY,isTextBox:true,margin:0,align:"right",valign:"middle"});
  });
  s.addText("▼  落ち商品（前年から消滅）", { x:6.75, y:1.28, w:6, h:0.3, fontFace:JP,
    fontSize:12.5, bold:true, color:NEG, isTextBox:true, margin:0 });
  D.down.forEach((r,i)=>{
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
  table(s, ["デバイス","売上 2026/08","構成比","売上 2025/08","構成比","前年比"], D.device,
    { x:0.55, y:1.58, w:7.4, colW:[1.5,1.45,0.9,1.45,0.9,1.2], rowH:0.36, fontSize:10,
      align:["left","right","right","right","right","right"],
      cellBold:(ri,ci)=>ci===5, cellColor:(ri,ci,r)=> ci===5 ? yoyColor(r[5]) : INK });
  s.addText("■  デバイス別 PV と PVあたり売上", { x:0.55, y:3.35, w:7, h:0.28,
    fontFace:JP, fontSize:11, bold:true, color:ORANGE, isTextBox:true, margin:0, valign:"middle" });
  table(s, ["デバイス","PV 2026","PV 2025","PV前年比","PV単価 26","PV単価 25","前年比"], D.devicePv,
    { x:0.55, y:3.7, w:7.4, colW:[1.3,1.0,1.0,1.05,1.05,1.0,1.0], rowH:0.36, fontSize:9.5,
      align:["left","right","right","right","right","right","right"],
      cellBold:(ri,ci)=>ci===6, cellColor:(ri,ci,r)=> ci===6 ? yoyColor(r[6]) : INK });
  s.addText("■  優良配送（2026年8月 vs 2025年8月）", { x:0.55, y:5.45, w:7, h:0.28,
    fontFace:JP, fontSize:11, bold:true, color:ORANGE, isTextBox:true, margin:0, valign:"middle" });
  table(s, ["指標","2026年8月","2025年8月","前年比"], D.yuryo,
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

pres.writeFile({ fileName: "/tmp/claude-0/-home-user-home/7cd269b9-76ec-5b62-a114-e98ebb274bdd/scratchpad/BAGMANIA_YAHOO_202608.pptx" })
  .then(f=>console.log("written:",f));
