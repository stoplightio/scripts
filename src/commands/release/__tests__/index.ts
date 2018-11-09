import * as shelljs from 'shelljs';

import BuildCommand from '../index';

describe('sl-scripts release', () => {
  let shellCommands: string[] = [];

  beforeEach(() => {
    shellCommands = [];
    jest.spyOn(shelljs, 'exec').mockImplementation(val => shellCommands.push(val));
    jest.spyOn(process, 'cwd').mockImplementation(() => '/mock');
  });

  afterEach(() => jest.restoreAllMocks());

  it('should use the semantic-release binary in node modules', async () => {
    await BuildCommand.run();
    expect(shellCommands).toEqual(['/mock/node_modules/.bin/semantic-release']);
  });
});
