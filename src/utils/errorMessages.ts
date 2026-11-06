import { isAxiosError } from 'axios';
import { AiError } from '../services/aiService';
import { LocationPermissionError, LocationServicesDisabledError } from '../services/locationService';

// Wandelt einen Fehler in eine verständliche Meldung für den Nutzer um.
export function getErrorMessage(error: unknown): string {
  if (error instanceof LocationPermissionError) {
    // Dauerhaft abgelehnt: Die App darf nicht mehr fragen, nur die Einstellungen helfen.
    return error.canAskAgain
      ? 'Ohne Standort kann WayTales keine Geschichte erzählen. Tippe erneut und erlaube den Zugriff.'
      : 'Der Standortzugriff ist ausgeschaltet. Erlaube ihn in den Einstellungen, um Geschichten zu hören.';
  }
  if (error instanceof LocationServicesDisabledError) {
    return 'Die Ortungsdienste sind ausgeschaltet. Schalte sie in den Einstellungen ein und versuche es erneut.';
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