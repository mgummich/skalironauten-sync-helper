import { describe, expect, it } from 'vitest';
import { normalizeRegion } from './normalizeRegion';

// The scraped strings carry the flag's ASCII alt text, a non-breaking space, and
// then the real name. Written out here so the fixtures stay readable.
const NB = ' ';
const raw = (s: string) => s.replace(/~/g, NB);

describe('normalizeRegion', () => {
  it('drops the duplicated alt text', () => {
    expect(normalizeRegion(raw('Kuba~Kuba'))).toBe('Kuba');
  });

  it('drops alt text that lost its diacritics', () => {
    expect(normalizeRegion(raw('Osterreich~Österreich'))).toBe('Österreich');
    expect(normalizeRegion(raw('Sudafrika~Südafrika'))).toBe('Südafrika');
    expect(normalizeRegion(raw('Turkei~Türkei'))).toBe('Türkei');
    expect(normalizeRegion(raw('Faroer~Färöer'))).toBe('Färöer');
  });

  it('joins concatenated countries with a comma', () => {
    expect(normalizeRegion(raw('Tschechien~TschechienSlowakei~Slowakei'))).toBe('Tschechien, Slowakei');
    expect(normalizeRegion(raw('Australien~AustralienNeuseeland~NeuseelandTonga~Tonga'))).toBe(
      'Australien, Neuseeland, Tonga'
    );
  });

  it('keeps multi-word country names intact', () => {
    expect(normalizeRegion(raw('Sri Lanka~Sri Lanka'))).toBe('Sri Lanka');
    expect(normalizeRegion(raw('Vereinigte Staaten~Vereinigte StaatenKanada~Kanada'))).toBe(
      'Vereinigte Staaten, Kanada'
    );
  });

  it('does not double up an existing comma separator', () => {
    expect(normalizeRegion(raw('Schottland~Schottland, Vereinigtes Konigreich~Vereinigtes Königreich'))).toBe(
      'Schottland, Vereinigtes Königreich'
    );
    expect(normalizeRegion(raw('Provinz Loei, Thailand~Thailand'))).toBe('Provinz Loei, Thailand');
  });

  it('keeps trailing qualifiers', () => {
    expect(normalizeRegion(raw('Japan~Japan, buddhistisch'))).toBe('Japan, buddhistisch');
    expect(normalizeRegion(raw('Bayern~Bayern, Römisch-katholische Kirche'))).toBe(
      'Bayern, Römisch-katholische Kirche'
    );
  });

  it('capitalizes and otherwise leaves plain values alone', () => {
    expect(normalizeRegion('international')).toBe('International');
    expect(normalizeRegion('Gregorianischer Kalender')).toBe('Gregorianischer Kalender');
    expect(normalizeRegion('')).toBe('');
  });

  it('needs at least three overlapping characters to cut', () => {
    // Guards the k >= 3 floor: a short accidental overlap must not eat the name.
    expect(normalizeRegion(raw('Go~Golf'))).toBe('Go Golf');
  });
});

describe('normalizeRegion known limitations', () => {
  it('cuts only the folded overlap when the alt text is reordered', () => {
    // Ideal output would be "Südkorea"; "Korea Sud" only overlaps on "Sud".
    expect(normalizeRegion(raw('Korea Sud~Südkorea'))).toBe('Korea, Südkorea');
  });

  it('cannot split a name that was concatenated without a separator', () => {
    expect(normalizeRegion(raw('Vereinigtes Konigreich~Vereinigtes KönigreichProvinz ~Kanada'))).toBe(
      'Vereinigtes KönigreichProvinz Kanada'
    );
  });
});
