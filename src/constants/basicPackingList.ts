import type { PackingCategory } from '../models';

// Fallback ohne Internet: Dinge, die man auf jeder Reise braucht.
// Ohne Mengen, weil wir weder Wetter noch Reiseziel kennen.
const BASIC_CATEGORIES = [
  { categoryName: 'Kleidung', items: ['Unterwäsche', 'Socken', 'T-Shirts', 'Bequeme Schuhe'] },
  { categoryName: 'Hygiene', items: ['Zahnbürste', 'Zahnpasta', 'Deo', 'Medikamente'] },
  { categoryName: 'Dokumente', items: ['Ausweis oder Reisepass', 'Bankkarte', 'Versicherungskarte'] },
  { categoryName: 'Technik', items: ['Smartphone', 'Ladekabel', 'Powerbank'] },
];

// Als Funktion, damit jeder Aufruf eine frische Liste ohne Häkchen bekommt.
export function createBasicPackingList(): PackingCategory[] {
  return BASIC_CATEGORIES.map((category, categoryIndex) => ({
    categoryName: category.categoryName,
    items: category.items.map((name, itemIndex) => ({
      // Eigenes Präfix, damit die ids sich nie mit denen einer KI-Liste überschneiden.
      id: `basic-${categoryIndex}-${itemIndex}`,
      name,
      isChecked: false,
    })),
  }));
}
