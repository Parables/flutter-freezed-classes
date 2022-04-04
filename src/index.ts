import { oldVisit, PluginFunction, Types } from '@graphql-codegen/plugin-helpers';
import { transformSchemaAST } from '@graphql-codegen/schema-ast';
import { GraphQLSchema } from 'graphql';
import { FlutterFreezedClassPluginConfig } from './config';
import { schemaVisitor } from './schema-visitor';

export const plugin: PluginFunction<FlutterFreezedClassPluginConfig, Types.ComplexPluginOutput> = (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: FlutterFreezedClassPluginConfig
) => {
  // return `// The following codes were generated by FlutterFreezedClass Plugin`

  const { schema: _schema, ast } = transformSchemaAST(schema, config);
  const { buildImports, shapeMap, ...visitor } = schemaVisitor(_schema, config);

  const result = oldVisit(ast, {
    leave: visitor,
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // result.definitions.forEach(def => {
  //   console.log(def);
  // });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const generated: string[] = result.definitions.filter(def => typeof def === 'string');
  /* 
  let finalOutput: string[] = [];

  Array.from(shapeMap.entries()).forEach(entry => {
    finalOutput = generated.map(gen => {
      const insertIndex = gen.indexOf(`insert ${entry[0]}`);
      console.log('insertIndex: ', insertIndex);
      if (insertIndex != -1) {
        const inserted = [...gen.substring(0, insertIndex), ...entry[1], ...gen.substring(insertIndex + 1)].join();
        console.log('Found and inserted @ ', insertIndex, inserted);
        return inserted;
      }
      return gen;
    });
  }); */

  const finalOutput = generated.map(gen => {
    const insertIndex = gen.indexOf('===replace');
    if (insertIndex != -1) {
      return gen
        .split('===replace')
        .map(part => {
          const shape = shapeMap.get(part);
          if (shape) {
            console.log('Found shape for : ', part, shape);
            return `\n${shape}`;
          }
          return part;
        })
        .join('');
    }
    return gen;
  });

  return { prepend: buildImports(config), content: [...finalOutput].join('\n') };
};
