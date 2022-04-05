import { oldVisit, PluginFunction, Types } from '@graphql-codegen/plugin-helpers';
import { transformSchemaAST } from '@graphql-codegen/schema-ast';
import { GraphQLSchema } from 'graphql';
import { FlutterFreezedClassPluginConfig } from './config';
import { schemaVisitor } from './schema-visitor';
import { camelCase } from 'change-case-all';

export const plugin: PluginFunction<FlutterFreezedClassPluginConfig, Types.ComplexPluginOutput> = (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: FlutterFreezedClassPluginConfig
) => {
  const { schema: _schema, ast } = transformSchemaAST(schema, config);
  const { buildImports, shapeMap, replaceInputBlockAsUnion, replaceUnionTypeShape, ...visitor } = schemaVisitor(
    _schema,
    config
  );

  const result = oldVisit(ast, {
    leave: visitor,
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const generated: string[] = result.definitions.filter(def => typeof def === 'string');

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
            console.log('Match found', first, second, key, namedConstructor, shape);
            if (shape) {
              const output = `\n\nconst factory ${first}.${namedConstructor}({\n${shape}}) = _${key};`;
              console.log('shape found... replacing part: ', part, ' with output: ', output);
              return output;
            }
            console.log('Pattern match but No shape found for part: ', part);
            return '';
          }

          return part;
        })
        .join('');
    }
    return gen;
  });

  return { prepend: buildImports(config), content: [...finalOutput].join('\n') };
};
