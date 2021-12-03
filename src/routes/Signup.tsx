import Modal from "../components/Modal";
import { useHistory } from "react-router";

import "../styles/signup.css";
import { createGlobalState } from "react-hooks-global-state";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { BASE_API_URL } from "../variables";
import { useGlobalState } from "../state";
import { strings } from "../strings";

export default function Signup() {
  const history = useHistory();

  const [token, setToken] = useGlobalState("token");
  const [tokenExpire, setTokenExpire] = useGlobalState("token");
  const [languageCode, setLanguageCode] = useGlobalState("language");

  useEffect(() => {
    strings.setLanguage(languageCode);
  }, [languageCode]);

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

        localStorage.setItem("user-token", data.token);
        localStorage.setItem("user-token-expires", data.expires);

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
    if (ipassConf === pass && pass.length > 8) {
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
          <p className={emailOk ? "" : "alter-email"}>{strings.signup_email}</p>
          <input
            type="text"
            value={email}
            name="email"
            onChange={(e) => validateEmail(e.target.value)}
            placeholder="you@email.com"
          />
        </label>
        <label>
          <p>{strings.signup_fname}</p>
          <input
            name="fname"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John"
          />
        </label>
        <label>
          <p>{strings.signup_lname}</p>
          <input
            name="lname"
            type="text"
            value={lname}
            onChange={(e) => setLname(e.target.value)}
            placeholder="Smith"
          />
        </label>
      </div>
      <div>
        <label>
          <p className={passConfOk ? "" : "mismatch-password"}>
            {strings.signup_pass}
          </p>
          <input
            type="password"
            name="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="•••••••••••••"
          />
        </label>
        <label>
          <p>{strings.signup_passConfirm}</p>
          <input
            type="password"
            name="confirmPassword"
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
    <div className="create-status">{strings.signup_processing}</div>
  );

  const success = <div className="create-status">{strings.signup_success}</div>;

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
