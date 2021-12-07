import { render, screen } from "@testing-library/react";
import Shows from "./Shows";

test("renders filter ability", () => {
  render(<Shows />);
  const titleElement = screen.getByText(/Filter/i);
  expect(titleElement).toBeInTheDocument();
});

test("renders heading/page", () => {
  render(<Shows />);
  const titleElement = screen.getByText(/Collections/i);
  expect(titleElement).toBeInTheDocument();
});
