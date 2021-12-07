import { render, screen } from "@testing-library/react";
import Music from "./Music";

test("renders filter ability", () => {
  render(<Music />);
  const titleElement = screen.getByText(/Filter/i);
  expect(titleElement).toBeInTheDocument();
});

test("renders selection choices", () => {
  render(<Music />);
  const titleElement = screen.getByText(/Tags/i);
  expect(titleElement).toBeInTheDocument();
});
