import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/colors';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

// Hinweisbalken, der nur im Offline-Fall sichtbar ist.
export function OfflineBanner() {
  const { isOnline } = useNetworkStatus();

  if (isOnline) return null;

  return (
    <View style={styles.banner} accessibilityRole="alert">
      <Text style={styles.text}>
        Du bist offline. Gespeicherte Geschichten kannst du weiterhin lesen.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: COLORS.error,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  text: {
    color: COLORS.background,
    textAlign: 'center',
  },
});
