import { render, screen } from "@testing-library/react";
import Home from "./Home";

import { BrowserRouter as Router } from "react-router-dom";

test("loads landing page", () => {
  render(
    <Router>
      <Home />
    </Router>
  );
  const titleElement = screen.getByText(/Backlog Personal Media Server/i);
  expect(titleElement).toBeInTheDocument();
});

test("loads login button", () => {
  render(
    <Router>
      <Home />
    </Router>
  );
  const titleElement = screen.getByText(/Log In/i);
  expect(titleElement).toBeInTheDocument();
});

test("loads signup button", () => {
  render(
    <Router>
      <Home />
    </Router>
  );
  const titleElement = screen.getByText(/Sign Up/i);
  expect(titleElement).toBeInTheDocument();
});
