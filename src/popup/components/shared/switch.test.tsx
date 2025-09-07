import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { Switch } from './switch';

describe('Switch', () => {
  test('matches snapshot when unchecked', () => {
    const { container } = render(<Switch checked={false} onChange={() => {}} />);
    expect(container).toMatchSnapshot();
  });

  test('matches snapshot when checked', () => {
    const { container } = render(<Switch checked={true} onChange={() => {}} />);
    expect(container).toMatchSnapshot();
  });

  test('calls onChange when clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Switch checked={false} onChange={onChange} />);
    const switchElement = screen.getByRole('switch');

    await user.click(switchElement);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
