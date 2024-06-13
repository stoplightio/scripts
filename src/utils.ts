import { ParsingToken } from '@oclif/parser/lib/parse';
import { execSync } from 'child_process';
import { sync as findUp } from 'find-up';
import * as fs from 'fs';
import * as path from 'path';

export const buildCommand = (
  baseCommand: string,
  {
    defaultArgs = {},
    rawArgs = [],
    flags = [],
  }: { defaultArgs?: any; rawArgs?: ParsingToken[]; flags?: string[] } = {},
) => {
  // TODO: use matcher function to match baseCommand.cmd for Windows?

  // pull binary off the front, append rest of args back later
  const [binary, ...commandArgs] = baseCommand.split(' ');

  let command = findUp(path.join('node_modules', '.bin', binary), {
    cwd: process.cwd(),
  });
  if (!command) throw new Error(`Unable to locate node_modules/.bin binary for ${binary}`);

  command = [command, ...commandArgs].join(' ');

  for (const arg of rawArgs) {
    if (!flags.includes(arg.input.substring(2))) command += ` ${arg.input}`;
  }

  for (const arg in defaultArgs) {
    if (!defaultArgs.hasOwnProperty(arg) || command.match(arg)) continue;
    command += ' ' + defaultArgs[arg];
  }

  return command;
};

export const runCommand = (command: string, { handleError = true } = {}) => {
  try {
    return execSync(command, {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: { ...process.env },
    });
  } catch (error) {
    if (
      handleError &&
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      (typeof error.status === 'number' || error.status === null)
    ) {
      return process.exit(error.status);
    } else {
      throw error;
    }
  }
};

export const getConfigFilePath = (name: string): string => {
  const filePath = path.resolve(process.cwd(), name);
  if (fs.existsSync(path.resolve(process.cwd(), name))) {
    return filePath;
  }

  return require.resolve(`@stoplight/scripts/${name}`);
};

export const buildPath = (...args: any) => {
  return path.resolve(process.cwd(), ...args);
};

export const sortObjKeys = (obj: object) => {
  return Object.keys(obj)
    .sort()
    .reduce((accumulator, currentValue) => {
      // @ts-expect-error
      accumulator[currentValue] = obj[currentValue];
      return accumulator;
    }, {});
};
