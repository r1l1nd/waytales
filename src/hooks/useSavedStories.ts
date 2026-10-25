import { MOCK_STORIES, USE_MOCK_STORIES } from '../constants/mockStories';
import { useStoryStore } from '../store/useStoryStore';

// Liefert die gespeicherten Geschichten. Die Screens müssen nicht wissen, woher sie kommen.
export function useSavedStories() {
  const storedStories = useStoryStore((state) => state.stories);
  const hasHydrated = useStoryStore((state) => state.hasHydrated);

  // FAKE-DATEN: Solange USE_MOCK_STORIES true ist, kommen Beispielgeschichten.
  // Später entfällt das, dann kommen die Geschichten nur noch aus dem Store.
  const stories = USE_MOCK_STORIES ? MOCK_STORIES : storedStories;

  return { stories, hasHydrated };
}
