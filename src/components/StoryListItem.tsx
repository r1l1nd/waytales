import { Pressable, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { COLORS } from '../constants/colors';
import type { Story } from '../models';
import { formatDate } from '../utils/formatDate';

// welche Parameter (Props) StoryListItem von der übergeordneten Komponente erhalten muss
type StoryListItemProps = {
  story: Story;
  onPress: () => void;
};

// Eine Zeile in der Liste der gespeicherten Geschichten.
export function StoryListItem({ story, onPress }: StoryListItemProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <AppText style={styles.title}>{story.title}</AppText>
      <AppText style={styles.location}>{story.locationName}</AppText>
      <AppText style={styles.meta}>
        {story.style} · {formatDate(story.createdAt)}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  pressed: { backgroundColor: COLORS.primaryLight },
  title: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  location: { marginTop: 2, fontSize: 14, color: COLORS.textMuted },
  meta: { marginTop: 2, fontSize: 13, color: COLORS.textMuted },
});
