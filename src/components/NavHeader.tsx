import { createGlobalState } from "react-hooks-global-state";
import {
  NavLink,
  useHistory,
  useLocation,
  useRouteMatch,
} from "react-router-dom";

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
            Backlog
          </NavLink>
        </div>
        <div id="nav-media-links">
          <NavLink activeClassName="active-link" to="/user/movies">
            Movies
          </NavLink>
          <NavLink activeClassName="active-link" to="/user/shows">
            Shows
          </NavLink>
          <NavLink activeClassName="active-link" to="/user/music">
            Music
          </NavLink>
        </div>
      </div>
      <div id="nav-user-links">
        <NavLink activeClassName="active-link" to="/user/admin">
          Admin
        </NavLink>
        <NavLink activeClassName="active-link" to="/user/preferences">
          Settings
        </NavLink>
        <NavLink to="/">Change User</NavLink>
      </div>
    </div>
  );
}
