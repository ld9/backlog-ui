import { render, screen } from "@testing-library/react";
import Movies from "./Movies";

test("renders filter ability", () => {
  render(<Movies />);
  const titleElement = screen.getByText(/Filter/i);
  expect(titleElement).toBeInTheDocument();
});

test("renders selection choices", () => {
  render(<Movies />);
  const titleElement = screen.getByText(/Tags/i);
  expect(titleElement).toBeInTheDocument();
});
