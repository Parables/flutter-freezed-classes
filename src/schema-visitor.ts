import { DeclarationBlock, indent } from '@graphql-codegen/visitor-plugin-common';
import {
  EnumTypeDefinitionNode,
  FieldDefinitionNode,
  GraphQLSchema,
  InputObjectTypeDefinitionNode,
  InputValueDefinitionNode,
  ListTypeNode,
  NamedTypeNode,
  NonNullTypeNode,
  ObjectTypeDefinitionNode,
  ScalarTypeDefinitionNode,
  TypeNode,
} from 'graphql';
import { FlutterFreezedClassPluginConfig } from './config/index';

const isListType = (typ?: TypeNode): typ is ListTypeNode => typ?.kind === 'ListType';
const isNonNullType = (typ?: TypeNode): typ is NonNullTypeNode => typ?.kind === 'NonNullType';
const isNamedType = (typ?: TypeNode): typ is NamedTypeNode => typ?.kind === 'NamedType';

const defaultScalars: { [name: string]: string } = {
  ID: 'String',
  String: 'String',
  Boolean: 'bool',
  Int: 'int',
  Float: 'double',
};
// const isInput = (kind: string) => kind.includes('Input');

export const schemaVisitor = (schema: GraphQLSchema, config: FlutterFreezedClassPluginConfig) => {
  const freezedImports = `
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:flutter/foundation.dart';

part '${config.fileName}.freezed.dart;
${config.fromJsonToJson ?? true ? "part '${config.fileName}.g.dart';" : ''}
`;

  return {
    buildImports: (): string[] => [freezedImports],

    EnumTypeDefinition: (node: EnumTypeDefinitionNode) => {
      const name = convertName(node.name.value);

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

    ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
      const name = convertName(node.name.value);
      const fromJsonToJson = `factory ${name}.fromJson(Map<String, dynamic> json) => _$${name}FromJson(json);`;

      const shape = node.fields?.map(field => generateField(config, field, 2)).join(',\n');

      // don't generate freezed classes for these types
      if (['Query', 'Mutation', 'Subscription', ...(config.ignoreTypes ?? [])].includes(name)) {
        return '';
      }

      return (
        new DeclarationBlock({})
          .withDecorator('@freezed')
          .asKind('class')
          .withName(`${name} with _$${name}{\n`)
          // .withBlock([indent(`factory ${name}({`)].join('\n')).string
          .withContent(
            [
              indent(`${addComment(node.description?.value)}const factory ${name}({`),
              shape,
              indent(`}) = _${name};\n`),
              indent(`${config.fromJsonToJson ?? true ? fromJsonToJson : ''}`),
              '}',
            ].join('\n')
          ).string
      );
    },

    InputObjectTypeDefinition: (node: InputObjectTypeDefinitionNode) => {
      const name = convertName(node.name.value);
      const fromJsonToJson = `factory ${name}.fromJson(Map<String, dynamic> json) => _$${name}FromJson(json);`;

      const shape = node.fields?.map(field => generateField(config, field, 2)).join(',\n');
      return new DeclarationBlock({})
        .withDecorator('@freezed')
        .asKind('class')
        .withName(`${name} with _$${name}{\n`)
        .withContent(
          [
            indent(`${addComment(node.description?.value)}const factory ${name}({`),
            shape,
            indent(`}) = _${name};\n`),
            indent(`${config.fromJsonToJson ?? true ? fromJsonToJson : ''}`),
            '}',
          ].join('\n')
        ).string;
    },
  };
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
    )} ${field.name.value}`,
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

const addComment = (comment?: string) => (comment ? `/// ${comment}\n` : '');

// TODO: Implement convertName to follow Dart's naming conversion
const convertName = (name: string, type?: string, options?: { prefix?: string; suffix?: string }) => name;

/* convertName(node, options) {
  const useTypesPrefix = typeof (options && options.useTypesPrefix) === 'boolean' ? options.useTypesPrefix : true;
  const useTypesSuffix = typeof (options && options.useTypesSuffix) === 'boolean' ? options.useTypesSuffix : true;
  let convertedName = '';
  if (useTypesPrefix) {
      convertedName += this.config.typesPrefix;
  }
  convertedName += this.config.convert(node, options);
  if (useTypesSuffix) {
      convertedName += this.config.typesSuffix;
  }
  return convertedName;
} */
