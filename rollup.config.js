import typescript from 'rollup-plugin-typescript2';
import { terser } from "rollup-plugin-terser";
import * as path from "path";

const BASE_PATH = process.cwd();
const getFile = path => path.resolve(BASE_PATH, path);

const pkg = require(getFile('package.json'));

export default {
  input: path.resolve(BASE_PATH, 'src/index.ts'),
  external: Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies }),
  plugins: [
    typescript({
      tsconfig: getFile('tsconfig.build.json'),
    }),
    terser()
  ],
  output: [
    {
      file: getFile('dist/index.cjs.js'),
      format: 'cjs'
    },
    {
      file: getFile('dist/index.es.js'),
      format: 'esm'
    }
  ]
}
