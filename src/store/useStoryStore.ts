import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Story } from '../models';
import { createStorage } from '../services/storageService';

// Store = die gespeicherten Geschichten und die Funktion, um eine zu speichern.
type StoryState = {
  stories: Story[];
  hasHydrated: boolean;
  saveStory: (story: Story) => void;
  deleteStory: (id: string) => void;
};

// Der Teil des Stores, der wirklich gespeichert wird.
type PersistedStoryState = Pick<StoryState, 'stories'>;

export const useStoryStore = create<StoryState>()(
  persist(
    (set, get) => ({
      stories: [],
      hasHydrated: false,
      saveStory: (story) => {
        const alreadySaved = get().stories.some((saved) => saved.id === story.id);
        if (alreadySaved) return;
        set({ stories: [story, ...get().stories] });
      },
      deleteStory: (id) => {
        set({ stories: get().stories.filter((saved) => saved.id !== id) });
      },
    }),
    {
      name: 'story-storage',
      storage: createStorage<PersistedStoryState>(),
      // Nur die Geschichten speichern, nicht das Lade-Flag.
      partialize: (state) => ({ stories: state.stories }),
      // Läuft nach dem Laden (auch bei Fehler), dann können Screens die Liste zeigen.
      onRehydrateStorage: () => () => {
        useStoryStore.setState({ hasHydrated: true });
      },
    }
  )
);
