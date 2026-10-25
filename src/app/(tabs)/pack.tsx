import { View, Text } from 'react-native';
import { OfflineBanner } from '../../components/OfflineBanner';

export default function PackScreen() {
  return (
    <View style={{ flex: 1 }}>
      <OfflineBanner />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Packliste (kommt noch)</Text>
      </View>
    </View>
  );
}