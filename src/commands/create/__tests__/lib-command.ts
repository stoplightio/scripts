import * as utils from '../../../utils';
import LibCommand from '../lib';

describe('sl-scripts create:lib', () => {
  let shellCommands: string[] = [];
  let libInstance: LibCommand;

  beforeEach(() => {
    shellCommands = [];
    libInstance = new LibCommand([], {
      name: 'create:lib',
      version: '',
      channel: '',
      // @ts-ignore
      pjson: '',
    });
    // @ts-ignore
    jest.spyOn(utils, 'runCommand').mockImplementation(val => shellCommands.push(val));
    jest.spyOn(process, 'cwd').mockImplementation(() => '/mock');
  });

  afterEach(() => jest.restoreAllMocks());

  describe('createPackage', () => {
    it('should create the right object for a ts library', () => {
      expect(
        // stringify to preserve property order
        JSON.stringify(
          libInstance.createPackage({
            name: 'stoplight',
            description: 'description...',
            author: 'support@stoplight',
            repository: 'https://github.com/stoplightio/scripts.git',
            react: false,
            ci: 'circle',
            license: 'apache2',
            quality: 'codeclimate',
          }),
          null,
          2
        )
      ).toMatchSnapshot('plain-lib');
    });

    it('should create the right object for a react library', () => {
      expect(
        // stringify to preserve property order
        JSON.stringify(
          libInstance.createPackage({
            name: 'stoplight',
            description: 'description...',
            author: 'support@stoplight',
            repository: 'https://github.com/stoplightio/scripts.git',
            react: true,
            ci: 'circle',
            license: 'apache2',
            quality: 'codeclimate',
          }),
          null,
          2
        )
      ).toMatchSnapshot('react-lib');
    });
  });
});
