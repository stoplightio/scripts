import { Command, flags as flagHelpers } from '@oclif/command';
import * as path from 'path';

import { buildCommand, getConfigFilePath, runCommand } from '../../utils';

export default class BuildTypedocCommand extends Command {
  public static strict = false;

  public static description = 'Builds tsdoc files. Output into docs-auto folder.';

  public static examples = [`$ sl-scripts build:tsdoc`];

  public static args = [];

  public static flags = {
    verbose: flagHelpers.boolean({
      description: 'moar logs',
      required: false,
    }),

    directory: flagHelpers.string({
      char: 'd',
      description: 'the directory to build',
      default: './',
    }),
  };

  public async run() {
    const parsed = this.parse(BuildTypedocCommand);
    const directory = parsed.flags.directory || './';

    const commands = [];

    commands.push(
      `${buildCommand('typedoc', {
        defaultArgs: {
          '--out': `--out ${path.resolve(process.cwd(), 'docs-auto')}`,
          '--target': `--target es6`,
          '--theme': `--theme minimal`,
          '--mode': `--mode file`,
          '--excludeNotExported': `--excludeNotExported`,
          '--excludePrivate': `--excludePrivate`,
          '--excludeProtected': `--excludeProtected`,
          '--hideGenerator': `--hideGenerator`,
          '--tsconfig': `--tsconfig ${getConfigFilePath(directory, 'tsconfig.build.json')}`,
        },
        rawArgs: parsed.raw,
        flags: Object.keys(BuildTypedocCommand.flags),
      })}`
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
