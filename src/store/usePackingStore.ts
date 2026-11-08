import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createBasicPackingList } from '../constants/basicPackingList';
import type { PackingCategory, Weather } from '../models';
import { createStorage } from '../services/storageService';
import { todayIso } from '../utils/isoDate';

type PackingState = {
  destination: string;
  startDate: string;
  days: number;
  weather: Weather | null;
  categories: PackingCategory[];
  // true, solange nur die Offline-Basisliste statt einer KI-Liste angezeigt wird.
  isBasicList: boolean;
  setDestination: (destination: string) => void;
  setStartDate: (startDate: string) => void;
  setDays: (days: number) => void;
  setPackingResult: (weather: Weather, categories: PackingCategory[]) => void;
  showBasicList: () => void;
  clearBasicList: () => void;
  toggleItem: (id: string) => void;
};

// Der Teil des Stores, der wirklich gespeichert wird (ohne Funktionen).
type PersistedPackingState = Pick<PackingState, 'destination' | 'startDate' | 'days' | 'weather' | 'categories'>;

export const usePackingStore = create<PackingState>()(
  persist(
    (set, get) => ({
      destination: '',
      startDate: todayIso(),
      days: 3,
      weather: null,
      categories: [],
      isBasicList: false,
      setDestination: (destination) => set({ destination }),
      setStartDate: (startDate) => set({ startDate }),
      setDays: (days) => set({ days }),
      // Wetter und Liste nur gemeinsam ersetzen. Schlägt etwas fehl, bleibt die alte Liste samt Häkchen.
      // Eine echte Liste ersetzt auch die Basisliste.
      setPackingResult: (weather, categories) => set({ weather, categories, isBasicList: false }),
      // Nur wenn noch gar keine Liste da ist. Eine gespeicherte Liste wird nie überschrieben.
      showBasicList: () => {
        if (get().categories.length > 0) return;
        set({ categories: createBasicPackingList(), isBasicList: true });
      },
      // Wieder online: Basisliste entfernen
      clearBasicList: () => {
        if (!get().isBasicList) return;
        set({ categories: [], isBasicList: false });
      },
      toggleItem: (id) =>
        set({
          categories: get().categories.map((category) => ({
            ...category,
            items: category.items.map((item) =>
              item.id === id ? { ...item, isChecked: !item.isChecked } : item
            ),
          })),
        }),
    }),
    {
      name: 'packing-storage',
      storage: createStorage<PersistedPackingState>(),
      partialize: (state) => ({
        destination: state.destination,
        startDate: state.startDate,
        days: state.days,
        weather: state.weather,
        categories: state.isBasicList ? [] : state.categories,
      }),
      // gespeichertes Anreisedatum auf heute setzen
      onRehydrateStorage: () => (state) => {
        if (state && state.startDate < todayIso()) {
          state.setStartDate(todayIso());
        }
      },
    }
  )
);