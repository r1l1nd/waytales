import type { PackingCategory } from '../models';

// Plan B für Entwicklung und Präsentation: Mit true liefert der aiService
// diese Beispiel-Packliste statt Gemini.
export const USE_MOCK_PACKING_LIST = false;

// Als Funktion, damit jeder Aufruf eine frische Liste ohne Häkchen bekommt.
export function createMockPackingList(): PackingCategory[] {
  const categories = [
    { categoryName: 'Kleidung', items: ['T-Shirts', 'Pullover', 'Bequeme Schuhe', 'Socken'] },
    { categoryName: 'Wetterschutz', items: ['Regenjacke', 'Regenschirm'] },
    { categoryName: 'Hygiene', items: ['Zahnbürste', 'Duschgel', 'Deo'] },
    { categoryName: 'Dokumente & Technik', items: ['Reisepass', 'Ladekabel', 'Powerbank'] },
  ];

  return categories.map((category, categoryIndex) => ({
    categoryName: category.categoryName,
    items: category.items.map((name, itemIndex) => ({
      id: `${categoryIndex}-${itemIndex}`,
      name,
      isChecked: false,
    })),
  }));
}