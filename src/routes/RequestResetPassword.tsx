import Modal from "../components/Modal";
import { useHistory } from "react-router";
import { FormEvent, useEffect, useState } from "react";
import { createGlobalState } from "react-hooks-global-state";

import "../styles/password-reset.css";
import { BASE_API_URL } from "../variables";
import { useGlobalState } from "../state";
import { NavLink } from "react-router-dom";
import { strings } from "../strings";

export default function RequestResetPassword() {
  let history = useHistory();

  const [token, setToken] = useGlobalState("token");
  const [tokenExpire, setTokenExpire] = useGlobalState("tokenExpire");

  const [email, setEmail] = useState("");
  const [requestSent, setRequestSent] = useState(false);

  const doResetRequest = (e: FormEvent) => {
    e.preventDefault();

    fetch(`${BASE_API_URL}/user/request-reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setRequestSent(true);
      });
  };

  return (
    <Modal title="Request Password Reset">
      <div className="reset-modal-container">
        <form onSubmit={doResetRequest}>
          <div>
            <label>
              <p>{strings.requestReset_email}</p>
              <input
                type="text"
                value={email}
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
              />
            </label>
          </div>
          <div>
            {requestSent ? (
              <p className="reset-request-message">
                {strings.requestReset_confirm}
              </p>
            ) : (
              <input type="submit" value="Request Reset"></input>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
}
