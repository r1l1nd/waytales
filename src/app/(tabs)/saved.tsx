import { View, Text } from 'react-native';
import { OfflineBanner } from '../../components/OfflineBanner';

export default function SavedScreen() {
  return (
    <View style={{ flex: 1 }}>
      <OfflineBanner />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Gespeicherte Orte (kommt noch)</Text>
      </View>
    </View>
  );
}