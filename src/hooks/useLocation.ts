import { useCallback, useState } from 'react';
import type { Place } from '../models';
import { getCurrentPlace } from '../services/locationService';
import { getErrorMessage } from '../utils/errorMessages';

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
      setError(getErrorMessage(e));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { place, isLoading, error, fetchLocation };
}