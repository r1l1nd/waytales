import * as Speech from 'expo-speech';

type SpeakOptions = {
  // Wird aufgerufen, wenn die Wiedergabe endet: fertig, gestoppt oder Fehler.
  onEnd: () => void;
};

// Einzige Stelle, die expo-speech kennt.
export function speak(text: string, { onEnd }: SpeakOptions) {
  // Laufende Wiedergabe beenden, damit nie zwei Texte gleichzeitig vorgelesen werden.
  Speech.stop();
  Speech.speak(text, {
    language: 'de-DE',
    onDone: onEnd,
    onStopped: onEnd,
    onError: onEnd,
  });
}

export function stopSpeaking() {
  Speech.stop();
}