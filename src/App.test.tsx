import React from 'react';
import { render, screen } from '@testing-library/react';
import { App } from './App';

test('renders the page title', () => {
  render(<App />);
  const pageTitle = screen.getByText(/learn music sight reading/i);
  expect(pageTitle).toBeInTheDocument();
});
