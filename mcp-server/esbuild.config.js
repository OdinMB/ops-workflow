import { build } from "esbuild";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

await build({
  entryPoints: [join(__dirname, "src/index.ts")],
  bundle: true,
  platform: "node",
  target: "node18",
  format: "esm",
  outfile: join(__dirname, "dist/index.js"),
  sourcemap: true,
  banner: {
    // ESM shims for __dirname and require()
    js: `
import { createRequire as __createRequire } from "module";
import { fileURLToPath as __fileURLToPath } from "url";
import { dirname as __dirname_fn } from "path";
const require = __createRequire(import.meta.url);
`,
  },
  external: [
    // claude-agent-sdk spawns a child process — can't bundle it
    "@anthropic-ai/claude-agent-sdk",
  ],
});

console.log("Built dist/index.js");
