# @stoplight/scripts

[![License](https://img.shields.io/npm/l/@stoplight/scripts.svg)](https://github.com/stoplightio/scripts/blob/master/package.json)

<!-- toc -->
* [@stoplight/scripts](#stoplight-scripts)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @stoplight/scripts
$ sl-scripts COMMAND
running command...
$ sl-scripts (-v|--version|version)
@stoplight/scripts/0.0.0 darwin-x64 node-v8.12.0
$ sl-scripts --help [COMMAND]
USAGE
  $ sl-scripts COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`sl-scripts build`](#sl-scripts-build)
* [`sl-scripts build:tsdoc`](#sl-scripts-buildtsdoc)
* [`sl-scripts help [COMMAND]`](#sl-scripts-help-command)
* [`sl-scripts lint`](#sl-scripts-lint)
* [`sl-scripts test [PATH]`](#sl-scripts-test-path)

## `sl-scripts build`

Builds src files.

```
USAGE
  $ sl-scripts build

OPTIONS
  --verbose  moar logs

EXAMPLE
  $ sl-scripts build
```

_See code: [dist/commands/build/index.js](https://github.com/stoplightio/scripts/blob/v0.0.0/dist/commands/build/index.js)_

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

_See code: [dist/commands/build/tsdoc.js](https://github.com/stoplightio/scripts/blob/v0.0.0/dist/commands/build/tsdoc.js)_

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

_See code: [dist/commands/lint.js](https://github.com/stoplightio/scripts/blob/v0.0.0/dist/commands/lint.js)_

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

_See code: [dist/commands/test.js](https://github.com/stoplightio/scripts/blob/v0.0.0/dist/commands/test.js)_
<!-- commandsstop -->
