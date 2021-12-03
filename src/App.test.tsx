import { render, screen } from '@testing-library/react';
import App from './App';

test('shows lazy load text', () => {
  render(<App />);
  const titleElement = screen.getByText(/Loading Page.../i);
  expect(titleElement).toBeInTheDocument();
});