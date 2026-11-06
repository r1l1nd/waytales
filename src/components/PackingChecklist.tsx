import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { COLORS } from '../constants/colors';
import type { PackingCategory } from '../models';

type Props = {
  categories: PackingCategory[];
  onToggle: (id: string) => void;
};

// Abhakbare Packliste, nach Kategorien gruppiert.
export function PackingChecklist({ categories, onToggle }: Props) {
  return (
    <View style={styles.list}>
      {categories.map((category, categoryIndex) => (
        <View key={categoryIndex} style={styles.category}>
          <AppText style={styles.categoryName} accessibilityRole="header">
            {category.categoryName}
          </AppText>
          {category.items.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => onToggle(item.id)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: item.isChecked }}
              accessibilityLabel={item.name}
              style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            >
              <SymbolView
                name={
                  item.isChecked
                    ? { ios: 'checkmark.square.fill', android: 'check_box', web: 'check_box' }
                    : { ios: 'square', android: 'check_box_outline_blank', web: 'check_box_outline_blank' }
                }
                size={24}
                tintColor={COLORS.primary}
              />
              <AppText style={[styles.itemText, item.isChecked && styles.itemChecked]}>{item.name}</AppText>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 20 },
  category: { gap: 4 },
  categoryName: { fontSize: 17, fontWeight: '600', color: COLORS.text, marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 44 },
  pressed: { opacity: 0.6 },
  itemText: { flex: 1, fontSize: 16, color: COLORS.text },
  itemChecked: { color: COLORS.textMuted, textDecorationLine: 'line-through' },
});