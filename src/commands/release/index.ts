import { Command, flags as flagHelpers } from '@oclif/command';
import * as shell from 'shelljs';

import { buildCommand } from '../../utils';

export default class ReleaseCommand extends Command {
  public static strict = false;

  public static description = 'Publish new release.';

  public static examples = [`$ sl-scripts release`];

  public static args = [];

  public static flags = {
    dryRun: flagHelpers.string({
      name: 'dry-run',
      description: 'run the release process but do not publish',
      required: false,
    }),
    verbose: flagHelpers.boolean({
      description: 'moar logs',
      required: false,
    }),
  };

  public async run() {
    const parsed = this.parse(ReleaseCommand);

    const commands = [];

    commands.push(buildCommand('semantic-release'));

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
