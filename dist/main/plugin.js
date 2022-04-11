"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = void 0;
const plugin_helpers_1 = require("@graphql-codegen/plugin-helpers");
const schema_ast_1 = require("@graphql-codegen/schema-ast");
const schema_visitor_1 = require("./schema-visitor");
const change_case_all_1 = require("change-case-all");
const plugin = (schema, documents, config) => {
    const { schema: _schema, ast } = (0, schema_ast_1.transformSchemaAST)(schema, config);
    const _a = (0, schema_visitor_1.schemaVisitor)(_schema, config), { buildImports, shapeMap, replaceInputBlockAsUnion, replaceUnionTypeShape } = _a, visitor = __rest(_a, ["buildImports", "shapeMap", "replaceInputBlockAsUnion", "replaceUnionTypeShape"]);
    const result = (0, plugin_helpers_1.oldVisit)(ast, {
        leave: visitor,
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const generated = result.definitions.filter(def => typeof def === 'string');
    const finalOutput = generated.map(gen => {
        const replaceUnion = gen.indexOf(replaceUnionTypeShape) != -1;
        const replaceInput = gen.indexOf(replaceInputBlockAsUnion) != -1;
        const splitToken = replaceUnion ? replaceUnionTypeShape : replaceInput ? replaceInputBlockAsUnion : undefined;
        if (splitToken) {
            return gen
                .split(splitToken)
                .map(part => {
                // let key = '';
                if (part.endsWith('.extra')) {
                    const key = part.split('.')[0];
                    const shape = shapeMap.get(key);
                    if (shape) {
                        return `\n${shape}`;
                    }
                }
                if (part.includes('$.$')) {
                    const [first, second] = part.split('$.$');
                    const key = second.replace('$', first);
                    const namedConstructor = (0, change_case_all_1.camelCase)(second.split('$').join('_'));
                    const shape = shapeMap.get(key);
                    if (shape) {
                        return `\n\nconst factory ${first}.${namedConstructor}({\n${shape}}) = _${key};`;
                    }
                    return '';
                }
                return part;
            })
                .join('');
        }
        // temporal fix to the bug in  https://github.com/dotansimha/graphql-code-generator/issues/7736
        if (gen.includes('};')) {
            return gen.replace('};', '}');
        }
        return gen;
    });
    return [...buildImports(config), ...finalOutput].join('\n');
};
exports.plugin = plugin;
