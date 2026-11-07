import { isAxiosError } from 'axios';
import { createMockPackingList, USE_MOCK_PACKING_LIST } from '../constants/mockPackingList';
import { createMockStory, USE_MOCK_STORY } from '../constants/mockStory';
import { buildPackingPrompt, buildStoryPrompt } from '../constants/prompts';
import type { StoryStyle } from '../constants/styles';
import type { PackingCategory, Place, StoryDraft, Weather } from '../models';
import { createHttpClient } from './httpClient';

const apiUrl = process.env.EXPO_PUBLIC_GEMINI_API_URL;
const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const model = process.env.EXPO_PUBLIC_GEMINI_MODEL;

// KI-Antworten dauern länger als normale Abfragen, deshalb 90 Sekunden Timeout.
const client = apiUrl ? createHttpClient(apiUrl, 90000) : null;

export type AiErrorCode = 'CONFIG' | 'NETWORK' | 'RATE_LIMIT' | 'API' | 'INVALID_RESPONSE';

// Eigener Fehlertyp mit Code, damit die UI je nach Ursache eine passende Meldung zeigen kann.
export class AiError extends Error {
  code: AiErrorCode;

  constructor(code: AiErrorCode, message: string) {
    super(message);
    this.name = 'AiError';
    this.code = code;
  }
}

// Nur der Teil der Gemini-Antwort, den wir brauchen.
type GeminiResponse = {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
};

// Schickt einen Prompt an Gemini und liefert die Antwort als geparstes JSON.
// Wird für die Geschichte genutzt und später auch für die Packliste.
export async function generateJson<T>(prompt: string): Promise<T> {
  if (!client || !apiKey || !model) {
    throw new AiError('CONFIG', 'Gemini ist nicht konfiguriert (.env prüfen).');
  }

  let text: string | undefined;
  try {
    const { data } = await client.post<GeminiResponse>(
      `/models/${model}:generateContent`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        // Gemini soll reines JSON liefern statt Fließtext.
        generationConfig: { responseMimeType: 'application/json' },
      },
      { headers: { 'x-goog-api-key': apiKey } }
    );
    text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  } catch (error) {
    if (isAxiosError(error)) {
      // 429 = zu viele Anfragen (Limit der kostenlosen Nutzung erreicht).
      if (error.response?.status === 429) {
        throw new AiError('RATE_LIMIT', 'Zu viele Anfragen an Gemini.');
      }
      // Es gab eine Antwort, aber mit Fehlerstatus.
      if (error.response) {
        throw new AiError('API', `Gemini-Fehler (Status ${error.response.status}).`);
      }
      // Keine Antwort: kein Netz oder Timeout.
      throw new AiError('NETWORK', 'Keine Verbindung zu Gemini.');
    }
    throw error;
  }

  if (!text) {
    throw new AiError('INVALID_RESPONSE', 'Gemini hat keine Antwort geliefert.');
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new AiError('INVALID_RESPONSE', 'Die Antwort von Gemini war kein gültiges JSON.');
  }
}

// Erzeugt die Geschichte zu einem Ort im gewählten Stil.
export async function generateStory(place: Place, style: StoryStyle): Promise<StoryDraft> {
  if (USE_MOCK_STORY) {
    // Kurz warten, damit der Ladeindikator wie im echten Ablauf zu sehen ist.
    await new Promise((resolve) => setTimeout(resolve, 800));
    return createMockStory(place);
  }

  const draft = await generateJson<Partial<StoryDraft>>(buildStoryPrompt(place, style));
  const { title, content, details } = draft;

  // Wir prüfen die Felder, denn die KI hält sich nicht immer perfekt ans Format.
  if (typeof title !== 'string' || typeof content !== 'string' || typeof details !== 'string') {
    throw new AiError('INVALID_RESPONSE', 'Die Geschichte war unvollständig.');
  }

  return { title, content, details };
}

// So kommt die Packliste von Gemini: Kategorien mit einfachen Texten.
// unknown, weil wir nicht blind vertrauen, dass die KI das Format einhält.
type PackingResponse = {
  categories?: { categoryName?: unknown; items?: unknown }[];
};

// Erzeugt eine abhakbare Packliste mit Mengen, passend zu Wetter und Reisedauer.
export async function generatePackingList(weather: Weather, days: number): Promise<PackingCategory[]> {
  if (USE_MOCK_PACKING_LIST) {
    // Kurz warten, damit der Ladeindikator wie im echten Ablauf zu sehen ist.
    await new Promise((resolve) => setTimeout(resolve, 800));
    return createMockPackingList();
  }

  const response = await generateJson<PackingResponse>(buildPackingPrompt(weather, days));
  const rawCategories = Array.isArray(response.categories) ? response.categories : [];

  // Unbrauchbares aussortieren und jedem Eintrag eine id und ein leeres Häkchen geben.
  const categories = rawCategories
    .filter((category) => typeof category.categoryName === 'string' && Array.isArray(category.items))
    .map((category, categoryIndex) => ({
      categoryName: category.categoryName as string,
      items: (category.items as unknown[])
        .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
        .map((name, itemIndex) => ({
          id: `${categoryIndex}-${itemIndex}`,
          name: name.trim(),
          isChecked: false,
        })),
    }))
    .filter((category) => category.items.length > 0);

  if (categories.length === 0) {
    throw new AiError('INVALID_RESPONSE', 'Die Packliste war leer oder unvollständig.');
  }

  return categories;
}