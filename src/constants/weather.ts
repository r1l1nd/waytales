import type { SymbolViewProps } from 'expo-symbols';

// Open-Meteo liefert höchstens 16 Tage Vorhersage, heute zählt als erster Tag.
export const MAX_FORECAST_DAYS = 16;


type WeatherDescription = {
  label: string;
  icon: SymbolViewProps['name'];
};

// Übersetzt den WMO-Wettercode von Open-Meteo in Text und Icon.
export function describeWeather(code: number): WeatherDescription {
  if (code === 0) {
    return { label: 'Sonnig', icon: { ios: 'sun.max', android: 'sunny', web: 'sunny' } };
  }
  if (code <= 2) {
    return { label: 'Leicht bewölkt', icon: { ios: 'cloud.sun', android: 'partly_cloudy_day', web: 'partly_cloudy_day' } };
  }
  if (code === 3) {
    return { label: 'Bewölkt', icon: { ios: 'cloud', android: 'cloud', web: 'cloud' } };
  }
  if (code <= 48) {
    return { label: 'Nebel', icon: { ios: 'cloud.fog', android: 'foggy', web: 'foggy' } };
  }
  if (code <= 57) {
    return { label: 'Nieselregen', icon: { ios: 'cloud.drizzle', android: 'rainy', web: 'rainy' } };
  }
  if (code <= 67 || (code >= 80 && code <= 82)) {
    return { label: 'Regen', icon: { ios: 'cloud.rain', android: 'rainy', web: 'rainy' } };
  }
  if (code <= 77 || code === 85 || code === 86) {
    return { label: 'Schnee', icon: { ios: 'cloud.snow', android: 'weather_snowy', web: 'weather_snowy' } };
  }
  return { label: 'Gewitter', icon: { ios: 'cloud.bolt.rain', android: 'thunderstorm', web: 'thunderstorm' } };
}
