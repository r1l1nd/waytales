import { useState } from 'react';
import { Button, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { COLORS } from '../constants/colors';
import { useSpeech } from '../hooks/useSpeech';
import { useTypewriter } from '../hooks/useTypewriter';
import type { Story } from '../models';
import { useStoryStore } from '../store/useStoryStore';
import { AppText } from './AppText';
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
  const { displayedText, isDone, skip } = useTypewriter(story?.content ?? '');
  // Details bekommen erst nach "Mehr erfahren" Text, dadurch startet das Tippen genau dann.
  const details = useTypewriter(showDetails ? (story?.details ?? '') : '');
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
          <AppText style={styles.location}>{story?.locationName}</AppText>
          <Pressable onPress={handleClose} accessibilityRole="button" accessibilityLabel="Schließen" hitSlop={12}>
            <AppText style={styles.close}>✕</AppText>
          </Pressable>
        </View>

        {story && (
          <ScrollView contentContainerStyle={styles.content}>
            <AppText style={styles.title}>{story.title}</AppText>
            <SpeakButton
              isSpeaking={isSpeaking}
              onPress={() =>
                toggle([story.title, story.content, showDetails ? story.details : ''].filter(Boolean).join('. '))
              }
            />
            {/* Tippen auf den Text überspringt den Tippeffekt. */}
            <Pressable
              onPress={skip}
              disabled={isDone}
              accessibilityHint={isDone ? undefined : 'Zeigt sofort die ganze Geschichte'}
            >
              <AppText style={styles.body}>{displayedText}</AppText>
            </Pressable>

            {/* Buttons erst zeigen, wenn der Text fertig ist, damit nichts verrutscht. */}
            {isDone && (showDetails ? (
              <Pressable
                onPress={details.skip}
                disabled={details.isDone}
                accessibilityHint={details.isDone ? undefined : 'Zeigt sofort alle Details'}
              >
                <AppText style={styles.body}>{details.displayedText}</AppText>
              </Pressable>
            ) : (
              <Button title="Mehr erfahren" onPress={() => setShowDetails(true)} />
            ))}

            {/* Speichern erst, wenn Geschichte und (falls geöffnet) Details fertig getippt sind. */}
            {isDone && (!showDetails || details.isDone) && (
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
                <AppText style={[styles.saveText, isSaved && styles.saveTextDone]}>
                  {isSaved ? '✓ Gespeichert' : 'Speichern'}
                </AppText>
              </Pressable>
            )}
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