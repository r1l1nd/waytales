import { useStoryStore } from '../store/useStoryStore';

// Liefert die gespeicherten Geschichten. Die Screens müssen nicht wissen, woher sie kommen.
export function useSavedStories() {
  const stories = useStoryStore((state) => state.stories);
  const hasHydrated = useStoryStore((state) => state.hasHydrated);

  return { stories, hasHydrated };
}
