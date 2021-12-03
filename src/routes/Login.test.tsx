import { render, screen } from "@testing-library/react";
import Login from "./Login";

import { BrowserRouter as Router } from "react-router-dom";
import { shallow } from "enzyme";

test("renders email field", () => {
  render(
    <Router>
      <Login />
    </Router>
  );
  const titleElement = screen.getByText(/E-Mail Address/i);
  expect(titleElement).toBeInTheDocument();
});

test("renders password field", () => {
  render(
    <Router>
      <Login />
    </Router>
  );
  const titleElement = screen.getAllByText(/Password/i);
  expect(titleElement.length).toBe(2);
});

test("has reset button", () => {
  render(
    <Router>
      <Login />
    </Router>
  );
  const titleElement = screen.getByText(/Request Password Reset/i);
  expect(titleElement).toBeInTheDocument();
});

test("sends async login request", () => {
  let item = shallow(<Login />);

  item
    .find("input[type='text']")
    .simulate("change", { target: { value: "testInput" } });
  item.find("form").simulate("submit", {
    preventDefault: () => {
      // Do nothing for the test
      return;
    },
  });
});