import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStorage } from '../src/services/storageService';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Beispiel-Zustand, wie ihn ein Store speichern würde.
type TestState = { stories: string[] };

const KEY = 'test-storage';

// Storage, der Daten vom Typ TestState speichern und laden kann
const storage = createStorage<TestState>()!;

describe('storageService', () => {
  beforeEach(async () => {
    // Jeder Test startet mit leerem Speicher.
    await AsyncStorage.clear();
  });

  it('schreibt die Daten als JSON-Text in AsyncStorage', async () => {
    await storage.setItem(KEY, { state: { stories: ['Wien'] }, version: 0 });

    // '{"state":{"stories":["Wien"]},"version":0}'
    const raw = await AsyncStorage.getItem(KEY);

    expect(JSON.parse(raw!)).toEqual({ state: { stories: ['Wien'] }, version: 0 });
  });

  it('liest gespeicherte Daten wieder als Objekt', async () => {
    await storage.setItem(KEY, { state: { stories: ['Wien', 'Graz'] }, version: 0 });

    const loaded = await storage.getItem(KEY);

    expect(loaded?.state.stories).toEqual(['Wien', 'Graz']);
  });

  it('gibt null zurück, wenn noch nichts gespeichert wurde', async () => {
    expect(await storage.getItem(KEY)).toBeNull();
  });

  it('löscht gespeicherte Daten', async () => {
    await storage.setItem(KEY, { state: { stories: ['Wien'] }, version: 0 });

    await storage.removeItem(KEY);

    expect(await storage.getItem(KEY)).toBeNull();
  });
});
