import fastify from "fastify";
import serve from "fastify-static";
import { resolve, join } from "path";
import { readFileSync, readJsonSync } from "fs-extra";

import { renderToNodeStream } from "solid-js/web";

import { App } from "./app.jsx";

const TEMPLATE_PATH = resolve(__dirname, "template.html");
const template = readFileSync(TEMPLATE_PATH, { encoding: "utf-8" });
const manifest = readJsonSync(resolve(__dirname, "manifest.json"));

const app = fastify();

app.register(serve, {
  root: join(__dirname, "public"),
  prefix: "/public/",
});

const makePage = ({ title = "", script = "", client = "" }) =>
  template
    .replace(/{{ TITLE }}/gim, title)
    .replace(/{{ HEAD }}/gim, script)
    .replace(/{{ SCRIPTS }}/gim, client)
    .split("{{ BODY }}");

app.get("*", (req, rep) => {
  const { script, stream } = renderToNodeStream(() => <App url={req.url} />);
  const client = `<script type="module" src="/public/${manifest["browser.js"]}"></script>`;

  rep.type("text/html");

  const [start, end] = makePage({ script, client });

  stream.unshift(start);
  stream.push(end);

  return stream;
});

app.listen(3042, console.log);
