import { SymbolView } from 'expo-symbols';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { OfflineBanner } from '../../components/OfflineBanner';
import { StyleDropdown } from '../../components/StyleDropdown';
import { COLORS } from '../../constants/colors';
import { useLocation } from '../../hooks/useLocation';
import { useSettingsStore } from '../../store/useSettingsStore';

export default function HomeScreen() {
  const { place, isLoading, error, fetchLocation } = useLocation();
  const style = useSettingsStore((state) => state.style);
  const setStyle = useSettingsStore((state) => state.setStyle);

  return (
    <View style={styles.screen}>
      <OfflineBanner />
      <View style={styles.container}>
        <Text style={styles.location}>
          {place ? `Standort: ${place.locationName}` : 'Standort noch unbekannt'}
        </Text>

        <Pressable
          style={({ pressed }) => [styles.gpsButton, pressed && styles.gpsButtonPressed]}
          onPress={fetchLocation}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel="Standort ermitteln"
        >
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : (
            <SymbolView
              name={{ ios: 'location.fill', android: 'location_on', web: 'location_on' }}
              size={64}
              tintColor={COLORS.primary}
            />
          )}
        </Pressable>

        {error && <Text style={styles.error}>{error}</Text>}

        <StyleDropdown value={style} onChange={setStyle} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 16,
    gap: 32,
  },
  location: { fontSize: 16, color: COLORS.text, textAlign: 'center' },
  gpsButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsButtonPressed: { opacity: 0.7 },
  error: { color: COLORS.error, textAlign: 'center' },
});