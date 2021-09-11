// @ts-check

/** This script modifies the project to support TS code in .svelte files like:

  <script lang="ts">
  	export let name: string;
  </script>
 
  As well as validating the code for CI.
  */

/**  To work on this script:
  rm -rf test-template template && git clone sveltejs/template test-template && node scripts/setupTypeScript.js test-template
*/

const fs = require("fs");
const path = require("path");
const { argv } = require("process");

const projectRoot = argv[2] || path.join(__dirname, "..");

// Add deps to pkg.json
const packageJSON = JSON.parse(
  fs.readFileSync(path.join(projectRoot, "package.json"), "utf8")
);
packageJSON.devDependencies = Object.assign(packageJSON.devDependencies, {
  "svelte-check": "^2.0.0",
  "svelte-preprocess": "^4.0.0",
  "@rollup/plugin-typescript": "^8.0.0",
  typescript: "4.3.5",
  tslib: "^2.0.0",
  "@tsconfig/svelte": "^2.0.0",
});

// Add script for checking
packageJSON.scripts = Object.assign(packageJSON.scripts, {
  check: "svelte-check --tsconfig ./tsconfig.json",
});

// Write the package JSON
fs.writeFileSync(
  path.join(projectRoot, "package.json"),
  JSON.stringify(packageJSON, null, "  ")
);

// mv src/index.js to index.ts - note, we need to edit rollup.config.js for this too
const beforeIndexJSPath = path.join(projectRoot, "src", "index.js");
const afterIndexTSPath = path.join(projectRoot, "src", "index.ts");
fs.renameSync(beforeIndexJSPath, afterIndexTSPath);

// Switch the example to use TS
const beforeMainJSPath = path.join(projectRoot, "example", "main.js");
const afterMainTSPath = path.join(projectRoot, "src", "main.ts");
fs.renameSync(beforeMainJSPath, afterMainTSPath);
const appSveltePath = path.join(projectRoot, "example", "App.svelte");
let appFile = fs.readFileSync(appSveltePath, "utf8");
appFile = appFile.replace("<script>", '<script lang="ts">');
appFile = appFile.replace("export let name;", "export let name: string;");
fs.writeFileSync(appSveltePath, appFile);

// Edit rollup config
const rollupConfigPath = path.join(projectRoot, "rollup.config.js");
let rollupConfig = fs.readFileSync(rollupConfigPath, "utf8");

// Edit imports
rollupConfig = rollupConfig.replace(
  `'rollup-plugin-terser';`,
  `'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';`
);

// Replace name of entry point
rollupConfig = rollupConfig.replace(`'src/index.js'`, `'src/index.ts'`);
rollupConfig = rollupConfig.replace(`'example/main.js'`, `'example/main.ts'`);

// Add preprocessor
rollupConfig = rollupConfig.replace(
  "compilerOptions:",
  "preprocess: sveltePreprocess({ sourceMap: !production }),\n\t\t\tcompilerOptions:"
);

// Add TypeScript
rollupConfig = rollupConfig.replace(
  "commonjs(),",
  "commonjs(),\n\t\ttypescript({\n\t\t\tsourceMap: !production,\n\t\t\tinlineSources: !production\n\t\t}),"
);
fs.writeFileSync(rollupConfigPath, rollupConfig);

// Add TSConfig
const tsconfig = `{
  "extends": "@tsconfig/svelte/tsconfig.json",

  "include": ["src/**/*", "example/**/*"],
  "exclude": ["node_modules/*", "__sapper__/*", "public/*"]
}`;
const tsconfigPath = path.join(projectRoot, "tsconfig.json");
fs.writeFileSync(tsconfigPath, tsconfig);

// Add global.d.ts
const dtsPath = path.join(projectRoot, "src", "global.d.ts");
fs.writeFileSync(dtsPath, `/// <reference types="svelte" />`);

// Replace JS content to TS content
let sourceCode = fs.readFileSync(afterIndexTSPath, "utf-8");
sourceCode = sourceCode.replace(
  `export default function plugin()`,
  `export default function plugin(): BytemdPlugin`
);
fs.writeFileSync(
  afterIndexTSPath,
  `import type { BytemdPlugin } from 'bytemd'
  
  ${sourceCode}`
);

// Delete this script, but not during testing
if (!argv[2]) {
  // Remove the script
  fs.unlinkSync(path.join(__filename));

  // Check for Mac's DS_store file, and if it's the only one left remove it
  const remainingFiles = fs.readdirSync(path.join(__dirname));
  if (remainingFiles.length === 1 && remainingFiles[0] === ".DS_store") {
    fs.unlinkSync(path.join(__dirname, ".DS_store"));
  }

  // Check if the scripts folder is empty
  if (fs.readdirSync(path.join(__dirname)).length === 0) {
    // Remove the scripts folder
    fs.rmdirSync(path.join(__dirname));
  }
}

// Adds the extension recommendation
fs.mkdirSync(path.join(projectRoot, ".vscode"), { recursive: true });
fs.writeFileSync(
  path.join(projectRoot, ".vscode", "extensions.json"),
  `{
  "recommendations": ["svelte.svelte-vscode"]
}
`
);

console.log("Converted to TypeScript.");

if (fs.existsSync(path.join(projectRoot, "node_modules"))) {
  console.log(
    "\nYou will need to re-run your dependency manager to get started."
  );
}
