import Modal from "../components/Modal";
import { useHistory } from "react-router";

import "../styles/signup.css";
import { createGlobalState } from "react-hooks-global-state";
import { initialState } from "../App";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { BASE_API_URL } from "../variables";

export default function Signup() {
  const history = useHistory();

  const { useGlobalState } = createGlobalState(initialState);
  const [token, setToken] = useGlobalState("token");
  const [tokenExpire, setTokenExpire] = useGlobalState("token");

  const [name, setName] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [passConf, setPassConf] = useState("");

  const [alertMessage, setAlertMessage] = useState("");

  const [emailOk, setEmailOk] = useState(true);
  const [passConfOk, setPassConfOk] = useState(true);

  const [submitting, setSubmitting] = useState("");

  useEffect(() => {
    if (token) {
      history.replace("/user");
    }
  }, []);

  const loginUser = async (e: FormEvent) => {
    e.preventDefault();

    // setUser({
    //   email: email,
    // });

    if (!emailOk || !passConfOk) {
      return;
    }

    if (
      email === "" ||
      name === "" ||
      lname === "" ||
      pass === "" ||
      passConf === ""
    ) {
      setAlertMessage("All fields must be filled.");
      return;
    } else {
      setAlertMessage("");
    }

    setSubmitting("wait");
    fetch(`${BASE_API_URL}/user/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password: pass,
        name: {
          first: name,
          last: lname,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setSubmitting("success");

        setToken(data.token);
        setTokenExpire(data.expires);

        localStorage.setItem('user-token', data.token);
        localStorage.setItem('user-token-expires', data.expires);

        setTimeout(() => {
          history.push("/user");
        }, 4000);
      });
  };

  const validateEmail = (email: string) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const ok: boolean = re.test(String(email).toLowerCase());

    if (ok) {
      setEmailOk(true);
    } else {
      setEmailOk(false);
    }

    setEmail(email);
  };

  const validatePass = (ipassConf: string) => {
    if (ipassConf === pass) {
      setPassConfOk(true);
    } else {
      setPassConfOk(false);
    }

    setPassConf(ipassConf);
  };

  const inputForms = (
    <form onSubmit={loginUser}>
      <div>
        <label>
          <p className={emailOk ? "" : "alter-email"}>E-Mail Address</p>
          <input
            type="text"
            value={email}
            name="email"
            onChange={(e) => validateEmail(e.target.value)}
            placeholder="you@email.com"
          />
        </label>
        <label>
          <p>First Name</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John"
          />
        </label>
        <label>
          <p>Last Name</p>
          <input
            type="text"
            value={lname}
            onChange={(e) => setLname(e.target.value)}
            placeholder="Smith"
          />
        </label>
      </div>
      <div>
        <label>
          <p className={passConfOk ? "" : "mismatch-password"}>Password</p>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="•••••••••••••"
          />
        </label>
        <label>
          <p>Confirm Password</p>
          <input
            type="password"
            value={passConf}
            onChange={(e) => validatePass(e.target.value)}
            placeholder="•••••••••••••"
          />
        </label>
      </div>
      <div>
        <div className="alert-message">{alertMessage}</div>
        <input type="submit" value="Create Account"></input>
      </div>
    </form>
  );

  const waiting = (
    <div className="create-status">
      Your account is currently being created. Please do not refresh the page.
    </div>
  );

  const success = (
    <div className="create-status">
      Success! Your account has been created. Please check your email for a
      confirmation message. You will now be logged in.
    </div>
  );

  let contents;
  if (submitting === "") {
    contents = inputForms;
  } else if (submitting === "wait") {
    contents = waiting;
  } else if (submitting === "success") {
    contents = success;
  }

  return (
    <Modal title="Create your Account">
      <div className="signup-modal-container">{contents}</div>
    </Modal>
  );
}
