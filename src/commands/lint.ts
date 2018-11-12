import { Command, flags as flagHelpers } from '@oclif/command';
import * as shell from 'shelljs';

import { buildCommand, getConfigFilePath } from '../utils';

export default class LintCommand extends Command {
  public static strict = false;

  public static description = 'Runs tslint. Supports all tslint flags.';

  public static examples = [`$ sl-scripts lint`, `$ sl-scripts lint src/**/*`];

  public static args = [
    // TODO: support the path arg
    // {
    //   name: 'path',
    //   description: 'a glob that describes the files to lint lint',
    //   required: false,
    // },
  ];

  public static flags = {
    verbose: flagHelpers.boolean({
      description: 'moar logs',
      required: false,
    }),
  };

  public async run() {
    const parsed = this.parse(LintCommand);

    let command = buildCommand('tslint', {
      defaultArgs: {
        format: '--format codeFrame',
        project: `--project ${getConfigFilePath('tsconfig.json')}`,
        config: `--config ${getConfigFilePath('tslint.json')}`,
      },
      rawArgs: parsed.raw,
    });

    if (parsed.flags.verbose) {
      this.log(`command: '${command}'`);
    }

    shell.exec(command);
  }
}
