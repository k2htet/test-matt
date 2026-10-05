import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { App } from './App';

test('developers can see that the todo starter is ready', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Todo workspace' })).toBeVisible();
  expect(
    screen.getByText(
      'The shared workspace is ready for authentication and todo features.',
    ),
  ).toBeVisible();
});
