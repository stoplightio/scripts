import { Command } from '@oclif/command';
import * as fs from 'fs';
import * as inquirer from 'inquirer';
import * as path from 'path';
import * as shell from 'shelljs';

export interface IResponses {
  name: string;
  description: string;
  author: string;
  repository: string;
  docs: 'tsdoc' | false;
  ci: 'circle' | false;
  quality: 'codeclimate' | false;
}

export default class CreateLibCommand extends Command {
  public static description = 'Scaffold out a new library.';

  public static examples = [`$ sl-scripts create:lib`];

  public static args = [];

  public static flags = {};

  public async run() {
    /**
     * name
     * description
     * author
     * repository
     * docs?
     * codeClimate?
     * circle?
     */
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
        name: 'docs',
        type: 'list',
        choices: [{ name: 'TSDoc', value: 'tsdoc' }, { name: 'None', value: false }],
      },
      {
        name: 'ci',
        type: 'list',
        choices: [{ name: 'CircleCI', value: 'circle' }, { name: 'None', value: false }],
      },
      {
        name: 'quality',
        type: 'list',
        choices: [{ name: 'Code Climate', value: 'codeclimate' }, { name: 'None', value: false }],
      },
    ]);

    const cleanedName = responses.name.replace('@stoplight/', '');
    const targetDir = path.resolve(process.cwd(), cleanedName);
    const circleDir = path.resolve(targetDir, '.circleci');

    if (shell.test('-e', targetDir)) {
      this.error(`'${targetDir}' directory already exists. Cannot create library.`);
      return;
    }

    shell.mkdir(targetDir);
    shell.mkdir(circleDir);

    shell.cp('-Rfn', path.resolve(__dirname, '..', '..', '..', 'scaffold', 'lib', '*'), targetDir);
    shell.cp('-Rfn', path.resolve(__dirname, '..', '..', '..', 'scaffold', 'lib', '.circleci', '*'), circleDir);

    this.writePackage(targetDir, responses);
    this.writeReadme(targetDir, responses);

    this.log(`Done! Change into the '${cleanedName}' directory to get started.`);
  }

  public writePackage(targetDir: string, responses: IResponses) {
    const pkgPath = path.resolve(targetDir, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath) as any);

    pkg.name = responses.name;
    pkg.description = responses.description;
    pkg.author = responses.author;
    pkg.homepage = responses.repository;

    const githubUrl = responses.repository.replace('.git', '');
    pkg.homepage = githubUrl;
    pkg.bugs = `${githubUrl}/issues`;

    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
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

    fs.writeFileSync(readmePath, readme);
  }
}
