import { Command, flags as flagHelpers } from '@oclif/command';
import cli from 'cli-ux';
import * as fs from 'fs';
import { dirname } from 'path';
import { cp, mkdir } from 'shelljs';

import { buildCommand, buildPath, getConfigFilePath, runCommand } from '../../utils';

const _pick = require('lodash/pick');

export default class BuildCommand extends Command {
  public static strict = false;

  public static description = 'Build source code';

  public static examples = [`$ sl-scripts build`];

  public static args = [];

  public static flags = {
    verbose: flagHelpers.boolean({
      description: 'moar logs',
      required: false,
    }),
  };

  protected get commands() {
    const parsed = this.parse(BuildCommand);

    return [
      buildCommand('tsc', {
        defaultArgs: {
          '--project': `--project ${getConfigFilePath('tsconfig.build.json')}`,
        },
        rawArgs: parsed.raw,
        flags: Object.keys(BuildCommand.flags),
      }),
    ];
  }

  public async run() {
    cli.action.start('building...', undefined, { stdout: true });

    const parsed = this.parse(BuildCommand);

    const commands = [`${buildCommand('rimraf')} dist`, ...this.commands];

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

  protected preparePackageJson() {
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
      'browser',
      'optionalDependencies',
      'peerDependencies',
      'peerDependenciesMeta',
      'dependencies',
      'dependenciesMeta',
      'pkg',
      'type',
    ]);

    releasePkg.main = 'index.js';
    if (!('typings' in releasePkg)) {
      releasePkg.typings = 'index.d.ts';
    }

    return releasePkg;
  }

  public postPublish() {
    cli.action.start('copying extra files ot dist folder...', undefined, {
      stdout: true,
    });

    const releasePkg = this.preparePackageJson();

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
    const readmeSourcePath = buildPath('README.md');
    const licenseSourcePath = buildPath('LICENSE');

    if (!fs.existsSync(readmeSourcePath)) {
      cli.error("A README.md file is mandatory in the project's root folder");
    }
    if (!fs.existsSync(licenseSourcePath)) {
      cli.error("A LICENSE file is mandatory in the project's root folder");
    }

    fs.copyFileSync(readmeSourcePath, buildPath('dist', 'README.md'));
    fs.copyFileSync(licenseSourcePath, buildPath('dist', 'LICENSE'));

    cli.action.stop();
  }
}
