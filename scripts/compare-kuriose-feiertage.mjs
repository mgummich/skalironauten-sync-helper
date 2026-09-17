import { readFile, writeFile } from 'node:fs/promises';

const SOURCE = new URL('../aktionstage_welcher_tag_pruefung.md', import.meta.url);
const OUT = new URL('../aktionstage_kuriose_feiertage_abgleich.md', import.meta.url);
const BASE = 'https://www.kuriose-feiertage.de';
const MONTHS = ['januar','februar','maerz','april','mai','juni','juli','august','september','oktober','november','dezember'];
const MONTH_LABELS = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];

async function get(url, tries = 3) {
  for (let attempt = 1; attempt <= tries; attempt++) {
    try {
      const c = new AbortController();
      const t = setTimeout(() => c.abort(), 20000);
      const r = await fetch(url, { signal: c.signal, redirect: 'follow', headers: { 'user-agent': 'skalironauten-sync-helper/1.0 (+https://github.com/mgummich/skalironauten-sync-helper)' } });
      clearTimeout(t);
      if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
      return await r.text();
    } catch (e) {
      if (attempt === tries) throw e;
      await new Promise((r) => setTimeout(r, 500 * attempt));
    }
  }
}

function ent(s) {
  return s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#0?39;|&apos;/g,"'").replace(/&nbsp;/g,' ')
    .replace(/&auml;/g,'ä').replace(/&ouml;/g,'ö').replace(/&uuml;/g,'ü').replace(/&Auml;/g,'Ä').replace(/&Ouml;/g,'Ö').replace(/&Uuml;/g,'Ü').replace(/&szlig;/g,'ß')
    .replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(+n));
}
function text(s) { return ent(s.replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim(); }
function norm(s) {
  return s.toLocaleLowerCase('de-DE').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/ß/g,'ss').replace(/&/g,' und ').replace(/[^a-z0-9]+/g,' ').trim()
    .replace(/\b(der|die|das|den|dem|des|ein|eine|einen|einem|einer)\b/g,' ').replace(/\s+/g,' ').trim();
}
function coreName(s) {
  return s.split(/\s+[–—]\s+|\s+-\s+/)[0].replace(/\s+(?:in den|in der|in|aus)\s+(?:USA|Vereinigten Staaten|Deutschland|Großbritannien|Kanada|Japan).*$/i,'').trim();
}
function tokens(s) { return new Set(norm(s).split(' ').filter((x)=>x.length>1)); }
function sim(a,b) {
  const A=tokens(a), B=tokens(b); if(!A.size||!B.size) return 0;
  let i=0; for(const x of A) if(B.has(x)) i++;
  return i / Math.max(A.size,B.size);
}
function equivalent(a,b) {
  const A=norm(a), B=norm(coreName(b));
  if (!A || !B) return false;
  if (A===B) return true;
  if (A.length>=8 && B.length>=8 && (A.includes(B)||B.includes(A))) return true;
  return false;
}

function parseSource(md) {
  const rows=[];
  const re=/- \*\*(\d{2})\.(\d{2})\. – (.+?)\*\*\s{2}\n\s+(https:\/\/welcher-tag-ist-heute\.org\/[^\s]+)/g;
  for(const m of md.matchAll(re)) rows.push({day:+m[1],month:+m[2],name:m[3].trim(),url:m[4]});
  return rows;
}

function parseKuriose(html, month) {
  const cleaned=html.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ');
  const tokenRe=/<h[2-4]\b[^>]*>([\s\S]*?)<\/h[2-4]>|<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let day=null; const out=[]; const seen=new Set();
  for(const m of cleaned.matchAll(tokenRe)) {
    if(m[1]!==undefined) {
      const h=text(m[1]); const dm=h.match(/^(\d{1,2})\.\s*(?:[A-Za-zÄÖÜäöüß]+)?/);
      if(dm && +dm[1]>=1 && +dm[1]<=31) day=+dm[1];
      continue;
    }
    if(!day) continue;
    let u; try { u=new URL(ent(m[2]),BASE); } catch { continue; }
    if(u.hostname!=='www.kuriose-feiertage.de' && u.hostname!=='kuriose-feiertage.de') continue;
    if(u.pathname.startsWith('/kalender/') || u.pathname==='/' || u.pathname.length<3) continue;
    const name=text(m[3]); if(!name || name.length<3 || name.length>220) continue;
    const key=`${month}-${day}-${u.pathname}`; if(seen.has(key)) continue; seen.add(key);
    out.push({day,month,name,url:u.href});
  }
  return out;
}

const source=parseSource(await readFile(SOURCE,'utf8'));
const kuriose=[];
for(let i=0;i<MONTHS.length;i++) {
  const url=`${BASE}/kalender/${MONTHS[i]}/`;
  const items=parseKuriose(await get(url),i+1);
  console.log(`${MONTH_LABELS[i]}: ${items.length}`);
  kuriose.push(...items);
}
if(kuriose.length<1500) throw new Error(`Only ${kuriose.length} kuriose entries parsed`);

const byDate=new Map();
for(const k of kuriose) {
  const key=`${k.month}-${k.day}`;
  if(!byDate.has(key)) byDate.set(key,[]);
  byDate.get(key).push(k);
}

const exact=[]; const probable=[]; const onlySource=[]; const used=new Set();
for(const s of source) {
  const candidates=byDate.get(`${s.month}-${s.day}`)||[];
  let hit=candidates.find((k)=>equivalent(s.name,k.name));
  if(hit) { exact.push({s,k:hit}); used.add(hit.url); continue; }
  const ranked=candidates.map((k)=>({k,score:sim(s.name,coreName(k.name))})).sort((a,b)=>b.score-a.score);
  if(ranked[0]?.score>=0.55) { probable.push({s,k:ranked[0].k,score:ranked[0].score}); used.add(ranked[0].k.url); }
  else onlySource.push(s);
}
const onlyKuriose=kuriose.filter((k)=>!used.has(k.url));

const lines=[
  '# Abgleich mit kuriose-feiertage.de', '',
  '> Automatischer Vollabgleich der Prüfliste von welcher-tag-ist-heute.org gegen die zwölf Monatsseiten des Kalenders von kuriose-feiertage.de. Matching erfolgt primär über Datum + normalisierten deutschen Namen; ähnliche Namen werden separat als mögliche Treffer ausgewiesen.', '',
  `- Einträge in welcher-tag-ist-heute-Prüfliste mit aufgelöstem Datum: **${source.length}**`,
  `- Aus kuriose-feiertage.de gelesene Kalender-Einträge: **${kuriose.length}**`,
  `- Sichere Treffer: **${exact.length}**`,
  `- Mögliche Namensvarianten: **${probable.length}**`,
  `- Nur bei welcher-tag-ist-heute gefunden: **${onlySource.length}**`,
  `- Nicht zugeordnet bei kuriose-feiertage.de: **${onlyKuriose.length}**`, '',
  '## Kontrollfall', ''
];
const appleExact=exact.find(({s})=>/tag der apfeltasche/i.test(s.name));
const appleProb=probable.find(({s})=>/tag der apfeltasche/i.test(s.name));
lines.push(`- Tag der Apfeltasche: **${appleExact?'sicherer Treffer':appleProb?'möglicher Treffer':'kein Treffer'}**`);
if(appleExact) lines.push(`  - welcher-tag-ist-heute: ${appleExact.s.url}`,`  - kuriose-feiertage: ${appleExact.k.url}`);
if(appleProb) lines.push(`  - welcher-tag-ist-heute: ${appleProb.s.url}`,`  - kuriose-feiertage: ${appleProb.k.url}`);

lines.push('', '## Mögliche Namensvarianten', '');
for(const x of probable.sort((a,b)=>a.s.month-b.s.month||a.s.day-b.s.day||b.score-a.score)) {
  lines.push(`- **${String(x.s.day).padStart(2,'0')}.${String(x.s.month).padStart(2,'0')}. – ${x.s.name}** ↔ ${x.k.name} _(Ähnlichkeit ${Math.round(x.score*100)} %)_  `,`  ${x.s.url}  `,`  ${x.k.url}`);
}

lines.push('', '## Nur bei welcher-tag-ist-heute gefunden', '');
for(const s of onlySource.sort((a,b)=>a.month-b.month||a.day-b.day||a.name.localeCompare(b.name,'de'))) {
  lines.push(`- **${String(s.day).padStart(2,'0')}.${String(s.month).padStart(2,'0')}. – ${s.name}**  `,`  ${s.url}`);
}

lines.push('', '## Nicht zugeordnet bei kuriose-feiertage.de', '', '> Diese Liste bedeutet nicht automatisch „fehlt bei welcher-tag-ist-heute“: Einträge können unter stark abweichenden Namen geführt sein oder vom automatischen Matching nicht erkannt worden sein.', '');
for(const k of onlyKuriose.sort((a,b)=>a.month-b.month||a.day-b.day||a.name.localeCompare(b.name,'de'))) {
  lines.push(`- **${String(k.day).padStart(2,'0')}.${String(k.month).padStart(2,'0')}. – ${k.name}**  `,`  ${k.url}`);
}

await writeFile(OUT,`${lines.join('\n')}\n`);
console.log(`Wrote comparison: exact=${exact.length}, probable=${probable.length}, sourceOnly=${onlySource.length}, kurioseUnmatched=${onlyKuriose.length}`);
