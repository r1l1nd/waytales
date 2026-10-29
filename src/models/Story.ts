export interface Story {
    id: string;
    title: string;
    content: string;
    style: string;
    latitude: number;
    longitude: number;
    locationName: string;
    createdAt: string;
    // Zusätzliche Informationen für "Mehr erfahren" (bei älteren Geschichten nicht vorhanden).
    details?: string;
}

// Das liefert die KI, bevor daraus eine speicherbare Story wird.
export interface StoryDraft {
    title: string;
    content: string;
    details: string;
}