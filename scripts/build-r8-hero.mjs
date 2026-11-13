// Match the generated sky inside the original white glyphs; preserve every other pixel.
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const manifestPath = new URL("../docs/rely-r8-hero-text-removal.json", import.meta.url);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const root = new URL("../", import.meta.url);

for (const record of manifest.records) {
  const source = new URL(record.original, root);
  const patch = new URL(record.patch, root);
  const target = new URL(record.target, root);
  const { data, info } = await sharp(await readFile(patch)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  if (info.width !== record.box.width || info.height !== record.box.height) throw new Error("Patch dimensions changed");
  const originalBytes = await readFile(source);
  const background = await sharp(originalBytes).extract(record.box).removeAlpha().raw().toBuffer();
  const mask = new Uint8Array(info.width * info.height);
  for (let y = 11; y < info.height - 11; y++) for (let x = 11; x < info.width - 11; x++) {
    const offset = (y * info.width + x) * 3;
    const minimum = Math.min(background[offset], background[offset + 1], background[offset + 2]);
    const maximum = Math.max(background[offset], background[offset + 1], background[offset + 2]);
    if (minimum < 225 || maximum - minimum > 28) continue;
    // Include antialiasing and the source JPEG's compression halo around the letters.
    for (let dy = -10; dy <= 10; dy++) for (let dx = -10; dx <= 10; dx++) if (dx * dx + dy * dy <= 100) mask[(y + dy) * info.width + x + dx] = 1;
  }
  const pixels = Array.from(mask.keys()).filter(index => mask[index]);
  const matched = Float32Array.from(background);
  const guidance = new Float32Array(pixels.length * 3);
  for (let n = 0; n < pixels.length; n++) {
    const index = pixels[n];
    for (let channel = 0; channel < 3; channel++) {
      matched[index * 3 + channel] = data[index * 4 + channel];
      guidance[n * 3 + channel] = 4 * data[index * 4 + channel]
        - data[(index - 1) * 4 + channel] - data[(index + 1) * 4 + channel]
        - data[(index - info.width) * 4 + channel] - data[(index + info.width) * 4 + channel];
    }
  }
  // Poisson matching joins generated cloud detail to the untouched sky along each glyph.
  for (let iteration = 0; iteration < 800; iteration++) {
    let delta = 0;
    for (let n = 0; n < pixels.length; n++) {
      const index = pixels[n];
      for (let channel = 0; channel < 3; channel++) {
        const offset = index * 3 + channel;
        const average = (matched[offset - 3] + matched[offset + 3] + matched[offset - info.width * 3] + matched[offset + info.width * 3] + guidance[n * 3 + channel]) / 4;
        const value = Math.max(0, Math.min(255, matched[offset] + 1.5 * (average - matched[offset])));
        delta = Math.max(delta, Math.abs(value - matched[offset]));
        matched[offset] = value;
      }
    }
    if (iteration > 50 && delta < .01) break;
  }
  for (let index = 0; index < mask.length; index++) {
    data[index * 4 + 3] = mask[index] ? 255 : 0;
    if (mask[index]) for (let channel = 0; channel < 3; channel++) data[index * 4 + channel] = Math.round(matched[index * 3 + channel]);
  }
  const overlay = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
  const finalBytes = await sharp(originalBytes).composite([{ input: overlay, left: record.box.left, top: record.box.top }]).webp({ lossless: true, effort: 6 }).toBuffer();
  const original = await sharp(originalBytes).removeAlpha().raw().toBuffer();
  const result = await sharp(finalBytes).removeAlpha().raw().toBuffer();
  let changed = 0;
  for (let y = 0; y < record.height; y++) for (let x = 0; x < record.width; x++) {
    if (x >= record.box.left && x < record.box.left + info.width && y >= record.box.top && y < record.box.top + info.height) continue;
    const index = (y * record.width + x) * 3;
    if (original[index] !== result[index] || original[index + 1] !== result[index + 1] || original[index + 2] !== result[index + 2]) changed++;
  }
  if (changed) throw new Error(`${record.name}: pixels outside the text area changed`);
  await writeFile(target, finalBytes);
  record.outsideTextAreaChangedPixels = changed;
  record.editedGlyphPixels = pixels.length;
  record.method = "Built-in imagegen sky reconstruction; glyph mask and Poisson boundary matching; lossless WebP with unchanged pixels outside the lettering";
  record.bytes = finalBytes.length;
  record.sha256 = createHash("sha256").update(finalBytes).digest("hex");
  console.log(`${record.name}: saved; all pixels outside text area preserved`);
}
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
