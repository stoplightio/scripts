"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transform = exports.UNCHANGED = void 0;
const magic_string_1 = __importDefault(require("magic-string"));
const estree_walker_1 = require("estree-walker");
const guards_1 = require("./guards");
const lodash_specifiers_to_es_1 = require("./lodash-specifiers-to-es");
const lodash_specifiers_to_cjs_1 = require("./lodash-specifiers-to-cjs");
exports.UNCHANGED = null;
function transform({ code, id, parse, warn, useLodashEs, }) {
    // before parsing, check if we can skip the whole file
    if (!code.includes("lodash")) {
        return exports.UNCHANGED;
    }
    let ast;
    try {
        ast = parse(code);
    }
    catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.message += ` in ${id}`;
        throw error;
    }
    // source map generation
    let magicString;
    estree_walker_1.walk(ast, {
        enter(node) {
            var _a, _b, _c;
            // top-level node; we need to walk its children to find imports
            if (guards_1.isProgram(node)) {
                return;
            }
            // skip any nodes that aren't imports (this skips most everything)
            if (!guards_1.isImportDeclaration(node)) {
                this.skip();
                return;
            }
            // narrow-in on lodash imports we care about
            if (node.source.value !== "lodash" && node.source.value !== "lodash/fp") {
                this.skip();
                return;
            }
            // transform specific "lodash" and "lodash/fp" imports such as:
            // import { isNil } from "lodash";
            if (guards_1.isImportSpecifierArray(node.specifiers)) {
                magicString = magicString !== null && magicString !== void 0 ? magicString : new magic_string_1.default(code);
                // modify
                const imports = useLodashEs
                    ? lodash_specifiers_to_es_1.lodashSpecifiersToEs(node.source.value, node.specifiers)
                    : lodash_specifiers_to_cjs_1.lodashSpecifiersToCjs(node.source.value, node.specifiers);
                // write
                magicString.overwrite(node.start, node.end, imports.join("\n"));
                // no need to dig deeper
                this.skip();
            }
            else if (warn !== undefined) {
                // help end-users benefit from this plugin (this behavior differs from
                // babel-plugin-lodash which does optimize non-specific imports)
                warn(`Detected a default lodash or lodash/fp import within ${id} on line ${(_c = (_b = (_a = node.loc) === null || _a === void 0 ? void 0 : _a.start) === null || _b === void 0 ? void 0 : _b.line) !== null && _c !== void 0 ? _c : "unknown"}.\nThis import cannot be optimized by optimize-lodash-imports.`);
            }
        },
    });
    if (!magicString) {
        return exports.UNCHANGED;
    }
    return {
        code: magicString.toString(),
        map: magicString.generateMap({
            file: id,
            includeContent: true,
            hires: true,
        }),
    };
}
exports.transform = transform;
//# sourceMappingURL=index.js.map