import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PREFIX = path.join(ROOT, 'src/browser/shell-prefix.html');
const CORE = path.join(ROOT, 'src/core/v1-mirror.mjs');
const APP = path.join(ROOT, 'src/browser/app.mjs');
const TAIL = path.join(ROOT, 'src/browser/shell-tail.html');
const OUT = path.join(ROOT, 'dist/gloopipelago.html');

const sha256 = b => crypto.createHash('sha256').update(b).digest('hex');

function buildText() {
  const prefix = fs.readFileSync(PREFIX, 'utf8');
  const core = fs.readFileSync(CORE, 'utf8').trimEnd() + '\n\n';
  const app = fs.readFileSync(APP, 'utf8');
  const tail = fs.readFileSync(TAIL, 'utf8');
  return { text: prefix + core + app + tail, prefix, core, app, tail };
}

function syntaxCheck(text) {
  const open = text.indexOf('<script type="module">');
  const start = open + '<script type="module">'.length;
  const end = text.indexOf('</script>', start);
  assert(open >= 0 && end > start, 'Inline module not found');
  const tmp = path.join(ROOT, '.browser-inline-check.mjs');
  fs.writeFileSync(tmp, text.slice(start, end));
  const r = spawnSync(process.execPath, ['--check', tmp], { encoding:'utf8' });
  fs.rmSync(tmp, { force:true });
  assert.equal(r.status, 0, `Inline module syntax failed: ${r.stderr || r.stdout}`);
}

function receipt(parts) {
  return {
    format:'gloopipelago-standalone-build-receipt',
    schema:1,
    sources:{
      prefix:'src/browser/shell-prefix.html',
      core:'src/core/v1-mirror.mjs',
      app:'src/browser/app.mjs',
      tail:'src/browser/shell-tail.html'
    },
    output:'dist/gloopipelago.html',
    prefixSha256:sha256(Buffer.from(parts.prefix)),
    coreSha256:sha256(fs.readFileSync(CORE)),
    appSha256:sha256(Buffer.from(parts.app)),
    tailSha256:sha256(Buffer.from(parts.tail)),
    outputSha256:sha256(Buffer.from(parts.text)),
    outputBytes:Buffer.byteLength(parts.text),
    standaloneNoExternalScript:!parts.text.includes('src="'),
    syntaxCheck:'PASS'
  };
}

function build() {
  const parts = buildText();
  syntaxCheck(parts.text);
  fs.mkdirSync(path.dirname(OUT), { recursive:true });
  fs.writeFileSync(OUT, parts.text);
  const second = buildText().text;
  assert.equal(second, parts.text, 'Build is not deterministic');
  return receipt(parts);
}

function verify() {
  assert(fs.existsSync(OUT), 'Generated artifact missing; run build first');
  const parts = buildText();
  const disk = fs.readFileSync(OUT, 'utf8');
  assert.equal(disk, parts.text, 'dist artifact is stale or hand-edited');
  syntaxCheck(disk);
  return receipt(parts);
}

const cmd = process.argv[2] ?? 'help';
if (cmd === 'build') console.log(JSON.stringify(build(), null, 2));
else if (cmd === 'verify') console.log(JSON.stringify(verify(), null, 2));
else console.log('Usage: node tools/build-standalone.mjs <build|verify>');
