import { create } from 'axios';

// Baut einen Axios-Client mit Timeout. Alle HTTP-Aufrufe der App laufen über solche Clients.
export function createHttpClient(baseURL: string, timeout = 5000) {
  return create({ baseURL, timeout });
}
