import * as fs from 'fs';
import * as path from 'path';
import * as shelljs from 'shelljs';

import BuildCommand from '../index';

const cwd = () => path.resolve(__dirname, 'fixtures');

// these work locally, but not in circle...
describe.skip('sl-scripts build', () => {
  let shellCommands: string[] = [];
  let pkgFilePath: any;
  let pkgFile: any;

  beforeEach(() => {
    shellCommands = [];
    jest.spyOn(shelljs, 'exec').mockImplementation(val => shellCommands.push(val));
    jest.spyOn(process, 'cwd').mockImplementation(cwd);
    jest.spyOn(fs, 'writeFileSync').mockImplementation((p, val) => {
      pkgFilePath = p;
      pkgFile = val;
    });
    jest.spyOn(fs, 'copyFileSync').mockImplementation((_p, _val) => {
      // pkgFilePath = p;
      // pkgFile = val;
    });
  });

  afterEach(() => jest.restoreAllMocks());

  it('should use the tsc binary in node modules', async () => {
    await BuildCommand.run();
    expect(shellCommands).toEqual([
      `${path.resolve(cwd(), 'node_modules', '.bin', 'rimraf')} dist`,
      `${path.resolve(cwd(), 'node_modules', '.bin', 'tsc')} --project ${path.resolve(
        cwd(),
        'node_modules',
        '@stoplight',
        'scripts',
        'tsconfig.build.json'
      )}`,
    ]);
    expect(pkgFilePath).toEqual(path.resolve(cwd(), 'dist', 'package.json'));
    expect(pkgFile).toBeDefined();
  });
});
