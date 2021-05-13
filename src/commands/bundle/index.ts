import { flags as flagHelpers } from '@oclif/command';
import { buildCommand, getConfigFilePath } from '../../utils';
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
    ];
  }

  protected preparePackageJson() {
    const pkg = super.preparePackageJson();
    Object.assign(pkg, {
      type: 'commonjs',
      main: './index.js',
      module: './index.mjs',
      exports: {
        require: './index.js',
        import: './index.mjs',
      },
    });
    return pkg;
  }
}
