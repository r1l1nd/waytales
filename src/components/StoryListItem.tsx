import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';
import { COLORS } from '../constants/colors';
import type { Story } from '../models';
import { formatDate } from '../utils/formatDate';
import { AppText } from './AppText';

// welche Parameter (Props) StoryListItem von der übergeordneten Komponente erhalten muss
type StoryListItemProps = {
  story: Story;
  onPress: () => void;
};

type SymbolName = SymbolViewProps['name'];

// Jeder Stil bekommt ein eigenes Icon
const STYLE_ICONS: Record<string, SymbolName> = {
  Historisch: { ios: 'building.columns.fill', android: 'account_balance', web: 'account_balance' },
  'Fun Facts': { ios: 'lightbulb.fill', android: 'lightbulb', web: 'lightbulb' },
  Kinderfreundlich: { ios: 'figure.and.child.holdinghands', android: 'child_care', web: 'child_care' },
};

// Für unbekannte Stile (z. B. alte Einträge) ein neutrales Buch-Icon.
const FALLBACK_ICON: SymbolName = { ios: 'book.fill', android: 'menu_book', web: 'menu_book' };

// Eine Karte in der Liste der gespeicherten Geschichten.
export function StoryListItem({ story, onPress }: StoryListItemProps) {
  const date = formatDate(story.createdAt);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${story.title}, ${story.locationName}, ${story.style}, ${date}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.iconCircle}>
        <SymbolView
          name={STYLE_ICONS[story.style] ?? FALLBACK_ICON}
          size={22}
          tintColor={COLORS.primary}
        />
      </View>

      <View style={styles.info}>
        {/* Lange Titel nach zwei Zeilen mit "…" abschneiden. */}
        <AppText style={styles.title} numberOfLines={2}>
          {story.title}
        </AppText>

        <View style={styles.locationRow}>
          <SymbolView
            name={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }}
            size={14}
            tintColor={COLORS.textMuted}
          />
          <AppText style={styles.location} numberOfLines={1}>
            {story.locationName}
          </AppText>
        </View>

        <AppText style={styles.meta}>
          {story.style} · {date}
        </AppText>
      </View>

      {/* Pfeil zeigt: Antippen öffnet die Detailansicht. */}
      <SymbolView
        name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
        size={16}
        tintColor={COLORS.border}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    boxShadow: '0px 2px 8px rgba(27, 27, 27, 0.06)',
  },
  pressed: { backgroundColor: COLORS.primaryLight },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryLight,
  },
  // flex: 1 = der Text nimmt den Platz zwischen Icon und Pfeil ein.
  info: { flex: 1, gap: 4 },
  title: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  location: { flex: 1, fontSize: 14, color: COLORS.textMuted },
  meta: { fontSize: 12, color: COLORS.textMuted },
});
