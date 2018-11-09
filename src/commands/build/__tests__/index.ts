import * as shelljs from 'shelljs';

import BuildCommand from '../index';

describe('sl-scripts build', () => {
  let shellCommands: string[] = [];

  beforeEach(() => {
    shellCommands = [];
    jest.spyOn(shelljs, 'exec').mockImplementation(val => shellCommands.push(val));
    jest.spyOn(process, 'cwd').mockImplementation(() => '/mock');
  });

  afterEach(() => jest.restoreAllMocks());

  it('should use the tsc binary in node modules', async () => {
    await BuildCommand.run();
    expect(shellCommands).toEqual([
      '/mock/node_modules/.bin/tsc --project /mock/node_modules/@stoplight/scripts/tsconfig.build.json',
      '/mock/node_modules/.bin/ts-node /mock/node_modules/@stoplight/scripts/dist/post-build-preparation',
    ]);
  });
});
