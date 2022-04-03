import { TsVisitor } from '@graphql-codegen/typescript';
import { DeclarationBlock } from '@graphql-codegen/visitor-plugin-common';
import { FieldDefinitionNode, GraphQLSchema, ObjectTypeDefinitionNode } from 'graphql';
import { FlutterFreezedClassPluginConfig } from './config/index';

// TODO: Set file name from config
const freezedImports = `
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:flutter/foundation.dart';

part 'main.freezed.dart;
part 'model.g.dart';
`;

export const schemaVisitor = (schema: GraphQLSchema, config: FlutterFreezedClassPluginConfig) => {
  const tsVisitor = new TsVisitor(schema, config);

  return {
    buildImports: (): string[] => [freezedImports],

    ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
      const name = tsVisitor.convertName(node.name.value);

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
