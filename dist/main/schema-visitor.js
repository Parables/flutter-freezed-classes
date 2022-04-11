"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaVisitor = void 0;
const visitor_plugin_common_1 = require("@graphql-codegen/visitor-plugin-common");
const graphql_1 = require("graphql");
const change_case_all_1 = require("change-case-all");
const isListType = (typ) => (typ === null || typ === void 0 ? void 0 : typ.kind) === 'ListType';
const isNonNullType = (typ) => (typ === null || typ === void 0 ? void 0 : typ.kind) === 'NonNullType';
const isNamedType = (typ) => (typ === null || typ === void 0 ? void 0 : typ.kind) === 'NamedType';
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
    var _a;
    const gImport = `part '${config.fileName}.g.dart';`;
    return [
        "import 'package:freezed_annotation/freezed_annotation.dart';",
        "import 'package:flutter/foundation.dart';\n",
        `part '${config.fileName}.freezed.dart;'`,
    ].concat(((_a = config.fromJsonToJson) !== null && _a !== void 0 ? _a : true) ? [gImport, '\n\n'] : ['\n']);
};
const schemaVisitor = (schema, config) => {
    return {
        buildImports,
        shapeMap,
        replaceUnionTypeShape,
        replaceInputBlockAsUnion,
        EnumTypeDefinition: (node) => {
            var _a, _b;
            const name = (0, change_case_all_1.pascalCase)(node.name.value);
            const shape = (_b = (_a = node.values) === null || _a === void 0 ? void 0 : _a.map(value => {
                var _a, _b, _c;
                return ((_a = config.lowercaseEnums) !== null && _a !== void 0 ? _a : true)
                    ? (0, visitor_plugin_common_1.indent)(`${addComment((_b = value.description) === null || _b === void 0 ? void 0 : _b.value)}@JsonKey(name: "${value.name.value}") ${value.name.value.toLowerCase()},`)
                    : (0, visitor_plugin_common_1.indent)(`${addComment((_c = value.description) === null || _c === void 0 ? void 0 : _c.value)}${value.name.value},`);
            }).join('\n')) !== null && _b !== void 0 ? _b : '';
            return new visitor_plugin_common_1.DeclarationBlock({}).asKind('enum').withName(name).withContent(`{\n ${shape} \n}`).string;
        },
        UnionTypeDefinition: (node) => generateBlock(config, node),
        ObjectTypeDefinition: (node) => generateBlock(config, node),
        InputObjectTypeDefinition: (node) => generateBlock(config, node),
    };
};
exports.schemaVisitor = schemaVisitor;
const generateBlock = (config, node) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const name = (0, change_case_all_1.pascalCase)(node.name.value);
    const fromJsonToJson = `factory ${name}.fromJson(Map<String, dynamic> json) => _$${name}FromJson(json);`;
    const shape = (node === null || node === void 0 ? void 0 : node.kind) == graphql_1.Kind.UNION_TYPE_DEFINITION
        ? (_b = (_a = node.types) === null || _a === void 0 ? void 0 : _a.map(type => generateUnionTypeBlock(name, type.name.value)).join('')) !== null && _b !== void 0 ? _b : ''
        : (_d = (_c = node.fields) === null || _c === void 0 ? void 0 : _c.map(field => generateField(config, field, 2)).join('')) !== null && _d !== void 0 ? _d : '';
    shapeMap.set(name, shape);
    const content = (node === null || node === void 0 ? void 0 : node.kind) == graphql_1.Kind.UNION_TYPE_DEFINITION
        ? [
            (0, visitor_plugin_common_1.indent)(`${addComment((_e = node.description) === null || _e === void 0 ? void 0 : _e.value)}\n`),
            ((_f = config.unionConstructor) !== null && _f !== void 0 ? _f : true) ? (0, visitor_plugin_common_1.indent)(`const factory ${name}({}) =  _${name};\n`) : '',
            shape,
            (0, visitor_plugin_common_1.indent)(((_g = config.fromJsonToJson) !== null && _g !== void 0 ? _g : true) ? `\n\n${fromJsonToJson}\n` : ''),
            '\n}',
        ].join('')
        : [
            (0, visitor_plugin_common_1.indent)(`${addComment((_h = node.description) === null || _h === void 0 ? void 0 : _h.value)}\n`),
            (0, visitor_plugin_common_1.indent)(`const factory ${name}({\n`),
            shape,
            (0, visitor_plugin_common_1.indent)(`}) = _${name};`),
            (0, visitor_plugin_common_1.indent)(node.kind == graphql_1.Kind.OBJECT_TYPE_DEFINITION ? getReplaceInputToken(config, name) : ''),
            (0, visitor_plugin_common_1.indent)(((_j = config.fromJsonToJson) !== null && _j !== void 0 ? _j : true) ? `\n\n${fromJsonToJson}\n` : ''),
            '\n}',
        ].join('');
    // don't generate freezed classes for these types
    if (['Query', 'Mutation', 'Subscription', ...((_k = config.ignoreTypes) !== null && _k !== void 0 ? _k : [])].includes(name)) {
        return '';
    }
    return new visitor_plugin_common_1.DeclarationBlock({})
        .withDecorator('@freezed')
        .asKind('class')
        .withName(`${name} with _$${name} {`)
        .withContent(content)
        .string.replace('};', '}');
};
const generateUnionTypeBlock = (unionName, typeName) => {
    return new visitor_plugin_common_1.DeclarationBlock({})
        .asKind((0, visitor_plugin_common_1.indent)('\nconst factory'))
        .withName(`${unionName}.${typeName.toLowerCase()}({`)
        .withContent(`${replaceUnionTypeShape}${typeName}.extra${replaceUnionTypeShape}}) = _${typeName}`).string;
};
const generateField = (config, field, indentCount) => {
    var _a;
    return (0, visitor_plugin_common_1.indent)(`${addComment((_a = field.description) === null || _a === void 0 ? void 0 : _a.value)}${isNonNullType(field.type) ? 'required' : ''} ${generateFieldType(config, field, field.type)} ${field.name.value},\n`, indentCount !== null && indentCount !== void 0 ? indentCount : 2);
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
    var _a, _b;
    if ((_a = config.customScalars) === null || _a === void 0 ? void 0 : _a[scalarName]) {
        return (_b = config.customScalars) === null || _b === void 0 ? void 0 : _b[scalarName];
    }
    if (defaultScalars[scalarName]) {
        return defaultScalars[scalarName];
    }
    return scalarName;
};
const addComment = (comment) => (comment ? `/// ${comment}\n` : '');
function getReplaceInputToken(config, name) {
    var _a, _b;
    return ((_b = (_a = config.mergeInputs) === null || _a === void 0 ? void 0 : _a.map(p => `${replaceInputBlockAsUnion}${name}$.$${p}${replaceInputBlockAsUnion}`).join('')) !== null && _b !== void 0 ? _b : '');
}
