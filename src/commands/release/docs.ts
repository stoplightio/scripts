import { Command, flags as flagHelpers } from '@oclif/command';
import cli from 'cli-ux';
import * as fs from 'fs';
import * as shell from 'shelljs';
import * as url from 'url';

import { buildPath } from '../../utils';

export default class ReleaseDocsCommand extends Command {
  public static description = 'Push built docs to github pages.';

  public static examples = [`$ sl-scripts release:docs`];

  public static args = [];

  public static flags = {
    ['dry-run']: flagHelpers.boolean({
      description: 'run the release process but do not publish',
      required: false,
    }),
    verbose: flagHelpers.boolean({
      description: 'moar logs',
      required: false,
    }),
  };

  public async run() {
    const parsed = this.parse(ReleaseDocsCommand);

    cli.action.start('deploying docs...', undefined, { stdout: true });

    let repoUrl;
    const pkg = JSON.parse(fs.readFileSync(buildPath('package.json')) as any);
    if (typeof pkg.repository === 'object') {
      if (!pkg.repository.hasOwnProperty('url')) {
        throw new Error('URL does not exist in repository section');
      }
      repoUrl = pkg.repository.url;
    } else {
      repoUrl = pkg.repository;
    }

    if (!repoUrl) {
      cli.action.stop('docs NOT deployed - no repo url found in your package.json file');
      return;
    }

    const parsedUrl = url.parse(repoUrl);
    const repository = (parsedUrl.host || '') + (parsedUrl.path || '');
    const ghToken = process.env.GH_TOKEN;

    shell.cd('docs-auto');
    shell.touch('.nojekyll');

    const commands = [
      'git init',
      'git add .',
      'git config user.name "Stoplight"',
      'git config user.email "support@stoplight.io"',
      `git commit -m "chore(docs) [skip ci]"`,
      `git push --force --quiet "https://${ghToken}@${repository}" master:gh-pages`,
    ];

    if (parsed.flags.verbose) {
      this.log(`commands:`);
      for (const command of commands) {
        this.log(`    '${command}'`);
      }
    }

    if (!parsed.flags['dry-run']) {
      for (const command of commands) {
        shell.exec(command);
      }
    }

    cli.action.stop();
  }
}
