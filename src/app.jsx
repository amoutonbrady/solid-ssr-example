import { lazy } from "solid-js";
import { Route, Router, Link } from "solid-app-router";

function Layout() {
  return (
    <>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>

      <hr />

      <Route />
    </>
  );
}

const routes = [
  {
    path: "/",
    component: lazy(() => import("./pages/home.jsx")),
  },
  {
    path: "/about",
    component: lazy(() => import("./pages/about.jsx")),
  },
];

export function App(props = {}) {
  return (
    <Router routes={routes} initialURL={props.url}>
      <Layout />
    </Router>
  );
}
