import { render, screen } from "@testing-library/react";
import { shallow } from "enzyme";
import Admin from "./Admin";

import { BrowserRouter as Router } from "react-router-dom";

test("renders heading", () => {
  render(<Admin />);
  const titleElement = screen.getByText(/Admin/i);
  expect(titleElement).toBeInTheDocument();
});
