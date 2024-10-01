// eslint-disable-next-line
const esbuild = require("esbuild");

const common = {
  entryPoints: ["src/index.tsx"],
  bundle: true,
  sourcemap: false,
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  loader: {
    ".js": "jsx",
    ".ts": "ts",
    ".tsx": "tsx",
  },
};

esbuild
  .build({
    ...common,
    platform: "browser",
    format: "esm",
    outfile: "dist/bundle.esm.js",
    external: ["react", "react-dom"],
  })
  .catch(() => process.exit(1));

esbuild
  .build({
    ...common,
    platform: "node",
    format: "cjs",
    target: ["node12"],
    outfile: "dist/bundle.cjs.js",
  })
  .catch(() => process.exit(1));
