import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';
import { OfflineBanner } from '../../components/OfflineBanner';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <OfflineBanner />
      <View style={styles.container}>
        <Text style={styles.title}>WayTales</Text>
        <Button
          title="Zur Detailansicht"
          onPress={() => {
            router.push('/story-detail')
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 16 },
});