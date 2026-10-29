import { SymbolView } from 'expo-symbols';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/colors';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

// Hinweisbalken, der nur im Offline-Fall sichtbar ist.
export function OfflineBanner() {
  const { isOnline } = useNetworkStatus();

  if (isOnline) return null;

  return (
    <View style={styles.banner} accessibilityRole="alert" accessibilityLiveRegion="polite">
      <SymbolView
        name={{ ios: 'wifi.slash', android: 'cloud_off', web: 'cloud_off' }}
        size={20}
        tintColor={COLORS.error}
        style={styles.icon}
      />
      <Text style={styles.text}>
        <Text style={styles.title}>Keine Internetverbindung. </Text>
        Gespeicherte Geschichten kannst du weiterhin lesen.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  icon: {
    marginTop: 1,
  },
  text: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.text,
  },
  title: {
    fontWeight: '600',
  },
});
