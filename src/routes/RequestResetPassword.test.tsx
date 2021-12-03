import { render, screen } from "@testing-library/react";
import { shallow } from "enzyme";
import RequestResetPassword from "./RequestResetPassword";

import { BrowserRouter as Router } from "react-router-dom";

test("renders reset prompt", () => {
  render(
    <Router>
      <RequestResetPassword />
    </Router>
  );
  const titleElement = screen.getByText(/Request Password Reset/i);
  expect(titleElement).toBeInTheDocument();
});

test("renders reset request button", () => {
  render(
    <Router>
      <RequestResetPassword />
    </Router>
  );
  const titleElement = screen.getByText(/Request Reset/i);
  expect(titleElement).toBeInTheDocument();
});

test("renders email input", () => {
  render(
    <Router>
      <RequestResetPassword />
    </Router>
  );
  const titleElement = screen.getByText(/E-Mail Address/i);
  expect(titleElement).toBeInTheDocument();
});

test("sends async request", () => {
  let item = shallow(<RequestResetPassword />);

  item
    .find("input[type='text']")
    .simulate("change", { target: { value: "test@test.com" } });
  item.find("form").simulate("submit", {
    preventDefault: () => {
      // Do nothing for the test
      return;
    },
  });
});
