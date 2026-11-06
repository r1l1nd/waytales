import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PackingCategory, Weather } from '../models';
import { createStorage } from '../services/storageService';
import { todayIso } from '../utils/isoDate';

type PackingState = {
  destination: string;
  startDate: string;
  days: number;
  weather: Weather | null;
  categories: PackingCategory[];
  setDestination: (destination: string) => void;
  setStartDate: (startDate: string) => void;
  setDays: (days: number) => void;
  setPackingResult: (weather: Weather, categories: PackingCategory[]) => void;
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
      setDestination: (destination) => set({ destination }),
      setStartDate: (startDate) => set({ startDate }),
      setDays: (days) => set({ days }),
      // Wetter und Liste nur gemeinsam ersetzen. Schlägt etwas fehl, bleibt die alte Liste samt Häkchen.
      setPackingResult: (weather, categories) => set({ weather, categories }),
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
        categories: state.categories,
      }),
    }
  )
);