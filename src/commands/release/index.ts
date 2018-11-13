import { Command, flags as flagHelpers } from '@oclif/command';

import { buildCommand, runCommand } from '../../utils';

export default class ReleaseCommand extends Command {
  public static strict = false;

  public static description = 'Publish new src or docs release.';

  public static examples = [`$ sl-scripts release`, `$ sl-scripts release:docs`];

  public static args = [];

  public static flags = {
    verbose: flagHelpers.boolean({
      description: 'moar logs',
      required: false,
    }),
  };

  public async run() {
    const parsed = this.parse(ReleaseCommand);

    const commands = [];

    commands.push(
      buildCommand('semantic-release', {
        defaultArgs: {},
        rawArgs: parsed.raw,
        flags: Object.keys(ReleaseCommand.flags),
      })
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
  }
}
