import type { StoryStyle } from '../constants/styles';
import type { Place, Story, StoryDraft } from '../models';

// Macht aus der KI-Antwort eine speicherbare Story.
// Die id entsteht hier genau einmal, dadurch erkennt der Store doppeltes Speichern.
export function createStory(draft: StoryDraft, place: Place, style: StoryStyle): Story {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: draft.title,
    content: draft.content,
    details: draft.details,
    style,
    latitude: place.latitude,
    longitude: place.longitude,
    locationName: place.locationName,
    createdAt: new Date().toISOString(),
  };
}