import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { OfflineBanner } from '../../components/OfflineBanner';
import { COLORS } from '../../constants/colors';
import { MOCK_STORIES, USE_MOCK_STORIES } from '../../constants/mockStories';
import { useStoryStore } from '../../store/useStoryStore';

export default function SavedScreen() {
  const storedStories = useStoryStore((state) => state.stories);
  const hasHydrated = useStoryStore((state) => state.hasHydrated);

  // FAKE-DATEN: Solange USE_MOCK_STORIES true ist, zeigen wir Beispielgeschichten.
  // Später entfällt das, dann kommen die Geschichten nur noch aus dem Store.
  const stories = USE_MOCK_STORIES ? MOCK_STORIES : storedStories;

  function renderContent() {
    if (!hasHydrated) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator color={COLORS.primary} />
        </View>
      );
    }

    if (stories.length === 0) {
      return (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Noch keine Geschichten gespeichert.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={stories}
        keyExtractor={(story) => story.id}
        renderItem={({ item }) => <Text style={styles.row}>{item.title}</Text>}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <OfflineBanner />
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  emptyText: { fontSize: 16, color: COLORS.textMuted, textAlign: 'center' },
  row: { padding: 16, fontSize: 16, color: COLORS.text },
});
