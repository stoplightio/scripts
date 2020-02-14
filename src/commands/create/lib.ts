import { Command } from '@oclif/command';
import * as fs from 'fs';
import * as inquirer from 'inquirer';
import { merge } from 'lodash';
import * as path from 'path';
import * as shell from 'shelljs';

import { sortObjKeys } from '../../utils';

export interface IResponses {
  name: string;
  description: string;
  author: string;
  repository: string;
  license: 'apache2' | false;
  react: boolean;
  ci: 'circle';
  quality: 'codeclimate';
}

export default class CreateLibCommand extends Command {
  public static description = 'Scaffold out a new library.';

  public static examples = [`$ sl-scripts create:lib`];

  public static args = [];

  public static flags = {};

  public async run() {
    const responses = await inquirer.prompt<IResponses>([
      {
        name: 'name',
        default: '@stoplight/library',
        validate: val => {
          return !val.trim() ? 'name is required' : true;
        },
      },
      {
        name: 'description',
      },
      {
        name: 'author',
        default: 'Stoplight <support@stoplight.io>',
      },
      {
        name: 'repository',
        default: (answers: IResponses) => `https://github.com/stoplightio/${answers.name.replace('@stoplight/', '')}`,
      },
      {
        name: 'license',
        type: 'list',
        choices: [{ name: 'Apache 2', value: 'apache2' }, { name: 'None', value: false }],
      },
      {
        name: 'react',
        message: 'needs react?',
        type: 'expand',
        default: 0,
        choices: [{ key: 'Y', name: 'Yes', value: true }, { key: 'n', name: 'No', value: false }],
      },
      {
        name: 'ci',
        type: 'list',
        choices: [{ name: 'CircleCI', value: 'circle' }],
      },
      {
        name: 'quality',
        type: 'list',
        choices: [{ name: 'Code Climate', value: 'codeclimate' }],
      },
    ]);

    const cleanedName = responses.name.replace('@stoplight/', '');
    const targetDir = path.resolve(process.cwd(), cleanedName);

    if (shell.test('-e', targetDir)) {
      this.error(`'${targetDir}' directory already exists. Cannot create library.`);
    }

    this.writeScaffold(targetDir);
    this.writeIgnore(targetDir);
    this.writeLicense(targetDir, responses);
    this.writeCi(targetDir, responses);
    this.writeQuality(targetDir, responses);
    this.writePackage(targetDir, responses);
    this.writeReadme(targetDir, responses);
    this.writeStorybook(targetDir, responses);
    this.writeSrc(targetDir, responses);

    this.log(`Done! Change into the '${cleanedName}' directory to get started.`);
  }

  public writeScaffold(targetDir: string) {
    shell.mkdir(targetDir);
    shell.cp('-Rfn', path.resolve(this.templateDir(), 'common', '*'), targetDir);
  }

  public writeIgnore(targetDir: string) {
    shell.cp('-Rfn', path.resolve(this.templateDir(), 'gitignore'), path.resolve(targetDir, '.gitignore'));
  }

  public writeLicense(targetDir: string, responses: IResponses) {
    if (!responses.license) return;

    if (responses.license === 'apache2') {
      shell.cp('-Rfn', path.resolve(this.templateDir(), 'licenses', 'apache2', '*'), targetDir);
    }
  }

  public writeStorybook(targetDir: string, responses: IResponses) {
    if (!responses.react) return;
    shell.cp('-Rfn', path.resolve(this.templateDir(), '.storybook'), targetDir);
  }

  public writeCi(targetDir: string, responses: IResponses) {
    if (!responses.ci) return;

    if (responses.ci === 'circle') {
      const circleDir = path.resolve(targetDir, '.circleci');
      shell.mkdir(circleDir);
      shell.cp('-Rfn', path.resolve(this.templateDir(), 'ci', '.circleci', '*'), circleDir);
    }
  }

  public writeQuality(targetDir: string, responses: IResponses) {
    if (!responses.quality) return;

    if (responses.quality === 'codeclimate') {
      shell.cp('-Rfn', path.resolve(this.templateDir(), 'quality', '.codeclimate.yml'), targetDir);
    }
  }

  public writePackage(targetDir: string, responses: IResponses) {
    const pkgPath = path.resolve(targetDir, 'package.json');
    const pkg = this.createPackage(responses);
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  }

  public createPackage(responses: IResponses) {
    const pkg = JSON.parse(fs.readFileSync(path.resolve(this.templateDir(), 'pkgs', 'base.json')) as any);

    pkg.name = responses.name;
    pkg.description = responses.description;
    pkg.author = responses.author;
    pkg.repository.url = responses.repository;

    const githubUrl = responses.repository.replace('.git', '');
    pkg.homepage = githubUrl;
    pkg.bugs = `${githubUrl}/issues`;

    merge(pkg, JSON.parse(fs.readFileSync(path.resolve(this.templateDir(), 'pkgs', 'release.json')) as any));

    // set license property
    if (responses.license === 'apache2') {
      pkg.license = 'Apache-2.0';
    }

    if (responses.react) {
      merge(pkg, JSON.parse(fs.readFileSync(path.resolve(this.templateDir(), 'pkgs', 'react.json')) as any));

      // react uses storybook
      merge(pkg, JSON.parse(fs.readFileSync(path.resolve(this.templateDir(), 'pkgs', 'storybook.json')) as any));
    }

    // sort sections

    if (pkg.scripts) pkg.scripts = sortObjKeys(pkg.scripts);
    if (pkg.peerDependencies) pkg.peerDependencies = sortObjKeys(pkg.peerDependencies);
    if (pkg.dependencies) pkg.dependencies = sortObjKeys(pkg.dependencies);
    if (pkg.devDependencies) pkg.devDependencies = sortObjKeys(pkg.devDependencies);

    return pkg;
  }

  public writeReadme(targetDir: string, responses: IResponses) {
    const readmePath = path.resolve(targetDir, 'README.md');
    let readme = fs.readFileSync(readmePath, 'utf8');

    readme = readme.replace(new RegExp('<!-- NAME -->', 'g'), responses.name);

    if (responses.description) {
      readme = readme.replace(new RegExp('<!-- SUMMARY -->', 'g'), responses.description);
    }

    if (responses.repository) {
      readme = readme.replace(new RegExp('<!-- GIT_REPO -->', 'g'), responses.repository);
    }

    if (responses.repository) {
      // Repo will look something like: `https://github.com/stoplightio/library`
      const repoParts = responses.repository.split('/');

      // Resulting Github pages URL will look like: `https://stoplightio.github.io/library`
      const docsUrl = `https://${repoParts[repoParts.length - 2]}.github.io/${repoParts[repoParts.length - 1]}`;

      if (responses.react) {
        readme = readme.replace(
          new RegExp('<!-- DOCS_LINK -->', 'g'),
          `Explore the components: [Storybook](${docsUrl})`,
        );
      } else {
        readme = readme.replace(new RegExp('<!-- DOCS_LINK -->', 'g'), `Explore the interfaces: [TSDoc](${docsUrl})`);
      }
    }

    fs.writeFileSync(readmePath, readme);
  }

  public writeSrc(targetDir: string, responses: IResponses) {
    if (responses.react) {
      shell.cp('-Rfn', path.resolve(this.templateDir(), 'srcs', 'react', '*'), targetDir);
    } else {
      shell.cp('-Rfn', path.resolve(this.templateDir(), 'srcs', 'lib', '*'), targetDir);
    }
  }

  public templateDir = () => path.resolve(__dirname, '..', '..', '..', 'templates');
}
