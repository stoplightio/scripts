import { ParsingToken } from '@oclif/parser/lib/parse';
import * as fs from 'fs';
import * as path from 'path';

export const buildCommand = (
  baseCommand: string,
  { defaultArgs = {}, rawArgs = [], flags = [] }: { defaultArgs?: any; rawArgs?: ParsingToken[]; flags?: string[] } = {}
) => {
  let command = path.resolve(process.cwd(), 'node_modules', '.bin', baseCommand);

  for (const arg of rawArgs) {
    if (!flags.includes(arg.input.substring(2))) command += ` ${arg.input}`;
  }

  for (const arg in defaultArgs) {
    if (!defaultArgs.hasOwnProperty(arg) || command.match(arg)) continue;
    command += ' ' + defaultArgs[arg];
  }

  return command;
};

export const getConfigFilePath = (name: string): string => {
  const filePath = path.resolve(process.cwd(), name);
  if (fs.existsSync(path.resolve(process.cwd(), name))) {
    return filePath;
  }

  return path.resolve(process.cwd(), 'node_modules', '@stoplight', 'scripts', name);
};

export const buildPath = (...args: any) => {
  return path.resolve(process.cwd(), ...args);
};

export const sortObjKeys = (obj: object) => {
  return Object.keys(obj)
    .sort()
    .reduce((accumulator, currentValue) => {
      accumulator[currentValue] = obj[currentValue];
      return accumulator;
    }, {});
};
