import { Command, flags as flagHelpers } from '@oclif/command';
import cli from 'cli-ux';
import * as fs from 'fs';
import * as shell from 'shelljs';

import { buildCommand, buildPath, getConfigFilePath } from '../../utils';

const _pick = require('lodash/pick');

export default class BuildCommand extends Command {
  public static strict = false;

  public static description = 'Builds src or docs.';

  public static examples = [`$ sl-scripts build`, `$ sl-scripts build:tsdoc`];

  public static args = [];

  public static flags = {
    verbose: flagHelpers.boolean({
      description: 'moar logs',
      required: false,
    }),
  };

  public async run() {
    cli.action.start('building...', undefined, { stdout: true });

    const parsed = this.parse(BuildCommand);

    const commands = [];

    commands.push(`${buildCommand('rimraf')} dist`);

    commands.push(
      buildCommand('tsc', {
        defaultArgs: {
          project: `--project ${getConfigFilePath('tsconfig.json')}`,
        },
        rawArgs: parsed.raw,
      })
    );

    if (parsed.flags.verbose) {
      this.log(`commands:`);
      for (const command of commands) {
        this.log(`    '${command}'`);
      }
    }

    for (const command of commands) {
      shell.exec(command);
    }

    cli.action.stop();

    this.postPublish();
  }

  public postPublish() {
    cli.action.start('copying extra files ot dist folder...', undefined, {
      stdout: true,
    });

    const pkg = JSON.parse(fs.readFileSync(buildPath('package.json')) as any);
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
    ]);

    releasePkg.main = 'index.js';
    releasePkg.typings = 'index.d.ts';

    fs.writeFileSync(buildPath('dist', 'package.json'), JSON.stringify(releasePkg, null, 2));
    fs.copyFileSync(buildPath('README.md'), buildPath('dist', 'README.md'));
    fs.copyFileSync(buildPath('LICENSE'), buildPath('dist', 'LICENSE'));

    cli.action.stop();
  }
}
