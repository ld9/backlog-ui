import { render, screen } from "@testing-library/react";
import { shallow } from "enzyme";
import { BrowserRouter as Router } from "react-router-dom";
import Stage from "./Stage";

test("renders global controls", () => {
  render(
    <Router>
      <Stage />
    </Router>
  );
  const titleElement = screen.getByText(/Global Controls/i);
  expect(titleElement).toBeInTheDocument();
});

test("renders playback queue", () => {
  render(
    <Router>
      <Stage />
    </Router>
  );
  const titleElement = screen.getByText(/Playback Queue/i);
  expect(titleElement).toBeInTheDocument();
});
