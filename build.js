const esbuild = require("esbuild");

const common = {
  entryPoints: ["src/index.tsx"],
  bundle: true,
  minify: true,
  sourcemap: false,
  outfile: "dist/bundle.js",
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  loader: {
    ".js": "jsx",
    ".ts": "ts",
    ".tsx": "tsx",
  },
  external: ["react", "react-dom"],
};

esbuild
  .build({
    ...common,
    outfile: "dist/bundle.js",
  })
  .catch(() => process.exit(1));

esbuild
  .build({
    ...common,
    platform: "node",
    outfile: "dist/bundle.cjs.js",
  })
  .catch(() => process.exit(1));
