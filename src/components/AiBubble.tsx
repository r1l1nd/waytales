import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { type CSSAnimationKeyframes, useReducedMotion } from 'react-native-reanimated';

type Props = {
  children?: ReactNode;
};

const SIZE = 180;

// Farben der Seifenblase, nur hier gebraucht.
const BUBBLE = {
  glow: 'rgba(110, 160, 255, 0.55)',
  rim: 'rgba(255, 255, 255, 0.8)',
  // Von der Mitte nach außen: fast weiß, dann hellblau.
  body: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.95) 0%, rgba(200, 230, 255, 0.9) 55%, rgba(130, 180, 255, 0.95) 100%)',
  // Regenbogen wie auf einer Seifenhaut, halbdurchsichtig.
  sheen: 'linear-gradient(135deg, rgba(255, 150, 210, 0.45) 0%, rgba(255, 235, 160, 0.35) 35%, rgba(150, 235, 255, 0.4) 65%, rgba(190, 160, 255, 0.45) 100%)',
  highlight: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 70%)',
};

// Leicht unterschiedlich runde Ecken: Die Blase wabbelt, bleibt aber fast rund.
const wobble: CSSAnimationKeyframes = {
  '0%': { borderTopLeftRadius: 92, borderTopRightRadius: 84, borderBottomRightRadius: 95, borderBottomLeftRadius: 86 },
  '50%': { borderTopLeftRadius: 84, borderTopRightRadius: 96, borderBottomRightRadius: 86, borderBottomLeftRadius: 94 },
  '100%': { borderTopLeftRadius: 95, borderTopRightRadius: 86, borderBottomRightRadius: 90, borderBottomLeftRadius: 84 },
};

// Dreht den Regenbogen, dadurch wandern die Farben über die Blase.
const spin: CSSAnimationKeyframes = {
  from: { transform: [{ rotate: '0deg' }] },
  to: { transform: [{ rotate: '360deg' }] },
};

// Das Leuchten wird größer und heller, wie beim Atmen.
const breathe: CSSAnimationKeyframes = {
  from: { transform: [{ scale: 0.95 }], opacity: 0.6 },
  to: { transform: [{ scale: 1.08 }], opacity: 1 },
};

// Die ganze Blase wippt sanft auf und ab.
const float: CSSAnimationKeyframes = {
  from: { transform: [{ translateY: -5 }] },
  to: { transform: [{ translateY: 5 }] },
};

// Schillernde, schwebende Seifenblase, damit der Button nach KI aussieht.
// Reine Optik, das Tippen regelt der Screen.
export function AiBubble({ children }: Props) {
  // Bei "Bewegung reduzieren" in den Systemeinstellungen bleibt die Blase still.
  const reduceMotion = useReducedMotion();

  return (
    <Animated.View
      style={[
        styles.container,
        !reduceMotion && {
          animationName: float,
          animationDuration: '4s',
          animationIterationCount: 'infinite',
          animationDirection: 'alternate',
          animationTimingFunction: 'ease-in-out',
        },
      ]}
    >
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
          styles.body,
          !reduceMotion && {
            animationName: wobble,
            animationDuration: '5s',
            animationIterationCount: 'infinite',
            animationDirection: 'alternate',
            animationTimingFunction: 'ease-in-out',
          },
        ]}
      >
        {/* Liegt in der Kugel, overflow: hidden schneidet ihn an deren Rand ab. */}
        <Animated.View
          style={[
            styles.sheen,
            !reduceMotion && {
              animationName: spin,
              animationDuration: '8s',
              animationIterationCount: 'infinite',
              animationTimingFunction: 'linear',
            },
          ]}
        />
        {/* Spiegelung einer Lichtquelle: bleibt fest an ihrer Stelle. */}
        <View style={styles.highlight} />
      </Animated.View>
      {children}
    </Animated.View>
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
  glow: {
    backgroundColor: BUBBLE.glow,
    boxShadow: [{ offsetX: 0, offsetY: 0, blurRadius: 40, spreadDistance: 8, color: BUBBLE.glow }],
  },
  body: {
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: BUBBLE.rim,
    backgroundImage: BUBBLE.body,
  },
  sheen: {
    ...StyleSheet.absoluteFill,
    backgroundImage: BUBBLE.sheen,
  },
  highlight: {
    position: 'absolute',
    top: SIZE * 0.12,
    left: SIZE * 0.18,
    width: SIZE * 0.35,
    height: SIZE * 0.22,
    borderRadius: SIZE * 0.2,
    transform: [{ rotate: '-30deg' }],
    backgroundImage: BUBBLE.highlight,
  },
});
