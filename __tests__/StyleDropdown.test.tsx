import { render, screen, userEvent } from '@testing-library/react-native';
import { StyleDropdown } from '../src/components/StyleDropdown';
import { STORY_STYLES } from '../src/constants/styles';

// Die Komponente bekommt den Stil von außen (value) und meldet Änderungen über onChange.
// Deshalb brauchen wir hier keinen Store: onChange ist eine simulierte Funktion.
async function renderDropdown(onChange = jest.fn()) {
  await render(<StyleDropdown value="Historisch" onChange={onChange} />);
  return onChange;
}

describe('StyleDropdown', () => {
  it('zeigt den gewählten Stil, die Liste ist zu', async () => {
    await renderDropdown();

    expect(screen.getByRole('button', { name: 'Erzählstil: Historisch' })).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Fun Facts' })).not.toBeOnTheScreen();
  });

  it('öffnet beim Tippen die Liste mit allen Stilen', async () => {
    const user = userEvent.setup();
    await renderDropdown();

    await user.press(screen.getByRole('button', { name: 'Erzählstil: Historisch' }));

    for (const style of STORY_STYLES) {
      expect(screen.getByRole('button', { name: style })).toBeOnTheScreen();
    }
    // Der aktuelle Stil ist in der Liste als ausgewählt markiert.
    expect(screen.getByRole('button', { name: 'Historisch' })).toBeSelected();
  });

  it('meldet den neuen Stil über onChange und schließt die Liste', async () => {
    const user = userEvent.setup();
    const onChange = await renderDropdown();

    await user.press(screen.getByRole('button', { name: 'Erzählstil: Historisch' }));
    await user.press(screen.getByRole('button', { name: 'Kinderfreundlich' }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('Kinderfreundlich');
    expect(screen.queryByRole('button', { name: 'Kinderfreundlich' })).not.toBeOnTheScreen();
  });
});
