import { hydrate } from "solid-js/web";
import { App } from "./app.jsx";

// entry point for browser
hydrate(App, document.getElementById("app"));
