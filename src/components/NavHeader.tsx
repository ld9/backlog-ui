import { useEffect, useState } from "react";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import { blankUser, useGlobalState } from "../state";
import { strings } from "../strings";

import "../styles/navbar.css";

export default function NavHeader() {
  let location = useLocation();
  let history = useHistory();

  const [user, setUser] = useGlobalState("user");
  const [token, setToken] = useGlobalState("token");
  const [stage, setStage] = useGlobalState("stage");

  let path = location.pathname;
  let hideNavBar = ["/", "/login", "/create-account", "/request-reset-password", "/reset-password"];

  return (
    <div>
      {hideNavBar.includes(path) || path.includes("/reset-password") ? null : (
        <div id="nav-container">
          <div id="nav-title-media">
            <div id="nav-user-home">
              <NavLink activeClassName="active-link" exact to="/user">
                {strings.home_appName}
              </NavLink>
            </div>
            <div id="nav-media-links">
              <NavLink activeClassName="active-link" to="/user/movies">
                {strings.nav_movies}
              </NavLink>
              <NavLink activeClassName="active-link" to="/user/shows">
                {strings.nav_shows}
              </NavLink>
              <NavLink activeClassName="active-link" to="/user/music">
                {strings.nav_music}
              </NavLink>
              {stage.queue.length >= 1 ? (
                <NavLink activeClassName="active-link" to="/user/stage">
                  {strings.nav_stage} ({stage.name})
                </NavLink>
              ) : null}
            </div>
          </div>
          <div id="nav-user-links">
            {user.permissions.user.admin ? (
              <NavLink activeClassName="active-link" to="/user/admin">
                {strings.nav_admin}
              </NavLink>
            ) : null}
            <NavLink activeClassName="active-link" to="/user/preferences">
              {strings.nav_settings}
            </NavLink>
            <NavLink
              to="/"
              onClick={() => {
                setUser(blankUser);
                setToken("");
              }}
            >
              {strings.nav_logout} ({user.name.first})
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
}
