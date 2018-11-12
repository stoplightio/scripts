import { Command, flags as flagHelpers } from '@oclif/command';
import * as path from 'path';
import * as shell from 'shelljs';

import { buildCommand } from '../../utils';

export default class BuildTsdocCommand extends Command {
  public static strict = false;

  public static description = 'Builds tsdoc files. Output into docs-auto folder.';

  public static examples = [`$ sl-scripts build:tsdoc`];

  public static args = [];

  public static flags = {
    verbose: flagHelpers.boolean({
      description: 'moar logs',
      required: false,
    }),
  };

  public async run() {
    const parsed = this.parse(BuildTsdocCommand);

    const commands = [];

    commands.push(
      `${buildCommand('typedoc', {
        defaultArgs: {
          out: `--out ${path.resolve(process.cwd(), 'docs-auto')}`,
          target: `--target es6`,
          theme: `--theme minimal`,
          mode: `--mode file`,
          excludeExternals: `--excludeExternals`,
          excludeNotExported: `--excludeNotExported`,
          excludePrivate: `--excludePrivate`,
          excludeProtected: `--excludeProtected`,
        },
        rawArgs: parsed.raw,
        flags: Object.keys(BuildTsdocCommand.flags)
      })} src`
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
