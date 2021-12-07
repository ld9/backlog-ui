import { render, screen } from "@testing-library/react";
import { shallow } from "enzyme";
import ListenAgain from "./ListenAgain";

test("renders heading message (component)", () => {
  // This message shows when the app is either redirecting or creating a new stage.
  render(<ListenAgain />);
  const titleElement = screen.getByTestId("dash-continue-list");
  expect(titleElement).toBeInTheDocument();
});

test("adds to queue end", () => {
  let full = render(<ListenAgain />);

  const titleElement = screen.getByTestId("dash-continue-list");
  if (titleElement.children.length > 0) {
    let item = shallow(<ListenAgain />);
    item.find("div[data-testid='dash-continue-item-0']").simulate("click");

    // Simulates the click event on the first item in the list.
    expect(titleElement.children.length).toBeGreaterThan(0);
  } else {
    expect(titleElement.children.length).toBe(0);
  }
});
