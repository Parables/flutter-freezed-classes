# GraphQL Flutter Freezed Classes

This project aims to speed up your development of Flutter apps by generating [Freezed](https://pub.dev/packages/freezed) from your GraphQL schema.

## Features

- [x] Generate Freezed classes for ObjectTypes
- [x] Generate Freezed classes for InputTypes
- [x] Support for EnumsTypes
- [x] Support for custom ScalarTypes
- [x] Support freeze documentation of class & properties from GraphQL SDL description comments
- [x] Ignore/don't generate freezed classes for certain ObjectTypes
- [] Support arguments
- [] Support directives
- [] Support deprecation annotation
- [] Support for InterfaceTypes
- [] Support for UnionTypes [union/sealed classes](https://pub.dev/packages/freezed#unionssealed-classes)
- [] Support for InputTypes as union/sealed classes [union/sealed classes](https://pub.dev/packages/freezed#unionssealed-classes)

## Example:

```yml
# codegen.yml
schema: example/schema.graphql
generates:
  example/generated/app_models.dart:
    plugins:
      - graphql-codegen-flutter-freezed-classes:
    config:
      fileName: 'app_models'
      fromJsonToJson: true
      lowercaseEnums: false # default: true
      customScalars: { 'jsonb': 'Map<String, dynamic>', 'timestamptz': 'DateTime', 'UUID': 'String' }
      ignoreTypes: ['PageInfo', 'UserPaginator', 'PaginatorInfo']
      # unionInputs: { 'CreateBookInput': ['Book', 'createInput'], 'UpdateBookInput': ['Book', 'updateInput'] }
```

```graphql
# schema.graphql
type Test {
  a: [String]
  b: [ID!]
  c: [Boolean!]!
  d: [[Int]]
  e: [[Float]!]
  f: [[String]!]!
  g: jsonb
  h: timestamptz!
  i: UUID!
}

input AInput {
  b: BInput!
}
input BInput {
  c: CInput!
}
input CInput {
  a: AInput!
}

enum Episode {
  NEWHOPE
  EMPIRE
  JEDI
}

enum Gender {
  FEMALE
  MALE
}

type Book {
  id: ID!
  title: String!
}

input CreateBookInput {
  title: String!
}
```

```dart
// app_models.dart

// with lowercaseEnums: true
enum Episode {
  @JsonKey(name: "EMPIRE") empire,
  @JsonKey(name: "JEDI") jedi,
  @JsonKey(name: "NEWHOPE") newhope,
}

// with lowercaseEnums: false
enum Gender {
  FEMALE,
  MALE,
}


@freezed
class AInput with _$AInput{
   const factory AInput({
    required BInput b
  }) = _AInput;

  factory AInput.fromJson(Map<String, dynamic> json) => _$AInputFromJson(json);
};

@freezed
class BInput with _$BInput{
   const factory BInput({
    required CInput c
  }) = _BInput;

  factory BInput.fromJson(Map<String, dynamic> json) => _$BInputFromJson(json);
};

@freezed
class CInput with _$CInput{
   const factory CInput({
    required AInput a
  }) = _CInput;

  factory CInput.fromJson(Map<String, dynamic> json) => _$CInputFromJson(json);
};

@freezed
class Test with _$Test{
   const factory Test({
     List<String?>? a,
     List<String>? b,
    required List<bool> c,
     List<List<int?>?>? d,
     List<List<double?>>? e,
    required List<List<String?>> f,
     Map<String, dynamic>? g,
    required DateTime h,
    required String i
  }) = _Test;

  factory Test.fromJson(Map<String, dynamic> json) => _$TestFromJson(json);
};

// TODO: Support for InputTypes as union/sealed classes
@freezed
class Book with _$Book {
  factory Book({
    required String id,
    required String title,
  }) = _Book;

  factory Book.createInput({
    required String title,
  }) = _CreateBookInput;

  factory Book.fromJson(Map<String, dynamic> json) => _$BookFromJson(json);
}
```

## Getting started

### Flutter Setup

1. Install [freezed](https://pub.dev/packages/freezed#install) in your flutter project

2. Install [json_serializable](https://pub.dev/packages/json_serializable) in your flutter project

3. Create a `codegen.yml` file at the root of your Flutter project

4. Download your GraphQL schema in graphql format and place it at the root of your Flutter project

```sh
npm install -g graphqurl

gq <graphql-endpoint> -H "Authorization: Bearer <token>" --introspect > schema.graphql
```

### Generator setup

1. Install the generator globally from [npm](npm)

2. Generate your Freezed classes

3. Build your imagination

## Contribution

What you can do to help

1. Star this repo on GitHub

2. Send in PRs

3. Share the word
