import { buildStoryPrompt } from '../src/constants/prompts';
import { STORY_STYLES } from '../src/constants/styles';
import type { Place } from '../src/models';

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

  // Läuft einmal pro Stil, ein neuer Stil wird automatisch mitgetestet.
  it.each(STORY_STYLES)('nennt den gewählten Stil "%s"', (style) => {
    const prompt = buildStoryPrompt(place, style);

    expect(prompt).toContain(`Erzählstil: ${style}.`);
  });

  it('passt die Anweisung an den Stil an', () => {
    const forKids = buildStoryPrompt(place, 'Kinderfreundlich');
    const historical = buildStoryPrompt(place, 'Historisch');

    expect(forKids).toContain('einfacher Sprache');
    expect(historical).not.toContain('einfacher Sprache');
  });

  it('verlangt eine JSON-Antwort mit title, content und details', () => {
    const prompt = buildStoryPrompt(place, 'Fun Facts');

    expect(prompt).toContain('JSON');
    expect(prompt).toContain('title, content, details');
  });
});
