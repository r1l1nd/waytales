// Die Erzählstile, die im Dropdown angeboten werden.

// "as const" = TypeScript kennt die genauen Texte.
export const STORY_STYLES = ['Historisch', 'Fun Facts', 'Kinderfreundlich'] as const;

export type StoryStyle = (typeof STORY_STYLES)[number];

// Standard (wenn noch nichts gewählt wurde).
export const DEFAULT_STYLE: StoryStyle = 'Historisch';