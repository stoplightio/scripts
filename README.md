# @stoplight/scripts

[![Maintainability](https://api.codeclimate.com/v1/badges/2628d0fe95cf3abae711/maintainability)](https://codeclimate.com/github/stoplightio/scripts/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/2628d0fe95cf3abae711/test_coverage)](https://codeclimate.com/github/stoplightio/scripts/test_coverage)

<!-- toc -->
* [@stoplight/scripts](#stoplight-scripts)
* [Usage](#usage)
* [Commands](#commands)
* [Overriding Configs](#overriding-configs)
<!-- tocstop -->

# Usage

Create a new library:

```bash
npx @stoplight/scripts create:lib
```

# Commands

<!-- commands -->
* [`sl-scripts build`](#sl-scripts-build)
* [`sl-scripts build:tsdoc`](#sl-scripts-buildtsdoc)
* [`sl-scripts create:lib`](#sl-scripts-createlib)
* [`sl-scripts help [COMMAND]`](#sl-scripts-help-command)
* [`sl-scripts lint`](#sl-scripts-lint)
* [`sl-scripts release`](#sl-scripts-release)
* [`sl-scripts release:docs`](#sl-scripts-releasedocs)
* [`sl-scripts test [PATH]`](#sl-scripts-test-path)

## `sl-scripts build`

Builds src or docs.

```
USAGE
  $ sl-scripts build

OPTIONS
  --verbose  moar logs

EXAMPLES
  $ sl-scripts build
  $ sl-scripts build:tsdoc
```

_See code: [dist/commands/build/index.ts](https://github.com/stoplightio/scripts/blob/v0.0.0/dist/commands/build/index.ts)_

## `sl-scripts build:tsdoc`

Builds tsdoc files. Output into docs-auto folder.

```
USAGE
  $ sl-scripts build:tsdoc

OPTIONS
  --verbose  moar logs

EXAMPLE
  $ sl-scripts build:tsdoc
```

_See code: [dist/commands/build/tsdoc.ts](https://github.com/stoplightio/scripts/blob/v0.0.0/dist/commands/build/tsdoc.ts)_

## `sl-scripts create:lib`

Scaffold out a new library.

```
USAGE
  $ sl-scripts create:lib

EXAMPLE
  $ sl-scripts create:lib
```

_See code: [dist/commands/create/lib.ts](https://github.com/stoplightio/scripts/blob/v0.0.0/dist/commands/create/lib.ts)_

## `sl-scripts help [COMMAND]`

display help for sl-scripts

```
USAGE
  $ sl-scripts help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.3/src/commands/help.ts)_

## `sl-scripts lint`

Runs tslint. Supports all tslint flags.

```
USAGE
  $ sl-scripts lint

OPTIONS
  --verbose  moar logs

EXAMPLES
  $ sl-scripts lint
  $ sl-scripts lint src/**/*
```

_See code: [dist/commands/lint.ts](https://github.com/stoplightio/scripts/blob/v0.0.0/dist/commands/lint.ts)_

## `sl-scripts release`

Publish new src or docs release.

```
USAGE
  $ sl-scripts release

OPTIONS
  --dry-run  run the release process but do not publish
  --verbose  moar logs

EXAMPLES
  $ sl-scripts release
  $ sl-scripts release:docs
```

_See code: [dist/commands/release/index.ts](https://github.com/stoplightio/scripts/blob/v0.0.0/dist/commands/release/index.ts)_

## `sl-scripts release:docs`

Push built docs to github pages.

```
USAGE
  $ sl-scripts release:docs

OPTIONS
  --dry-run  run the release process but do not publish
  --verbose  moar logs

EXAMPLE
  $ sl-scripts release:docs
```

_See code: [dist/commands/release/docs.ts](https://github.com/stoplightio/scripts/blob/v0.0.0/dist/commands/release/docs.ts)_

## `sl-scripts test [PATH]`

Runs Jest. Supports all Jest flags.

```
USAGE
  $ sl-scripts test [PATH]

ARGUMENTS
  PATH  only run tests in the target directory

OPTIONS
  -w, --watch  run tests in watch mode
  --verbose    moar logs

EXAMPLES
  $ sl-scripts test
  $ sl-scripts test src/utils
```

_See code: [dist/commands/test.ts](https://github.com/stoplightio/scripts/blob/v0.0.0/dist/commands/test.ts)_
<!-- commandsstop -->

# Overriding Configs

## Jest

Simply create a `jest.config.js` file in the root of your project, and extend the default config. For example:

```js
// ./jest.config.js
module.exports = {
  preset: "@stoplight/scripts"
};
```

## TS

Simply create a `tsconfig.json` file in the root of your project, and extend the default config. For example:

```json
// ./tsconfig.json
{
  "extends": "./node_modules/@stoplight/scripts/tsconfig.json",
  "include": ["src"],
  "compilerOptions": {
    "outDir": "dist"
  }
}
```

## TSLint

Simply create a `tslint.json` file in the root of your project, and extend the default config. For example:

```json
// ./tslint.json
{
  "extends": ["./node_modules/@stoplight/scripts/tslint.json"]
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
    "plugins": [
      "@semantic-release/commit-analyzer",
      "@semantic-release/release-notes-generator"
    ]
  }
  // ... props
}
```
