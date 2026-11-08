import { render, screen, userEvent } from '@testing-library/react-native';
import { StoryModal } from '../src/components/StoryModal';
import type { Story } from '../src/models';
import { useStoryStore } from '../src/store/useStoryStore';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// jest.fn = simulierte Funktion
jest.mock('../src/services/ttsService', () => ({
  speak: jest.fn(),
  stopSpeaking: jest.fn(),
}));

// Typewriter mocken
jest.mock('../src/hooks/useTypewriter', () => ({
  useTypewriter: (text: string) => ({ displayedText: text, isDone: true, skip: jest.fn() }),
}));

const story: Story = {
  id: '1',
  title: 'Der Stephansdom',
  content: 'Eine Geschichte über den Dom.',
  style: 'Historisch',
  latitude: 48.2,
  longitude: 16.37,
  locationName: 'Wien',
  createdAt: '2026-11-08T10:00:00.000Z',
};

function renderModal() {
  return render(<StoryModal visible story={story} onClose={jest.fn()} />);
}

describe('Speichern-Button im StoryModal', () => {
  beforeEach(() => {
    useStoryStore.setState({ stories: [] });
  });

  it('zeigt "Speichern", solange die Geschichte nicht gespeichert ist', async () => {
    await renderModal();

    const button = screen.getByRole('button', { name: 'Geschichte speichern' });

    expect(button).toBeEnabled();
    expect(screen.getByText('Speichern')).toBeOnTheScreen();
  });

  it('speichert die Geschichte und zeigt danach "Gespeichert"', async () => {
    const user = userEvent.setup();
    await renderModal();

    await user.press(screen.getByRole('button', { name: 'Geschichte speichern' }));

    expect(useStoryStore.getState().stories).toEqual([story]);
    expect(screen.getByText('✓ Gespeichert')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Geschichte ist gespeichert' })).toBeDisabled();
  });

  it('speichert eine schon gespeicherte Geschichte nicht doppelt', async () => {
    useStoryStore.setState({ stories: [story] });
    const user = userEvent.setup();
    await renderModal();

    await user.press(screen.getByRole('button', { name: 'Geschichte ist gespeichert' }));

    expect(useStoryStore.getState().stories).toHaveLength(1);
  });
});
