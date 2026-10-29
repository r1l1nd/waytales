import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

type MapLocation = {
  latitude: number;
  longitude: number;
  name: string;
};

// Baut die Adresse für die Karten-App des Geräts (Apple Karten auf iOS, geo: auf Android).
export function buildMapUrl({ latitude, longitude, name }: MapLocation) {
  const label = encodeURIComponent(name);

  if (Platform.OS === 'ios') {
    return `https://maps.apple.com/place?coordinate=${latitude},${longitude}&name=${label}`;
  }
  return `geo:0,0?q=${latitude},${longitude}(${label})`;
}

// Öffnet den Ort in der Karten-App. Schlägt fehl, wenn keine passende App installiert ist.
export async function openInMaps(location: MapLocation) {
  await Linking.openURL(buildMapUrl(location));
}
