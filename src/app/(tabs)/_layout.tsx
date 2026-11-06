import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';

export default function TabLayout() {
  return (
    <Tabs
      // Kopfzeile und Tab-Beschriftung zeichnet die Navigation selbst, darum die Schrift hier setzen.
      screenOptions={{
        headerTitleStyle: { fontFamily: FONTS.semibold },
        tabBarLabelStyle: { fontFamily: FONTS.medium },
        tabBarActiveTintColor: COLORS.primary,
      }}
    >
      {/* Icons: Android zeigt Google Material Symbols, iOS die SF Symbols (aktiv = gefüllt). */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color, size }) => (
            <SymbolView
              name={{ ios: focused ? 'house.fill' : 'house', android: 'home', web: 'home' }}
              tintColor={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Gespeicherte Orte',
          tabBarIcon: ({ focused, color, size }) => (
            <SymbolView
              name={{ ios: focused ? 'bookmark.fill' : 'bookmark', android: 'bookmark', web: 'bookmark' }}
              tintColor={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="pack"
        options={{
          title: 'Packliste',
          tabBarIcon: ({ focused, color, size }) => (
            <SymbolView
              name={{ ios: focused ? 'suitcase.fill' : 'suitcase', android: 'luggage', web: 'luggage' }}
              tintColor={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
