import * as utils from '../../../utils';
import LibCommand, { IResponses } from '../lib';

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
    jest.spyOn(utils, 'runCommand').mockImplementation(val => shellCommands.push(val));
    jest.spyOn(process, 'cwd').mockImplementation(() => '/mock');
  });

  afterEach(() => jest.restoreAllMocks());

  describe('createPackage', () => {
    it('should create the right object for a ts library', () => {
      const responses: IResponses = {
        name: 'stoplight',
        description: 'description...',
        author: 'support@stoplight',
        repository: 'https://github.com/stoplightio/scripts.git',
        react: false,
        ci: 'circle',
        license: 'apache2',
        quality: 'codeclimate',
      };

      expect(JSON.stringify(libInstance.createPackage(responses), null, 2)).toBe(
        JSON.stringify(
          {
            name: responses.name,
            version: '0.0.0',
            description: responses.description,
            keywords: [],
            sideEffects: false,
            homepage: 'https://github.com/stoplightio/scripts',
            bugs: 'https://github.com/stoplightio/scripts/issues',
            author: responses.author,
            repository: {
              type: 'git',
              url: responses.repository,
            },
            license: 'Apache-2.0',
            main: 'src/index.ts',
            files: ['**/*', '!__tests__'],
            engines: {
              node: '>=8.3.0',
            },
            scripts: {
              build: 'sl-scripts build',
              'build.docs': 'sl-scripts build:tsdoc',
              commit: 'git-cz',
              lint: 'sl-scripts lint',
              'lint.fix': 'yarn lint --fix',
              release: 'sl-scripts release',
              'release.docs': 'sl-scripts release:docs',
              'release.dryRun': 'sl-scripts release --dry-run --debug',
              test: 'sl-scripts test',
              'test.prod': 'yarn lint && yarn test --coverage --no-cache',
              'test.update': 'yarn test --updateSnapshot',
              'test.watch': 'yarn test --watch',
            },
            peerDependencies: {},
            dependencies: {},
            devDependencies: {
              '@stoplight/scripts': '1.x.x',
              typescript: '3.1.6',
            },
            'lint-staged': {
              '*.ts': ['yarn lint.fix', 'git add'],
            },
            husky: {
              hooks: {
                'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
                'pre-commit': 'lint-staged',
              },
            },
            config: {
              commitizen: {
                path: 'node_modules/cz-conventional-changelog',
              },
            },
            commitlint: {
              extends: ['@commitlint/config-conventional'],
            },
            release: {
              extends: '@stoplight/scripts/release',
            },
          },
          null,
          2
        )
      );
    });

    it('should create the right object for a react library', () => {
      const responses: IResponses = {
        name: 'stoplight',
        description: 'description...',
        author: 'support@stoplight',
        repository: 'https://github.com/stoplightio/scripts.git',
        react: true,
        ci: 'circle',
        license: 'apache2',
        quality: 'codeclimate',
      };

      expect(JSON.stringify(libInstance.createPackage(responses), null, 2)).toBe(
        JSON.stringify(
          {
            name: responses.name,
            version: '0.0.0',
            description: responses.description,
            keywords: [],
            sideEffects: false,
            homepage: 'https://github.com/stoplightio/scripts',
            bugs: 'https://github.com/stoplightio/scripts/issues',
            author: responses.author,
            repository: {
              type: 'git',
              url: responses.repository,
            },
            license: 'Apache-2.0',
            main: 'src/index.ts',
            files: ['**/*', '!__tests__'],
            engines: {
              node: '>=8.3.0',
            },
            scripts: {
              build: 'sl-scripts build',
              'build.docs': 'build-storybook -c .storybook -o docs-auto',
              commit: 'git-cz',
              lint: 'sl-scripts lint',
              'lint.fix': 'yarn lint --fix',
              release: 'sl-scripts release',
              'release.docs': 'sl-scripts release:docs',
              'release.dryRun': 'sl-scripts release --dry-run --debug',
              storybook: 'start-storybook -p 9001',
              test: 'sl-scripts test',
              'test.prod': 'yarn lint && yarn test --coverage --no-cache',
              'test.update': 'yarn test --updateSnapshot',
              'test.watch': 'yarn test --watch',
            },
            peerDependencies: {
              react: '16.x.x',
            },
            dependencies: {
              '@stoplight/ui-kit': '1.x.x',
            },
            devDependencies: {
              '@stoplight/scripts': '1.x.x',
              '@types/react': '16.x.x',
              '@types/react-dom': '16.x.x',
              react: '16.x.x',
              'react-dom': '16.x.x',
              typescript: '3.1.6',
            },
            'lint-staged': {
              '*.ts': ['yarn lint.fix', 'git add'],
            },
            husky: {
              hooks: {
                'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
                'pre-commit': 'lint-staged',
              },
            },
            config: {
              commitizen: {
                path: 'node_modules/cz-conventional-changelog',
              },
            },
            commitlint: {
              extends: ['@commitlint/config-conventional'],
            },
            release: {
              extends: '@stoplight/scripts/release',
            },
          },
          null,
          2
        )
      );
    });
  });
});
