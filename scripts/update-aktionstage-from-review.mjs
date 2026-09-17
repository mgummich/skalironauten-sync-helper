import { readFile, writeFile } from 'node:fs/promises';

const JSON_FILE = new URL('../aktionstage.json', import.meta.url);
const REVIEW_FILE = new URL('../aktionstage_gesamt_pruefung.md', import.meta.url);

function normalize(value = '') {
  return value
    .toLocaleLowerCase('de-DE')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    .replace(/&/g, ' und ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\b(der|die|das|den|dem|des|ein|eine|einen|einem|einer)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokens(value) {
  return new Set(normalize(value).split(' ').filter((x) => x.length > 1));
}

function similarity(a, b) {
  const A = tokens(a);
  const B = tokens(b);
  if (!A.size || !B.size) return 0;
  let overlap = 0;
  for (const x of A) if (B.has(x)) overlap++;
  return overlap / Math.max(A.size, B.size);
}

function sameEnough(a, b) {
  const A = normalize(a);
  const B = normalize(b);
  if (!A || !B) return false;
  if (A === B) return true;
  if (A.length >= 8 && B.length >= 8 && (A.includes(B) || B.includes(A))) return true;
  return similarity(a, b) >= 0.8;
}

function parseReview(md) {
  const lines = md.split(/\r?\n/);
  const out = [];
  let current = null;

  for (const line of lines) {
    const header = line.match(/^- \*\*(\d{2})\.(\d{2})\. – (.+?)\*\*(?:\s+_\((.+?)\)_)?\s{0,2}$/);
    if (header) {
      if (current) out.push(current);
      current = {
        day: Number(header[1]),
        month: Number(header[2]),
        name: header[3].trim(),
        status: header[4]?.trim() ?? '',
        welcher: null,
        kuriose: null,
      };
      continue;
    }
    if (!current) continue;
    const welcher = line.match(/^\s+- welcher-tag-ist-heute:\s+(https:\/\/\S+)/);
    if (welcher) current.welcher = welcher[1];
    const kuriose = line.match(/^\s+- kuriose-feiertage:\s+(https:\/\/\S+)/);
    if (kuriose) current.kuriose = kuriose[1];
  }
  if (current) out.push(current);
  return out;
}

function makeNew(entry) {
  const isKurioseOnly = Boolean(entry.kuriose && !entry.welcher);
  const source = entry.welcher || entry.kuriose;
  return {
    name: entry.name,
    category: isKurioseOnly ? 'Fun & Kuriose Tage' : 'Kultur & Gesellschaft',
    region: 'International',
    month: entry.month,
    day: entry.day,
    beschreibung: `${isKurioseOnly ? 'Kurioser ' : ''}Gedenk- und Aktionstag (${entry.name}).`,
    quelle: source,
  };
}

const existing = JSON.parse(await readFile(JSON_FILE, 'utf8'));
const review = parseReview(await readFile(REVIEW_FILE, 'utf8'));

if (review.length < 2500) {
  throw new Error(`Unified review parse unexpectedly small: ${review.length}`);
}

const merged = [...existing];
let added = 0;
let preserved = 0;

for (const candidate of review) {
  const matches = merged.filter((x) => x.month === candidate.month && x.day === candidate.day);
  if (matches.some((x) => sameEnough(x.name, candidate.name))) {
    preserved++;
    continue;
  }
  merged.push(makeNew(candidate));
  added++;
}

merged.sort((a, b) =>
  a.month - b.month ||
  a.day - b.day ||
  a.name.localeCompare(b.name, 'de')
);

await writeFile(JSON_FILE, `${JSON.stringify(merged, null, 2)}\n`);
console.log(`Existing entries: ${existing.length}`);
console.log(`Review entries: ${review.length}`);
console.log(`Matched existing: ${preserved}`);
console.log(`Added new: ${added}`);
console.log(`Final entries: ${merged.length}`);
