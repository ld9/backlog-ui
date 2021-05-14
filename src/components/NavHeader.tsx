import { createGlobalState } from "react-hooks-global-state";
import {
  NavLink,
  useHistory,
  useLocation,
  useRouteMatch,
} from "react-router-dom";
import { strings } from "../strings";

import "../styles/navbar.css";

export default function NavHeader() {
  let { url } = useRouteMatch();

  let location = useLocation();
  let path = location.pathname;

  let hideNavBar = ["/", "/login", "/create-account"];

  return <div>{hideNavBar.includes(path) ? null : <NavHeaderContents />}</div>;
}

function NavHeaderContents() {
  return (
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
        </div>
      </div>
      <div id="nav-user-links">
        <NavLink activeClassName="active-link" to="/user/admin">
          {strings.nav_admin}
        </NavLink>
        <NavLink activeClassName="active-link" to="/user/preferences">
          {strings.nav_settings}
        </NavLink>
        <NavLink to="/">{strings.nav_logout}</NavLink>
      </div>
    </div>
  );
}
