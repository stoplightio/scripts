import type { Node } from "acorn";
import { SourceMap } from "magic-string";
declare module "estree" {
    interface BaseNodeWithoutComments {
        start: number;
        end: number;
    }
}
export declare type UNCHANGED = null;
export declare const UNCHANGED: null;
export interface CodeWithSourcemap {
    code: string;
    map: SourceMap;
}
export declare type ParseFunction = (code: string) => Node;
export declare type WarnFunction = (message: string) => void;
export declare function transform({ code, id, parse, warn, useLodashEs, }: {
    code: string;
    id: string;
    parse: ParseFunction;
    warn?: WarnFunction;
    useLodashEs?: true;
}): CodeWithSourcemap | UNCHANGED;
//# sourceMappingURL=index.d.ts.map