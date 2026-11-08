// Schriftart Poppins (Google Fonts, SIL Open Font License), geladen in src/app/_layout.tsx.
// Jede Stärke ist eine eigene Schrift. Darum fontFamily statt fontWeight verwenden.
// Die Namen müssen genau zu den Schlüsseln in useFonts passen.
export const FONTS = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semibold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
} as const;
