import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { COLORS } from '../constants/colors';
import { STORY_STYLES, type StoryStyle } from '../constants/styles';

type Props = {
  value: StoryStyle;
  onChange: (style: StoryStyle) => void;
};

// Dropdown für den Erzählstil. Der gewählte Wert kommt von außen (value),
// eine Änderung wird über onChange gemeldet. So bleibt die Komponente einfach und testbar.
export function StyleDropdown({ value, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.container}>
      <AppText style={styles.label}>Erzählstil</AppText>

      <Pressable
        style={styles.field}
        onPress={() => setIsOpen((open) => !open)}
        accessibilityRole="button"
        accessibilityLabel={`Erzählstil: ${value}`}
        accessibilityState={{ expanded: isOpen }}
      >
        <AppText style={styles.fieldText}>{value}</AppText>
        <AppText style={styles.arrow}>{isOpen ? '▲' : '▼'}</AppText>
      </Pressable>

      {isOpen && (
        <View style={styles.list}>
          {STORY_STYLES.map((style) => (
            <Pressable
              key={style}
              style={[styles.option, style === value && styles.optionSelected]}
              onPress={() => {
                onChange(style);
                setIsOpen(false);
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: style === value }}
            >
              <AppText style={styles.optionText}>{style}</AppText>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: 240 },
  label: { fontSize: 13, color: COLORS.textMuted, marginBottom: 6 },
  field: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.background,
  },
  fieldText: { fontSize: 16, color: COLORS.text },
  arrow: { fontSize: 12, color: COLORS.textMuted },
  list: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },
  option: { paddingVertical: 12, paddingHorizontal: 14 },
  optionSelected: { backgroundColor: COLORS.primaryLight },
  optionText: { fontSize: 16, color: COLORS.text },
});