import { DeclarationBlock, indent } from '@graphql-codegen/visitor-plugin-common';
import {
  EnumTypeDefinitionNode,
  FieldDefinitionNode,
  GraphQLSchema,
  InputObjectTypeDefinitionNode,
  InputValueDefinitionNode,
  Kind,
  ListTypeNode,
  NamedTypeNode,
  NonNullTypeNode,
  ObjectTypeDefinitionNode,
  TypeNode,
  UnionTypeDefinitionNode,
} from 'graphql';
import { FlutterFreezedClassPluginConfig } from './config/index';

import { camelCase, pascalCase } from 'change-case-all';

const isListType = (typ?: TypeNode): typ is ListTypeNode => typ?.kind === 'ListType';
const isNonNullType = (typ?: TypeNode): typ is NonNullTypeNode => typ?.kind === 'NonNullType';
const isNamedType = (typ?: TypeNode): typ is NamedTypeNode => typ?.kind === 'NamedType';

const replaceUnionTypeShape = '===replaceUnionShape';
const replaceInputBlockAsUnion = '===replaceInputBlock';

const defaultScalars: { [name: string]: string } = {
  ID: 'String',
  String: 'String',
  Boolean: 'bool',
  Int: 'int',
  Float: 'double',
};
// const isInput = (kind: string) => kind.includes('Input');

const shapeMap: Map<string, string> = new Map<string, string>();

const buildImports = (config: FlutterFreezedClassPluginConfig) => {
  const gImport = `part '${config.fileName}.g.dart';\n\n`;
  return [
    "import 'package:freezed_annotation/freezed_annotation.dart';",
    "import 'package:flutter/foundation.dart';\n",
    `part '${config.fileName}.freezed.dart;`,
    `${config.fromJsonToJson ?? true ? gImport : ''}`,
  ];
};

export const schemaVisitor = (schema: GraphQLSchema, config: FlutterFreezedClassPluginConfig) => {
  return {
    buildImports,

    shapeMap,

    replaceUnionTypeShape,

    replaceInputBlockAsUnion,

    EnumTypeDefinition: (node: EnumTypeDefinitionNode) => {
      const name = pascalCase(node.name.value);

      const shape =
        node.values
          ?.map(value =>
            config.lowercaseEnums ?? true
              ? indent(
                  `${addComment(value.description?.value)}@JsonKey(name: "${
                    value.name.value
                  }") ${value.name.value.toLowerCase()},`
                )
              : indent(`${addComment(value.description?.value)}${value.name.value},`)
          )
          .join('\n') ?? '';

      return new DeclarationBlock({}).asKind('enum').withName(name).withContent(`{\n ${shape} \n}`).string;
    },

    UnionTypeDefinition: (node: UnionTypeDefinitionNode) => generateBlock(config, node),

    ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => generateBlock(config, node),

    InputObjectTypeDefinition: (node: InputObjectTypeDefinitionNode) => generateBlock(config, node),
  };
};

const generateBlock = (
  config: FlutterFreezedClassPluginConfig,
  node: ObjectTypeDefinitionNode | InputObjectTypeDefinitionNode | UnionTypeDefinitionNode
) => {
  const name = pascalCase(node.name.value);
  const fromJsonToJson = `factory ${name}.fromJson(Map<String, dynamic> json) => _$${name}FromJson(json);`;

  const shape =
    node?.kind == Kind.UNION_TYPE_DEFINITION
      ? node.types?.map(type => generateUnionTypeBlock(name, type.name.value)).join('') ?? ''
      : node.fields?.map(field => generateField(config, field, 2)).join('') ?? '';

  shapeMap.set(name, shape);

  const content =
    node?.kind == Kind.UNION_TYPE_DEFINITION
      ? [
          indent(`${addComment(node.description?.value)}\n`),
          indent(`const factory ${name}({}) =  _${name};\n`),
          shape,
          indent(`\n\n${config.fromJsonToJson ?? true ? fromJsonToJson : ''}\n`),
          '}',
        ].join('')
      : [
          indent(`${addComment(node.description?.value)}\n`),
          indent(`const factory ${name}({\n`),
          shape,
          indent(`}) = _${name};`),
          indent(node.kind == Kind.OBJECT_TYPE_DEFINITION ? getReplaceInputToken(config, name) : ''),
          indent(`\n\n${config.fromJsonToJson ?? true ? fromJsonToJson : ''}\n`),
          '}',
        ].join('');

  // don't generate freezed classes for these types
  if (['Query', 'Mutation', 'Subscription', ...(config.ignoreTypes ?? [])].includes(name)) {
    return '';
  }

  return new DeclarationBlock({})
    .withDecorator('@freezed')
    .asKind('class')
    .withName(`${name} with _$${name}{`)
    .withContent(content).string;
};

const generateUnionTypeBlock = (unionName: string, typeName: string) => {
  return new DeclarationBlock({})
    .asKind(indent('\nconst factory'))
    .withName(`${unionName}.${typeName.toLowerCase()}({`)
    .withContent(`${replaceUnionTypeShape}${typeName}.extra${replaceUnionTypeShape}}) = _${typeName}`).string;
};

const generateField = (
  config: FlutterFreezedClassPluginConfig,
  field: FieldDefinitionNode | InputValueDefinitionNode,
  indentCount?: number
): string => {
  return indent(
    `${addComment(field.description?.value)}${isNonNullType(field.type) ? 'required' : ''} ${generateFieldType(
      config,
      field,
      field.type
    )} ${field.name.value},\n`,
    indentCount ?? 2
  );
};

const generateFieldType = (
  config: FlutterFreezedClassPluginConfig,
  field: FieldDefinitionNode | InputValueDefinitionNode,
  type: TypeNode,
  parentType?: TypeNode
): string => {
  if (isNonNullType(type)) {
    const gen = generateFieldType(config, field, type.type, type);
    return `${gen}`;
  }
  if (isListType(type)) {
    const gen = generateFieldType(config, field, type.type, type);
    return `List<${gen}>${isNonNullType(parentType) ? '' : '?'}`;
  }

  if (isNamedType(type)) {
    return `${scalarValue(config, type.name.value)}${isNonNullType(parentType) ? '' : '?'}`;
  }
  return '';
};

const scalarValue = (config: FlutterFreezedClassPluginConfig, scalarName: string) => {
  if (config.customScalars?.[scalarName]) {
    return config.customScalars?.[scalarName];
  }
  if (defaultScalars[scalarName]) {
    return defaultScalars[scalarName];
  }
  return scalarName;
};

const addComment = (comment?: string) => (comment ? `/// ${comment}` : '');

function getReplaceInputToken(config: FlutterFreezedClassPluginConfig, name: string): string {
  return (
    config.mergeInputs?.map(p => `${replaceInputBlockAsUnion}${name}$.$${p}${replaceInputBlockAsUnion}`).join('') ?? ''
  );
}
