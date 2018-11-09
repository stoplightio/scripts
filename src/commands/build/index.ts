import { Command, flags as flagHelpers } from '@oclif/command';
import * as path from 'path';
import * as shell from 'shelljs';

import { buildCommand, getConfigFilePath } from '../../utils';

export default class BuildCommand extends Command {
  public static strict = false;

  public static description = 'Builds src files.';

  public static examples = [`$ sl-scripts build`];

  public static args = [];

  public static flags = {
    verbose: flagHelpers.boolean({
      description: 'moar logs',
      required: false,
    }),
  };

  public async run() {
    const parsed = this.parse(BuildCommand);

    const command1 = buildCommand('tsc', {
      defaultArgs: {
        project: `--project ${getConfigFilePath('tsconfig.build.json')}`,
      },
      rawArgs: parsed.raw,
    });

    const command2 = `${buildCommand('ts-node', {
      defaultArgs: {},
      rawArgs: parsed.raw,
    })} ${path.resolve(process.cwd(), 'node_modules', '@stoplight', 'scripts', 'dist', 'post-build-preparation')}`;

    if (parsed.flags.verbose) {
      this.log(`commands:`);
      this.log(`    '${command1}'`);
      this.log(`    '${command2}'`);
    }

    shell.exec(command1);
    shell.exec(command2);
  }
}
