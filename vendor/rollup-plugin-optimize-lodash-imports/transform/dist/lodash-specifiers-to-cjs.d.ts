import type { ImportSpecifier } from 'estree';
/**
 * Turns a generic lodash import into a specific import using the CommonJS
 * lodash package.
 *
 * @param base "lodash" or "lodash/fp"
 * @param specifiers from an AST; assumes they are all ImportSpecifiers
 */
export declare function lodashSpecifiersToCjs(base: string, specifiers: Array<ImportSpecifier>): Array<string>;
//# sourceMappingURL=lodash-specifiers-to-cjs.d.ts.map
