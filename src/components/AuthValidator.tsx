import { useEffect } from "react";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";

import { checkTokenStillActive } from "../functions";
import { useGlobalState } from "../state";
import { BASE_API_URL } from "../variables";

export default function AuthRouter() {
  const history = useHistory();
  const location = useLocation();

  const [user, setUser] = useGlobalState("user");

  useEffect(() => {
    const forceLoginExceptions = ["/", "/login", "/create-account"];

    if (!forceLoginExceptions.includes(location.pathname)) {
      void (async function verify() {
        const token = await checkTokenStillActive();

        if (token) {
          fetch(`${BASE_API_URL}/user/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (!data.auth) {
                history.replace("/login");
              } else {
                setUser(data.auth);
              }
            });
        } else {
          history.replace("/login");
        }
      })();
    }
  }, []);

  return null;
}
