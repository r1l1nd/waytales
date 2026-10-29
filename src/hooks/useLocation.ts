import { useCallback, useState } from 'react';
import type { Place } from '../models';
import { getCurrentPlace, LocationPermissionError } from '../services/locationService';

// Hook für Screens: kapselt Ladezustand, Fehler und den aktuellen Ort.
export function useLocation() {
  const [place, setPlace] = useState<Place | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = useCallback(async (): Promise<Place | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getCurrentPlace();
      setPlace(result);
      return result;
    } catch (e) {
      setError(
        e instanceof LocationPermissionError
          ? 'Bitte erlaube den Standortzugriff in den Einstellungen.'
          : 'Standort konnte nicht ermittelt werden.'
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { place, isLoading, error, fetchLocation };
}