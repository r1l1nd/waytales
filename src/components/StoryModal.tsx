import { useState } from 'react';
import { Button, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/colors';
import { useSpeech } from '../hooks/useSpeech';
import type { Story } from '../models';
import { useStoryStore } from '../store/useStoryStore';
import { SpeakButton } from './SpeakButton';


type Props = {
  visible: boolean;
  story: Story | null;
  onClose: () => void;
};

// Zeigt die generierte Geschichte. "Mehr erfahren" blendet die Details im selben Fenster ein.
export function StoryModal({ visible, story, onClose }: Props) {
  const [showDetails, setShowDetails] = useState(false);
  const { isSpeaking, toggle, stop } = useSpeech();
  const saveStory = useStoryStore((state) => state.saveStory);
  // Direkt aus dem Store lesen: stimmt auch, wenn die Geschichte woanders gelöscht wurde.
  const isSaved = useStoryStore((state) =>
    story ? state.stories.some((saved) => saved.id === story.id) : false
  );

  // Beim Schließen die Details wieder einklappen, damit die nächste Geschichte frisch startet.
  const handleClose = () => {
    stop();
    setShowDetails(false);
    onClose();
  };

  const handleSave = () => {
    if (story) saveStory(story);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.location}>{story?.locationName}</Text>
          <Pressable onPress={handleClose} accessibilityRole="button" accessibilityLabel="Schließen" hitSlop={12}>
            <Text style={styles.close}>✕</Text>
          </Pressable>
        </View>

        {story && (
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>{story.title}</Text>
            <SpeakButton
              isSpeaking={isSpeaking}
              onPress={() =>
                toggle([story.title, story.content, showDetails ? story.details : ''].filter(Boolean).join('. '))
              }
            />
            <Text style={styles.body}>{story.content}</Text>
            <Text style={styles.body}>{story.content}</Text>

            {showDetails ? (
              <Text style={styles.body}>{story.details}</Text>
            ) : (
              <Button title="Mehr erfahren" onPress={() => setShowDetails(true)} />
            )}

            <Pressable
              style={({ pressed }) => [
                styles.saveButton,
                isSaved && styles.saveButtonDone,
                pressed && !isSaved && styles.saveButtonPressed,
              ]}
              onPress={handleSave}
              disabled={isSaved}
              accessibilityRole="button"
              accessibilityState={{ disabled: isSaved }}
              accessibilityLabel={isSaved ? 'Geschichte ist gespeichert' : 'Geschichte speichern'}
            >
              <Text style={[styles.saveText, isSaved && styles.saveTextDone]}>
                {isSaved ? '✓ Gespeichert' : 'Speichern'}
              </Text>
            </Pressable>
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  location: { flex: 1, fontSize: 14, color: COLORS.textMuted },
  close: { fontSize: 22, color: COLORS.text, paddingLeft: 12 },
  content: { padding: 16, gap: 16 },
  title: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  body: { fontSize: 16, lineHeight: 24, color: COLORS.text },
  saveButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
  },
  saveButtonPressed: { opacity: 0.7 },
  saveButtonDone: {
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  saveText: { fontSize: 16, fontWeight: '600', color: COLORS.background },
  saveTextDone: { color: COLORS.primary },
});