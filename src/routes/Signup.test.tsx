import { render, screen } from "@testing-library/react";
import Signup from "./Signup";

import { BrowserRouter as Router } from "react-router-dom";
import { shallow } from "enzyme";

test("renders email field", () => {
  render(
    <Router>
      <Signup />
    </Router>
  );
  const titleElement = screen.getByText(/E-Mail Address/i);
  expect(titleElement).toBeInTheDocument();
});

test("renders first name field", () => {
  render(
    <Router>
      <Signup />
    </Router>
  );
  const titleElement = screen.getByText(/First Name/i);
  expect(titleElement).toBeInTheDocument();
});

test("renders last name field", () => {
  render(
    <Router>
      <Signup />
    </Router>
  );
  const titleElement = screen.getByText(/Last Name/i);
  expect(titleElement).toBeInTheDocument();
});

test("renders password & confirm password field", () => {
  render(
    <Router>
      <Signup />
    </Router>
  );
  const titleElement = screen.getAllByText(/Password/i);
  expect(titleElement.length).toBe(2);
});

test("has create button", () => {
  render(
    <Router>
      <Signup />
    </Router>
  );
  const titleElement = screen.getByText(/Create Account/i);
  expect(titleElement).toBeInTheDocument();
});

test("sends async signup request", () => {
  let item = shallow(<Signup />);

  item
    .find("input[type='text'][name='email']")
    .simulate("change", { target: { value: "testInput@email.com" } });

  item
    .find("input[type='text'][name='fname']")
    .simulate("change", { target: { value: "testInput" } });

  item
    .find("input[type='text'][name='lname']")
    .simulate("change", { target: { value: "testInput" } });

  item.find("form").simulate("submit", {
    preventDefault: () => {
      // Do nothing for the test
      return;
    },
  });
});

test("validate the password check method does not throw", () => {
  let item = shallow(<Signup />);

  item
    .find("input[type='password'][name='confirmPassword']")
    .simulate("change", { target: { value: "testInput" } });

  item
    .find("input[type='password'][name='password']")
    .simulate("change", { target: { value: "testInput" } });

  item.find("form").simulate("submit", {
    preventDefault: () => {
      // Do nothing for the test
      return;
    },
  });
});
