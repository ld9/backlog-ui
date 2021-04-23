import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
} from "react-router-dom";

import { createGlobalState } from 'react-hooks-global-state';

// import Login from './routes/Login';

import "./App.css";

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

const initialState = {
  theme: 'bushido',
  font: 'Roboto Mono',
  user: {},
  token: ''
}

const { useGlobalState } = createGlobalState(initialState);

// X-MoviePage
export default function App() {
  return (
    // <UserProvider value={{
    //   isLoggedIn: false,
    //   user: {}
    // }}>
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

          <Route path="/user/movie/:slug" />
          <Route path="/user/show/:slug" />
          <Route path="/user/listen/:slug" component={Listen} />
        </Switch>
      </Suspense>
    </Router>
    // </UserProvider>
  );
}

function Listen() {
  let { slug } = useParams() as {
    slug: "none";
  };

  return <div>Listening to {slug}</div>;
}
