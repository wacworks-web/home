const PptxGenJS = require("pptxgenjs");
const path = require("path");
const L = require("./lib.js");
const { C, F, M, CW, RIGHT } = L;

const pptx = new PptxGenJS();
pptx.defineLayout({ name: "WW16x9", width: 13.333, height: 7.5 });
pptx.layout = "WW16x9";
pptx.author = "株式会社Wacworks";
pptx.company = "Wacworks Inc.";
pptx.title = "「これが欲しかった」と言われる商品は、どう作るのか？";

let P = 0;
const next = () => ++P;

/* =======================================================================
   01  TITLE
   ===================================================================== */
{
  const s = pptx.addSlide(); L.chromeDark(s, next());
  L.txt(s, "Wacworks EC GROWTH SEMINAR", {
    x: M, y: 1.15, w: 8.0, h: 0.35, fontSize: 13, bold: true,
    color: C.onDarkEyebrow, charSpacing: 1.5, valign: "middle",
  });
  L.txt(s, "「これが欲しかった」と言われる商品は、\nどう作るのか？", {
    x: M, y: 1.75, w: 12.0, h: 2.2, fontSize: 42, bold: true, color: C.white,
    lineSpacing: 56, valign: "middle",
  });
  L.txt(s, "ECマーケティングが難しくなった時代の、商品設計の考え方", {
    x: M, y: 4.05, w: 11.2, h: 0.5, fontSize: 18, color: C.onDarkSub, valign: "middle",
  });
  L.card(s, { x: M, y: 5.35, w: 5.7, h: 1.1, fill: C.dkPlate, line: C.dkEdge, r: 0.09 });
  s.addText([
    { text: "株式会社Wacworks\n", options: { bold: true, fontSize: 15, color: C.white } },
    { text: "代表取締役　舟瀬 悠", options: { fontSize: 12.5, color: C.onDarkSub2 } },
  ], { x: 0.95, y: 5.5, w: 5.2, h: 0.85, isTextBox: true, margin: 0, fontFace: F, valign: "middle", lineSpacing: 22 });
  s.addNotes("皆さんこんにちは。株式会社Wacworks代表の舟瀬です。今日のテーマは「これが欲しかった、と言われる商品はどう作るのか」です。広告もSNSもSEOもやっている、セールもクーポンも打っている。それでも思うように伸びない。その原因は、売り方ではなく商品の設計側にあることが非常に多いんです。今日は、マーケティングの視点から商品そのものを設計する考え方を、15分で体系的にお話しします。");
}

/* =======================================================================
   02  ABOUT US
   ===================================================================== */
{
  const s = pptx.addSlide(); L.chromeLight(s, next());
  L.head(s, "ABOUT US", "本題の前に ── Wacworksについて");
  L.txt(s, "楽天・Amazon・Yahoo!ショッピング・Qoo10を中心に、ECモールの売上支援を行う専門企業です。\nコンサルティングから運営代行・広告運用まで、「売れる仕組みづくり」を一気通貫でサポートしています。", {
    x: M, y: 1.55, w: 12.0, h: 0.8, fontSize: 14, color: C.body, lineSpacing: 24,
  });
  const stats = [
    ["120社+", "支援店舗数", "store"],
    ["233%", "平均売上アップ率", "trending"],
    ["95%", "サポート継続率", "repeat"],
  ];
  stats.forEach(([n, label, icon], i) => {
    const x = M + i * 4.115;
    L.card(s, { x, y: 2.7, w: 3.8, h: 2.5 });
    L.circle(s, { x: x + 0.35, y: 3.0, d: 0.62, fill: C.blue });
    s.addImage({ path: path.join(L.ASSETS, "icons", icon + ".png"), x: x + 0.5, y: 3.15, w: 0.32, h: 0.32 });
    L.txt(s, n, { x: x + 0.3, y: 3.65, w: 3.2, h: 0.9, fontSize: 40, bold: true, color: C.blue, valign: "middle" });
    L.txt(s, label, { x: x + 0.33, y: 4.55, w: 3.2, h: 0.35, fontSize: 13, color: C.body, valign: "middle" });
  });
  L.txt(s, "設立 2021年11月 ／ 東京都渋谷区　※数値は自社実績(公式サイト掲載値)", {
    x: M, y: 5.65, w: 12.0, h: 0.35, fontSize: 11, color: C.muted, valign: "middle",
  });
  s.addNotes("簡単に自己紹介です。Wacworksは楽天・Amazon・Yahoo!・Qoo10といったECモールの売上支援を専門にしている会社です。これまで120社以上をご支援し、平均売上アップ率は233%、サポート継続率は95%。日々いろいろな商品の売上を見ていますが、伸びる商品と伸びない商品の差は、広告の上手さよりも「商品設計の段階でどこまで考えられているか」で決まる。今日はその実感からお話しします。");
}

/* =======================================================================
   03  AGENDA
   ===================================================================== */
{
  const s = pptx.addSlide(); L.chromeLight(s, next());
  L.head(s, "AGENDA", "この動画でわかること");
  const items = [
    ["01", "なぜ「売り方」で差がつかなくなったのか", "施策の模倣が容易になった時代の構造変化"],
    ["02", "「これが欲しかった」の正体", "市場を小さくし、課題の深さで狙いを定める"],
    ["03", "課題起点で商品を設計する", "5つの質問・本当の競合・価値の引き算"],
    ["04", "小さく当てて、大きく広げる", "逆算ファネルと、小さなPMFからの市場拡張"],
  ];
  items.forEach(([n, t, d], i) => {
    const x = M + (i % 2) * 6.18;
    const y = 2.15 + Math.floor(i / 2) * 1.85;
    L.card(s, { x, y, w: 5.85, h: 1.5 });
    L.txt(s, n, { x: x + 0.4, y: y + 0.28, w: 0.9, h: 0.5, fontSize: 26, bold: true, color: C.blue, valign: "middle" });
    L.txt(s, t, { x: x + 1.25, y: y + 0.26, w: 4.3, h: 0.55, fontSize: 16, bold: true, color: C.ink, valign: "middle" });
    L.txt(s, d, { x: x + 1.25, y: y + 0.85, w: 4.3, h: 0.42, fontSize: 12, color: C.body, valign: "middle" });
  });
  L.band(s, "対象　", "経営者・EC事業責任者・マーケター。商品開発とマーケティングを分けずに考える回です。", { y: 6.0, h: 0.75, size: 16 });
  s.addNotes("今日の流れです。前半で、なぜ売り方の工夫だけでは差がつかなくなったのかという構造の話。中盤で、では何を見るべきかという「課題の深さ」と「市場の狭さ」の話。後半で、実際に課題起点で商品を設計する手順と、小さく当てて大きく広げる進め方をお話しします。最後まで見ていただくと、次に商品を企画するときの思考の順番が変わるはずです。");
}

/* =======================================================================
   04  SECTION 01
   ===================================================================== */
{
  const s = pptx.addSlide(); L.chromeDark(s, next());
  L.txt(s, "01", { x: M, y: 2.0, w: 3.5, h: 1.6, fontSize: 96, bold: true, color: C.blue, valign: "middle" });
  L.txt(s, "なぜ「売り方」で差がつかなくなったのか", { x: M, y: 3.7, w: 11.8, h: 0.85, fontSize: 34, bold: true, color: C.white, valign: "middle" });
  L.txt(s, "まず、いま起きている構造の変化から整理します。", { x: M, y: 4.6, w: 11.5, h: 0.45, fontSize: 15, color: C.onDarkSub2, valign: "middle" });
  s.addNotes("第1章です。まずは、なぜ今までのやり方が通用しにくくなったのか。ここを共有しないと、この後の話が「精神論」に聞こえてしまうので、構造からいきます。");
}

/* =======================================================================
   05  かつての勝ちパターン vs 現在
   ===================================================================== */
{
  const s = pptx.addSlide(); L.chromeLight(s, next());
  L.head(s, "WHY NOW", "かつての勝ちパターンが、効かなくなった");

  // left: 以前
  L.card(s, { x: M, y: 1.72, w: 5.85, h: 4.35, fill: C.tint });
  L.txt(s, "以前", { x: M + 0.4, y: 1.95, w: 2.0, h: 0.4, fontSize: 15, bold: true, color: C.muted, valign: "middle" });
  const past = ["商品を作る", "広告を出す", "LPを改善する", "売上が伸びる"];
  past.forEach((t, i) => {
    const y = 2.5 + i * 0.86;
    L.card(s, { x: M + 0.4, y, w: 5.05, h: 0.6, fill: C.white, r: 0.06 });
    L.txt(s, t, { x: M + 0.7, y, w: 4.5, h: 0.6, fontSize: 14.5, bold: i === 3, color: i === 3 ? C.ink : C.body, valign: "middle" });
    if (i < 3) L.arrowDown(s, { x: M + 2.83, y: y + 0.66, color: C.edge2 });
  });

  // right: 現在
  L.card(s, { x: 6.83, y: 1.72, w: 5.85, h: 4.35, fill: C.redTint });
  L.txt(s, "現在", { x: 7.23, y: 1.95, w: 2.0, h: 0.4, fontSize: 15, bold: true, color: C.red, valign: "middle" });
  const now = ["競合商品が増えた", "広告費が上がった", "似た商品が大量に存在する", "ユーザーが広告に慣れている", "商品比較が簡単になった", "AIで施策もすぐ模倣される"];
  now.forEach((t, i) => {
    const y = 2.5 + i * 0.58;
    L.circle(s, { x: 7.25, y: y + 0.16, d: 0.14, fill: C.red });
    L.txt(s, t, { x: 7.55, y, w: 4.9, h: 0.48, fontSize: 14, color: C.ink, valign: "middle" });
  });

  L.band(s, "つまり　", "「売り方」だけで作れる差は、どんどん小さくなっている。", { y: 6.25, h: 0.68 });
  s.addNotes("以前はシンプルでした。商品を作って、広告を出して、LPを改善すれば売上が伸びた。ところが今はどうでしょうか。競合商品が増え、広告費が上がり、似た商品が大量にあり、ユーザーは広告に慣れ、比較も一瞬でできる。さらにAIで、クリエイティブも施策もすぐ真似されます。つまり「売り方」だけで作れる差は、どんどん小さくなっている。ここが出発点です。");
}

/* =======================================================================
   06  商品起点 vs 課題起点
   ===================================================================== */
{
  const s = pptx.addSlide(); L.chromeLight(s, next());
  L.head(s, "THE SHIFT", "「商品起点」から「課題起点」へ");

  const cols = [
    { x: M, label: "商品起点（これまで）", labelColor: C.muted, fill: C.tint, stepFill: C.white,
      steps: ["商品を作る", "特徴・スペックを伝える", "広告で説得する", "他社と比較される"],
      tone: C.body, last: "価格と広告費の勝負になる", lastColor: C.red },
    { x: 6.83, label: "課題起点（これから）", labelColor: C.blue, fill: C.tint2, stepFill: C.white,
      steps: ["課題を見つける", "課題から商品を設計する", "「これが欲しかった」と言われる", "指名で選ばれる"],
      tone: C.ink, last: "説得コストが下がり、利益が残る", lastColor: C.blue },
  ];
  cols.forEach((c) => {
    L.card(s, { x: c.x, y: 1.72, w: 5.85, h: 4.35, fill: c.fill });
    L.txt(s, c.label, { x: c.x + 0.4, y: 1.95, w: 5.0, h: 0.4, fontSize: 15, bold: true, color: c.labelColor, valign: "middle" });
    c.steps.forEach((t, i) => {
      const y = 2.5 + i * 0.78;
      L.card(s, { x: c.x + 0.4, y, w: 5.05, h: 0.56, fill: c.stepFill, r: 0.06 });
      L.txt(s, t, { x: c.x + 0.7, y, w: 4.5, h: 0.56, fontSize: 14, bold: i === 2 && c.labelColor === C.blue, color: c.tone, valign: "middle" });
      if (i < 3) L.arrowDown(s, { x: c.x + 2.83, y: y + 0.6, color: c.labelColor === C.blue ? C.blue : C.edge2 });
    });
    L.txt(s, c.last, { x: c.x + 0.4, y: 5.55, w: 5.05, h: 0.4, fontSize: 13.5, bold: true, color: c.lastColor, valign: "middle" });
  });

  L.band(s, "要は　", "マーケティングは「商品を作った後」ではなく、「商品を作る前」から始まる。", { y: 6.25, h: 0.68 });
  s.addNotes("ここで一番伝えたい転換がこれです。商品起点というのは、まず商品を作って、その特徴を伝えて、広告で説得して、最後は他社と比較される。行き着く先は価格と広告費の勝負です。一方の課題起点は、先に課題を見つけて、その課題から商品を設計する。だから見た瞬間に「これが欲しかった」と言われて、指名で選ばれる。説得コストが下がるので利益も残ります。マーケティングは商品を作った後に始めるものではなく、作る前から始まっているんです。");
}

/* =======================================================================
   07  SECTION 02
   ===================================================================== */
{
  const s = pptx.addSlide(); L.chromeDark(s, next());
  L.txt(s, "02", { x: M, y: 2.0, w: 3.5, h: 1.6, fontSize: 96, bold: true, color: C.blue, valign: "middle" });
  L.txt(s, "「これが欲しかった」の正体", { x: M, y: 3.7, w: 11.8, h: 0.85, fontSize: 34, bold: true, color: C.white, valign: "middle" });
  L.txt(s, "狙うのは、大きな市場ではありません。", { x: M, y: 4.6, w: 11.5, h: 0.45, fontSize: 15, color: C.onDarkSub2, valign: "middle" });
  s.addNotes("第2章です。ではその「これが欲しかった」という反応は、どこから生まれるのか。実は狙う市場の選び方に答えがあります。");
}

/* =======================================================================
   08  良い商品 ≠ 欲しかった商品
   ===================================================================== */
{
  const s = pptx.addSlide(); L.chromeLight(s, next());
  L.head(s, "THE DIFFERENCE", "「良い商品」と「欲しかった商品」は違う");

  const panels = [
    { x: M, tag: "良い商品", tagFill: C.muted, fill: C.tint,
      copy: "高品質な化粧水", copySize: 26, copyColor: C.muted,
      reactLabel: "ユーザーの反応", react: "「良さそう」", reactColor: C.muted,
      note: "同じことを言う商品が、市場に大量にある。" },
    { x: 6.83, tag: "欲しかった商品", tagFill: C.blue, fill: C.tint2,
      copy: "肌が弱くて何を使ってもヒリヒリし、\nスキンケア選びを諦めていた人のための化粧水", copySize: 17, copyColor: C.ink,
      reactLabel: "ユーザーの反応", react: "「これ、私のための商品じゃん」", reactColor: C.blue,
      note: "同じことを言っている商品が、他にない。" },
  ];
  panels.forEach((p) => {
    L.card(s, { x: p.x, y: 1.72, w: 5.85, h: 4.35, fill: p.fill });
    L.card(s, { x: p.x + 0.4, y: 1.98, w: 2.05, h: 0.42, fill: p.tagFill, r: 0.09 });
    L.txt(s, p.tag, { x: p.x + 0.4, y: 1.98, w: 2.05, h: 0.42, fontSize: 12.5, bold: true, color: C.white, align: "center", valign: "middle" });
    L.card(s, { x: p.x + 0.4, y: 2.62, w: 5.05, h: 1.55, fill: C.white, r: 0.06 });
    L.txt(s, p.copy, { x: p.x + 0.65, y: 2.62, w: 4.55, h: 1.55, fontSize: p.copySize, bold: true, color: p.copyColor, valign: "middle", lineSpacing: p.copySize * 1.5 });
    L.txt(s, p.reactLabel, { x: p.x + 0.4, y: 4.35, w: 5.05, h: 0.3, fontSize: 11, color: C.muted, valign: "middle" });
    L.txt(s, p.react, { x: p.x + 0.4, y: 4.68, w: 5.05, h: 0.55, fontSize: 19, bold: true, color: p.reactColor, valign: "middle" });
    L.txt(s, p.note, { x: p.x + 0.4, y: 5.35, w: 5.05, h: 0.45, fontSize: 12, color: C.body, valign: "middle" });
  });

  L.band(s, "違いは　", "スペックではなく「誰の、どんな未解決課題を解決するのか」。", { y: 6.25, h: 0.68 });
  s.addNotes("具体例でいきます。「高品質な化粧水」。これだけだと弱い。なぜなら高品質な化粧水は市場に山ほどあるからです。でも「肌が弱くて何を使ってもヒリヒリしてしまい、スキンケア選びを諦めていた人のための化粧水」になると、意味がまったく変わる。前者への反応は「良さそう」。後者への反応は「これ、私のための商品じゃん」です。この差を生んでいるのはスペックではなく、誰のどんな未解決課題を解決するのかが明確かどうか、それだけです。");
}

/* =======================================================================
   09  市場を意図的に小さくする
   ===================================================================== */
{
  const s = pptx.addSlide(); L.chromeLight(s, next());
  L.head(s, "NARROW DOWN", "最初から大きな市場を狙わない");
  L.txt(s, "多くの商品開発は「市場規模はどのくらい？」から考える。しかし大きな市場ほど競合も多い。だから逆に、市場を意図的に小さくする。", {
    x: M, y: 1.6, w: 12.0, h: 0.4, fontSize: 13.5, color: C.body, valign: "middle",
  });

  const steps = [
    { t: "スキンケア", w: 8.3, fill: "DDE6F5", color: C.muted },
    { t: "乾燥肌", w: 6.9, fill: "C9DAF5", color: C.body },
    { t: "子育て中の乾燥肌", w: 5.5, fill: "8FBCFF", color: C.ink },
    { t: "お風呂上がりに子どもの世話で、自分のスキンケアができない人", w: 4.1, fill: C.blue, color: C.white },
  ];
  steps.forEach((st, i) => {
    const y = 2.2 + i * 0.92;
    const x = M + (8.3 - st.w) / 2;
    L.card(s, { x, y, w: st.w, h: 0.7, fill: st.fill, r: 0.07 });
    L.txt(s, st.t, { x: x + 0.15, y, w: st.w - 0.3, h: 0.7, fontSize: i === 3 ? 12.5 : 16, bold: true, color: st.color, align: "center", valign: "middle" });
    if (i < 3) L.arrowDown(s, { x: M + 4.05, y: y + 0.74, w: 0.22, h: 0.14, color: C.edge2 });
  });

  // right rail: 市場規模↓ / 解像度↑
  L.card(s, { x: 9.35, y: 2.2, w: 3.33, h: 3.62, fill: C.tint });
  L.txt(s, "絞り込むと、何が起きるか", { x: 9.65, y: 2.45, w: 2.8, h: 0.35, fontSize: 12.5, bold: true, color: C.ink, valign: "middle" });
  const rail = [
    { label: "市場規模", val: "小さくなる", arrow: "▼", color: C.muted, y: 3.0 },
    { label: "課題の解像度", val: "一気に高くなる", arrow: "▲", color: C.blue, y: 4.35 },
  ];
  rail.forEach((r) => {
    L.card(s, { x: 9.65, y: r.y, w: 2.73, h: 1.15, fill: C.white, r: 0.06 });
    L.txt(s, r.label, { x: 9.9, y: r.y + 0.15, w: 2.25, h: 0.3, fontSize: 11.5, color: C.body, valign: "middle" });
    L.txt(s, r.arrow + " " + r.val, { x: 9.9, y: r.y + 0.5, w: 2.25, h: 0.45, fontSize: 15, bold: true, color: r.color, valign: "middle" });
  });

  L.band(s, "狙いは　", "「市場を捨てること」ではなく、「課題をはっきり見えるようにすること」。", { y: 6.25, h: 0.68 });
  s.addNotes("多くの商品開発は「市場規模はどのくらいある？」から入ります。でも大きな市場ほど競合も多い。だから逆をやります。市場を意図的に小さくする。スキンケア、から乾燥肌、から子育て中の乾燥肌、さらに、お風呂上がりに子どもの世話で自分のスキンケアができない人。ここまで狭くすると、市場は確かに小さくなります。でもその代わり、課題の解像度が一気に上がる。何を作ればいいかが、はっきり見えるようになるんです。市場を捨てているのではなく、課題を見えるようにしている。ここを間違えないでください。");
}

/* =======================================================================
   10  課題の深さ × 人数 マトリクス
   ===================================================================== */
{
  const s = pptx.addSlide(); L.chromeLight(s, next());
  L.head(s, "THE MATRIX", "狙うべきは「人口」ではなく「課題の深さ」");

  // --- matrix ---
  const mx = 1.45, my = 1.85, mw = 6.6, mh = 3.95; // plot area
  const hw = mw / 2, hh = mh / 2;
  const quads = [
    { x: mx,      y: my,      w: hw, h: hh, fill: C.blue,   t: "★ ここから始める", tc: C.white, d: "人数は少ないが、\n課題が深い", dc: C.onBlueSub, big: true },
    { x: mx + hw, y: my,      w: hw, h: hh, fill: "DDE6F5", t: "激戦区",           tc: C.body,  d: "大手が既に\n参入している", dc: C.muted },
    { x: mx,      y: my + hh, w: hw, h: hh, fill: "F4F6F9", t: "市場にならない",   tc: C.muted, d: "人数も少なく\n困ってもいない", dc: C.muted },
    { x: mx + hw, y: my + hh, w: hw, h: hh, fill: "FBECEC", t: "価格競争",         tc: C.red,   d: "困り度が浅く\n安さで選ばれる", dc: C.muted },
  ];
  quads.forEach((q) => {
    s.addShape("rect", { x: q.x, y: q.y, w: q.w, h: q.h, fill: { color: q.fill }, line: { color: C.white, width: 2 } });
    L.txt(s, q.t, { x: q.x + 0.25, y: q.y + 0.3, w: q.w - 0.5, h: 0.45, fontSize: q.big ? 17 : 15, bold: true, color: q.tc, valign: "middle" });
    L.txt(s, q.d, { x: q.x + 0.25, y: q.y + 0.85, w: q.w - 0.5, h: 0.8, fontSize: 11.5, color: q.dc, lineSpacing: 17 });
  });
  // axes labels
  L.txt(s, "課題の深さ", { x: 0.25, y: 3.63, w: 1.4, h: 0.4, fontSize: 12.5, bold: true, color: C.ink, align: "center", valign: "middle", rotate: 270 });
  L.txt(s, "深い", { x: 0.78, y: my + 0.05, w: 0.6, h: 0.3, fontSize: 10.5, color: C.muted, align: "right", valign: "middle" });
  L.txt(s, "浅い", { x: 0.78, y: my + mh - 0.35, w: 0.6, h: 0.3, fontSize: 10.5, color: C.muted, align: "right", valign: "middle" });
  L.txt(s, "少ない", { x: mx, y: my + mh + 0.07, w: 0.9, h: 0.3, fontSize: 10.5, color: C.muted, valign: "middle" });
  L.txt(s, "多い", { x: mx + mw - 0.9, y: my + mh + 0.07, w: 0.9, h: 0.3, fontSize: 10.5, color: C.muted, align: "right", valign: "middle" });
  L.txt(s, "人数", { x: mx, y: my + mh + 0.07, w: mw, h: 0.3, fontSize: 12.5, bold: true, color: C.ink, align: "center", valign: "middle" });

  // --- right rail ---
  L.card(s, { x: 8.45, y: 1.85, w: 4.23, h: 1.62, fill: C.tint2 });
  L.txt(s, "見るのは人数ではなく", { x: 8.8, y: 2.05, w: 3.6, h: 0.3, fontSize: 11.5, color: C.body, valign: "middle" });
  L.txt(s, "課題の深さ × 人数", { x: 8.8, y: 2.4, w: 3.6, h: 0.5, fontSize: 21, bold: true, color: C.blue, valign: "middle" });
  L.txt(s, "100万人 × 困り度10  ＜  3万人 × 困り度100", { x: 8.8, y: 2.95, w: 3.6, h: 0.35, fontSize: 11.5, bold: true, color: C.ink, valign: "middle" });

  L.card(s, { x: 8.45, y: 3.65, w: 4.23, h: 2.35, fill: C.tint });
  L.txt(s, "課題が深い人は、こう動く", { x: 8.8, y: 3.85, w: 3.6, h: 0.32, fontSize: 12.5, bold: true, color: C.ink, valign: "middle" });
  ["自分から検索する", "比較して調べる", "多少高くても買う", "満足すれば口コミする", "リピートする"].forEach((t, i) => {
    const y = 4.25 + i * 0.33;
    L.circle(s, { x: 8.82, y: y + 0.09, d: 0.13, fill: C.blue });
    L.txt(s, t, { x: 9.08, y, w: 3.35, h: 0.3, fontSize: 12, color: C.body, valign: "middle" });
  });

  L.band(s, "探すべきは　", "「人数の多い市場」ではなく「困っている人が密集している市場」。", { y: 6.3, h: 0.62, size: 16 });
  s.addNotes("市場を見るとき、何人いるか、だけを見てはいけません。見るべきは課題の深さ掛ける人数です。100万人いるけれど困り度が10の市場より、3万人しかいないけれど困り度が100の市場を狙う。このマトリクスでいうと、左上、人数は少ないが課題が深いところ。ここから始めます。右上は大手がいる激戦区、右下は困り度が浅いので価格競争になる。なぜ左上かというと、課題が深い人は、自分から検索して、比較して、多少高くても買って、満足したら口コミして、リピートしてくれるからです。探すべきは人数の多い市場ではなく、困っている人が密集している市場です。");
}

/* =======================================================================
   11  SECTION 03
   ===================================================================== */
{
  const s = pptx.addSlide(); L.chromeDark(s, next());
  L.txt(s, "03", { x: M, y: 2.0, w: 3.5, h: 1.6, fontSize: 96, bold: true, color: C.blue, valign: "middle" });
  L.txt(s, "課題起点で、商品を設計する", { x: M, y: 3.7, w: 11.8, h: 0.85, fontSize: 34, bold: true, color: C.white, valign: "middle" });
  L.txt(s, "ここからは、実際に手を動かすパートです。", { x: M, y: 4.6, w: 11.5, h: 0.45, fontSize: 15, color: C.onDarkSub2, valign: "middle" });
  s.addNotes("第3章です。ここからは実務パートに入ります。実際に商品を企画するときに、何をどの順番で考えるか。");
}

/* =======================================================================
   12  5つの質問
   ===================================================================== */
{
  const s = pptx.addSlide(); L.chromeLight(s, next());
  L.head(s, "5 QUESTIONS", "商品開発の最初に答える、5つの質問");
  const qs = [
    { n: "①", en: "WHO", jp: "誰が\n困っているのか？", d: "年齢・性別ではなく\n「どんな状況の人か」\nまで定義する" },
    { n: "②", en: "PAIN", jp: "何に\n困っているのか？", d: "面倒・不安・恥ずかしい\n時間がない\n失敗したくない\n諦めている、まで掘る" },
    { n: "③", en: "WHY", jp: "なぜ既存品では\n解決できないのか？", d: "ここが商品開発\n最大のヒントになる" },
    { n: "④", en: "SOLUTION", jp: "何を変えれば\n劇的に解決するか？", d: "機能だけでなく\n使い方・サイズ・価格\n購入方法・配送\nセット・サポートまで", small: true },
    { n: "⑤", en: "PROOF", jp: "何を見たら\n信じてもらえるか？", d: "レビュー・実験・比較\n専門家・利用者数\nビフォーアフター" },
  ];
  qs.forEach((q, i) => {
    const x = M + i * 2.4525;
    L.card(s, { x, y: 1.75, w: 2.25, h: 3.95, fill: i === 2 ? C.tint2 : C.tint });
    L.badge(s, { x: x + 0.28, y: 2.02, d: 0.56, text: q.n, size: 17, fill: C.blue });
    L.txt(s, q.en, { x: x + 0.28, y: 2.72, w: 1.75, h: 0.32, fontSize: 12.5, bold: true, color: C.blue, charSpacing: 1, valign: "middle" });
    L.txt(s, q.jp, { x: x + 0.28, y: 3.08, w: 1.8, h: 0.9, fontSize: 13.5, bold: true, color: C.ink, lineSpacing: 19 });
    L.txt(s, q.d, { x: x + 0.28, y: 4.1, w: 1.8, h: 1.75, fontSize: 10.5, color: C.body, lineSpacing: 16 });
  });
  L.band(s, "特に重要なのは　", "③ なぜ既存商品では解決できていないのか。ここに答えが埋まっている。", { y: 6.05, h: 0.72, size: 16 });
  s.addNotes("商品開発の最初に、この5つに答えてください。1つ目WHO、誰が困っているのか。年齢性別ではなく、どんな状況にいる人かまで定義します。2つ目PAIN、何に困っているのか。表面的なニーズではなく、面倒、不安、恥ずかしい、時間がない、失敗したくない、もう諦めている、というところまで掘ります。3つ目WHY、なぜ既存商品では解決できていないのか。ここが最大のヒントです。4つ目SOLUTION、何を変えれば劇的に解決するのか。機能だけでなく、使い方、サイズ、価格、購入方法、配送、セット、サポートまで含めて考える。5つ目PROOF、ユーザーは何を見たら本当に解決できそうだと信じるのか。この5つが埋まらないまま商品を作ると、後から広告で穴埋めすることになります。");
}

/* =======================================================================
   13  本当の競合
   ===================================================================== */
{
  const s = pptx.addSlide(); L.chromeLight(s, next());
  L.head(s, "THE REAL COMPETITOR", "競合は「同じカテゴリーの商品」とは限らない");

  // left: あなたが見ている競合
  L.card(s, { x: M, y: 1.8, w: 5.0, h: 3.9, fill: C.tint });
  L.txt(s, "つい見てしまう競合", { x: M + 0.35, y: 2.05, w: 4.3, h: 0.35, fontSize: 13, bold: true, color: C.muted, valign: "middle" });
  L.txt(s, "同じカテゴリーの商品", { x: M + 0.35, y: 2.45, w: 4.3, h: 0.5, fontSize: 20, bold: true, color: C.ink, valign: "middle" });
  ["Amazonの同カテゴリー上位商品", "楽天の同ジャンルランキング", "価格・成分・容量の比較表"].forEach((t, i) => {
    const y = 3.15 + i * 0.62;
    L.card(s, { x: M + 0.35, y, w: 4.3, h: 0.5, fill: C.white, r: 0.06 });
    L.txt(s, t, { x: M + 0.55, y, w: 3.9, h: 0.5, fontSize: 12.5, color: C.body, valign: "middle" });
  });
  L.txt(s, "→ これだけでは、不十分。", { x: M + 0.35, y: 5.05, w: 4.3, h: 0.4, fontSize: 13, bold: true, color: C.red, valign: "middle" });

  // arrow
  L.chevron(s, { cx: 6.09, cy: 3.75, size: 0.3, color: C.edge2 });

  // right: 本当の競合
  L.card(s, { x: 6.5, y: 1.8, w: 6.18, h: 3.9, fill: C.tint2 });
  L.txt(s, "本当の競合", { x: 6.85, y: 2.05, w: 5.5, h: 0.35, fontSize: 13, bold: true, color: C.blue, valign: "middle" });
  L.txt(s, "ユーザーが今、その課題をどう解決しているか", { x: 6.85, y: 2.45, w: 5.5, h: 0.5, fontSize: 18, bold: true, color: C.ink, valign: "middle" });
  L.txt(s, "例）「時短ボディケア」の競合は、別のボディミルクだけではない", { x: 6.85, y: 3.0, w: 5.5, h: 0.3, fontSize: 11.5, color: C.muted, valign: "middle" });
  ["何も塗らない", "化粧水だけで済ませる", "子ども用クリームで代用する", "乾燥を我慢する"].forEach((t, i) => {
    const x = 6.85 + (i % 2) * 2.83;
    const y = 3.45 + Math.floor(i / 2) * 0.72;
    L.card(s, { x, y, w: 2.63, h: 0.58, fill: C.white, r: 0.06 });
    L.txt(s, t, { x: x + 0.18, y, w: 2.3, h: 0.58, fontSize: 12, bold: true, color: C.ink, valign: "middle" });
  });
  L.txt(s, "→ これらすべてが、競合。", { x: 6.85, y: 5.05, w: 5.5, h: 0.4, fontSize: 13, bold: true, color: C.blue, valign: "middle" });

  L.band(s, "戦っている相手は　", "商品ではなく、ユーザーの「いまの代替行動」。", { y: 5.95, h: 0.85 });
  s.addNotes("競合分析というと、Amazonで同じカテゴリーの商品を見る、で終わりがちです。でもそれだけでは不十分。見るべきなのは、ユーザーが今その課題をどうやって解決しているか、です。たとえば時短ボディケアの競合は、別のボディミルクだけではありません。何も塗らない、化粧水だけで済ませる、子ども用クリームを一緒に使う、乾燥を我慢する。これらも全部競合です。つまり私たちが戦っているのは商品ではなく、ユーザーの今の代替行動なんです。ここが見えると、勝ち方が変わります。");
}

/* =======================================================================
   14  不満は新商品の宝庫
   ===================================================================== */
{
  const s = pptx.addSlide(); L.chromeLight(s, next());
  L.head(s, "VOICE OF CUSTOMER", "新商品のヒントは「★1〜3レビュー」にある");
  L.txt(s, "新しい商品アイデアをゼロから考えない。既存商品への「○○だったらいいのに」を探す。", {
    x: M, y: 1.6, w: 12.0, h: 0.4, fontSize: 13.5, color: C.body, valign: "middle" });

  // left: sources
  L.card(s, { x: M, y: 2.15, w: 5.3, h: 3.65, fill: C.tint });
  L.txt(s, "不満が集まっている場所", { x: M + 0.35, y: 2.38, w: 4.6, h: 0.35, fontSize: 13, bold: true, color: C.ink, valign: "middle" });
  const src = ["Amazon / 楽天 / Qoo10 レビュー", "SNS（X・Instagram）", "Yahoo!知恵袋・Reddit", "検索キーワード（サジェスト）", "問い合わせ・返品理由", "カスタマーサポートの記録"];
  src.forEach((t, i) => {
    const y = 2.85 + i * 0.46;
    L.circle(s, { x: M + 0.37, y: y + 0.14, d: 0.13, fill: C.blue });
    L.txt(s, t, { x: M + 0.62, y, w: 4.4, h: 0.4, fontSize: 12.5, color: C.body, valign: "middle" });
  });

  // right: star chart
  L.card(s, { x: 6.35, y: 2.15, w: 6.33, h: 3.65, fill: C.white, line: C.edge, lw: 1 });
  L.txt(s, "レビュー評価のどこを読むか", { x: 6.7, y: 2.38, w: 5.6, h: 0.35, fontSize: 13, bold: true, color: C.ink, valign: "middle" });
  const rows = [
    { star: "★5", w: 3.1, fill: "DDE6F5", label: "満足の声（伸ばす材料）", lc: C.muted, hot: false },
    { star: "★4", w: 2.2, fill: "DDE6F5", label: "", lc: C.muted, hot: false },
    { star: "★3", w: 1.5, fill: C.blue, label: "", lc: C.blue, hot: true },
    { star: "★2", w: 1.0, fill: C.blue, label: "", lc: C.blue, hot: true },
    { star: "★1", w: 1.6, fill: C.blue, label: "", lc: C.blue, hot: true },
  ];
  rows.forEach((r, i) => {
    const y = 2.9 + i * 0.5;
    L.txt(s, r.star, { x: 6.7, y, w: 0.55, h: 0.38, fontSize: 12.5, bold: true, color: r.hot ? C.blue : C.muted, valign: "middle" });
    s.addShape("rect", { x: 7.3, y: y + 0.06, w: r.w, h: 0.26, fill: { color: r.fill }, line: { type: "none" } });
    if (r.label) L.txt(s, r.label, { x: 10.55, y, w: 2.0, h: 0.38, fontSize: 10.5, color: r.lc, valign: "middle" });
  });
  s.addShape("roundRect", { x: 6.62, y: 3.82, w: 3.75, h: 1.6, rectRadius: 0.06, fill: { type: "none" }, line: { color: C.blue, width: 1.5, dashType: "dash" } });
  L.txt(s, "★1〜3 に、既存商品が\n解決できていない課題が\n大量に書かれている", {
    x: 10.55, y: 4.15, w: 2.0, h: 0.95, fontSize: 11.5, bold: true, color: C.blue, lineSpacing: 18 });

  L.band(s, "探すのは　", "「良い商品」ではなく、「既存商品の不満」。", { y: 5.98, h: 0.82 });
  s.addNotes("新しい商品アイデアは、ゼロから考えないでください。既存商品に対する「○○だったらいいのに」を探すほうが、圧倒的に早くて確実です。見る場所は、Amazon・楽天・Qoo10のレビュー、SNS、知恵袋、検索キーワード、問い合わせ、返品理由、カスタマーサポートの記録。特に重要なのは★1から★3のレビューです。★5は満足の声で、これは伸ばす材料。でも★1から3には、既存商品が解決できていない課題が大量に書かれています。良い商品を探すのではなく、既存商品の不満を探す。ここが商品開発のスタート地点です。");
}

/* =======================================================================
   15  ADD / REMOVE / REDUCE / SIMPLIFY
   ===================================================================== */
{
  const s = pptx.addSlide(); L.chromeLight(s, next());
  L.head(s, "VALUE DESIGN", "商品価値は「足し算」だけではない");
  L.txt(s, "ユーザーが欲しいのは機能ではなく、「課題がなくなること」。", {
    x: M, y: 1.6, w: 12.0, h: 0.4, fontSize: 13.5, color: C.body, valign: "middle" });

  const ops = [
    { en: "ADD", jp: "追加する", q: "何を足すか？", d: "新しい機能・成分・付加価値", accent: false },
    { en: "REMOVE", jp: "なくす", q: "何をなくせるか？", d: "工程・手間・迷う要素", accent: true },
    { en: "REDUCE", jp: "減らす", q: "何を減らせるか？", d: "時間・回数・種類・負担", accent: true },
    { en: "SIMPLIFY", jp: "簡単にする", q: "何を簡単にできるか？", d: "使い方・選び方・買い方", accent: true },
  ];
  ops.forEach((o, i) => {
    const x = M + i * 3.06;
    L.card(s, { x, y: 2.2, w: 2.85, h: 2.45, fill: o.accent ? C.tint2 : C.tint });
    L.txt(s, o.en, { x: x + 0.32, y: 2.5, w: 2.25, h: 0.42, fontSize: 17, bold: true, color: o.accent ? C.blue : C.muted, charSpacing: 0.8, valign: "middle" });
    L.txt(s, o.jp, { x: x + 0.32, y: 2.95, w: 2.25, h: 0.4, fontSize: 15, bold: true, color: C.ink, valign: "middle" });
    L.txt(s, o.q, { x: x + 0.32, y: 3.5, w: 2.25, h: 0.4, fontSize: 12.5, bold: true, color: o.accent ? C.blue : C.muted, valign: "middle" });
    L.txt(s, o.d, { x: x + 0.32, y: 3.95, w: 2.25, h: 0.85, fontSize: 11.5, color: C.body, lineSpacing: 17 });
  });
  L.txt(s, "多くの商品開発は ADD に偏る。差がつくのは、残りの3つ。", {
    x: M, y: 4.9, w: 12.0, h: 0.35, fontSize: 12, color: C.muted, valign: "middle" });

  L.band(s, "たとえば　", "10種類の美容成分を足すより、「お風呂上がり10秒で終わる」の方が価値になる。", { y: 5.72, h: 1.05 });
  s.addNotes("商品開発というと、つい新しい機能を追加しようとなります。でもユーザーが欲しいのは機能ではなく、課題がなくなることです。だから考えるべきは4つ。ADD、何を追加するか。これはみんなやります。大事なのは残りの3つで、REMOVE、何をなくせるか。REDUCE、何を減らせるか。SIMPLIFY、何を簡単にできるか。たとえば10種類の美容成分を追加するより、お風呂上がり10秒で終わる、のほうが価値になることがあるんです。足し算ではなく引き算で価値を作る。ここは意識しないとまずできません。");
}

/* =======================================================================
   16  一文コンセプト
   ===================================================================== */
{
  const s = pptx.addSlide(); L.chromeLight(s, next());
  L.head(s, "THE CONCEPT", "商品コンセプトは、一文で説明できるか");
  L.txt(s, "強い商品は「誰の、何を解決する商品か」が一瞬でわかる。", {
    x: M, y: 1.6, w: 12.0, h: 0.4, fontSize: 13.5, color: C.body, valign: "middle" });

  // format box
  L.card(s, { x: M, y: 2.15, w: CW, h: 1.35, fill: C.blue, r: 0.09 });
  L.txt(s, "フォーマット", { x: M + 0.45, y: 2.32, w: 3.0, h: 0.3, fontSize: 11.5, bold: true, color: C.onBlueSub, charSpacing: 1, valign: "middle" });
  s.addText([
    { text: "○○な人", options: { color: C.white, bold: true } },
    { text: "が、", options: { color: C.onBlueSub } },
    { text: "△△せずに", options: { color: C.white, bold: true } },
    { text: "、", options: { color: C.onBlueSub } },
    { text: "□□できる", options: { color: C.white, bold: true } },
    { text: "商品", options: { color: C.onBlueSub } },
  ], { x: M + 0.45, y: 2.68, w: CW - 0.9, h: 0.62, isTextBox: true, margin: 0, fontFace: F, fontSize: 28, valign: "middle" });

  // example
  L.card(s, { x: M, y: 3.72, w: 7.6, h: 2.35, fill: C.tint });
  L.txt(s, "例", { x: M + 0.4, y: 3.95, w: 1.5, h: 0.3, fontSize: 11.5, bold: true, color: C.muted, valign: "middle" });
  s.addText([
    { text: "子育て中で自分のスキンケア時間がない人", options: { color: C.blue, bold: true } },
    { text: "が、\n", options: { color: C.ink } },
    { text: "何種類もの化粧品を使わずに", options: { color: C.blue, bold: true } },
    { text: "、\n", options: { color: C.ink } },
    { text: "10秒で保湿を終えられる", options: { color: C.blue, bold: true } },
    { text: "商品", options: { color: C.ink } },
  ], { x: M + 0.4, y: 4.3, w: 6.8, h: 1.5, isTextBox: true, margin: 0, fontFace: F, fontSize: 18, bold: true, lineSpacing: 30, valign: "middle" });

  // check
  L.card(s, { x: 8.53, y: 3.72, w: 4.15, h: 2.35, fill: C.tint2 });
  L.txt(s, "チェックすること", { x: 8.88, y: 3.95, w: 3.45, h: 0.32, fontSize: 12.5, bold: true, color: C.ink, valign: "middle" });
  L.txt(s, "この一文を読んだ対象ユーザーが", { x: 8.88, y: 4.38, w: 3.45, h: 0.3, fontSize: 12, color: C.body, valign: "middle" });
  L.txt(s, "「それ私だ」", { x: 8.88, y: 4.7, w: 3.45, h: 0.6, fontSize: 26, bold: true, color: C.blue, valign: "middle" });
  L.txt(s, "と思えるか。思えないなら、まだ絞れていない。", { x: 8.88, y: 5.35, w: 3.45, h: 0.55, fontSize: 11.5, color: C.body, lineSpacing: 17 });

  L.band(s, "逆に言えば　", "この一文が書けないうちは、まだ商品を作らない。", { y: 6.25, h: 0.68 });
  s.addNotes("商品コンセプトは一文で説明できるか。これは強い商品かどうかの、いちばん簡単なテストです。フォーマットはこれ。「○○な人が、△△せずに、□□できる商品」。例をあてはめると、「子育て中で自分のスキンケア時間がない人が、何種類もの化粧品を使わずに、10秒で保湿を終えられる商品」。この一文を見て、対象ユーザーが「それ私だ」と思えるかを確認してください。思えないなら、まだ絞りきれていないということです。");
}

/* =======================================================================
   17  SECTION 04
   ===================================================================== */
{
  const s = pptx.addSlide(); L.chromeDark(s, next());
  L.txt(s, "04", { x: M, y: 2.0, w: 3.5, h: 1.6, fontSize: 96, bold: true, color: C.blue, valign: "middle" });
  L.txt(s, "小さく当てて、大きく広げる", { x: M, y: 3.7, w: 11.8, h: 0.85, fontSize: 34, bold: true, color: C.white, valign: "middle" });
  L.txt(s, "順番を逆にすると、失敗のコストが下がります。", { x: M, y: 4.6, w: 11.5, h: 0.45, fontSize: 15, color: C.onDarkSub2, valign: "middle" });
  s.addNotes("最終章です。ここまでで課題起点の設計方法をお話ししました。最後は、それをどういう順番で市場に出していくか。ここを間違えると、良い商品でも埋もれます。");
}

/* =======================================================================
   18  作る前に「欲しい」を確認する
   ===================================================================== */
{
  const s = pptx.addSlide(); L.chromeLight(s, next());
  L.head(s, "VALIDATE FIRST", "商品を作る前に「欲しい」を確認する");
  L.txt(s, "商品を完成させてから売れるか確認するのでは遅い。順番を逆にする。", {
    x: M, y: 1.62, w: 12.0, h: 0.4, fontSize: 13.5, color: C.body, valign: "middle" });

  // wrong order
  L.card(s, { x: M, y: 2.15, w: CW, h: 1.15, fill: "F4F6F9" });
  L.txt(s, "よくある順番", { x: M + 0.4, y: 2.35, w: 2.2, h: 0.32, fontSize: 12, bold: true, color: C.muted, valign: "middle" });
  ["商品を作る", "在庫を仕入れる", "広告を出す", "売れるか確認する"].forEach((t, i) => {
    const x = M + 2.75 + i * 2.35;
    L.card(s, { x, y: 2.62, w: 2.0, h: 0.5, fill: C.white, r: 0.06 });
    L.txt(s, t, { x: x + 0.1, y: 2.62, w: 1.8, h: 0.5, fontSize: 11.5, color: C.muted, align: "center", valign: "middle" });
    if (i < 3) L.chevron(s, { cx: x + 2.175, cy: 2.87, size: 0.17, color: C.faint });
  });
  L.txt(s, "失敗が分かるのが最後。\n損失が最大になる。", { x: M + 0.4, y: 2.68, w: 2.2, h: 0.5, fontSize: 10, color: C.red, lineSpacing: 14 });

  // right order
  L.card(s, { x: M, y: 3.55, w: CW, h: 2.05, fill: C.tint2 });
  L.txt(s, "推奨する順番", { x: M + 0.4, y: 3.78, w: 2.4, h: 0.32, fontSize: 12.5, bold: true, color: C.blue, valign: "middle" });
  const flow = ["課題を発見", "コンセプトを作る", "LP・画像・広告を作る", "ユーザーに見せる", "反応を見る", "商品を改善", "本格投入"];
  flow.forEach((t, i) => {
    const x = M + 0.4 + i * 1.62;
    L.card(s, { x, y: 4.25, w: 1.42, h: 0.95, fill: i === 6 ? C.blue : C.white, r: 0.06 });
    L.txt(s, t, { x: x + 0.08, y: 4.25, w: 1.26, h: 0.95, fontSize: 11, bold: i === 6, color: i === 6 ? C.white : C.ink, align: "center", valign: "middle", lineSpacing: 15 });
    if (i < 6) L.chevron(s, { cx: x + 1.52, cy: 4.725, size: 0.17, color: C.blue });
  });

  L.band(s, "つまり　", "商品を作ってからマーケティングするのではなく、マーケティングしながら商品を作る。", { y: 5.78, h: 0.98 });
  s.addNotes("商品を完成させてから売れるかどうか確認するのでは遅いです。在庫を抱えてから失敗がわかる、これがいちばん損失が大きい。だから順番を逆にします。まず課題を発見して、コンセプトを作って、先にLP・画像・広告を作ってしまう。それをユーザーに見せて、反応を見る。反応が悪ければ商品ではなくコンセプトを直せばいいので、傷が浅い。反応が良ければ商品を改善して本格投入する。商品を作ってからマーケティングするのではなく、マーケティングしながら商品を作る、ということです。");
}

/* =======================================================================
   19  通常ファネル vs 逆算ファネル
   ===================================================================== */
{
  const s = pptx.addSlide(); L.chromeLight(s, next());
  L.head(s, "FUNNEL", "マーケティングファネルも、逆から設計する");

  const stages = ["認知", "興味", "比較", "購入", "リピート"];
  const widths = [4.7, 4.1, 3.5, 2.9, 2.3];
  const questions = ["その人はどこにいる？", "どんな言葉なら「自分のことだ」と思う？", "他の商品ではなくこれを選ぶ理由は？", "何ならお金を払ってでも解決したい？", "どんな商品ならもう一度買いたくなる？"];

  const panels = [
    { x: M, title: "通常のファネル", sub: "上から下へ考える", color: C.muted, fill: C.tint, barFill: "DDE6F5", barText: C.body, order: [1, 2, 3, 4, 5], dir: "down" },
    { x: 6.83, title: "逆算ファネル", sub: "下から上へ考える", color: C.blue, fill: C.tint2, barFill: null, barText: C.ink, order: [5, 4, 3, 2, 1], dir: "up" },
  ];
  panels.forEach((p) => {
    L.card(s, { x: p.x, y: 1.7, w: 5.85, h: 4.3, fill: p.fill });
    L.txt(s, p.title, { x: p.x + 0.4, y: 1.9, w: 3.4, h: 0.38, fontSize: 16, bold: true, color: p.color, valign: "middle" });
    L.txt(s, p.sub, { x: p.x + 0.4, y: 2.26, w: 3.4, h: 0.3, fontSize: 11, color: C.muted, valign: "middle" });

    stages.forEach((st, i) => {
      const y = 2.68 + i * 0.63;
      const bw = widths[i];
      const bx = p.x + 0.35 + (4.9 - bw) / 2;
      const isBlue = p.dir === "up";
      const shade = ["FFFFFF", "D6E6FB", "AFC6E8", "5B93EE", C.blue][i];
      L.card(s, { x: bx, y, w: bw, h: 0.46, fill: isBlue ? shade : p.barFill, r: 0.05 });
      L.txt(s, st, { x: bx, y, w: bw, h: 0.46, fontSize: 14, bold: true,
        color: isBlue && i >= 3 ? C.white : (isBlue ? C.ink : C.body), align: "center", valign: "middle" });
      L.txt(s, String(p.order[i]), { x: p.x + 0.35, y, w: 0.35, h: 0.46, fontSize: 12, bold: true, color: p.color, align: "center", valign: "middle" });
      if (p.dir === "up") {
        L.txt(s, questions[i], { x: p.x + 0.35, y: y + 0.47, w: 4.9, h: 0.15, fontSize: 8, color: C.body, align: "center", valign: "middle" });
      }
    });
    // direction arrow
    const ax = p.x + 5.42;
    s.addShape("rect", { x: ax, y: 2.85, w: 0.06, h: 2.5, fill: { color: p.color }, line: { type: "none" } });
    s.addShape("triangle", { x: ax - 0.09, y: p.dir === "down" ? 5.32 : 2.63, w: 0.24, h: 0.2,
      rotate: p.dir === "down" ? 180 : 0, fill: { color: p.color }, line: { type: "none" } });
  });

  L.band(s, "だから　", "広告から考えない。リピートから逆算する。", { y: 6.2, h: 0.7 });
  s.addNotes("マーケティングファネルの話です。通常は、認知、興味、比較、購入、リピートの順に上から考えます。でも商品設計では逆から考えてください。まずリピート。どんな商品ならもう一度買いたくなるか。次に購入。何ならお金を払ってでも解決したいか。次に比較。他の商品ではなくこれを選ぶ理由は何か。次に興味。どんな言葉なら自分のことだと思うか。最後に認知。その人はどこにいるのか。この順番で考えると、広告のクリエイティブは自然に決まります。広告から考えない、リピートから逆算する。ここは本当に効きます。");
}

/* =======================================================================
   20  小さなPMF → 市場拡張
   ===================================================================== */
{
  const s = pptx.addSlide(); L.chromeLight(s, next());
  L.head(s, "GROWTH PATH", "小さく深く刺してから、広げる");

  const phases = [
    { n: "01", t: "大きな市場", d: "競合だらけで、\n誰にも刺さらない", type: "big", accent: false },
    { n: "02", t: "小さな課題市場", d: "特定の課題を持つ、\n小さな顧客群に絞る", type: "dot", accent: true },
    { n: "03", t: "小さなPMF", d: "その人たちに\n圧倒的に支持される", type: "pmf", accent: true },
    { n: "04", t: "市場拡張", d: "隣接層・利用シーンへ\n広げ、ブランド化", type: "expand", accent: true },
  ];
  phases.forEach((p, i) => {
    const x = M + i * 3.06;
    L.card(s, { x, y: 1.75, w: 2.85, h: 3.55, fill: p.accent ? C.tint2 : C.tint });
    L.txt(s, p.n, { x: x + 0.3, y: 1.95, w: 1.0, h: 0.32, fontSize: 12.5, bold: true, color: p.accent ? C.blue : C.muted, valign: "middle" });

    const cx = x + 1.425, cy = 3.0; // diagram centre
    if (p.type === "big") {
      L.circle(s, { x: cx - 0.85, y: cy - 0.85, d: 1.7, fill: "E4E9F0" });
      [[-0.42, -0.34], [0.2, -0.5], [0.44, 0.1], [-0.14, 0.42], [-0.55, 0.16], [0.1, 0.08]].forEach(([dx, dy]) =>
        L.circle(s, { x: cx + dx - 0.11, y: cy + dy - 0.11, d: 0.22, fill: "A6B4C9" }));
    } else if (p.type === "dot") {
      L.circle(s, { x: cx - 0.85, y: cy - 0.85, d: 1.7, fill: "EDF1F6" });
      L.circle(s, { x: cx - 0.33, y: cy - 0.33, d: 0.66, fill: C.blue });
    } else if (p.type === "pmf") {
      L.circle(s, { x: cx - 0.85, y: cy - 0.85, d: 1.7, fill: "EDF1F6" });
      L.circle(s, { x: cx - 0.6, y: cy - 0.6, d: 1.2, fill: "D6E6FB" });
      L.circle(s, { x: cx - 0.42, y: cy - 0.42, d: 0.84, fill: C.blue });
      L.txt(s, "PMF", { x: cx - 0.42, y: cy - 0.42, w: 0.84, h: 0.84, fontSize: 11.5, bold: true, color: C.white, align: "center", valign: "middle" });
    } else {
      L.circle(s, { x: cx - 0.85, y: cy - 0.85, d: 1.7, fill: "EDF1F6" });
      L.circle(s, { x: cx - 0.85, y: cy - 0.85, d: 1.7, fill: "FFFFFF", line: C.blue, lw: 1.25 });
      L.circle(s, { x: cx - 0.58, y: cy - 0.58, d: 1.16, fill: "E8F0FC", line: C.edge2, lw: 1 });
      L.circle(s, { x: cx - 0.32, y: cy - 0.32, d: 0.64, fill: C.blue });
      [[1.06, 0, 90], [-1.06, 0, 270], [0, -1.06, 0], [0, 1.06, 180]].forEach(([dx, dy, rot]) => {
        L.tri(s, { cx: cx + dx, cy: cy + dy, size: 0.2, rotate: rot, color: C.blue });
      });
    }
    L.txt(s, p.t, { x: x + 0.3, y: 4.05, w: 2.25, h: 0.4, fontSize: 15, bold: true, color: p.accent ? C.ink : C.muted, valign: "middle" });
    L.txt(s, p.d, { x: x + 0.3, y: 4.5, w: 2.25, h: 0.7, fontSize: 11.5, color: C.body, lineSpacing: 17 });
    if (i < 3) L.chevron(s, { cx: x + 2.955, cy: 3.0, size: 0.22, color: C.blue });
  });

  L.txt(s, "小さなPMFのサイン　│　レビュー評価が高い ／ 内容が具体的 ／ リピートされる ／ 人に紹介される ／ 指名検索される ／ 「他の商品に戻れない」と言われる", {
    x: M, y: 5.45, w: 12.0, h: 0.35, fontSize: 11, color: C.muted, valign: "middle" });

  L.band(s, "順番が逆　", "「広く売ってからファンを作る」のではなく、「小さなファンを作ってから広く売る」。", { y: 5.95, h: 0.85 });
  s.addNotes("成長の順番です。多くの人は最初から大きな市場を取りにいきますが、そこは競合だらけで誰にも刺さりません。そうではなく、まず小さな課題市場に絞る。そこで圧倒的に支持される状態、つまり小さなPMFを作る。サインは、レビュー評価が高い、レビューの内容が具体的、リピートされる、人に紹介される、指名検索される、他の商品に戻れないと言われる。この状態ができると、レビューと口コミとデータが資産として貯まります。そこから初めて、似た課題を持つ隣接層、利用シーンへと広げていく。広く売ってからファンを作るのではなく、小さなファンを作ってから広く売るんです。");
}

/* =======================================================================
   21  強い商品は広告を楽にする
   ===================================================================== */
{
  const s = pptx.addSlide(); L.chromeLight(s, next());
  L.head(s, "THE PAYOFF", "商品が強ければ、広告は「説得」ではなくなる");

  // weak
  L.card(s, { x: M, y: 1.8, w: 5.85, h: 3.85, fill: "F4F6F9" });
  L.txt(s, "弱い商品", { x: M + 0.4, y: 2.05, w: 3.0, h: 0.4, fontSize: 16, bold: true, color: C.muted, valign: "middle" });
  ["広告", "説得", "説得", "説得", "購入"].forEach((t, i) => {
    const y = 2.5 + i * 0.55;
    const isPersuade = t === "説得";
    L.card(s, { x: M + 0.4, y, w: 5.05, h: 0.44, fill: isPersuade ? C.redTint : C.white, r: 0.05 });
    L.txt(s, t, { x: M + 0.4, y, w: 5.05, h: 0.44, fontSize: 13.5, bold: true, color: isPersuade ? C.red : C.body, align: "center", valign: "middle" });
    if (i < 4) L.arrowDown(s, { x: M + 2.83, y: y + 0.455, w: 0.18, h: 0.1, color: C.faint });
  });
  L.txt(s, "説得の回数が多い＝広告費がかさむ", { x: M + 0.4, y: 5.28, w: 5.05, h: 0.32, fontSize: 12, bold: true, color: C.red, align: "center", valign: "middle" });

  // strong
  L.card(s, { x: 6.83, y: 1.8, w: 5.85, h: 3.85, fill: C.tint2 });
  L.txt(s, "強い商品", { x: 7.23, y: 2.05, w: 3.0, h: 0.4, fontSize: 16, bold: true, color: C.blue, valign: "middle" });
  const strong = [
    { t: "広告", fill: C.white, color: C.ink, size: 15, h: 0.62 },
    { t: "「これ、欲しかった」", fill: C.blue, color: C.white, size: 19, h: 0.9 },
    { t: "購入", fill: C.white, color: C.ink, size: 15, h: 0.62 },
  ];
  let sy = 2.5;
  strong.forEach((b, i) => {
    L.card(s, { x: 7.23, y: sy, w: 5.05, h: b.h, fill: b.fill, r: 0.06 });
    L.txt(s, b.t, { x: 7.23, y: sy, w: 5.05, h: b.h, fontSize: b.size, bold: true, color: b.color, align: "center", valign: "middle" });
    sy += b.h;
    if (i < 2) { L.arrowDown(s, { x: 9.66, y: sy + 0.08, w: 0.2, h: 0.13, color: C.blue }); sy += 0.3; }
  });
  L.txt(s, "説得が不要＝広告費が効率化する", { x: 7.23, y: 5.28, w: 5.05, h: 0.32, fontSize: 12, bold: true, color: C.blue, align: "center", valign: "middle" });

  L.band(s, "理想は　", "マーケティングが「説得」ではなく、必要としている人に「知らせる」仕事になること。", { y: 5.88, h: 0.9, size: 16 });
  s.addNotes("ここまでの話が全部つながるのがこのスライドです。弱い商品は、広告を見せて、説得して、説得して、説得して、やっと購入。説得の回数が多いほど広告費はかさみます。強い商品は、広告を見た瞬間に「これ欲しかった」となって購入。商品と顧客課題が合っていれば、マーケティングは説得ではなく、その商品を必要としている人に知らせる仕事になります。これが理想の状態です。広告が上手いから売れるのではなく、商品が合っているから広告が効く、という順番です。");
}

/* =======================================================================
   22  まとめ
   ===================================================================== */
{
  const s = pptx.addSlide(); L.chromeLight(s, next());
  L.head(s, "SUMMARY", "考える順番を、5つ変える");
  L.txt(s, "広告テクニックを増やすだけでは限界がある。問いを変える。", {
    x: M, y: 1.62, w: 12.0, h: 0.4, fontSize: 13.5, color: C.body, valign: "middle" });

  L.txt(s, "これまでの問い", { x: M + 0.4, y: 2.12, w: 4.0, h: 0.32, fontSize: 12, bold: true, color: C.muted, valign: "middle" });
  L.txt(s, "これからの問い", { x: 6.35, y: 2.12, w: 4.0, h: 0.32, fontSize: 12, bold: true, color: C.blue, valign: "middle" });
  const pairs = [
    ["何を売る？", "誰が困っている？"],
    ["市場は大きい？", "課題は深い？"],
    ["競合商品は？", "今どうやって解決している？"],
    ["何を追加する？", "何をなくせる？"],
    ["どう広告する？", "なぜ「これが欲しかった」と言われる？"],
  ];
  pairs.forEach(([a, b], i) => {
    const y = 2.58 + i * 0.7;
    L.card(s, { x: M, y, w: 4.55, h: 0.6, fill: "F4F6F9", r: 0.07 });
    L.txt(s, a, { x: M + 0.4, y, w: 3.9, h: 0.6, fontSize: 14.5, color: C.muted, valign: "middle" });
    L.chevron(s, { cx: 5.6, cy: y + 0.3, size: 0.2, color: C.edge2 });
    L.card(s, { x: 5.95, y, w: 6.73, h: 0.6, fill: C.tint2, r: 0.07 });
    L.txt(s, b, { x: 6.35, y, w: 6.1, h: 0.6, fontSize: 15.5, bold: true, color: C.ink, valign: "middle" });
  });

  L.band(s, "そして　", "特定の誰かに、120点の商品を作る。", { y: 6.2, h: 0.72, size: 18 });
  s.addNotes("まとめです。ECマーケティングが難しくなったとき、広告テクニックを増やすだけでは限界があります。変えるべきは、考える順番、つまり自分に投げかける問いです。何を売る、ではなく誰が困っている。市場は大きい、ではなく課題は深い。競合商品は、ではなく今どうやって解決している。何を追加する、ではなく何をなくせる。どう広告する、ではなく、なぜこれが欲しかったと言われるのか。この5つの問いに変えるだけで、出てくる企画がまったく変わります。そして、万人に70点ではなく、特定の誰かに120点の商品を作る。");
}

/* =======================================================================
   23  CONCLUSION (big)
   ===================================================================== */
{
  const s = pptx.addSlide(); L.chromeDark(s, next());
  L.txt(s, "CONCLUSION", { x: M, y: 1.9, w: 8.0, h: 0.35, fontSize: 13, bold: true, color: C.onDarkEyebrow, charSpacing: 1.5, valign: "middle" });
  L.txt(s, "最後に大きな市場を取るために、\n最初は市場を小さくする。", {
    x: M, y: 2.6, w: 12.0, h: 2.3, fontSize: 46, bold: true, color: C.white, lineSpacing: 66, valign: "middle" });
  L.txt(s, "特定の誰かに120点の商品を作り、その小さな市場で「これが欲しかった」と言われる状態を作る。\nそこから、隣の市場へ広げていく。これが、これからのEC商品開発とマーケティングの考え方です。", {
    x: M, y: 5.45, w: 11.5, h: 1.0, fontSize: 15, color: C.onDarkSub, lineSpacing: 26 });
  s.addNotes("今日いちばんお伝えしたいのはこの一文です。最後に大きな市場を取るために、最初は市場を小さくする。万人に70点の商品を作るのではなく、特定の誰かに120点の商品を作る。その小さな市場で「これが欲しかった」と言われる状態を作って、そこから隣の市場へ広げていく。遠回りに見えて、これがいちばん確実で速い道です。");
}

/* =======================================================================
   24  NEXT ACTION
   ===================================================================== */
{
  const s = pptx.addSlide(); L.chromeDark(s, next());
  L.txt(s, "NEXT ACTION", { x: M, y: 1.3, w: 8.0, h: 0.35, fontSize: 12, bold: true, color: C.onDarkEyebrow, charSpacing: 1.5, valign: "middle" });
  L.txt(s, "「これが欲しかった」を、あなたの商品で。", { x: M, y: 1.75, w: 12.0, h: 0.9, fontSize: 36, bold: true, color: C.white, valign: "middle" });
  L.txt(s, "商品設計から見直すと、広告もページもセールも、すべての施策が効きやすくなります。\nまずは、自社商品と競合商品の★1〜3レビューを読むところから。", {
    x: M, y: 2.75, w: 11.5, h: 0.8, fontSize: 15, color: C.onDarkSub, lineSpacing: 26, valign: "middle" });
  L.card(s, { x: M, y: 3.7, w: CW, h: 2.3, fill: C.blue, r: 0.09 });
  L.txt(s, "無料相談 受付中", { x: 1.2, y: 4.05, w: 6.0, h: 0.55, fontSize: 24, bold: true, color: C.white, valign: "middle" });
  L.txt(s, "現在の商品・店舗状況をお伺いし、課題起点での商品設計と売上の伸ばし方を無料でご提案します。\nお申し込みは概要欄のリンク、または「Wacworks」で検索してください。", {
    x: 1.2, y: 4.75, w: 10.9, h: 0.95, fontSize: 14, color: C.onBlueSub, lineSpacing: 24 });
  L.txt(s, "ご視聴ありがとうございました　─　株式会社Wacworks 代表取締役 舟瀬 悠", {
    x: M, y: 6.45, w: 11.5, h: 0.4, fontSize: 13, color: C.onDarkSub2, valign: "middle" });
  s.addNotes("商品設計から見直すと、広告もページもセールも、すべての施策が効きやすくなります。今日からできる第一歩は、自社商品と競合商品の★1から3のレビューを100件読むこと。そこに次の商品のヒントが必ずあります。個別のご相談は無料で受け付けていますので、概要欄のリンクから、あるいはWacworksで検索してください。今日はご視聴ありがとうございました。");
}

const OUT = path.join(__dirname, "..", "out", "Wacworks_これが欲しかった商品の作り方.pptx");
pptx.writeFile({ fileName: OUT }).then(() => console.log("WROTE", OUT, "slides:", P));
