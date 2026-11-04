import { useState } from 'react';
import { Button, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/colors';
import type { StoryDraft } from '../models';

type Props = {
  visible: boolean;
  story: StoryDraft | null;
  locationName: string;
  onClose: () => void;
};

// Zeigt die generierte Geschichte. "Mehr erfahren" blendet die Details im selben Fenster ein.
export function StoryModal({ visible, story, locationName, onClose }: Props) {
  const [showDetails, setShowDetails] = useState(false);

  // Beim Schließen die Details wieder einklappen, damit die nächste Geschichte frisch startet.
  const handleClose = () => {
    setShowDetails(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.location}>{locationName}</Text>
          <Pressable onPress={handleClose} accessibilityRole="button" accessibilityLabel="Schließen" hitSlop={12}>
            <Text style={styles.close}>✕</Text>
          </Pressable>
        </View>

        {story && (
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>{story.title}</Text>
            <Text style={styles.body}>{story.content}</Text>

            {showDetails ? (
              <Text style={styles.body}>{story.details}</Text>
            ) : (
              <Button title="Mehr erfahren" onPress={() => setShowDetails(true)} />
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
});