// Render react-icons to white PNGs, matching the house style (white glyph in a blue circle)
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const Fi = require("react-icons/fi");

const OUT = path.join(__dirname, "..", "assets", "icons");
fs.mkdirSync(OUT, { recursive: true });

const WANTED = {
  store:    "FiShoppingBag",
  trending: "FiTrendingUp",
  repeat:   "FiRefreshCw",
};

(async () => {
  for (const [name, comp] of Object.entries(WANTED)) {
    const Icon = Fi[comp];
    if (!Icon) { console.error("missing icon", comp); continue; }
    let svg = renderToStaticMarkup(React.createElement(Icon, { color: "#FFFFFF", size: 256, strokeWidth: 2 }));
    if (!svg.includes("xmlns=")) svg = svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
    const buf = await sharp(Buffer.from(svg)).resize(256, 256, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
    fs.writeFileSync(path.join(OUT, name + ".png"), buf);
    console.log("wrote", name + ".png", buf.length, "bytes");
  }
})();
