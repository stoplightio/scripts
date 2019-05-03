import typescript from 'rollup-plugin-typescript2';
import { terser } from "rollup-plugin-terser";
import * as path from "path";
import * as fs from "fs";

const BASE_PATH = process.cwd();
const getConfigFile = (name) => {
  const filePath = path.resolve(BASE_PATH, name);
  if (fs.existsSync(path.resolve(BASE_PATH, name))) {
    return filePath;
  }

  return path.resolve(BASE_PATH, 'node_modules', '@stoplight', 'scripts', name);
};

export default {
  input: path.resolve(BASE_PATH, 'src/index.ts'),
  plugins: [
    typescript({
      tsconfig: getConfigFile('tsconfig.json'),
    }),
    terser()
  ],
  output: [
    {
      file: path.resolve(BASE_PATH, 'dist/index.cjs.js'),
      format: 'cjs'
    },
    {
      file: path.resolve(BASE_PATH, 'dist/index.es.js'),
      format: 'esm'
    }
  ]
}
