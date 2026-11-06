// Schriftart Outfit (Google Fonts, SIL Open Font License), geladen in src/app/_layout.tsx.
// Jede Stärke ist eine eigene Schrift. Darum fontFamily statt fontWeight verwenden.
// Die Namen müssen genau zu den Schlüsseln in useFonts passen.
export const FONTS = {
  regular: 'Outfit_400Regular',
  medium: 'Outfit_500Medium',
  semibold: 'Outfit_600SemiBold',
  bold: 'Outfit_700Bold',
} as const;
