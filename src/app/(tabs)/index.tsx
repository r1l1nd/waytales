import { useRouter } from 'expo-router';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import { OfflineBanner } from '../../components/OfflineBanner';
import { COLORS } from '../../constants/colors';
import { useLocation } from '../../hooks/useLocation';

export default function HomeScreen() {
  const router = useRouter();
  const { place, isLoading, error, fetchLocation } = useLocation();

  return (
    <View style={styles.screen}>
      <OfflineBanner />
      <View style={styles.container}>
        <Text style={styles.title}>WayTales</Text>

        <Button title="Standort ermitteln" onPress={fetchLocation} disabled={isLoading} />
        {isLoading && <ActivityIndicator style={styles.spacing} />}
        {place && <Text style={styles.spacing}>Standort: {place.locationName}</Text>}
        {error && <Text style={[styles.spacing, styles.error]}>{error}</Text>}

        <View style={styles.spacing}>
          <Button title="Zur Detailansicht" onPress={() => router.push('/story-detail')} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 16 },
  spacing: { marginTop: 16 },
  error: { color: COLORS.error, textAlign: 'center' },
});