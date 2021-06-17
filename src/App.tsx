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

const Home = lazy(() => import("./routes/Home"));
const Login = lazy(() => import("./routes/Login"));
const Signup = lazy(() => import("./routes/Signup"));
// const Authenticated = lazy(() => import('./routes/Authenticated'));

const Movies = lazy(() => import("./routes/user/Movies"));
const Music = lazy(() => import("./routes/user/Music"));
const Shows = lazy(() => import("./routes/user/Shows"));

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
      document.documentElement.style.setProperty("font-size", localStorageFontSize + "em");
    }

    // Load FontFamily from LocalStorage
    if (localStorageFont) {
      setFont(localStorageFont);
      document.documentElement.style.setProperty("font-family", localStorageFont);
    }


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

          <Route exact path="/user" component={Dashboard} />
          <Route path="/user/movies" component={Movies} />
          <Route path="/user/shows" component={Shows} />
          <Route path="/user/music" component={Music} />
          <Route path="/user/preferences" component={Preferences} />

          <Route path="/user/stage/:newStage" component={StageInitiator} />
          <Route path="/user/stage" />

          <Route path="/user/movie/:slug" />
          <Route path="/user/show/:slug" />
        </Switch>
      </Suspense>
    </Router>
  );
}