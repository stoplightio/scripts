import * as shelljs from 'shelljs';

import BuildTsdocCommand from '../tsdoc';

describe('sl-scripts build:tsdoc', () => {
  let shellCommands: string[] = [];

  beforeEach(() => {
    shellCommands = [];
    jest.spyOn(shelljs, 'exec').mockImplementation(val => shellCommands.push(val));
    jest.spyOn(process, 'cwd').mockImplementation(() => '/mock');
  });

  afterEach(() => jest.restoreAllMocks());

  it('should use the typedoc binary in node modules', async () => {
    await BuildTsdocCommand.run();
    expect(shellCommands).toEqual([
      '/mock/node_modules/.bin/typedoc --out /mock/docs-auto --target es6 --theme minimal --mode file --excludeExternals --excludeNotExported --excludePrivate --excludeProtected src',
    ]);
  });
});
