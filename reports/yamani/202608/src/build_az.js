const pptxgen = require('pptxgenjs');
const D = require('./data_az.js');

const NAVY="0E2038", NAVY2="1B3A5F", ORANGE="146EB4", INK="1F2733",
      MUTED="6B7280", LINE="DCE1E8", TINT="F3F6FA", WHITE="FFFFFF",
      POS="1F7A4D", NEG="B3261E", SLATE="45566B";
const JP="Meiryo";
const W=13.333, H=7.5;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "WAC WORKS";

const FOOT = "Confidential  |  BAGMANIA Amazon (ベンダー)  /  2026年8月度 分析レポート";

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
  table(s, ["指標","2026年8月","2025年8月","前年比"], D.yoy,
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
    { name:"自然検索売上（百万円）", labels: D.wkChart.labels, values: D.wkChart.organic },
    { name:"広告経由売上（百万円）", labels: D.wkChart.labels, values: D.wkChart.ad }
  ], { x:0.55, y:1.35, w:6.5, h:3.4, barDir:"col", barGrouping:"stacked",
       chartColors:["8DA2BC", ORANGE],
       showTitle:true, title:"週次 売上構成（百万円）", titleFontSize:11, titleColor:NAVY, titleFontFace:JP,
       showValue:true, dataLabelPosition:"ctr", dataLabelFontSize:8, dataLabelColor:"FFFFFF",
       dataLabelFontFace:JP, dataLabelFormatCode:"0.0",
       catAxisLabelColor:SLATE, catAxisLabelFontSize:8.5, catAxisLabelFontFace:JP,
       valAxisLabelColor:SLATE, valAxisLabelFontSize:8.5, valAxisMinVal:0, valAxisMaxVal:6,
       valGridLine:{ color:"EDF0F4", size:1 }, catGridLine:{ style:"none" },
       showLegend:true, legendPos:"b", legendFontSize:8.5, legendColor:SLATE, barGapWidthPct:55 });
  table(s, ["期間","上代","自然検索","広告経由","広告費","ROAS","件数"], D.weekly,
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
  table(s, ["指標","2026年8月","2025年8月","前年比"], D.ad.filter(r=>["CTR","広告費","広告経由売上","ROAS（全体・上代）","TACOS（上代）"].includes(r[0])),
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
  table(s, ["指標","2026年8月","2025年8月","前年比"], D.js,
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

pres.writeFile({ fileName: "/tmp/claude-0/-home-user-home/7cd269b9-76ec-5b62-a114-e98ebb274bdd/scratchpad/BAGMANIA_AMAZON_202608.pptx" })
  .then(f=>console.log("written:",f));
