import { writeFile } from 'node:fs/promises';

const INDEX = 'https://welcher-tag-ist-heute.org/aktionstage/';
const YEAR = Number(process.env.TARGET_YEAR || new Date().getUTCFullYear());
const OUT = new URL('../aktionstage_welcher_tag_pruefung.md', import.meta.url);
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const delay = Number(process.env.IMPORT_DELAY_MS || 120);
const concurrency = Number(process.env.IMPORT_CONCURRENCY || 6);

async function get(url, tries = 3) {
  for (let attempt = 1; attempt <= tries; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20000);
      const response = await fetch(url, {
        redirect: 'follow',
        signal: controller.signal,
        headers: { 'user-agent': 'skalironauten-sync-helper/1.0 (+https://github.com/mgummich/skalironauten-sync-helper)' },
      });
      clearTimeout(timer);
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return await response.text();
    } catch (error) {
      if (attempt === tries) throw error;
      await wait(400 * attempt);
    }
  }
}

function ent(s) {
  return s
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ').replace(/&auml;/g, 'ä').replace(/&ouml;/g, 'ö').replace(/&uuml;/g, 'ü')
    .replace(/&Auml;/g, 'Ä').replace(/&Ouml;/g, 'Ö').replace(/&Uuml;/g, 'Ü').replace(/&szlig;/g, 'ß')
    .replace(/&#(\d+);/g, (_, x) => String.fromCodePoint(+x));
}

function text(html) {
  return ent(html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ').trim();
}

function links(html) {
  const out = new Map();
  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    if (!/\/aktionstage\//i.test(match[1])) continue;
    try {
      const url = new URL(ent(match[1]), INDEX);
      url.hash = '';
      url.search = '';
      if (url.hostname !== 'welcher-tag-ist-heute.org' || /\/aktionstage\/$/i.test(url.pathname)) continue;
      const name = text(match[2]);
      if (name && name.toLocaleLowerCase('de-DE') !== 'aktionstage') out.set(url.href.toLowerCase(), { url: url.href, name });
    } catch {}
  }
  return [...out.values()];
}

function date(html) {
  const plain = text(html);
  for (const match of plain.matchAll(/\bam\s+(\d{1,2})\.(\d{1,2})\.(\d{4})\b/g)) {
    if (+match[3] === YEAR) return { day: +match[1], month: +match[2] };
  }
  const match = plain.match(/findet\s+(?:jedes\s+jahr|jährlich)\s+am\s+(\d{1,2})\.?\s*(Januar|Februar|März|Maerz|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember)/i);
  if (!match) return null;
  const months = { januar:1, februar:2, märz:3, maerz:3, april:4, mai:5, juni:6, juli:7, august:8, september:9, oktober:10, november:11, dezember:12 };
  return { day: +match[1], month: months[match[2].toLocaleLowerCase('de-DE')] };
}

async function pool(items, fn) {
  let i = 0;
  const out = new Array(items.length);
  async function worker() {
    for (;;) {
      const x = i++;
      if (x >= items.length) return;
      out[x] = await fn(items[x], x);
      await wait(delay);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return out;
}

const months = [null, 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

async function main() {
  const discovered = links(await get(INDEX));
  if (discovered.length < 500) throw new Error(`Only ${discovered.length} action links discovered`);
  const details = await pool(discovered, async (entry, index) => {
    try {
      const html = await get(entry.url);
      const d = date(html);
      process.stdout.write(`\r${index + 1}/${discovered.length}`);
      return { ...entry, day: d?.day ?? null, month: d?.month ?? null };
    } catch (error) {
      return { ...entry, day: null, month: null, error: error.message };
    }
  });
  process.stdout.write('\n');

  details.sort((a, b) => (a.month ?? 99) - (b.month ?? 99) || (a.day ?? 99) - (b.day ?? 99) || a.name.localeCompare(b.name, 'de'));

  const lines = [
    '# Aktionstage von welcher-tag-ist-heute.org',
    '',
    '> Prüffassung: Name, Datum und Detail-URL direkt aus dem Crawl. Noch keine Quellenrecherche und keine Übernahme in `aktionstage.json`.',
    '',
    `- Gefundene eindeutige Detailseiten: **${details.length}**`,
    `- Zieljahr für variable Datumsangaben: **${YEAR}**`,
    '',
  ];

  let currentMonth = -1;
  for (const entry of details) {
    const month = entry.month ?? 0;
    if (month !== currentMonth) {
      currentMonth = month;
      lines.push(`## ${month ? months[month] : 'Datum nicht aufgelöst'}`, '');
    }
    const label = entry.day && entry.month ? `${String(entry.day).padStart(2, '0')}.${String(entry.month).padStart(2, '0')}.` : 'Datum offen';
    lines.push(`- **${label} – ${entry.name}**  `, `  ${entry.url}`);
  }

  lines.push('', '## Prüfhinweise', '', '- Diese Datei ist nur zur Sichtprüfung gedacht.', '- `welcher-tag-ist-heute.org` ist hier lediglich die Entdeckungsquelle.', '- Primär-/offizielle Quellen werden erst nach Freigabe dieser Liste ergänzt.');
  await writeFile(OUT, `${lines.join('\n')}\n`);
  console.log(`Wrote ${details.length} entries to ${OUT.pathname}`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
