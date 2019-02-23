import * as path from 'path';

import * as utils from '../../../utils';
import BuildCommand from '../index';

const cwd = () => path.resolve(__dirname, 'fixtures');

describe('sl-scripts release', () => {
  let shellCommands: string[] = [];

  beforeEach(() => {
    shellCommands = [];
    // @ts-ignore
    jest.spyOn(utils, 'runCommand').mockImplementation(val => shellCommands.push(val));
    jest.spyOn(process, 'cwd').mockImplementation(cwd);
  });

  afterEach(() => jest.restoreAllMocks());

  it('should use the semantic-release binary in node modules', async () => {
    await BuildCommand.run();
    expect(shellCommands).toEqual([path.resolve(cwd(), 'node_modules', '.bin', 'semantic-release')]);
  });
});
