import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { type CSSAnimationKeyframes, useReducedMotion } from 'react-native-reanimated';
import { COLORS } from '../constants/colors';

type Props = {
  children?: ReactNode;
};

const SIZE = 180;

// Unterschiedlich runde Ecken ergeben eine Blase statt eines Kreises.
// Ändern sich die Werte laufend, "wabbelt" die Form.
const morph: CSSAnimationKeyframes = {
  '0%': { borderTopLeftRadius: 90, borderTopRightRadius: 70, borderBottomRightRadius: 100, borderBottomLeftRadius: 60 },
  '50%': { borderTopLeftRadius: 60, borderTopRightRadius: 100, borderBottomRightRadius: 70, borderBottomLeftRadius: 95 },
  '100%': { borderTopLeftRadius: 100, borderTopRightRadius: 65, borderBottomRightRadius: 90, borderBottomLeftRadius: 75 },
};

const spin: CSSAnimationKeyframes = {
  from: { transform: [{ rotate: '0deg' }] },
  to: { transform: [{ rotate: '360deg' }] },
};

// Der Schein dahinter wird größer und heller, wie beim Atmen.
const breathe: CSSAnimationKeyframes = {
  from: { transform: [{ scale: 1 }], opacity: 0.25 },
  to: { transform: [{ scale: 1.15 }], opacity: 0.45 },
};

// Sich bewegende Blase, damit der Button nach KI aussieht. Reine Optik, das Tippen regelt der Screen.
export function AiBubble({ children }: Props) {
  // Bei "Bewegung reduzieren" in den Systemeinstellungen bleibt die Blase still.
  const reduceMotion = useReducedMotion();

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.layer,
          styles.glow,
          !reduceMotion && {
            animationName: breathe,
            animationDuration: '3s',
            animationIterationCount: 'infinite',
            animationDirection: 'alternate',
            animationTimingFunction: 'ease-in-out',
          },
        ]}
      />
      <Animated.View
        style={[
          styles.layer,
          styles.outerBlob,
          !reduceMotion && {
            animationName: [morph, spin],
            animationDuration: ['6s', '14s'],
            animationIterationCount: 'infinite',
            animationDirection: ['alternate', 'normal'],
            animationTimingFunction: ['ease-in-out', 'linear'],
          },
        ]}
      />
      {/* Zweite Form mit anderem Tempo und Gegendrehung, dadurch wirkt die Bewegung lebendig. */}
      <Animated.View
        style={[
          styles.layer,
          styles.innerBlob,
          !reduceMotion && {
            animationName: [morph, spin],
            animationDuration: ['4s', '10s'],
            animationIterationCount: 'infinite',
            animationDirection: ['alternate-reverse', 'reverse'],
            animationTimingFunction: ['ease-in-out', 'linear'],
          },
        ]}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Alle Ebenen liegen genau übereinander.
  layer: {
    ...StyleSheet.absoluteFill,
    borderRadius: SIZE / 2,
  },
  glow: { backgroundColor: COLORS.primary, opacity: 0.25 },
  outerBlob: { backgroundColor: COLORS.primaryLight, opacity: 0.9 },
  innerBlob: { margin: 18, backgroundColor: COLORS.primary, opacity: 0.35 },
});
