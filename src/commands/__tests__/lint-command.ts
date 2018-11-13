import * as fs from 'fs';

import * as utils from '../../utils';
import LintCommand from '../lint';

describe('sl-scripts lint', () => {
  let shellCommands: string[] = [];

  beforeEach(() => {
    shellCommands = [];
    jest.spyOn(utils, 'runCommand').mockImplementation(val => shellCommands.push(val));
    jest.spyOn(process, 'cwd').mockImplementation(() => '/mock');
  });

  afterEach(() => jest.restoreAllMocks());

  it('should use the tslint binary in node modules', async () => {
    await LintCommand.run();
    expect(shellCommands).toEqual([
      '/mock/node_modules/.bin/tslint --format codeFrame --project /mock/node_modules/@stoplight/scripts/tsconfig.json "src/**/*.ts"',
    ]);
  });

  it('should support passing in a path', async () => {
    await LintCommand.run(['custom/**']);
    expect(shellCommands).toEqual([
      '/mock/node_modules/.bin/tslint custom/** --format codeFrame --project /mock/node_modules/@stoplight/scripts/tsconfig.json',
    ]);
  });

  it('should support passing multiple file names', async () => {
    await LintCommand.run(['f1.ts', 'f2.ts']);
    expect(shellCommands).toEqual([
      '/mock/node_modules/.bin/tslint f1.ts f2.ts --format codeFrame --project /mock/node_modules/@stoplight/scripts/tsconfig.json',
    ]);
  });

  it('should use user defined jest config file if present', async () => {
    jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
    await LintCommand.run();
    expect(shellCommands).toEqual([
      '/mock/node_modules/.bin/tslint --format codeFrame --project /mock/tsconfig.json "src/**/*.ts"',
    ]);
  });
});
