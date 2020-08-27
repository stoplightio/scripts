const typescript = require('@rollup/plugin-typescript');
const { terser } = require('rollup-plugin-terser');
const path = require('path');
const fs = require('fs');

const BASE_PATH = process.cwd();
const getConfigFile = name => {
  const filePath = path.resolve(BASE_PATH, name);
  if (fs.existsSync(path.resolve(BASE_PATH, name))) {
    return filePath;
  }

  return path.resolve(BASE_PATH, 'node_modules', '@stoplight', 'scripts', name);
};

module.exports = {
  input: path.resolve(BASE_PATH, 'src/index.ts'),
  plugins: [
    typescript({
      tsconfig: getConfigFile('tsconfig.build.json'),
      include: ['src/**/*.{ts,tsx}'],
    }),
    terser(),
  ],
  output: [
    {
      file: path.resolve(BASE_PATH, 'dist/index.cjs.js'),
      format: 'cjs',
    },
    {
      file: path.resolve(BASE_PATH, 'dist/index.es.js'),
      format: 'esm',
    },
  ],
};
