import { ParsingToken } from '@oclif/parser/lib/parse';
import * as fs from 'fs';
import * as path from 'path';

export const buildCommand = (
  baseCommand: string,
  { defaultArgs = {}, rawArgs = [] }: { defaultArgs: any; rawArgs: ParsingToken[] }
) => {
  let command = path.resolve(process.cwd(), 'node_modules', '.bin', baseCommand);

  for (const arg of rawArgs) {
    command += ` ${arg.input}`;
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
