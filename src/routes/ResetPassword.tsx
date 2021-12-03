import Modal from "../components/Modal";
import { useHistory, useLocation, useParams } from "react-router";
import { FormEvent, useEffect, useState } from "react";
import { createGlobalState } from "react-hooks-global-state";

import "../styles/password-reset.css";
import { BASE_API_URL } from "../variables";
import { useGlobalState } from "../state";
import { NavLink } from "react-router-dom";
import { strings } from "../strings";

export default function RequestResetPassword() {
  let { token } = useParams() as any;

  const [requestSent, setRequestSent] = useState(false);

  const [pass, setPass] = useState("");
  const [passConf, setPassConf] = useState("");

  const [passConfOk, setPassConfOk] = useState(true);
  const [languageCode, setLanguageCode] = useGlobalState("language");

  useEffect(() => {
    strings.setLanguage(languageCode);
  }, [languageCode])

  const doResetRequest = (e: FormEvent) => {
    e.preventDefault();

    fetch(`${BASE_API_URL}/user/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        password: pass,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setRequestSent(true);
      });
  };

  const validatePass = (ipassConf: string) => {
    if (ipassConf === pass) {
      setPassConfOk(true);
    } else {
      setPassConfOk(false);
    }

    setPassConf(ipassConf);
  };

  return (
    <Modal title="Request Password Reset">
      <div className="reset-modal-container">
        <form onSubmit={doResetRequest}>
          <div>
            <label>
              <p className={passConfOk ? "" : "mismatch-password"}>
                {strings.reset_desired}
              </p>
              <input
                name="password"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="•••••••••••••"
              />
            </label>
            <label>
              <p>{strings.reset_confirm}</p>
              <input
                name="passwordConf"
                type="password"
                value={passConf}
                onChange={(e) => validatePass(e.target.value)}
                placeholder="•••••••••••••"
              />
            </label>
          </div>
          <div>
            {requestSent ? (
              <div>
                <p className="reset-request-message">
                  {strings.reset_complete}
                </p>
                <NavLink to="/login">{strings.reset_return}</NavLink>
              </div>
            ) : (
              <input type="submit" value="Request Reset"></input>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
}
