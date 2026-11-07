import { useCallback, useEffect, useState } from 'react';

type Options = {
  /** Abstand zwischen zwei "Tastenanschlägen" in Millisekunden. */
  intervalMs?: number;
  /** Wie viele Zeichen pro Anschlag dazukommen. */
  charsPerTick?: number;
};

// Gibt einen Text Stück für Stück zurück, als würde er gerade getippt.
// skip() zeigt sofort den ganzen Text.
export function useTypewriter(text: string, { intervalMs = 20, charsPerTick = 3 }: Options = {}) {
  /**
   * text: Welcher Text gerade verarbeitet wird.
   * length: Wie viele Zeichen davon bereits angezeigt werden.
   */
  const [typed, setTyped] = useState({ text, length: 0 });

  // Neuer Text: direkt beim Rendern von vorne beginnen
  if (typed.text !== text) {
    setTyped({ text, length: 0 });
  }

  const isDone = typed.length >= text.length;

  useEffect(() => {
    if (isDone) return;

    // setInterval = führt eine bestimmte Funktion regelmäßig aus.
    const timer = setInterval(() => {
      setTyped((prev) => ({
        ...prev,
        length: Math.min(prev.length + charsPerTick, prev.text.length),
      }));
    }, intervalMs);

    // Timer stoppen, wenn fertig, der Text wechselt oder die Komponente verschwindet.
    return () => clearInterval(timer);
  }, [isDone, text, intervalMs, charsPerTick]);

  const skip = useCallback(() => {
    setTyped((prev) => ({ ...prev, length: prev.text.length }));
  }, []);

  return { displayedText: text.slice(0, typed.length), isDone, skip };
}
