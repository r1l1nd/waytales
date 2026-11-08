import { buildPackingPrompt, buildStoryPrompt } from '../src/constants/prompts';
import { STORY_STYLES } from '../src/constants/styles';
import type { Place, Weather } from '../src/models';

const place: Place = {
  locationName: 'Stephansplatz, Wien',
  latitude: 48.2084567,
  longitude: 16.3731234,
};

describe('buildStoryPrompt', () => {
  it('enthält den Ortsnamen und die auf 5 Stellen gerundeten Koordinaten', () => {
    const prompt = buildStoryPrompt(place, 'Historisch');

    expect(prompt).toContain('Ort: Stephansplatz, Wien');
    expect(prompt).toContain('Koordinaten: 48.20846, 16.37312');
  });

  it('behält bei negativen Koordinaten das Minus', () => {
    // Santiago de Chile: südlich des Äquators und westlich von Greenwich.
    const santiago = { locationName: 'Santiago', latitude: -33.448891, longitude: -70.669268 };

    expect(buildStoryPrompt(santiago, 'Historisch')).toContain('Koordinaten: -33.44889, -70.66927');
  });

  it('füllt Koordinaten mit wenigen Nachkommastellen mit Nullen auf', () => {
    const roundPlace = { locationName: 'Wien', latitude: 48.2, longitude: 16 };

    expect(buildStoryPrompt(roundPlace, 'Historisch')).toContain('Koordinaten: 48.20000, 16.00000');
  });

  // Läuft einmal pro Zeile: Jeder Stil muss seinen Namen und seine eigene Anweisung enthalten.
  it.each([
    ['Historisch', 'Jahreszahlen'],
    ['Fun Facts', 'überraschenden'],
    ['Kinderfreundlich', 'einfacher Sprache'],
  ] as const)('nennt den Stil "%s" mit passender Anweisung', (style, keyword) => {
    const prompt = buildStoryPrompt(place, style);

    expect(prompt).toContain(`Erzählstil: ${style}.`);
    expect(prompt).toContain(keyword);
  });

  it('deckt alle Stile aus der Konstante ab', () => {
    // Kommt ein neuer Stil dazu, erinnert dieser Test daran, die Tabelle oben zu ergänzen.
    expect(STORY_STYLES).toEqual(['Historisch', 'Fun Facts', 'Kinderfreundlich']);
  });

  it('verbietet Markdown, weil die Geschichte vorgelesen wird', () => {
    expect(buildStoryPrompt(place, 'Fun Facts')).toContain('ohne Markdown');
  });

  it('verlangt eine JSON-Antwort mit title, content und details', () => {
    const prompt = buildStoryPrompt(place, 'Fun Facts');

    expect(prompt).toContain('JSON');
    expect(prompt).toContain('title, content, details');
  });
});

describe('buildPackingPrompt', () => {
  const weather: Weather = {
    destination: 'Innsbruck',
    dateRange: '2026-12-01 bis 2026-12-03',
    temperature: -3,
    precipitation: 4.5,
    conditionCode: 71,
  };

  it('schreibt bei einem Tag "Tag" in der Einzahl', () => {
    const prompt = buildPackingPrompt(weather, 1);

    expect(prompt).toContain('Reisedauer: 1 Tag');
    expect(prompt).not.toContain('Reisedauer: 1 Tage');
  });

  it('schreibt bei mehreren Tagen "Tage"', () => {
    expect(buildPackingPrompt(weather, 3)).toContain('Reisedauer: 3 Tage');
  });

  it('enthält Ziel, Zeitraum und alle Wetterwerte, auch Minusgrade', () => {
    const prompt = buildPackingPrompt(weather, 3);

    expect(prompt).toContain('Reiseziel: Innsbruck');
    expect(prompt).toContain('Reisezeitraum: 2026-12-01 bis 2026-12-03');
    expect(prompt).toContain('Durchschnittstemperatur: -3 °C');
    expect(prompt).toContain('Niederschlag gesamt: 4.5 mm');
    expect(prompt).toContain('Häufigster Wettercode (WMO): 71');
  });

  it('verlangt das JSON-Format, das generatePackingList ausliest', () => {
    const prompt = buildPackingPrompt(weather, 3);

    expect(prompt).toContain('"categories"');
    expect(prompt).toContain('"categoryName"');
    expect(prompt).toContain('"items"');
  });
});
