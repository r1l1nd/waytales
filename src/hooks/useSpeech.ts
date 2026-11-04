import { useCallback, useEffect, useState } from 'react';
import { speak, stopSpeaking } from '../services/ttsService';

// Steuert das Vorlesen in einem Screen. Wird der Screen verlassen, stoppt die Wiedergabe.
export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const stop = useCallback(() => {
    stopSpeaking();
    setIsSpeaking(false);
  }, []);

  // Ein Button für beides: startet, wenn nichts läuft, sonst Stopp.
  const toggle = useCallback(
    (text: string) => {
      if (isSpeaking) {
        stop();
        return;
      }
      setIsSpeaking(true);
      speak(text, { onEnd: () => setIsSpeaking(false) });
    },
    [isSpeaking, stop]
  );

  // Beim Verlassen des Screens (z. B. Detailansicht schließen) nicht weiterlesen.
  useEffect(() => () => stopSpeaking(), []);

  return { isSpeaking, toggle, stop };
}