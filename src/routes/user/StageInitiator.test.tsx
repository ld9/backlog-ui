import { render, screen } from "@testing-library/react";
import StageInitiator from "./StageInitiator";
import { BrowserRouter as Router } from "react-router-dom";

test("renders deliver message", () => {
  // This message shows when the app is either redirecting or creating a new stage.
  render(
    <Router>
      <StageInitiator />
    </Router>
  );
  const titleElement = screen.getByText(/Trying to/i);
  expect(titleElement).toBeInTheDocument();
});
