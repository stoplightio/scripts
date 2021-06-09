import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import fs from 'fs';
import path from 'path';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

const BASE_PATH = process.cwd();

const getConfigFile = name => {
  const filePath = path.resolve(BASE_PATH, name);
  if (fs.existsSync(path.resolve(BASE_PATH, name))) {
    return filePath;
  }

  return require.resolve(`@stoplight/scripts/${name}`);
};

const plugins = () =>
  [
    typescript({
      tsconfig: getConfigFile('tsconfig.build.json'),
      useTsconfigDeclarationDir: true,
    }),
    process.env.MINIFY ? terser() : null,
  ].filter(Boolean);

const packageJson = JSON.parse(fs.readFileSync(path.resolve(BASE_PATH, 'package.json'), { encoding: 'utf-8' }));
const dependencies = [
  ...Object.keys(packageJson.dependencies || {}),
  ...Object.keys(packageJson.peerDependencies || {}),
];
const external = module => dependencies.some(dep => module === dep || module.startsWith(`${dep}/`));

export default [
  {
    input: path.resolve(BASE_PATH, 'src/index.ts'),
    output: {
      entryFileNames: '[name].js',
      dir: path.resolve(BASE_PATH, 'dist'),
      format: 'cjs',
    },
    plugins: [json(), commonjs(), ...plugins()],
    external
  },
  {
    input: path.resolve(BASE_PATH, 'src/index.ts'),
    output: {
      entryFileNames: '[name].mjs',
      dir: path.resolve(BASE_PATH, 'dist'),
      format: 'esm',
    },
    plugins: plugins(),
    external,
  },
];
