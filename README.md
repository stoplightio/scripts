# @stoplight/scripts

[![Maintainability](https://api.codeclimate.com/v1/badges/2628d0fe95cf3abae711/maintainability)](https://codeclimate.com/github/stoplightio/scripts/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/2628d0fe95cf3abae711/test_coverage)](https://codeclimate.com/github/stoplightio/scripts/test_coverage)

<!-- toc -->

- [@stoplight/scripts](#stoplightscripts)
- [Usage](#usage)
- [Commands](#commands)
  - [`sl-scripts build`](#sl-scripts-build)
  - [`sl-scripts bundle`](#sl-scripts-bundle)
  - [`sl-scripts create:lib`](#sl-scripts-createlib)
  - [`sl-scripts release`](#sl-scripts-release)
  - [`sl-scripts release:docs`](#sl-scripts-releasedocs)
- [Overriding Configs](#overriding-configs)
  - [Jest](#jest)
  - [TS](#ts)
  - [Semantic Release](#semantic-release)
  - [Rollup](#rollup)
  <!-- tocstop -->

# Usage

Create a new library:

```bash
npx @stoplight/scripts create:lib
```

# Commands

<!-- commands -->

- [@stoplight/scripts](#stoplightscripts)
- [Usage](#usage)
- [Commands](#commands)
  - [`sl-scripts build`](#sl-scripts-build)
  - [`sl-scripts bundle`](#sl-scripts-bundle)
  - [`sl-scripts create:lib`](#sl-scripts-createlib)
  - [`sl-scripts release`](#sl-scripts-release)
  - [`sl-scripts release:docs`](#sl-scripts-releasedocs)
- [Overriding Configs](#overriding-configs)
  - [Jest](#jest)
  - [TS](#ts)
  - [Semantic Release](#semantic-release)
  - [Rollup](#rollup)

## `sl-scripts build`

Build source code

```
USAGE
  $ sl-scripts build [--verbose]

FLAGS
  --verbose  moar logs

DESCRIPTION
  Build source code

EXAMPLES
  $ sl-scripts build
```

_See code:
[src/commands/build/index.ts](https://github.com/stoplightio/scripts/blob/v0.0.0/src/commands/build/index.ts)_

## `sl-scripts bundle`

Bundle source code

```
USAGE
  $ sl-scripts bundle [--minify] [--verbose]

FLAGS
  --minify   minify output using terser
  --verbose  moar logs

DESCRIPTION
  Bundle source code

EXAMPLES
  $ sl-scripts bundle
```

_See code:
[src/commands/bundle/index.ts](https://github.com/stoplightio/scripts/blob/v0.0.0/src/commands/bundle/index.ts)_

## `sl-scripts create:lib`

Scaffold out a new library.

```
USAGE
  $ sl-scripts create:lib

DESCRIPTION
  Scaffold out a new library.

EXAMPLES
  $ sl-scripts create:lib
```

_See code: [src/commands/create/lib.ts](https://github.com/stoplightio/scripts/blob/v0.0.0/src/commands/create/lib.ts)_

## `sl-scripts release`

Publish new src or docs release.

```
USAGE
  $ sl-scripts release [--verbose]

FLAGS
  --verbose  moar logs

DESCRIPTION
  Publish new src or docs release.

EXAMPLES
  $ sl-scripts release

  $ sl-scripts release:docs
```

_See code:
[src/commands/release/index.ts](https://github.com/stoplightio/scripts/blob/v0.0.0/src/commands/release/index.ts)_

## `sl-scripts release:docs`

Push built docs to github pages.

```
USAGE
  $ sl-scripts release:docs [--dry-run] [--verbose]

FLAGS
  --dry-run  run the release process but do not publish
  --verbose  moar logs

DESCRIPTION
  Push built docs to github pages.

EXAMPLES
  $ sl-scripts release:docs
```

_See code:
[src/commands/release/docs.ts](https://github.com/stoplightio/scripts/blob/v0.0.0/src/commands/release/docs.ts)_

<!-- commandsstop -->

# Overriding Configs

## Jest

Simply create a `jest.config.js` file in the root of your project, and extend the default config. For example:

```js
// ./jest.config.js
module.exports = {
  preset: '@stoplight/scripts',
};
```

## TS

Simply create a `tsconfig.json` file in the root of your project, and extend the default config. For example:

```json
// ./tsconfig.json
{
  "extends": "@stoplight/scripts/tsconfig.json",
  "include": ["src"],
  "compilerOptions": {
    "outDir": "dist"
  }
}
```

## Semantic Release

Simply add a `release` property to your `package.json` file. For example:

```json
// ./package.json
{
  // ... props
  "release": {
    "pkgRoot": "dist",
    "plugins": ["@semantic-release/commit-analyzer", "@semantic-release/release-notes-generator"]
  }
  // ... props
}
```

## Rollup

By default all `dependencies` and `peerDependencies` declared in your `package.json` will be treated as external deps
during `sl-scripts bundle`. If you would like to always bundle a dep, list those deps in your `package.json` file like
so:

```json
{
  "name": "your-package",
  "version": "0.0.0",
  "rollup": {
    "bundleDeps": ["dep-1", "dep-2"]
  }
}
```
