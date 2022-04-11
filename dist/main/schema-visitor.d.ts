import { EnumTypeDefinitionNode, GraphQLSchema, InputObjectTypeDefinitionNode, ObjectTypeDefinitionNode, UnionTypeDefinitionNode } from 'graphql';
import { FlutterFreezedClassPluginConfig } from './config';
export declare const schemaVisitor: (schema: GraphQLSchema, config: FlutterFreezedClassPluginConfig) => {
    buildImports: (config: FlutterFreezedClassPluginConfig) => string[];
    shapeMap: Map<string, string>;
    replaceUnionTypeShape: string;
    replaceInputBlockAsUnion: string;
    EnumTypeDefinition: (node: EnumTypeDefinitionNode) => string;
    UnionTypeDefinition: (node: UnionTypeDefinitionNode) => string;
    ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => string;
    InputObjectTypeDefinition: (node: InputObjectTypeDefinitionNode) => string;
};
