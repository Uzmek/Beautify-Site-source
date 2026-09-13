// Trim only the external backdrop from the text-free reference edits.
// Do not mask subjects or bake live labels into these decorative photographs.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const source = process.argv[2];
if (!source) throw new Error('Pass the directory containing the four approved faithful edits.');
const target = path.resolve(__dirname, '../dist/assets/paywall-faithful-v2');
fs.mkdirSync(target, {recursive: true});
const crops = {
  hair: {left: 6, top: 58, width: 1218, height: 1160},
  bun: {left: 16, top: 59, width: 1188, height: 1185},
  care: {left: 9, top: 58, width: 1200, height: 1160},
  palette: {left: 28, top: 23, width: 2118, height: 662}
};
Promise.all(Object.entries(crops).map(async ([kind, crop]) => {
  const width = kind === 'palette' ? 1540 : kind === 'hair' ? 508 : kind === 'bun' ? 480 : 494;
  const height = kind === 'palette' ? 484 : 480;
  await sharp(path.join(source, `${kind}-faithful-glass.png`)).extract(crop)
    .resize(width, height, {fit: 'fill'}).webp({quality: 96, effort: 6})
    .toFile(path.join(target, `${kind}.webp`));
  console.log(`${kind}: ${width} × ${height}`);
})).catch(error => { console.error(error); process.exitCode = 1; });
