import { Button, Text, View } from 'react-native';
import { STORY_STYLES } from '../src/constants/styles';
import { useSettingsStore } from '../src/store/useSettingsStore';

export default function HomeScreen() {
  const { style, setStyle } = useSettingsStore();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <Text style={{ fontSize: 20 }}>Aktueller Stil: {style}</Text>
      {STORY_STYLES.map((s) => (
        <Button key={s} title={s} onPress={() => setStyle(s)} />
      ))}
    </View>
  );
}