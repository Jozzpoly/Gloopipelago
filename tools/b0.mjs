import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ARCHIVE = path.join(ROOT, 'archive/v1/gloopipelago_single.html');
const PREFIX = path.join(ROOT, 'src/browser/shell-prefix.html');
const APP = path.join(ROOT, 'src/browser/app.mjs');
const TAIL = path.join(ROOT, 'src/browser/shell-tail.html');
const CORE = path.join(ROOT, 'src/core/v1-mirror.mjs');
const OUT = path.join(ROOT, 'dist/gloopipelago.html');
const RECEIPT = path.join(ROOT, 'evidence/b0/browser-surface-receipt.json');

const START = 'function mulberry32(seed) {';
const UI = "const canvas = document.getElementById('world');";
const EXPECTED_OUTPUT = '9750e602ae61d712c64b046f130dac4c743e718d45c638ff423d5484aed9a5b0';
const EXPECTED_CORE = '77c5736b56a2c85799df8caaa221d85cb583c1ef63c1533b74102f73f86efd7b';
const sha256 = b => crypto.createHash('sha256').update(b).digest('hex');

function splitHistorical(text) {
  const start = text.indexOf(START);
  const ui = text.indexOf(UI);
  const end = text.indexOf('</script>', ui);
  assert(start >= 0 && ui > start && end > ui, 'Historical browser anchors missing');
  return { prefix:text.slice(0,start), app:text.slice(ui,end), tail:text.slice(end) };
}

function verify() {
  const archive = fs.readFileSync(ARCHIVE, 'utf8');
  const historical = splitHistorical(archive);
  const prefix = fs.readFileSync(PREFIX, 'utf8');
  const app = fs.readFileSync(APP, 'utf8');
  const tail = fs.readFileSync(TAIL, 'utf8');
  const coreBytes = fs.readFileSync(CORE);
  const output = fs.readFileSync(OUT);

  assert.equal(prefix, historical.prefix, 'Maintained prefix differs from qualified historical surface');
  assert.equal(app, historical.app, 'Maintained app/controller differs from qualified historical surface');
  assert.equal(tail, historical.tail, 'Maintained tail differs from qualified historical surface');
  assert.equal(sha256(coreBytes), EXPECTED_CORE, 'Maintained core changed during B0');
  assert.equal(sha256(output), EXPECTED_OUTPUT, 'B0 output differs from Owner-tested M1.2 artifact');

  const buildSource = fs.readFileSync(path.join(ROOT, 'tools/build-standalone.mjs'), 'utf8');
  assert(!buildSource.includes('archive/v1'), 'Current build still depends on frozen archive');

  const receipt = {
    format:'gloopipelago-b0-browser-surface-receipt',
    schema:1,
    status:'PASS',
    historicalArchive:'archive/v1/gloopipelago_single.html',
    archiveRole:'qualification-only',
    liveBuildReadsArchive:false,
    exactHistoricalPrefix:true,
    exactHistoricalApp:true,
    exactHistoricalTail:true,
    prefixSha256:sha256(Buffer.from(prefix)),
    appSha256:sha256(Buffer.from(app)),
    tailSha256:sha256(Buffer.from(tail)),
    coreSha256:sha256(coreBytes),
    outputSha256:sha256(output),
    outputBytes:output.length,
    ownerRetestRequired:false,
    ownerRetestReason:'Generated artifact is byte-identical to the already Owner-tested M1.2 artifact.'
  };
  fs.writeFileSync(RECEIPT, JSON.stringify(receipt, null, 2) + '\n');
  return receipt;
}

const cmd = process.argv[2] ?? 'help';
if (cmd === 'verify') console.log(JSON.stringify(verify(), null, 2));
else console.log('Usage: node tools/b0.mjs verify');
