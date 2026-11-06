import { Tabs } from 'expo-router';
import { FONTS } from '../../constants/fonts';

export default function TabLayout() {
  return (
    <Tabs
      // Kopfzeile und Tab-Beschriftung zeichnet die Navigation selbst, darum die Schrift hier setzen.
      screenOptions={{
        headerTitleStyle: { fontFamily: FONTS.semibold },
        tabBarLabelStyle: { fontFamily: FONTS.medium },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="saved" options={{ title: 'Gespeicherte Orte' }} />
      <Tabs.Screen name="pack" options={{ title: 'Packliste' }} />
    </Tabs>
  );
}
