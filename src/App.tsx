import React, { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  useHistory,
  useLocation,
} from "react-router-dom";

import { createGlobalState } from "react-hooks-global-state";

// import Login from './routes/Login';

import "./App.css";

import themeCollection from "./styles/ThemeCollection";
import { useGlobalState } from "./state";
import Stage from "./routes/user/Stage";
import StageInitiator from "./routes/user/StageInitiator";
import AuthValidator from "./components/AuthValidator";
import ToastManager from "./components/ToastManager";

const Home = lazy(() => import("./routes/Home"));
const Login = lazy(() => import("./routes/Login"));
const Signup = lazy(() => import("./routes/Signup"));
// const Authenticated = lazy(() => import('./routes/Authenticated'));

const RequestResetPassword = lazy(
  () => import("./routes/RequestResetPassword")
);
const ResetPassword = lazy(() => import("./routes/ResetPassword"));

const Movies = lazy(() => import("./routes/user/Movies"));
const Music = lazy(() => import("./routes/user/Music"));
const Shows = lazy(() => import("./routes/user/Shows"));

const Admin = lazy(() => import("./routes/user/Admin"));
const Preferences = lazy(() => import("./routes/user/Preferences"));

const Dashboard = lazy(() => import("./routes/user/Dashboard"));
const NavHeader = lazy(() => import("./components/NavHeader"));

const localStorageFontSize = localStorage.getItem("fontSize");
const localStorageTheme = localStorage.getItem("themeName");
const localStorageFont = localStorage.getItem("font");

export default function App() {
  const [theme, setTheme] = useGlobalState("theme");
  const [fontSize, setFontSize] = useGlobalState("fontSize");
  const [font, setFont] = useGlobalState("font");

  // This makes the loading of preferences work if you are on any page that isn't the preferences page.
  // Without it, loading only works if you're on preferences. You'd need to go to that page
  // in order to get it to update.
  useEffect(() => {
    // Load ThemeName from LocalStorage
    if (localStorageTheme) {
      let theme = themeCollection[localStorageTheme];
      setTheme(localStorageTheme);

      Object.entries(theme).forEach((entry) => {
        let [property, value] = entry;
        document.documentElement.style.setProperty(property, value);
      });
    }

    // Load FontSize from LocalStorage
    if (localStorageFontSize) {
      setFontSize(localStorageFontSize);
      document.documentElement.style.setProperty(
        "font-size",
        localStorageFontSize + "em"
      );
    }

    // Load FontFamily from LocalStorage
    if (localStorageFont) {
      setFont(localStorageFont);
      document.documentElement.style.setProperty(
        "font-family",
        localStorageFont
      );
    }

    // Clear mediaKeys
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("mediaKey")) {
        const stored = localStorage.getItem(key);
        if (stored == null) {
          localStorage.removeItem(key);
          return;
        }
        const item = JSON.parse(stored);

        if (!item.authorized || item.invalidated || item.expires < new Date()) {
          localStorage.removeItem(key);
          return;
        }
      }
    });
  }, []);

  return (
    <Router>
      <Suspense
        fallback={
          <div className="loading-container">
            <div>
              <h1>Loading Page...</h1>
            </div>
          </div>
        }
      >
        <AuthValidator />
        <Stage></Stage>

        <header>
          <NavHeader></NavHeader>
        </header>

        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/create-account" component={Signup} />
          <Route
            exact
            path="/request-reset-password"
            component={RequestResetPassword}
          />
          <Route
            exact
            path="/reset-password/:token"
            component={ResetPassword}
          />

          <Route exact path="/user" component={Dashboard} />
          <Route path="/user/movies" component={Movies} />
          <Route path="/user/shows" component={Shows} />
          <Route path="/user/music" component={Music} />
          <Route path="/user/admin" component={Admin} />
          <Route path="/user/preferences" component={Preferences} />

          <Route path="/user/stage/:newStage" component={StageInitiator} />
          <Route path="/user/remote/:newStage" component={StageInitiator} />
          <Route path="/user/stage" />

          {/* <Route path="/user/movie/:slug" />
          <Route path="/user/show/:slug" /> */}
        </Switch>

        <ToastManager></ToastManager>
      </Suspense>
    </Router>
  );
}
