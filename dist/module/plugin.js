import { oldVisit } from '@graphql-codegen/plugin-helpers';
import { transformSchemaAST } from '@graphql-codegen/schema-ast';
import { schemaVisitor } from './schema-visitor';
import { camelCase } from 'change-case-all';
export const plugin = (schema, documents, config) => {
    const { schema: _schema, ast } = transformSchemaAST(schema, config);
    const { buildImports, shapeMap, replaceInputBlockAsUnion, replaceUnionTypeShape, ...visitor } = schemaVisitor(_schema, config);
    const result = oldVisit(ast, {
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
                    const namedConstructor = camelCase(second.split('$').join('_'));
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
