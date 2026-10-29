import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { OfflineBanner } from '../../components/OfflineBanner';
import { StoryListItem } from '../../components/StoryListItem';
import { COLORS } from '../../constants/colors';
import { useSavedStories } from '../../hooks/useSavedStories';

export default function SavedScreen() {
  const router = useRouter();
  const { stories, hasHydrated } = useSavedStories();

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
        renderItem={({ item }) => (
          <StoryListItem
            story={item}
            onPress={() => router.push(`/story-detail?id=${encodeURIComponent(item.id)}`)}
          />
        )}
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
});
