'use strict';
const typescript = require('@rollup/plugin-typescript');
const terser = require('@rollup/plugin-terser');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const path = require('path');
const fs = require('fs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { optimizeLodashImports } = require('@optimize-lodash/rollup-plugin');

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
    }),
    nodeResolve(),
    commonjs(),
    optimizeLodashImports(),
    process.env.MINIFY ? terser() : null,
  ].filter(Boolean);

const packageJson = JSON.parse(fs.readFileSync(path.resolve(BASE_PATH, 'package.json'), { encoding: 'utf-8' }));
const dependencies = [
  ...Object.keys(packageJson.dependencies || {}),
  ...Object.keys(packageJson.peerDependencies || {}),
];
const rollupConfig = packageJson.rollup || {};
const alwaysInclude = rollupConfig.bundleDeps || [];

const external = module => {
  const isDefaultExternal = dependencies.some(dep => module === dep || module.startsWith(`${dep}/`));
  const forceBundle = alwaysInclude.some(dep => module === dep || module.startsWith(`${dep}/`));

  return isDefaultExternal && !forceBundle;
};

module.exports = [
  {
    input: path.resolve(BASE_PATH, 'src/index.ts'),
    output: {
      entryFileNames: '[name].js',
      dir: path.resolve(BASE_PATH, 'dist'),
      format: 'cjs',
    },
    plugins: [json(), ...plugins()],
    external,
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
