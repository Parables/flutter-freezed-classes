# GraphQL Flutter Freezed Classes

This project aims to speed up your development of Flutter apps by generating [Freezed](https://pub.dev/packages/freezed) from your GraphQL schema.

## Features

- [x] Generate Freezed classes for ObjectTypes InputTypes and EnumsTypes

```yml
# codegen.yml
schema: example/schema.graphql
generates:
  example/generated/app_models.dart:
    plugins:
      - graphql-codegen-flutter-freezed-classes:
    config:
      fileName: app_models
      fromJsonToJson: true
      lowercaseEnums: false # default: true
```

```graphql
# schema.graphql
type Test {
  a: [String]
  b: [String!]
  c: [String!]!
  d: [[String]]
  e: [[String]!]
  f: [[String]!]!
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

@freezed- [x] Generate Freezed classes for

class Test with _$Test{
   const factory Test({
     List<String?>? a,
     List<String>? b,
    required List<String> c,
     List<List<String?>?>? d,
     List<List<String?>>? e,
    required List<List<String?>> f
  }) = _Test;

  factory Test.fromJson(Map<String, dynamic> json) => _$TestFromJson(json);
};

```

- [] Generate Freezed classes UnionTypes [union/sealed classea](https://pub.dev/packages/freezed#unionssealed-classes)

- [] Generate Freezed classes InterfaceTypes

- [] Generate Freezed Class for ObjectTypes with InputTypes as named constructors [union/sealed classes](https://pub.dev/packages/freezed#unionssealed-classes)

```yml
# codegen.yml
schema: example/schema.graphql
generates:
  example/generated/app_models.dart:
    plugins:
      - graphql-codegen-flutter-freezed-classes:
    config:
      fileName: app_models
      fromJsonToJson: true
      unionInputs:
        - CreateBookInput: ['Book', 'createInput'] # InputType: ['ObjectType', 'namedConstructor']
```

```graphql
# schema.graphql
type Book {
  id: ID!
  title: String!
}

input CreateBookInput {
  title: String!
}
```

```dart
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

- [] Support custom ScalarTypes

- [] Support arguments

- [] Support directives

- [x] Support freeze documentation of class properties from GraphQL SDL description comments

- [] Support deprecation annotation

## Getting started

### Flutter Setup

1. Install [freezed](https://pub.dev/packages/freezed#install) in your flutter project

2. Optinal: Install [json_serializable](https://pub.dev/packages/json_serializable) in your flutter project if you want Freeze to generate fromJson and toJson methods for you

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
