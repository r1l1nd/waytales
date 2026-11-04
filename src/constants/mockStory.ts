import type { Place, StoryDraft } from '../models';

// Plan B für Entwicklung und Präsentation: Mit true liefert der aiService
// diese Beispielgeschichte statt Gemini (z. B. bei Rate Limit oder schlechtem Netz).
export const USE_MOCK_STORY = false;

export function createMockStory(place: Place): StoryDraft {
  return {
    title: `Unterwegs in ${place.locationName}`,
    content:
      'Das ist eine Beispielgeschichte, damit die App auch ohne Gemini vorgeführt werden kann. ' +
      'Normalerweise erzählt WayTales hier etwas über den Ort, an dem du gerade stehst, ' +
      'im gewählten Stil: historisch, mit Fun Facts oder kinderfreundlich.',
    details:
      'Mit "Mehr erfahren" kommen hier weitere Informationen dazu. Die Beispieldaten werden ' +
      'über das Flag USE_MOCK_STORY in src/constants/mockStory.ts aktiviert.',
  };
}