import type { DailyForecast, GeocodedPlace } from '../services/weatherService';

// FAKE-DATEN: Beispielwetter als Plan B (kein Netz, API-Ausfall, Demo).
// Mit USE_MOCK_WEATHER = true liefert der weatherService diese Werte statt Open-Meteo.
export const USE_MOCK_WEATHER = false;

// Koordinaten von Wien. Der Name kommt aus der Eingabe, siehe geocodePlace.
export const MOCK_PLACE: Omit<GeocodedPlace, 'name'> = {
  latitude: 48.2085,
  longitude: 16.3721,
  country: 'Österreich',
};

// Beispielwerte für einzelne Tage. Das Datum setzt der weatherService je nach Zeitraum.
export const MOCK_DAYS: Omit<DailyForecast, 'date'>[] = [
  { temperatureMax: 14, temperatureMin: 7, precipitation: 0, weatherCode: 2 },
  { temperatureMax: 12, temperatureMin: 6, precipitation: 2.4, weatherCode: 61 },
  { temperatureMax: 13, temperatureMin: 5, precipitation: 0, weatherCode: 3 },
  { temperatureMax: 15, temperatureMin: 8, precipitation: 0.6, weatherCode: 1 },
];
