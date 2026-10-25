import { createHttpClient } from './httpClient';

const geocodingUrl = process.env.EXPO_PUBLIC_GEOCODING_API_URL;
const geocodingClient = geocodingUrl ? createHttpClient(geocodingUrl) : null;

export type GeocodedPlace = {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
};

type GeocodingResponse = {
  results?: GeocodedPlace[];
};

// Sucht einen Ort und liefert den besten Treffer, oder null, wenn nichts gefunden wurde.
export async function geocodePlace(query: string): Promise<GeocodedPlace | null> {
  if (!geocodingClient) {
    throw new Error('EXPO_PUBLIC_GEOCODING_API_URL fehlt in der .env');
  }

  const name = query.trim();
  if (name.length < 2) return null;

  const { data } = await geocodingClient.get<GeocodingResponse>('/search', {
    params: { name, count: 1, language: 'de', format: 'json' },
  });

  const place = data.results?.[0];
  if (!place) return null;

  return {
    name: place.name,
    latitude: place.latitude,
    longitude: place.longitude,
    country: place.country,
  };
}
