import { render, screen } from "@testing-library/react";
import Preferences from "./Preferences";

test("renders heading", () => {
  render(<Preferences />);
  const titleElement = screen.getByText(/Settings/i);
  expect(titleElement).toBeInTheDocument();
});
