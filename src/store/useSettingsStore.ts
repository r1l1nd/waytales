import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_STYLE, type StoryStyle } from '../constants/styles';
import { createStorage } from '../services/storageService';

// Store = der gewählte Stil und Funktion, um ihn zu ändern.
type SettingsState = {
  style: StoryStyle;
  setStyle: (style: StoryStyle) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      style: DEFAULT_STYLE,
      setStyle: (style) => set({ style }),
    }),
    {
      name: 'settings-storage',
      storage: createStorage<SettingsState>(),
    }
  )
);