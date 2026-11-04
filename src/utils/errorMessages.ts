import { isAxiosError } from 'axios';
import { AiError } from '../services/aiService';
import { LocationPermissionError } from '../services/locationService';

// Wandelt einen Fehler in eine verständliche Meldung für den Nutzer um.
export function getErrorMessage(error: unknown): string {
  if (error instanceof LocationPermissionError) {
    return 'Bitte erlaube den Standortzugriff in den Einstellungen.';
  }
  if (error instanceof AiError) {
    switch (error.code) {
      case 'NETWORK':
        return 'Keine Verbindung zu Gemini. Prüfe dein Internet und versuche es erneut.';
      case 'RATE_LIMIT':
        return 'Gemini hat gerade zu viele Anfragen. Warte kurz und versuche es erneut.';
      case 'CONFIG':
        return 'Gemini ist nicht eingerichtet. Prüfe die .env-Datei.';
      case 'INVALID_RESPONSE':
        return 'Die Antwort konnte nicht gelesen werden. Bitte versuche es noch einmal.';
      default:
        return 'Gemini hat einen Fehler gemeldet. Bitte versuche es später erneut.';
    }
  }

  if (isAxiosError(error)) {
    return 'Keine Verbindung zum Wetterdienst. Prüfe dein Internet und versuche es erneut.';
  }

  return 'Etwas ist schiefgelaufen. Bitte versuche es erneut.';
}