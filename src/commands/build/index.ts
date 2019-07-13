import { Command, flags as flagHelpers } from '@oclif/command';
import cli from 'cli-ux';
import * as fs from 'fs';
import { dirname } from 'path';
import { cp, mkdir } from 'shelljs';

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
  };

  public async run() {
    cli.action.start('building...', undefined, { stdout: true });

    const parsed = this.parse(BuildCommand);

    const commands = [];

    commands.push(`${buildCommand('rimraf')} dist`);

    commands.push(
      buildCommand(`rollup --config ${getConfigFilePath('rollup.config.js')}`, {
        rawArgs: parsed.raw,
        flags: Object.keys(BuildCommand.flags),
      }),
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
    cli.action.start('copying extra files to dist folder...', undefined, {
      stdout: true,
    });

    const pkg = JSON.parse(fs.readFileSync(buildPath('package.json')) as any);
    const releasePkg = _pick(pkg, [
      'name',
      'version',
      'description',
      'keywords',
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

    releasePkg.main = 'index.cjs.js';
    releasePkg.module = 'index.es.js';
    if (!('typings' in releasePkg)) {
      releasePkg.typings = 'index.d.ts';
    }

    // Convert any yalced dependencies (local "file:" dependencies) into proper bundledDependencies before publishing
    for (const [name, version] of Object.entries(releasePkg.dependencies as { [key: string]: string })) {
      if (version.startsWith('file:')) {
        const filepath = version.replace('file:', '');
        const installPath = buildPath('dist', 'node_modules', name);
        mkdir('-p', dirname(installPath));
        cp('-r', buildPath(filepath), installPath);
        if (!releasePkg.bundledDependencies) {
          releasePkg.bundledDependencies = [];
        }
        releasePkg.bundledDependencies.push(name);
        // Remove the dependency from 'dependencies' since yarn (unlike npm) isn't smart enough
        // to know bundledDependencies don't be installed from registry
        delete releasePkg.dependencies[name];
      }
    }

    fs.writeFileSync(buildPath('dist', 'package.json'), JSON.stringify(releasePkg, null, 2));
    fs.copyFileSync(buildPath('README.md'), buildPath('dist', 'README.md'));
    fs.copyFileSync(buildPath('LICENSE'), buildPath('dist', 'LICENSE'));

    cli.action.stop();
  }
}
