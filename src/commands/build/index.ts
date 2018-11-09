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

    const commands = [];

    commands.push(`${buildCommand('rimraf')} dist`);

    commands.push(
      buildCommand('tsc', {
        defaultArgs: {
          project: `--project ${getConfigFilePath('tsconfig.build.json')}`,
        },
        rawArgs: parsed.raw,
      })
    );

    commands.push(
      `node ${path.resolve(process.cwd(), 'node_modules', '@stoplight', 'scripts', 'dist', 'post-build-preparation')}`
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
  }
}
