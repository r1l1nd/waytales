import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { ActivityIndicator, Alert, Button, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SpeakButton } from '../components/SpeakButton';
import { COLORS } from '../constants/colors';
import { useSavedStories } from '../hooks/useSavedStories';
import { useSpeech } from '../hooks/useSpeech';
import { openInMaps } from '../services/mapService';
import { useStoryStore } from '../store/useStoryStore';
import { formatDate } from '../utils/formatDate';

export default function StoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { stories, hasHydrated } = useSavedStories();
  const deleteStory = useStoryStore((state) => state.deleteStory);
  const { isSpeaking, toggle } = useSpeech();
  const [showDetails, setShowDetails] = useState(false);
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

  const openMap = async () => {
    try {
      await openInMaps({
        latitude: story.latitude,
        longitude: story.longitude,
        name: story.locationName,
      });
    } catch {
      Alert.alert('Karten-App nicht verfügbar', 'Auf diesem Gerät wurde keine Karten-App gefunden.');
    }
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
        <View style={styles.actions}>
          <SpeakButton
            isSpeaking={isSpeaking}
            // Details nur vorlesen, wenn sie aufgeklappt sind.
            onPress={() =>
              toggle([story.title, story.content, showDetails ? story.details : ''].filter(Boolean).join('. '))
            }
          />
          <Pressable
            onPress={openMap}
            accessibilityRole="link"
            style={({ pressed }) => [styles.mapButton, pressed && styles.pressed]}
          >
            <SymbolView
              name={{ ios: 'map', android: 'map', web: 'map' }}
              size={18}
              tintColor={COLORS.primary}
            />
            <Text style={styles.mapText}>Karte öffnen</Text>
          </Pressable>
        </View>
        <Text style={styles.text}>{story.content}</Text>

        {/* Ältere Geschichten haben noch keine Details, dann gibt es auch keinen Button. */}
        {story.details &&
          (showDetails ? (
            <Text style={styles.text}>{story.details}</Text>
          ) : (
            <View style={styles.moreButton}>
              <Button title="Mehr erfahren" onPress={() => setShowDetails(true)} />
            </View>
          ))}
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
  actions: { marginTop: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  mapButton: {
    minHeight: 48,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mapText: { fontSize: 16, fontWeight: '500', color: COLORS.primary },
  moreButton: { marginTop: 16, alignSelf: 'flex-start' },
});
