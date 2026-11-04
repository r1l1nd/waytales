import DateTimePicker, {
    DateTimePickerAndroid,
    type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';
import { COLORS } from '../constants/colors';
import { fromIsoDate, toIsoDate } from '../utils/isoDate';

type Props = {
  value: string; // yyyy-mm-dd
  minimumDate: Date;
  onChange: (isoDate: string) => void;
};

// Datumsauswahl: iOS zeigt den kompakten System-Picker, Android öffnet den System-Dialog.
export function DateField({ value, minimumDate, onChange }: Props) {
  const date = fromIsoDate(value);

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    // "set" = bestätigt. Bei Abbrechen (Android) bleibt das alte Datum.
    if (event.type === 'set' && selected) onChange(toIsoDate(selected));
  };

  if (Platform.OS === 'ios') {
    return (
      <DateTimePicker
        value={date}
        mode="date"
        display="compact"
        locale="de-AT"
        minimumDate={minimumDate}
        onChange={handleChange}
        style={styles.iosPicker}
      />
    );
  }

  const label = date.toLocaleDateString('de-AT', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <Pressable
      onPress={() => DateTimePickerAndroid.open({ value: date, mode: 'date', minimumDate, onChange: handleChange })}
      accessibilityRole="button"
      accessibilityLabel={`Anreise am ${label}, ändern`}
      style={({ pressed }) => [styles.field, pressed && styles.pressed]}
    >
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iosPicker: { alignSelf: 'flex-start' },
  field: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
  },
  pressed: { opacity: 0.6 },
  text: { fontSize: 16, color: COLORS.text },
});