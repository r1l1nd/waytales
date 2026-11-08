import type { PackingCategory } from '../src/models';
import { usePackingStore } from '../src/store/usePackingStore';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

const categories: PackingCategory[] = [
  {
    categoryName: 'Kleidung',
    items: [
      { id: '0-0', name: 'Jacke', isChecked: false },
      { id: '0-1', name: 'Mütze', isChecked: false },
    ],
  },
  { categoryName: 'Hygiene', items: [{ id: '1-0', name: 'Zahnbürste', isChecked: false }] },
];

// Liefert für jeden Eintrag (alle Kategorien) die id und ob er abgehakt ist.
function checkedState() {
  return usePackingStore
    .getState()
    .categories.flatMap((category) => category.items.map((item) => [item.id, item.isChecked]));
}

describe('usePackingStore.toggleItem', () => {
  beforeEach(() => {
    usePackingStore.setState({ categories, isBasicList: false });
  });

  it('setzt das Häkchen und entfernt es beim zweiten Mal wieder', () => {
    usePackingStore.getState().toggleItem('0-1');
    expect(checkedState()).toContainEqual(['0-1', true]);

    usePackingStore.getState().toggleItem('0-1');
    expect(checkedState()).toContainEqual(['0-1', false]);
  });

  it('ändert nur den angetippten Eintrag', () => {
    usePackingStore.getState().toggleItem('1-0');

    expect(checkedState()).toEqual([
      ['0-0', false],
      ['0-1', false],
      ['1-0', true],
    ]);
  });
});
