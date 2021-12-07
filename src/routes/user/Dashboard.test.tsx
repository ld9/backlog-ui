import { render, screen } from "@testing-library/react";
import Dashboard from "./Dashboard";

test("renders music", () => {
  render(<Dashboard />);
  const titleElement = screen.getByText(/Listen Again/i);
  expect(titleElement).toBeInTheDocument();
});

test("renders recent watched", () => {
  render(<Dashboard />);
  const titleElement = screen.getByText(/Continue Watching/i);
  expect(titleElement).toBeInTheDocument();
});
