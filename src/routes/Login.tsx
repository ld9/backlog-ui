import Modal from "../components/Modal";
import { useHistory } from "react-router";
import { FormEvent, useEffect, useState } from "react";
import { createGlobalState } from "react-hooks-global-state";

import "../styles/login.css";
import { BASE_API_URL } from "../variables";
import { useGlobalState } from "../state";
import { NavLink } from "react-router-dom";

export default function Login() {
  let history = useHistory();

  const [token, setToken] = useGlobalState("token");
  const [tokenExpire, setTokenExpire] = useGlobalState("tokenExpire");

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [wrongPass, setWrongPass] = useState(0);

  useEffect(() => {

    if (token) {
      history.replace("/user");
    }
  }, []);

  const doLogin = (e: FormEvent) => {
    e.preventDefault();

    fetch(`${BASE_API_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password: pass,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Just makes sure the page doesn't change when it shouldn't.
        // If this skips, the user will see an empty dashboard.
        // (Effectively Pointless)
        if (data.auth === false || !data.token) {
          setWrongPass(wrongPass + 1);
          return;
        }


        setToken(data.token);
        setTokenExpire(data.expires);

        localStorage.setItem("user-token", data.token);
        localStorage.setItem("user-token-expires", data.expires);

        history.push("/user");
      });
  };

  return (
    <Modal title="Application Sign In">
      <div className="login-modal-container">
        <form onSubmit={doLogin}>
          <div>
            <label>
              <p>E-Mail Address</p>
              <input
                type="text"
                value={email}
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
              />
            </label>
            <label>
              <p>Password</p>
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="•••••••••••••"
              />
            </label>
          </div>
          <div>
            {wrongPass ? (
              <div className="login-fail">Incorrect Email or Password (Failures Logged: {wrongPass})</div>
            ) : null}
            <div className="password-reset-button">
              <NavLink to="request-reset-password">
                Request Password Reset
              </NavLink>
            </div>
            <input type="submit" value="Login"></input>
          </div>
        </form>
      </div>
    </Modal>
  );
}
