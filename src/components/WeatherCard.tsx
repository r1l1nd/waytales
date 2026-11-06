import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { COLORS } from '../constants/colors';
import { describeWeather } from '../constants/weather';
import type { Weather } from '../models';

type Props = {
  weather: Weather;
};

// Zeigt das zusammengefasste Wetter für die Reise.
export function WeatherCard({ weather }: Props) {
  const { label, icon } = describeWeather(weather.conditionCode);

  return (
    <View
      style={styles.card}
      accessible
      accessibilityLabel={`Wetter in ${weather.destination}: ${label}, etwa ${weather.temperature} Grad, ${weather.precipitation} Millimeter Niederschlag`}
    >
      <SymbolView name={icon} size={36} tintColor={COLORS.primary} />
      <View style={styles.info}>
        <AppText style={styles.destination}>{weather.destination}</AppText>
        <AppText style={styles.summary}>
          {label} · Ø {weather.temperature} °C · {weather.precipitation} mm Niederschlag
        </AppText>
        <AppText style={styles.dates}>{weather.dateRange}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
  },
  info: { flex: 1, gap: 2 },
  destination: { fontSize: 18, fontWeight: '600', color: COLORS.text },
  summary: { fontSize: 15, color: COLORS.text },
  dates: { fontSize: 13, color: COLORS.textMuted },
});