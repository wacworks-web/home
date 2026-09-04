// Wacworks house design system (extracted from META広告_ECモールセール完全解説_Wacworks)
const path = require("path");
const ASSETS = path.join(__dirname, "..", "assets");

const C = {
  ink:    "0E1B2C",  // headings
  body:   "3A4A61",  // body copy
  blue:   "1E6FE8",  // accent
  muted:  "7A8AA3",  // captions
  faint:  "A6B4C9",  // footer on light
  tint:   "F2F6FD",  // card fill
  tint2:  "E8F0FC",  // band fill
  edge:   "C9DAF5",
  edge2:  "AFC6E8",
  red:    "BF0000",
  redTint:"FCE9EB",
  amber:  "E8830C",
  gold:   "F5B60D",
  white:  "FFFFFF",
  dkPlate:"16294A",
  dkEdge: "2E4A7A",
  dkFoot: "5E7396",
  onDarkEyebrow: "8FBCFF",
  onDarkSub:     "C9DAF5",
  onDarkSub2:    "AFC6E8",
  onBlueSub:     "EAF2FF",
};

const F = "Arial";
const M = 0.65;        // left margin
const CW = 12.03;      // content width
const RIGHT = M + CW;  // 12.68

const LOGO = { x: 11.18, y: 0.5, w: 1.5, h: 0.17 };

const pad = (n) => String(n).padStart(2, "0");

// ---- chrome -------------------------------------------------------------
function chromeLight(s, page) {
  s.background = { color: C.white };
  s.addImage({ path: path.join(ASSETS, "logo_black.png"), ...LOGO });
  s.addText("© Wacworks Inc.", {
    x: M, y: 7.12, w: 2.5, h: 0.3, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 8.5, color: C.faint, valign: "middle",
  });
  s.addText(pad(page), {
    x: 12.23, y: 7.12, w: 0.5, h: 0.3, isTextBox: true, margin: 0, align: "right",
    fontFace: F, fontSize: 8.5, color: C.faint, valign: "middle",
  });
}

function chromeDark(s, page) {
  s.background = { path: path.join(ASSETS, "bg_dark.jpg") };
  s.addImage({ path: path.join(ASSETS, "logo_white.png"), ...LOGO });
  s.addText("© Wacworks Inc.", {
    x: M, y: 7.12, w: 2.5, h: 0.3, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 8.5, color: C.dkFoot, valign: "middle",
  });
  s.addText(pad(page), {
    x: 12.23, y: 7.12, w: 0.5, h: 0.3, isTextBox: true, margin: 0, align: "right",
    fontFace: F, fontSize: 8.5, color: C.dkFoot, valign: "middle",
  });
}

// eyebrow + title block used on every content slide
function head(s, eyebrow, title, titleSize) {
  s.addText(eyebrow, {
    x: M, y: 0.42, w: 9.0, h: 0.32, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 11, bold: true, color: C.blue, charSpacing: 1.2, valign: "middle",
  });
  s.addText(title, {
    x: M, y: 0.72, w: CW, h: 0.68, isTextBox: true, margin: 0,
    fontFace: F, fontSize: titleSize || 26, bold: true, color: C.ink, valign: "middle",
  });
}

// ---- primitives ---------------------------------------------------------
function card(s, o) {
  s.addShape("roundRect", {
    x: o.x, y: o.y, w: o.w, h: o.h, rectRadius: o.r === undefined ? 0.08 : o.r,
    fill: { color: o.fill || C.tint },
    line: o.line ? { color: o.line, width: o.lw || 1 } : { type: "none" },
  });
}

function circle(s, o) {
  s.addShape("ellipse", {
    x: o.x, y: o.y, w: o.d, h: o.d,
    fill: { color: o.fill },
    line: o.line ? { color: o.line, width: o.lw || 1 } : { type: "none" },
  });
}

// numbered/label token inside a filled circle
function badge(s, o) {
  circle(s, { x: o.x, y: o.y, d: o.d, fill: o.fill || C.blue });
  s.addText(o.text, {
    x: o.x, y: o.y, w: o.d, h: o.d, isTextBox: true, margin: 0,
    align: "center", valign: "middle",
    fontFace: F, fontSize: o.size || 16, bold: true, color: o.color || C.white,
  });
}

function txt(s, text, o) {
  s.addText(text, Object.assign({
    isTextBox: true, margin: 0, fontFace: F, valign: "top",
  }, o));
}

// bottom conclusion strip (house pattern: label in blue + statement in ink)
function band(s, label, statement, o) {
  o = o || {};
  const y = o.y === undefined ? 5.55 : o.y;
  const h = o.h === undefined ? 1.1 : o.h;
  card(s, { x: M, y, w: CW, h, fill: o.fill || C.tint2, r: 0.09 });
  const runs = [];
  if (label) runs.push({ text: label, options: { bold: true, color: C.blue } });
  runs.push({ text: statement, options: { bold: true, color: o.color || C.ink } });
  s.addText(runs, {
    x: M + 0.4, y, w: CW - 0.8, h, isTextBox: true, margin: 0,
    fontFace: F, fontSize: o.size || 17, valign: "middle", align: o.align || "left",
  });
}

// small right-pointing arrow head between flow steps
function arrowRight(s, o) {
  s.addShape("triangle", {
    x: o.x, y: o.y, w: o.w || 0.16, h: o.h || 0.2,
    rotate: 90, fill: { color: o.color || C.edge2 }, line: { type: "none" },
  });
}
// right-pointing connector between flow steps, centred on (cx, cy).
// A real shape, not the "▶" character: emoji-presentation fonts hijack that glyph
// and render it as a coloured emoji, ignoring the run colour.
function chevron(s, o) {
  const w = o.size === undefined ? 0.18 : o.size;
  const h = w * 0.78;
  s.addShape("triangle", {
    x: o.cx - w / 2, y: o.cy - h / 2, w, h,
    rotate: 90, fill: { color: o.color || C.blue }, line: { type: "none" },
  });
}

// same, pointing in any of the four directions (rotate: 0=up, 90=right, 180=down, 270=left)
function tri(s, o) {
  const w = o.size === undefined ? 0.18 : o.size;
  const h = w * 0.78;
  const rot = o.rotate || 0;
  const swap = rot === 90 || rot === 270;
  s.addShape("triangle", {
    x: o.cx - (swap ? w : w) / 2, y: o.cy - h / 2, w, h,
    rotate: rot, fill: { color: o.color || C.blue }, line: { type: "none" },
  });
}

function arrowDown(s, o) {
  s.addShape("triangle", {
    x: o.x, y: o.y, w: o.w || 0.2, h: o.h || 0.16,
    rotate: 180, fill: { color: o.color || C.edge2 }, line: { type: "none" },
  });
}

module.exports = { C, F, M, CW, RIGHT, LOGO, pad, chromeLight, chromeDark, head, card, circle, badge, txt, band, arrowRight, arrowDown, chevron, tri, ASSETS };
