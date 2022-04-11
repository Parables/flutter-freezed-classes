export interface FlutterFreezedClassPluginConfig {
    /**
     * @name fileName
     * @description the name of the file without the extension that the freezed classes will be generated
     * @default false
     *
     * @exampleMarkdown
     * ```yml
     * generates:
     *   path/to/your/flutter/project/data/models/app_models.dart
     *     plugins:
     *       - typescript
     *       - graphql-codegen-flutter-freezed-classes
     *     config:
     *       fileName: app_models
     *
     * ```
     */
    fileName: string;
    /**
     * @name ignoreTypes
     * @description names of GraphQL types to ignore when generating Freezed classes
     * @default []
     *
     * @exampleMarkdown
     * ```yml
     * generates:
     *   path/to/your/flutter/project/data/models/app_models.dart
     *     plugins:
     *       - typescript
     *       - graphql-codegen-flutter-freezed-classes
     *     config:
     *       fileName: app_models
     *       ignoreTypes: ["PaginatorInfo"]
     *
     * ```
     */
    ignoreTypes?: string[];
    /**
     * @name fromJsonToJson
     * @description generate fromJson toJson methods on the classes with json_serialization. Requires the [json_serializable](https://pub.dev/packages/json_serializable) to be installed in your Flutter app
     * @default true
     *
     * @exampleMarkdown
     * ```yml
     * generates:
     *   path/to/your/flutter/project/data/models/app_models.dart
     *     plugins:
     *       - typescript
     *       - graphql-codegen-flutter-freezed-classes
     *     config:
     *       fileName: app_models
     *       ignoreTypes: ["PaginatorInfo"]
     *       fromJsonToJson: true
     *
     * ```
     */
    fromJsonToJson?: boolean;
    /**
     * @name lowercaseEnums
     * @description make enum fields lowercase
     * @default true
     *
     * @exampleMarkdown
     * ```yml
     * generates:
     *   path/to/your/flutter/project/data/models/app_models.dart
     *     plugins:
     *       - typescript
     *       - graphql-codegen-flutter-freezed-classes
     *     config:
     *       fileName: app_models
     *       ignoreTypes: ["PaginatorInfo"]
     *       fromJsonToJson: true
     *       lowercaseEnums: true
     * ```
     */
    lowercaseEnums?: boolean;
    /**
     * @name unionConstructor
     * @description generate empty constructors for Union Types
     * @default true
     *
     * @exampleMarkdown
     * ```yml
     * generates:
     *   path/to/your/flutter/project/data/models/app_models.dart
     *     plugins:
     *       - typescript
     *       - graphql-codegen-flutter-freezed-classes
     *     config:
     *       fileName: app_models
     *       ignoreTypes: ["PaginatorInfo"]
     *       fromJsonToJson: true
     *       unionConstructor: true
     * ```
     */
    unionConstructor?: boolean;
    /**
     * @name customScalars
     * @description map custom Scalars to Dart built-in types
     * @default {}
     *
     * @exampleMarkdown
     * ```yml
     * generates:
     *   path/to/your/flutter/project/data/models/app_models.dart
     *     plugins:
     *       - typescript
     *       - graphql-codegen-flutter-freezed-classes
     *     config:
     *       fileName: app_models
     *       ignoreTypes: ["PaginatorInfo"]
     *       fromJsonToJson: true
     *       customScalars:
     *         {
     *           "jsonb": "Map<String, dynamic>",
     *           "timestamptz": "DateTime",
     *           "UUID": "String",
     *         }
     * ```
     */
    customScalars?: {
        [name: string]: string;
    };
    /**
     * @name mergeInputs
     * @description merge InputTypes as a union of an ObjectType where ObjectType is denoted by a $ in the pattern.
     * @default []
     *
     * @exampleMarkdown
     * ```yml
     * generates:
     *   path/to/your/flutter/project/data/models/app_models.dart
     *     plugins:
     *       - typescript
     *       - graphql-codegen-flutter-freezed-classes
     *     config:
     *       fileName: app_models
     *       ignoreTypes: ["PaginatorInfo"]
     *       fromJsonToJson: true
     *       customScalars:
     *         {
     *           "jsonb": "Map<String, dynamic>",
     *           "timestamptz": "DateTime",
     *           "UUID": "String",
     *         }
     *      mergeInputs: ["Create$Input", "Update$Input", "Delete$Input"]
     * ```
     */
    mergeInputs?: string[];
    /**
     * @name interfaceNamePrefix
     * @description append this string to the abstract class name for Interface Types
     * @default ""
     *
     * @exampleMarkdown
     * ```yml
     * generates:
     *   path/to/your/flutter/project/data/models/app_models.dart
     *     plugins:
     *       - typescript
     *       - graphql-codegen-flutter-freezed-classes
     *     config:
     *       fileName: app_models
     *       optionalConstructor: true
     *       interfaceNamePrefix: "I_"
     * ```
     */
    interfaceNamePrefix?: string;
    /**
     * @name interfaceNameSuffix
     * @description prepend this string to the abstract class name for Interface Types
     * @default "Interface"
     *
     * @exampleMarkdown
     * ```yml
     * generates:
     *   path/to/your/flutter/project/data/models/app_models.dart
     *     plugins:
     *       - typescript
     *       - graphql-codegen-flutter-freezed-classes
     *     config:
     *       fileName: app_models
     *       optionalConstructor: true
     *       interfaceNameSuffix: "Interface"
     * ```
     */
    interfaceNameSuffix?: string;
    /**
     * @name optionalConstructor
     * @description makes all the properties in the Freezed classes optional and rather uses Assert statements to enforce required fields
     * @default false
     *
     * @exampleMarkdown
     * ```yml
     * generates:
     *   path/to/your/flutter/project/data/models/app_models.dart
     *     plugins:
     *       - typescript
     *       - graphql-codegen-flutter-freezed-classes
     *     config:
     *       fileName: app_models
     *       optionalConstructor: true
     *
     * ```
     */
    optionalConstructor?: boolean;
}
