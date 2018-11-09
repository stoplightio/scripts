import * as path from 'path';
import * as shelljs from 'shelljs';

import BuildTsdocCommand from '../docs';

const cwd = () => path.resolve(__dirname, 'fixtures');

describe('sl-scripts release:docs', () => {
  let shellCommands: string[] = [];

  beforeEach(() => {
    shellCommands = [];
    jest.spyOn(shelljs, 'cd').mockImplementation(val => shellCommands.push(`cd ${val}`));
    jest.spyOn(shelljs, 'touch').mockImplementation(val => shellCommands.push(`touch ${val}`));
    jest.spyOn(shelljs, 'exec').mockImplementation(val => shellCommands.push(val));
    jest.spyOn(process, 'cwd').mockImplementation(cwd);
  });

  afterEach(() => jest.restoreAllMocks());

  it('should commit and push gh-pages branch', async () => {
    await BuildTsdocCommand.run();

    // TODO need to overwrite GH_TOKEN to test the final command below. this is not working
    // process.env.GH_TOKEN = '123';

    expect(shellCommands.slice(0, 7)).toEqual([
      'cd docs-auto',
      'touch .nojekyll',
      'git init',
      'git add .',
      'git config user.name "Stoplight"',
      'git config user.email "support@stoplight.io"',
      `git commit -m "chore(docs) [skip ci]"`,
      // `git push --force --quiet "https://123@github.com/stoplightio/scripts.git" master:gh-pages`,
    ]);
  });
});
