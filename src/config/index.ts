import { TypeScriptPluginConfig } from '@graphql-codegen/typescript';

export interface FlutterFreezedClassPluginConfig extends TypeScriptPluginConfig {
  /**
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
   *       optionalConstructor: true
   *
   * ```
   */

  optionalConstructor?: boolean;
}
