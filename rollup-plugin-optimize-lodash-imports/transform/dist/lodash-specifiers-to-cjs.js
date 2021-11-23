"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lodashSpecifiersToCjs = void 0;
/**
 * Turns a generic lodash import into a specific import using the CommonJS
 * lodash package.
 *
 * @param base "lodash" or "lodash/fp"
 * @param specifiers from an AST; assumes they are all ImportSpecifiers
 */
function lodashSpecifiersToCjs(base, specifiers) {
    return specifiers.map(({ imported, local }) => `import ${imported.name !== local.name ? local.name : imported.name} from "${base}/${imported.name}.js";`);
}
exports.lodashSpecifiersToCjs = lodashSpecifiersToCjs;
//# sourceMappingURL=lodash-specifiers-to-cjs.js.map