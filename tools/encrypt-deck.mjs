#!/usr/bin/env node
// Publishes a slide deck from decks-src/<slug>/ into assets/decks/<slug>/.
//
//   node tools/encrypt-deck.mjs <slug> "<Title>"            password-protected
//   node tools/encrypt-deck.mjs <slug> "<Title>" --public   plain images
//
// Slides are the .webp files in decks-src/<slug>/, in filename order.
// decks-src/ is gitignored, so the plaintext never reaches GitHub.
//
// Protected decks: the password is stretched with PBKDF2-SHA256 into an
// AES-256-GCM key, and each slide is written as iv ‖ ciphertext ‖ tag —
// the layout Web Crypto's decrypt() expects, so the viewer in index.html
// can open them in the browser. The password is read from a hidden
// prompt (or DECK_PASSWORD) and is never written anywhere.

import { readdir, readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { createCipheriv, pbkdf2Sync, randomBytes } from 'node:crypto';
import { createInterface } from 'node:readline';
import path from 'node:path';

const ITERATIONS = 600000;

const [slug, title, flag] = process.argv.slice(2);
if (!slug || !title) {
  console.error('usage: node tools/encrypt-deck.mjs <slug> "<Title>" [--public]');
  process.exit(1);
}
const isPublic = flag === '--public';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const srcDir = path.join(root, 'decks-src', slug);
const outDir = path.join(root, 'assets', 'decks', slug);

function askHidden(prompt) {
  return new Promise(resolve => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = s => { if (!rl.muted) rl.output.write(s); };
    rl.question(prompt, answer => {
      rl.close();
      process.stdout.write('\n');
      resolve(answer);
    });
    rl.muted = true; // set after question() has printed the prompt
  });
}

const slides = (await readdir(srcDir)).filter(f => f.endsWith('.webp')).sort();
if (!slides.length) {
  console.error(`No .webp slides in ${srcDir}`);
  process.exit(1);
}

let key, salt;
if (!isPublic) {
  let password = process.env.DECK_PASSWORD;
  if (!password) {
    password = await askHidden('Deck password: ');
    if (password !== await askHidden('Confirm password: ')) {
      console.error('Passwords did not match.');
      process.exit(1);
    }
  }
  if (!password) {
    console.error('Empty password.');
    process.exit(1);
  }
  salt = randomBytes(16);
  key = pbkdf2Sync(password, salt, ITERATIONS, 32, 'sha256');
}

// Start clean so stale slides (or a previous public export) don't linger
await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const ext = isPublic ? 'webp' : 'bin';
for (const [i, file] of slides.entries()) {
  const data = await readFile(path.join(srcDir, file));
  const name = `${String(i + 1).padStart(2, '0')}.${ext}`;
  if (isPublic) {
    await writeFile(path.join(outDir, name), data);
  } else {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const body = Buffer.concat([cipher.update(data), cipher.final()]);
    await writeFile(path.join(outDir, name), Buffer.concat([iv, body, cipher.getAuthTag()]));
  }
}

const manifest = { title, count: slides.length, ext };
if (!isPublic) {
  manifest.kdf = { name: 'PBKDF2', hash: 'SHA-256', iterations: ITERATIONS, salt: salt.toString('base64') };
}
await writeFile(path.join(outDir, 'deck.json'), JSON.stringify(manifest, null, 2) + '\n');

console.log(`${isPublic ? 'Published' : 'Encrypted'} ${slides.length} slides → assets/decks/${slug}/`);
