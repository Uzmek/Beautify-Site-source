// Encode independent generated masters for the app without cropping, upscaling,
// drawing over the artwork or discarding transparency. Keep original masters.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const input = process.argv[2];
if (!input) throw new Error('Pass the generated PNG master directory.');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist/assets/paywall-hq-v2');
const originals = path.join(root, 'docs/paywall-hq-originals');
fs.mkdirSync(output, {recursive: true});
fs.mkdirSync(originals, {recursive: true});
(async () => {
  const assets = [];
  for (const name of ['hero', 'silk', 'crown', 'palette', 'hair', 'bun', 'care']) {
    const source = path.join(input, `${name}.png`);
    const metadata = await sharp(source).metadata();
    if (Math.min(metadata.width, metadata.height) < 1024) throw new Error(`${name}: master too small`);
    if (!['hero', 'silk'].includes(name) && !metadata.hasAlpha) throw new Error(`${name}: missing transparent background`);
    fs.copyFileSync(source, path.join(originals, `${name}.png`));
    await sharp(source).webp({quality: 96, alphaQuality: 100, effort: 6}).toFile(path.join(output, `${name}.webp`));
    assets.push({name, width: metadata.width, height: metadata.height, alpha: metadata.hasAlpha, master: `docs/paywall-hq-originals/${name}.png`, app: `/assets/paywall-hq-v2/${name}.webp`});
  }
  fs.writeFileSync(path.join(originals, 'manifest.json'), JSON.stringify(assets, null, 2) + '\n');
  console.log(JSON.stringify(assets, null, 2));
})();
