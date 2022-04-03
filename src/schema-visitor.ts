import { DeclarationBlock } from '@graphql-codegen/visitor-plugin-common';
import { FieldDefinitionNode, GraphQLSchema, ObjectTypeDefinitionNode } from 'graphql';
import { FlutterFreezedClassPluginConfig } from './config/index';
export const schemaVisitor = (schema: GraphQLSchema, config: FlutterFreezedClassPluginConfig) => {
  return {
    ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
      return new DeclarationBlock({})
        .withDecorator('@freezed')
        .asKind('class')
        .withName(` with _$`)
        .withBlock('')
        .withContent(``);
    },
    FieldDefinition(node: FieldDefinitionNode) {
      return new DeclarationBlock({});
    },
  };
};
