# GraphQL Flutter Freezed Classes

This project aims to speed up your development of Flutter apps by generating [Freezed](https://pub.dev/packages/freezed) from your GraphQL schema.

## Todo

- [] Submit PR to [visitor-plugin-common](@graphql-codegen/visitor-plugin-common/index.js), to add `|| this._kind === 'class'` to line: 350

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
- [x] Support for UnionTypes [union/sealed classes](https://pub.dev/packages/freezed#unionssealed-classes)
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
      unionInputs:
        {
          'CreateMovieInput': ['Movie', 'createInput'],
          'UpdateMovieInput': ['Movie', 'updateInput'],
          'DeleteMovieInput': ['Movie', 'deleteInput'],
        }
```

```graphql
# schema.graphql
type Movie {
  id: ID!
  title: String!
}

input CreateMovieInput {
  title: String!
}

input CreateMovieInput {
  title: String!
}

input UpsertMovieInput {
  id: ID!
  title: String!
}

input UpdateMovieInput {
  id: ID!
  title: String
}

input DeleteMovieInput {
  id: ID!
}

enum Episode {
  NEWHOPE
  EMPIRE
  JEDI
}

type Starship {
  id: ID!
  name: String!
  length(unit: LengthUnit = METER): Float
}

interface Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
}

type Character {
  name: String!
  appearsIn: [Episode]!
}

type Human implements Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
  starships: [Starship]
  totalCredits: Int
}

type Droid implements Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
  primaryFunction: String
}

union SearchResult = Human | Droid | Starship

# tests

scalar UUID
scalar timestamptz
scalar jsonb

# cyclic references/nested types
input AInput {
  b: BInput!
}

input BInput {
  c: CInput!
}

input CInput {
  a: AInput!
}

type ComplexType {
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
class ComplexType with _$ComplexType{
   const factory ComplexType({
     List<String?>? a,
     List<String>? b,
    required List<bool> c,
     List<List<int?>?>? d,
     List<List<double?>>? e,
    required List<List<String?>> f,
     Map<String, dynamic>? g,
    required DateTime h,
    required String i
  }) = _ComplexType;

  factory ComplexType.fromJson(Map<String, dynamic> json) => _$ComplexTypeFromJson(json);
};

// TODO: Support for InputTypes as union/sealed classes
@freezed
class Movie with _$Movie {
  factory Movie({
    required String id,
    required String title,
  }) = _Movie;

  factory Movie.createInput({
    required String title,
  }) = _CreateMovieInput;

  factory Movie.fromJson(Map<String, dynamic> json) => _$MovieFromJson(json);
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
