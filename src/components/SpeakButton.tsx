import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { COLORS } from '../constants/colors';

type Props = {
  isSpeaking: boolean;
  onPress: () => void;
};

// Play/Stopp-Button fürs Vorlesen. Icon und Text wechseln je nach Zustand.
export function SpeakButton({ isSpeaking, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={isSpeaking ? 'Vorlesen stoppen' : 'Geschichte vorlesen'}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <SymbolView
        name={
          isSpeaking
            ? { ios: 'stop.fill', android: 'stop', web: 'stop' }
            : { ios: 'play.fill', android: 'play_arrow', web: 'play_arrow' }
        }
        size={18}
        tintColor={COLORS.primary}
      />
      <AppText style={styles.text}>{isSpeaking ? 'Stopp' : 'Vorlesen'}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
  },
  pressed: { opacity: 0.6 },
  text: { fontSize: 16, fontWeight: '500', color: COLORS.primary },
});