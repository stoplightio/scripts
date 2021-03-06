import { flags as flagHelpers } from '@oclif/command';
import * as fs from 'fs';

import { buildCommand, buildPath, getConfigFilePath } from '../../utils';
import BuildCommand from '../build';

export default class BundleCommand extends BuildCommand {
  public static strict = false;

  public static description = 'Bundle source code';

  public static examples = [`$ sl-scripts bundle`];

  public static flags = {
    minify: flagHelpers.boolean({
      description: 'minify output using terser',
      required: false,
      default: false,
    }),
    verbose: flagHelpers.boolean({
      description: 'moar logs',
      required: false,
    }),
  };

  protected get commands() {
    const parsed = this.parse(BundleCommand);

    return [
      buildCommand(`rollup --config ${getConfigFilePath('rollup.config.js')}`, {
        rawArgs: parsed.raw.map(rawArg => {
          if (rawArg.type === 'flag' && rawArg.flag === 'minify') {
            return {
              type: 'arg',
              input: '--environment MINIFY',
            };
          }

          return rawArg;
        }),
        flags: Object.keys(BundleCommand.flags),
      }),
      buildCommand(`tsc -p tsconfig.build.json --emitDeclarationOnly --declaration --declarationDir dist`),
    ];
  }

  protected preparePackageJson() {
    const pkg = super.preparePackageJson();

    const exports = {
      require: './index.js',
      import: './index.mjs',
    };

    Object.assign(pkg, {
      type: 'commonjs',
      main: './index.js',
      // webpack v4 support
      module: './index.esm.js',
      exports:
        'exports' in pkg && typeof pkg.exports === 'object'
          ? {
              ...pkg.exports,
              '.': exports,
            }
          : exports,
    });

    return pkg;
  }

  public postPublish() {
    // webpack v4 support
    fs.copyFileSync(buildPath('dist', 'index.mjs'), buildPath('dist', 'index.esm.js'));

    super.postPublish();
  }
}
