/**
 * Source regions were scraped from Wikipedia with flag icons: each real name is preceded by the
 * flag's ASCII alt text and a non-breaking space, e.g. "Agypten Ägypten" or, concatenated,
 * "Deutschland DeutschlandFrankreich Frankreich". At every nbsp, drop the longest
 * suffix on the left that (diacritics-folded) equals the prefix on the right.
 */
const fold = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ß/g, 'ss')
    .replace(/ /g, ' ')
    .toLowerCase();

export function normalizeRegion(region: string): string {
  let s = region;
  let at = s.indexOf(' ');
  while (at !== -1) {
    const left = s.slice(0, at);
    const right = s.slice(at + 1);
    const fl = fold(left);
    const fr = fold(right);
    let cut = 0;
    for (let k = Math.min(fl.length, fr.length); k >= 3; k--) {
      if (fl.slice(fl.length - k) === fr.slice(0, k)) {
        cut = k;
        break;
      }
    }
    const kept = left.slice(0, left.length - cut).trim();
    // No cut: the nbsp was just a space inside one name ("Burkina Faso").
    const sep = kept === '' ? '' : cut === 0 || /[,/]$/.test(kept) ? ' ' : ', ';
    s = kept + sep + right;
    at = s.indexOf(' ', kept.length + sep.length);
  }
  return s.charAt(0).toUpperCase() + s.slice(1);
}
