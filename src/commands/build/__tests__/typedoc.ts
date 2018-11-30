import * as utils from '../../../utils';
import BuildTypedocCommand from '../typedoc';

describe('sl-scripts build:typedoc', () => {
  let shellCommands: string[] = [];

  beforeEach(() => {
    shellCommands = [];
    jest.spyOn(utils, 'runCommand').mockImplementation(val => shellCommands.push(val));
    jest.spyOn(process, 'cwd').mockImplementation(() => '/mock');
  });

  afterEach(() => jest.restoreAllMocks());

  it('should use the typedoc binary in node modules', async () => {
    await BuildTypedocCommand.run();
    expect(shellCommands).toEqual([
      '/mock/node_modules/.bin/typedoc --out /mock/docs-auto --target es6 --theme minimal --mode file --excludeNotExported --excludePrivate --excludeProtected --hideGenerator --tsconfig /mock/node_modules/@stoplight/scripts/tsconfig.build.json',
    ]);
  });
});
