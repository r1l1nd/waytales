import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

// Einzige Stelle, die AsyncStorage kennt. Stores nutzen nur diese Funktion für "persist".
export function createStorage<State>() {
  return createJSONStorage<State>(() => AsyncStorage);
}
