import type { Story } from '../models';

// FAKE-DATEN: Nur zum Entwickeln, damit die Liste im Saved-Screen etwas anzeigt.
// Später werden hier die echten, vom Nutzer gespeicherten Geschichten aus dem
// useStoryStore verwendet (USE_MOCK_STORIES auf false setzen, Datei entfernen).
export const USE_MOCK_STORIES = false;

export const MOCK_STORIES: Story[] = [
  {
    id: 'mock-1',
    title: 'Schönbrunn: Die Sommerresidenz der Habsburger',
    content:
      'Das Schloss Schönbrunn war die Sommerresidenz der Habsburger. Maria Theresia ließ es im 18. Jahrhundert zu einem prächtigen Schloss ausbauen.',
    style: 'Historisch',
    latitude: 48.1845,
    longitude: 16.3122,
    locationName: 'Schloss Schönbrunn, Wien',
    createdAt: '2026-10-20T09:15:00.000Z',
  },
  {
    id: 'mock-2',
    title: 'Riesenrad: Über den Dächern des Praters',
    content:
      'Das Wiener Riesenrad wurde 1897 eröffnet und ist rund 65 Meter hoch. Eine Runde dauert ungefähr zehn Minuten.',
    style: 'Fun Facts',
    latitude: 48.2166,
    longitude: 16.3959,
    locationName: 'Prater, Wien',
    createdAt: '2026-10-21T14:30:00.000Z',
  },
  {
    id: 'mock-3',
    title: 'Stephansdom: Der Turm mit dem Spitznamen',
    content:
      'Der hohe Südturm des Stephansdoms heißt bei den Wienern liebevoll "Steffl". Von dort oben konnte man früher die ganze Stadt überblicken.',
    style: 'Kinderfreundlich',
    latitude: 48.2086,
    longitude: 16.3731,
    locationName: 'Stephansdom, Wien',
    createdAt: '2026-10-22T11:00:00.000Z',
  },
];
