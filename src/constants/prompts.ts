import type { Place, Weather } from '../models';
import type { StoryStyle } from './styles';

// Wie die KI je nach Stil erzählen soll. Kommt ein neuer Stil dazu, meldet TypeScript hier einen Fehler.
const STYLE_INSTRUCTIONS: Record<StoryStyle, string> = {
  Historisch: 'Erzähle sachlich und spannend über Geschichte, wichtige Ereignisse und Jahreszahlen.',
  'Fun Facts': 'Erzähle locker und mit überraschenden, kurzen Fakten, die man gern weitererzählt.',
  Kinderfreundlich:
    'Erzähle in einfacher Sprache für Kinder ab etwa 8 Jahren, mit kurzen Sätzen und nichts Gruseligem.',
};

// Baut den Text, den wir an die KI schicken.
export function buildStoryPrompt(place: Place, style: StoryStyle): string {
  return [
    'Du bist ein freundlicher Reiseführer und erzählst Kurzgeschichten über Orte.',
    `Ort: ${place.locationName}`,
    `Koordinaten: ${place.latitude.toFixed(5)}, ${place.longitude.toFixed(5)}`,
    `Erzählstil: ${style}. ${STYLE_INSTRUCTIONS[style]}`,
    '',
    'Regeln:',
    '- Schreibe auf Deutsch.',
    '- Erzähle nur, was du sicher weißt, und erfinde nichts. Kennst du den genauen Ort nicht, erzähle etwas über die Gegend oder die Stadt.',
    '- Schreibe reinen Text ohne Markdown, Aufzählungen oder Sternchen, weil er vorgelesen wird.',
    '',
    'Antworte ausschließlich als JSON mit genau diesen Feldern: title, content, details.',
    'title ist ein kurzer Titel. content ist die Geschichte mit etwa 80 bis 120 Wörtern.',
    'details enthält weitere Informationen mit etwa 100 bis 150 Wörtern, die noch nicht in content stehen.',
  ].join('\n');
}

// Baut den Prompt für die Packliste aus dem zusammengefassten Reisewetter.
export function buildPackingPrompt(weather: Weather): string {
  return [
    'Du hilfst Reisenden beim Packen.',
    `Reiseziel: ${weather.destination}`,
    `Reisezeitraum: ${weather.dateRange}`,
    `Durchschnittstemperatur: ${weather.temperature} °C`,
    `Niederschlag gesamt: ${weather.precipitation} mm`,
    `Häufigster Wettercode (WMO): ${weather.conditionCode}`,
    '',
    'Regeln:',
    '- Schreibe auf Deutsch.',
    '- Passe die Liste an Temperatur und Niederschlag an, z. B. Regenjacke nur bei Regen, Sonnencreme nur bei Sonne oder Wärme.',
    '- Kurze Einträge mit höchstens drei Wörtern, keine Mengenangaben.',
    '- 3 bis 5 Kategorien (z. B. Kleidung, Wetterschutz, Hygiene, Dokumente, Technik) mit je 3 bis 8 Einträgen.',
    '',
    'Antworte ausschließlich als JSON in genau dieser Form:',
    '{"categories": [{"categoryName": "Kleidung", "items": ["T-Shirts", "Pullover"]}]}',
  ].join('\n');
}