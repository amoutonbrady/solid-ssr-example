import fastify from "fastify";
import serve from "fastify-static";
import { resolve, join } from "path";
import { readFileSync, readJsonSync } from "fs-extra";

import { renderToString, generateHydrationScript } from "solid-js/web";

import { App } from "./app.jsx";

const TEMPLATE_PATH = resolve(__dirname, "template.html");
const template = readFileSync(TEMPLATE_PATH, { encoding: "utf-8" });
const manifest = readJsonSync(resolve(__dirname, "manifest.json"));

const app = fastify();

app.register(serve, {
  root: join(__dirname, "public"),
  prefix: "/public/",
});

const makePage = ({ body = "", title = "", head = "", scripts = "" }) =>
  template
    .replace(/{{ TITLE }}/gim, title)
    .replace(/{{ HEAD }}/gim, head)
    .replace(/{{ SCRIPTS }}/gim, scripts)
    .replace(/{{ BODY }}/gim, body);

app.get("*", async (req, rep) => {
  const eventNames = ["click", "blur", "input"];
  const head = `<script>${generateHydrationScript({ eventNames })}</script>`;
  const body = renderToString(App);
  const scripts = `<script type="module" src="/public/${manifest["browser.js"]}"></script>`;

  rep.type("text/html");

  return makePage({ body, head, scripts });
});

app.listen(3042, console.log);
