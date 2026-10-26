// Turns the camera originals in photos/ into the web-sized WebP files the site
// actually serves. Run with `npm run images` after adding or replacing a photo,
// then commit what lands in public/.
//
// The originals are portrait 3:4 straight off a phone, up to 3.4 MB each. The
// grid crops them square and the About box crops them 4:3, so those crops are
// baked in here rather than paid for in bytes and then thrown away by CSS.

import { mkdir, readdir, rm, stat } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

import { SIZES } from '../src/imageSizes.js';

const SRC_GALLERY = 'photos/gallery';
const SRC_ABOUT = 'photos/about';
const OUT = 'public';

// Explicit order: this is the order the gallery renders, carried over from the
// original site. Adding a photo means adding a line here.
const GALLERY = [
  'after1.jpg',
  'IMG_2844.JPG',
  'IMG_6175.JPG',
  'IMG_6176.JPG',
  'IMG_6177.jpg',
  'IMG_6178.JPG',
  'IMG_6179.JPG',
  'IMG_6182.JPG',
  'IMG_6183.JPG',
  'IMG_6184.jpg',
  'IMG_6185.jpg',
  'IMG_6186.JPG',
  'IMG_6187.JPG',
  'IMG_6188.JPG',
  'IMG_6189.JPG',
  'IMG_6190.JPG',
  'IMG_6191.JPG',
  'insiteafter1.jpg',
];

const ABOUT = ['1.JPG', '2.JPG', '3.JPG', '4.JPG'];

// The hero is a background behind an 85% dark overlay, so it reads as texture.
// This one shows a bay window install, which is what the headline leads with.
const HERO_SOURCE = 'after1.jpg';

// The home-screen icon. index.html and manifest.json used to point at a
// logo.png that has never existed in this repo, so both were 404s. The only
// master is the transparent logo in public/, which is why this one source
// comes from the output directory rather than photos/.
const ICON_SOURCE = join(OUT, 'logo-transparent-bg.png');
const ICON_SIZES = [180, 512];

// Dimensions live in src/imageSizes.js so the components can reserve the same
// boxes with width/height. Only the encoder quality is decided here.
const QUALITY = {
  galleryThumb: 74,
  galleryFull: 80,
  about: 80,
  hero: 78,
};
const opts = (key) => ({ ...SIZES[key], quality: QUALITY[key] });

const pad = (n) => String(n).padStart(2, '0');
const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

async function sizeOf(path) {
  return (await stat(path)).size;
}

async function cover(src, dest, { width, height, quality }) {
  await sharp(src)
    .rotate() // honour EXIF orientation before cropping
    .resize(width, height, { fit: 'cover', position: 'centre' })
    .webp({ quality })
    .toFile(dest);
  return sizeOf(dest);
}

async function contain(src, dest, { width, height, quality }) {
  await sharp(src)
    .rotate()
    .resize(width, height, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality })
    .toFile(dest);
  return sizeOf(dest);
}

// Square, padded, and flattened onto white: the logo is transparent and iOS
// composites a transparent icon onto black.
async function icon(src, dest, size) {
  const pad = Math.round(size * 0.08);
  const white = { r: 255, g: 255, b: 255, alpha: 1 };
  await sharp(src)
    .resize(size - pad * 2, size - pad * 2, { fit: 'contain', background: white })
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: white })
    .flatten({ background: white })
    .png()
    .toFile(dest);
  return sizeOf(dest);
}

async function main() {
  for (const dir of ['gallery/thumb', 'gallery/full', 'about']) {
    await rm(join(OUT, dir), { recursive: true, force: true });
    await mkdir(join(OUT, dir), { recursive: true });
  }

  let sourceBytes = 0;
  let outputBytes = 0;

  for (const [i, file] of GALLERY.entries()) {
    const src = join(SRC_GALLERY, file);
    const name = `gallery-${pad(i + 1)}.webp`;
    sourceBytes += await sizeOf(src);
    outputBytes += await cover(src, join(OUT, 'gallery/thumb', name), opts('galleryThumb'));
    outputBytes += await contain(src, join(OUT, 'gallery/full', name), opts('galleryFull'));
  }

  for (const [i, file] of ABOUT.entries()) {
    const src = join(SRC_ABOUT, file);
    sourceBytes += await sizeOf(src);
    outputBytes += await cover(src, join(OUT, 'about', `about-${i + 1}.webp`), opts('about'));
  }

  const heroBytes = await cover(join(SRC_GALLERY, HERO_SOURCE), join(OUT, 'hero.webp'), opts('hero'));
  outputBytes += heroBytes;

  let iconBytes = 0;
  for (const size of ICON_SIZES) {
    iconBytes += await icon(ICON_SOURCE, join(OUT, `icon-${size}.png`), size);
  }
  outputBytes += iconBytes;

  const counts = await Promise.all(
    ['gallery/thumb', 'gallery/full', 'about'].map(async (d) => (await readdir(join(OUT, d))).length)
  );

  console.log(`gallery thumbs  ${counts[0]}`);
  console.log(`gallery full    ${counts[1]}`);
  console.log(`about           ${counts[2]}`);
  console.log(`hero            1  (${kb(heroBytes)})`);
  console.log(`icons           ${ICON_SIZES.length}  (${kb(iconBytes)})`);
  console.log('');
  console.log(`originals       ${kb(sourceBytes)}`);
  console.log(`generated       ${kb(outputBytes)}`);
}

await main();
