import { DeclarationBlock, indent } from '@graphql-codegen/visitor-plugin-common';
import { Kind, } from 'graphql';
import { pascalCase } from 'change-case-all';
const isListType = (typ) => typ?.kind === 'ListType';
const isNonNullType = (typ) => typ?.kind === 'NonNullType';
const isNamedType = (typ) => typ?.kind === 'NamedType';
const replaceUnionTypeShape = '===replaceUnionShape';
const replaceInputBlockAsUnion = '===replaceInputBlock';
const defaultScalars = {
    ID: 'String',
    String: 'String',
    Boolean: 'bool',
    Int: 'int',
    Float: 'double',
    DateTime: 'DateTime',
};
// const isInput = (kind: string) => kind.includes('Input');
const shapeMap = new Map();
const buildImports = (config) => {
    const gImport = `part '${config.fileName}.g.dart';`;
    return [
        "import 'package:freezed_annotation/freezed_annotation.dart';",
        "import 'package:flutter/foundation.dart';\n",
        `part '${config.fileName}.freezed.dart;'`,
    ].concat(config.fromJsonToJson ?? true ? [gImport, '\n\n'] : ['\n']);
};
export const schemaVisitor = (schema, config) => {
    return {
        buildImports,
        shapeMap,
        replaceUnionTypeShape,
        replaceInputBlockAsUnion,
        EnumTypeDefinition: (node) => {
            const name = pascalCase(node.name.value);
            const shape = node.values
                ?.map(value => config.lowercaseEnums ?? true
                ? indent(`${addComment(value.description?.value)}@JsonKey(name: "${value.name.value}") ${value.name.value.toLowerCase()},`)
                : indent(`${addComment(value.description?.value)}${value.name.value},`))
                .join('\n') ?? '';
            return new DeclarationBlock({}).asKind('enum').withName(name).withContent(`{\n ${shape} \n}`).string;
        },
        UnionTypeDefinition: (node) => generateBlock(config, node),
        ObjectTypeDefinition: (node) => generateBlock(config, node),
        InputObjectTypeDefinition: (node) => generateBlock(config, node),
    };
};
const generateBlock = (config, node) => {
    const name = pascalCase(node.name.value);
    const fromJsonToJson = `factory ${name}.fromJson(Map<String, dynamic> json) => _$${name}FromJson(json);`;
    const shape = node?.kind == Kind.UNION_TYPE_DEFINITION
        ? node.types?.map(type => generateUnionTypeBlock(name, type.name.value)).join('') ?? ''
        : node.fields?.map(field => generateField(config, field, 2)).join('') ?? '';
    shapeMap.set(name, shape);
    const content = node?.kind == Kind.UNION_TYPE_DEFINITION
        ? [
            indent(`${addComment(node.description?.value)}\n`),
            config.unionConstructor ?? true ? indent(`const factory ${name}({}) =  _${name};\n`) : '',
            shape,
            indent(config.fromJsonToJson ?? true ? `\n\n${fromJsonToJson}\n` : ''),
            '\n}',
        ].join('')
        : [
            indent(`${addComment(node.description?.value)}\n`),
            indent(`const factory ${name}({\n`),
            shape,
            indent(`}) = _${name};`),
            indent(node.kind == Kind.OBJECT_TYPE_DEFINITION ? getReplaceInputToken(config, name) : ''),
            indent(config.fromJsonToJson ?? true ? `\n\n${fromJsonToJson}\n` : ''),
            '\n}',
        ].join('');
    // don't generate freezed classes for these types
    if (['Query', 'Mutation', 'Subscription', ...(config.ignoreTypes ?? [])].includes(name)) {
        return '';
    }
    return new DeclarationBlock({})
        .withDecorator('@freezed')
        .asKind('class')
        .withName(`${name} with _$${name} {`)
        .withContent(content)
        .string.replace('};', '}');
};
const generateUnionTypeBlock = (unionName, typeName) => {
    return new DeclarationBlock({})
        .asKind(indent('\nconst factory'))
        .withName(`${unionName}.${typeName.toLowerCase()}({`)
        .withContent(`${replaceUnionTypeShape}${typeName}.extra${replaceUnionTypeShape}}) = _${typeName}`).string;
};
const generateField = (config, field, indentCount) => {
    return indent(`${addComment(field.description?.value)}${isNonNullType(field.type) ? 'required' : ''} ${generateFieldType(config, field, field.type)} ${field.name.value},\n`, indentCount ?? 2);
};
const generateFieldType = (config, field, type, parentType) => {
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
const scalarValue = (config, scalarName) => {
    if (config.customScalars?.[scalarName]) {
        return config.customScalars?.[scalarName];
    }
    if (defaultScalars[scalarName]) {
        return defaultScalars[scalarName];
    }
    return scalarName;
};
const addComment = (comment) => (comment ? `/// ${comment}\n` : '');
function getReplaceInputToken(config, name) {
    return (config.mergeInputs?.map(p => `${replaceInputBlockAsUnion}${name}$.$${p}${replaceInputBlockAsUnion}`).join('') ?? '');
}
