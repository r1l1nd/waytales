import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';
import { FONTS } from '../constants/fonts';

// Jede Outfit-Stärke ist eine eigene Schriftdatei. Darum wird aus fontWeight die passende Datei.
function fontForWeight(weight: TextStyle['fontWeight']): string {
  switch (String(weight)) {
    case '500':
      return FONTS.medium;
    case '600':
      return FONTS.semibold;
    case '700':
    case '800':
    case '900':
    case 'bold':
      return FONTS.bold;
    default:
      return FONTS.regular;
  }
}

// Ersatz für Text: Gleiche Props, aber immer in der App-Schrift.
// So bekommt jeder Text die Standardschrift, ohne dass jeder Stil sie selbst setzen muss.
export function AppText({ style, ...props }: TextProps) {
  // flatten macht aus einem Stil-Array (z. B. [styles.a, isChecked && styles.b]) ein Objekt.
  const { fontFamily, fontWeight } = StyleSheet.flatten(style) ?? {};

  return (
    <Text
      {...props}
      style={[
        style,
        // fontWeight zurücksetzen, sonst fettet Android die Schrift zusätzlich künstlich.
        { fontFamily: fontFamily ?? fontForWeight(fontWeight), fontWeight: 'normal' },
      ]}
    />
  );
}
