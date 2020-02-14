import { buildCommand, getConfigFilePath } from '../../utils';
import BuildCommand from '../build';

export default class BundleCommand extends BuildCommand {
  public static strict = false;

  public static description = 'Bundle source code';

  public static examples = [`$ sl-scripts bundle`];

  protected get commands() {
    const parsed = this.parse(BundleCommand);

    return [
      buildCommand(`rollup --config ${getConfigFilePath('rollup.config.js')}`, {
        rawArgs: parsed.raw,
        flags: Object.keys(BundleCommand.flags),
      }),
      buildCommand(`tsc --declaration --emitDeclarationOnly -p ${getConfigFilePath('tsconfig.build.json')}`),
    ];
  }

  protected preparePackageJson() {
    const pkg = super.preparePackageJson();
    pkg.main = 'index.cjs.js';
    pkg.module = 'index.es.js';
    return pkg;
  }
}
