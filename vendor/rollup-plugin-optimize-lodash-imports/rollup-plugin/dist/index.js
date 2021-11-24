"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optimizeLodashImports = void 0;
const pluginutils_1 = require("@rollup/pluginutils");
const transform_1 = require("../../transform/dist/index.js");
const UNCHANGED = null;
/**
 * Converts lodash imports to be specific, enabling better tree-shaking:
 *
 * `import { isNil } from "lodash";` -> `import { isNil } from "lodash/isNil";`
 *
 * Note that only specific named imports are supported, unlike babel-plugin-lodash. For example,
 * this plugin will print a warning for this import and make no changes to the import:
 *
 * `import _ from "lodash";`
 *
 * Optionally, set `useLodashEs` to true and `lodash` imports will be converted to `lodash-es`
 * imports. Note that it's up to user to include the `lodash-es` module and ensure the output
 * is set to some form of `es` (other output formats will error). An example:
 *
 * `import { isNil } from "lodash";` -> `import { isNil } from "lodash-es";`
 *
 * @param include files/globs to include with this plugin (optional)
 * @param exclude files/globs to exclude from this plugin (optional)
 * @param useLodashEs set `true` to convert imports to use "lodash-es" (optional; default false)
 */
function optimizeLodashImports({ include, exclude, useLodashEs, } = {}) {
    const filter = pluginutils_1.createFilter(include, exclude);
    return {
        name: "optimize-lodash-imports",
        outputOptions(options) {
            var _a;
            if (useLodashEs && options.format !== "es") {
                this.error(`'useLodashEs' is true but the output format is not 'es', it's ${(_a = options.format) !== null && _a !== void 0 ? _a : "undefined"}`);
            }
            return UNCHANGED;
        },
        transform(code, id) {
            const warn = this.warn.bind(this);
            const parse = this.parse.bind(this);
            // honor include/exclude
            if (!filter(id)) {
                return UNCHANGED;
            }
            return transform_1.transform({ code, id, parse, warn, useLodashEs });
        },
    };
}
exports.optimizeLodashImports = optimizeLodashImports;
//# sourceMappingURL=index.js.map