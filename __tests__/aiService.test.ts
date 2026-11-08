import { AxiosError, type AxiosResponse } from 'axios';
import type { Place, Weather } from '../src/models';

// kein echtes Netzwerk
const mockPost = jest.fn();

jest.mock('../src/services/httpClient', () => ({
  createHttpClient: () => ({ post: mockPost }),
}));

jest.mock('../src/constants/mockStory', () => ({
  ...jest.requireActual('../src/constants/mockStory'),
  USE_MOCK_STORY: false,
}));

jest.mock('../src/constants/mockPackingList', () => ({
  ...jest.requireActual('../src/constants/mockPackingList'),
  USE_MOCK_PACKING_LIST: false,
}));

type AiService = typeof import('../src/services/aiService');
type Env = { url?: string; key?: string; model?: string };

const FULL_ENV: Env = { url: 'https://gemini.test/v1beta', key: 'test-key', model: 'gemini-test' };

function setEnv(name: string, value: string | undefined) {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}

// Der Service liest die .env beim Laden der Datei, deshalb erst setzen, dann frisch laden.
function loadAiService(env: Env = FULL_ENV): AiService {
  setEnv('EXPO_PUBLIC_GEMINI_API_URL', env.url);
  setEnv('EXPO_PUBLIC_GEMINI_API_KEY', env.key);
  setEnv('EXPO_PUBLIC_GEMINI_MODEL', env.model);

  let service!: AiService;
  jest.isolateModules(() => {
    service = require('../src/services/aiService');
  });
  return service;
}

// Gemini-Antwort
function geminiReply(text: string) {
  return { data: { candidates: [{ content: { parts: [{ text }] } }] } };
}

// Echter Axios-Fehler mit Antwort vom Server (z. B. 429 oder 500).
function httpError(status: number) {
  return new AxiosError('Request failed', 'ERR_BAD_RESPONSE', undefined, undefined, {
    status,
  } as AxiosResponse);
}

beforeEach(() => {
  mockPost.mockReset();
});

describe('generateJson', () => {
  it('schickt den Prompt mit Modell, JSON-Modus und API-Key und gibt das Ergebnis als Objekt zurück', async () => {
    mockPost.mockResolvedValue(geminiReply('{"title":"Test"}'));
    const { generateJson } = loadAiService();

    const result = await generateJson('Hallo');

    expect(mockPost).toHaveBeenCalledWith(
      '/models/gemini-test:generateContent',
      {
        contents: [{ parts: [{ text: 'Hallo' }] }],
        generationConfig: { responseMimeType: 'application/json' },
      },
      { headers: { 'x-goog-api-key': 'test-key' } }
    );
    expect(result).toEqual({ title: 'Test' });
  });

  it('wirft CONFIG und ruft das Netz nicht auf, wenn der API-Key fehlt', async () => {
    const { generateJson } = loadAiService({ ...FULL_ENV, key: undefined });

    await expect(generateJson('Hallo')).rejects.toMatchObject({ code: 'CONFIG' });
    expect(mockPost).not.toHaveBeenCalled();
  });

  // Jede Fehlerursache einmal: Die UI zeigt je nach Code eine andere Meldung.
  it.each([
    ['429 (zu viele Anfragen)', httpError(429), 'RATE_LIMIT'],
    ['500 (Serverfehler)', httpError(500), 'API'],
    ['kein Netz', new AxiosError('Fehler', 'ERR_NETWORK'), 'NETWORK'],
  ])('wirft bei %s den passenden Code', async (_case, error, code) => {
    mockPost.mockRejectedValue(error);
    const { generateJson } = loadAiService();

    await expect(generateJson('Hallo')).rejects.toMatchObject({ name: 'AiError', code });
  });

  it('wirft fremde Fehler unverändert weiter, statt sie als Netzfehler zu tarnen', async () => {
    const bug = new TypeError('Programmierfehler');
    mockPost.mockRejectedValue(bug);
    const { generateJson } = loadAiService();

    await expect(generateJson('Hallo')).rejects.toBe(bug);
  });

  it.each([
    ['leer ist', { data: {} }],
    ['kein gültiges JSON ist', geminiReply('Hier ist deine Geschichte: {')],
  ])('wirft INVALID_RESPONSE, wenn die Antwort %s', async (_case, reply) => {
    mockPost.mockResolvedValue(reply);
    const { generateJson } = loadAiService();

    await expect(generateJson('Hallo')).rejects.toMatchObject({ code: 'INVALID_RESPONSE' });
  });
});

describe('generateStory', () => {
  const place: Place = { locationName: 'Wien', latitude: 48.2, longitude: 16.37 };
  const validStory = { title: 'Der Dom', content: 'Eine Geschichte.', details: 'Mehr dazu.' };

  it('gibt nur title, content und details zurück, keine zusätzlichen Felder der KI', async () => {
    mockPost.mockResolvedValue(geminiReply(JSON.stringify({ ...validStory, author: 'KI' })));
    const { generateStory } = loadAiService();

    expect(await generateStory(place, 'Historisch')).toEqual(validStory);
  });

  it('wirft INVALID_RESPONSE, wenn ein Feld fehlt', async () => {
    mockPost.mockResolvedValue(geminiReply(JSON.stringify({ content: 'Text', details: 'Mehr' })));
    const { generateStory } = loadAiService();

    await expect(generateStory(place, 'Historisch')).rejects.toMatchObject({ code: 'INVALID_RESPONSE' });
  });
});

describe('generatePackingList', () => {
  const weather: Weather = {
    destination: 'Innsbruck',
    dateRange: '2026-12-01 bis 2026-12-03',
    temperature: -3,
    precipitation: 4.5,
    conditionCode: 71,
  };

  function replyWith(categories: unknown) {
    mockPost.mockResolvedValue(geminiReply(JSON.stringify({ categories })));
  }

  it('macht abhakbare Einträge und sortiert Unbrauchbares aus', async () => {
    replyWith([
      { categoryName: 'Kleidung', items: ['Jacke', '  Mütze  ', '', 42] },
      { items: ['ohne Kategorienamen'] },
      { categoryName: 'Leer', items: [] },
    ]);
    const { generatePackingList } = loadAiService();

    expect(await generatePackingList(weather, 3)).toEqual([
      {
        categoryName: 'Kleidung',
        items: [
          { id: '0-0', name: 'Jacke', isChecked: false },
          { id: '0-1', name: 'Mütze', isChecked: false },
        ],
      },
    ]);
  });

  it('wirft INVALID_RESPONSE, wenn keine brauchbare Kategorie übrig bleibt', async () => {
    replyWith([{ categoryName: 'Kleidung', items: [] }]);
    const { generatePackingList } = loadAiService();

    await expect(generatePackingList(weather, 3)).rejects.toMatchObject({ code: 'INVALID_RESPONSE' });
  });
});
