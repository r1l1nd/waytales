import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/colors';
import { useSavedStories } from '../hooks/useSavedStories';
import { useStoryStore } from '../store/useStoryStore';
import { formatDate } from '../utils/formatDate';

export default function StoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { stories, hasHydrated } = useSavedStories();
  const deleteStory = useStoryStore((state) => state.deleteStory);
  const story = stories.find((saved) => saved.id === id);

  if (!hasHydrated) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={COLORS.primary} />
      </View>
    );
  }

  if (!story) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>Geschichte nicht gefunden.</Text>
      </View>
    );
  }

  const confirmDelete = () => {
    Alert.alert('Geschichte löschen?', `"${story.title}" wird von diesem Gerät gelöscht.`, [
      { text: 'Abbrechen', style: 'cancel' },
      {
        text: 'Löschen',
        style: 'destructive',
        onPress: () => {
          deleteStory(story.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              onPress={confirmDelete}
              accessibilityRole="button"
              accessibilityLabel="Geschichte löschen"
              style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}
            >
              <SymbolView
                name={{ ios: 'trash', android: 'delete', web: 'delete' }}
                size={22}
                tintColor={COLORS.error}
              />
            </Pressable>
          ),
        }}
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        <Text style={styles.title}>{story.title}</Text>
        <Text style={styles.location}>{story.locationName}</Text>
        <Text style={styles.meta}>
          {story.style} · {formatDate(story.createdAt)}
        </Text>
        <Text style={styles.text}>{story.content}</Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  message: { fontSize: 16, color: COLORS.textMuted, textAlign: 'center' },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  location: { marginTop: 8, fontSize: 16, color: COLORS.textMuted },
  meta: { marginTop: 2, fontSize: 14, color: COLORS.textMuted },
  text: { marginTop: 16, fontSize: 16, lineHeight: 24, color: COLORS.text },
  deleteButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.6 },
});
