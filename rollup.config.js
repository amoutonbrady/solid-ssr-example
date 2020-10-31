import nodeResolve from "@rollup/plugin-node-resolve";
import common from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import copy from "rollup-plugin-copy";
import outputManifest from "rollup-plugin-output-manifest";
import del from "rollup-plugin-delete";
import { resolve } from "path";

export default [
  {
    input: "src/server.js",
    output: [
      {
        dir: "build",
        exports: "auto",
        format: "cjs",
      },
    ],
    external: [
      "solid-js",
      "solid-js/dom",
      "fs-extra",
      "path",
      "fastify",
      "fastify-static",
      "stream",
    ],
    plugins: [
      del({ targets: "build/*" }),
      nodeResolve({ preferBuiltins: true }),
      babel({
        babelHelpers: "bundled",
        presets: [["solid", { generate: "ssr", hydratable: true }]],
      }),
      common(),
    ],
  },
  {
    input: "src/browser.js",
    output: [
      {
        dir: "build/public",
        entryFileNames: "[name].[hash].js",
        chunkFileNames: "[name].[hash].js",
        format: "esm",
      },
    ],
    preserveEntrySignatures: false,
    plugins: [
      nodeResolve(),
      babel({
        babelHelpers: "bundled",
        presets: [["solid", { generate: "dom", hydratable: true }]],
      }),
      common(),
      copy({
        targets: [
          {
            src: ["src/template.html"],
            dest: "build",
          },
        ],
      }),
      outputManifest({
        outputPath: resolve(__dirname, "build"),
      }),
    ],
  },
];
