import type { Story } from '../src/models';
import { useStoryStore } from '../src/store/useStoryStore';

// AsyncStorage gibt es nur auf dem Handy, im Test nehmen wir den Mock des Pakets.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

function createStory(id: string): Story {
  return {
    id,
    title: `Titel ${id}`,
    content: 'Text',
    style: 'Historisch',
    latitude: 48.2,
    longitude: 16.37,
    locationName: 'Wien',
    createdAt: '2026-10-24T10:00:00.000Z',
  };
}

describe('useStoryStore', () => {
  beforeEach(() => {
    useStoryStore.setState({ stories: [] });
  });

  it('speichert eine Geschichte', () => {
    useStoryStore.getState().saveStory(createStory('1'));

    expect(useStoryStore.getState().stories).toHaveLength(1);
  });

  it('speichert dieselbe Geschichte nicht doppelt', () => {
    useStoryStore.getState().saveStory(createStory('1'));
    useStoryStore.getState().saveStory(createStory('1'));

    expect(useStoryStore.getState().stories).toHaveLength(1);
  });

  it('löscht eine Geschichte über ihre id', () => {
    useStoryStore.getState().saveStory(createStory('1'));
    useStoryStore.getState().saveStory(createStory('2'));

    useStoryStore.getState().deleteStory('1');

    expect(useStoryStore.getState().stories.map((story) => story.id)).toEqual(['2']);
  });
});
