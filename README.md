# ByteMD plugin

This is a project template for ByteMD plugin. It lives at [https://github.com/curly210102/bytemd-plugin-template](https://github.com/curly210102/bytemd-plugin-template).

To create a new project based on this template using [degit](https://github.com/Rich-Harris/degit):

``` js
npx degit curly210102/bytemd-plugin-template bytemd-plugin
cd bytemd-plugin
```

*Note that you will need to have [Node.js](https://nodejs.org) installed.*

## Get started

Install the dependencies...

```bash
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

...then open another terminal panel, start preview:

``` bash
cd example && npm install && npm run dev
```

Navigate to [localhost:9000](http://localhost:9000). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.

If you're using [Visual Studio Code](https://code.visualstudio.com/) we recommend installing the official extension [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode). If you are using other editors you may need to install a plugin in order to get syntax highlighting and intellisense.

## Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

## Using TypeScript

This template comes with a script to set up a TypeScript development environment, you can run it immediately after cloning the template with:

```bash
node scripts/setupTypeScript.js
```

Or remove the script via:

```bash
rm scripts/setupTypeScript.js
```

If you want to use `baseUrl` or `path` aliases within your `tsconfig`, you need to set up `@rollup/plugin-alias` to tell Rollup to resolve the aliases. For more info, see [this StackOverflow question](https://stackoverflow.com/questions/63427935/setup-tsconfig-path-in-svelte).
