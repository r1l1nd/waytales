import { useCallback, useState } from 'react';
import type { Place } from '../models';
import {
  getCurrentPlace,
  LocationPermissionError,
  LocationServicesDisabledError,
} from '../services/locationService';
import { getErrorMessage } from '../utils/errorMessages';

// Nur in diesen Fällen kann die Nutzerin das Problem selbst in den Einstellungen lösen.
function needsSettings(error: unknown): boolean {
  if (error instanceof LocationPermissionError) return !error.canAskAgain;
  return error instanceof LocationServicesDisabledError;
}

// Hook für Screens: kapselt Ladezustand, Fehler und den aktuellen Ort.
export function useLocation() {
  const [place, setPlace] = useState<Place | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canOpenSettings, setCanOpenSettings] = useState(false);

  const fetchLocation = useCallback(async (): Promise<Place | null> => {
    setIsLoading(true);
    setError(null);
    setCanOpenSettings(false);
    try {
      const result = await getCurrentPlace();
      setPlace(result);
      return result;
    } catch (e) {
      setError(getErrorMessage(e));
      setCanOpenSettings(needsSettings(e));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { place, isLoading, error, canOpenSettings, fetchLocation };
}
