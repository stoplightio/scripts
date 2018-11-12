import { Command, flags as flagHelpers } from '@oclif/command';
import * as shell from 'shelljs';

import { buildCommand, getConfigFilePath } from '../utils';

export default class TestCommand extends Command {
  public static strict = false;

  public static description = 'Runs Jest. Supports all Jest flags.';

  public static examples = [`$ sl-scripts test`, `$ sl-scripts test src/utils`];

  public static args = [
    {
      name: 'path',
      description: 'only run tests in the target directory',
      required: false,
    },
  ];

  public static flags = {
    verbose: flagHelpers.boolean({
      description: 'moar logs',
      required: false,
    }),
  };

  public async run() {
    const parsed = this.parse(TestCommand);

    const command = buildCommand('jest', {
      defaultArgs: {
        color: '--color=always',
        config: `--config=${getConfigFilePath('jest.config.js')}`,
      },
      rawArgs: parsed.raw,
      flags: Object.keys(TestCommand.flags),
    });

    if (parsed.flags.verbose) {
      this.log(`command: '${command}'`);
    }

    shell.exec(command);
  }
}
