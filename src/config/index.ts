// import { TypeScriptPluginConfig } from '@graphql-codegen/typescript';

export interface FlutterFreezedClassPluginConfig /* extends TypeScriptPluginConfig */ {
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
   *       lowercaseEnums: true
   * ```
   */

  lowercaseEnums?: boolean;

  /**
   * @name customScalars
   * @description specify how custom scalar types in your GraphQL Schema should be typed in Dart
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

  customScalars?: { [name: string]: string };

  /**
   * @name unionInputs
   * @description specify how custom scalar types in your GraphQL Schema should be typed in Dart
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
   *      unionInputs:
   *        {
   *          'CreateMovieInput': ['Movie', 'createInput'],
   *          'UpdateMovieInput': ['Movie', 'updateInput'],
   *          'DeleteMovieInput': ['Movie', 'deleteInput'],
   *        }
   * ```
   */

  unionInputs?: { [name: string]: string };

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
