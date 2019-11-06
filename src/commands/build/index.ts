import { Command, flags as flagHelpers } from '@oclif/command';
import cli from 'cli-ux';
import * as fs from 'fs';
import { resolve } from 'path';

import { buildCommand, buildPath, getConfigFilePath, runCommand } from '../../utils';

const _pick = require('lodash/pick');

export default class BuildCommand extends Command {
  public static strict = false;

  public static description = 'Builds src or docs.';

  public static examples = [`$ sl-scripts build`, `$ sl-scripts build:typedoc`];

  public static args = [];

  public static flags = {
    verbose: flagHelpers.boolean({
      description: 'moar logs',
      required: false,
    }),

    directory: flagHelpers.string({
      char: 'd',
      description: 'the directory to build',
      default: './',
    }),
  };

  public async run() {
    cli.action.start('building...', undefined, { stdout: true });

    const parsed = this.parse(BuildCommand);
    const directory = parsed.flags.directory || './';

    const commands = [];

    commands.push(`${buildCommand('rimraf')} ${resolve(process.cwd(), directory, 'dist')}`);

    commands.push(
      buildCommand('tsc', {
        defaultArgs: {
          '--project': `--project ${getConfigFilePath(directory, 'tsconfig.build.json')}`,
        },
        flags: Object.keys(BuildCommand.flags),
      })
    );

    if (parsed.flags.verbose) {
      this.log(`commands:`);
      for (const command of commands) {
        this.log(`    '${command}'`);
      }
    }

    for (const command of commands) {
      runCommand(command);
    }

    cli.action.stop();

    this.postPublish();
  }

  public postPublish() {
    cli.action.start('copying extra files ot dist folder...', undefined, {
      stdout: true,
    });

    const parsed = this.parse(BuildCommand);
    const directory = parsed.flags.directory || './';

    const pkg = JSON.parse(fs.readFileSync(buildPath(directory, 'package.json')) as any);
    const releasePkg = _pick(pkg, [
      'name',
      'version',
      'description',
      'keywords',
      'main',
      'typings',
      'sideEffects',
      'files',
      'author',
      'repository',
      'license',
      'engines',
      'optionalDependencies',
      'peerDependencies',
      'dependencies',
      'pkg',
    ]);

    releasePkg.main = 'index.js';
    releasePkg.typings = 'index.d.ts';

    fs.writeFileSync(buildPath(directory, 'dist', 'package.json'), JSON.stringify(releasePkg, null, 2));
    fs.copyFileSync(buildPath(directory, 'README.md'), buildPath(directory, 'dist', 'README.md'));
    fs.copyFileSync(buildPath(directory, 'LICENSE'), buildPath(directory, 'dist', 'LICENSE'));

    cli.action.stop();
  }
}
