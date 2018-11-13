import * as fs from 'fs';

import * as utils from '../../utils';
import TestCommand from '../test';

describe('sl-scripts test', () => {
  let shellCommands: string[] = [];

  beforeEach(() => {
    shellCommands = [];
    jest.spyOn(utils, 'runCommand').mockImplementation(val => shellCommands.push(val));
    jest.spyOn(process, 'cwd').mockImplementation(() => '/mock');
  });

  afterEach(() => jest.restoreAllMocks());

  it('should use the jest binary in node modules', async () => {
    await TestCommand.run();
    expect(shellCommands).toEqual([
      '/mock/node_modules/.bin/jest --color=always --config=/mock/node_modules/@stoplight/scripts/jest.config.js',
    ]);
  });

  it('should support passing in a path and flag', async () => {
    await TestCommand.run(['src/**/*', '--watch']);
    expect(shellCommands).toEqual([
      '/mock/node_modules/.bin/jest src/**/* --watch --color=always --config=/mock/node_modules/@stoplight/scripts/jest.config.js',
    ]);
  });

  it('should use user defined jest config file if present', async () => {
    jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
    await TestCommand.run();
    expect(shellCommands).toEqual(['/mock/node_modules/.bin/jest --color=always --config=/mock/jest.config.js']);
  });
});
