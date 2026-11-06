import * as Location from 'expo-location';
import type { Place } from '../models';

// Eigener Fehlertyp, damit die UI "Berechtigung abgelehnt" von anderen Fehlern unterscheiden kann.
// canAskAgain = false heißt dauerhaft abgelehnt -> Einstellungen.
export class LocationPermissionError extends Error {
  canAskAgain: boolean;

  constructor(canAskAgain: boolean) {
    super('Standortberechtigung wurde abgelehnt.');
    this.name = 'LocationPermissionError';
    this.canAskAgain = canAskAgain;
  }
}

// GPS aus
export class LocationServicesDisabledError extends Error {
  constructor() {
    super('Ortungsdienste sind ausgeschaltet.');
    this.name = 'LocationServicesDisabledError';
  }
}

// Fragt die Berechtigung ab, holt die Koordinaten und den Ortsnamen.
export async function getCurrentPlace(): Promise<Place> {
  const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
  if (status !== Location.PermissionStatus.GRANTED) {
    throw new LocationPermissionError(canAskAgain);
  }

  const servicesEnabled = await Location.hasServicesEnabledAsync();
  if (!servicesEnabled) {
    throw new LocationServicesDisabledError();
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  const { latitude, longitude } = position.coords;
  const locationName = await getLocationName(latitude, longitude);

  return { latitude, longitude, locationName };
}

// Reverse-Geocoding: aus Koordinaten wird ein lesbarer Name. Schlägt es fehl, nehmen wir einen Ersatztext.
async function getLocationName(latitude: number, longitude: number): Promise<string> {
  try {
    const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (!address) return 'Unbekannter Ort';
    const parts = [address.name ?? address.street, address.city ?? address.region];
    return parts.filter(Boolean).join(', ') || 'Unbekannter Ort';
  } catch {
    return 'Unbekannter Ort';
  }
}