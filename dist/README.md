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
- [x] Support for UnionTypes [union/sealed classes](https://pub.dev/packages/freezed#unionssealed-classes)
- [x] Merge InputTypes with ObjectType as union/sealed class [union/sealed classes](https://pub.dev/packages/freezed#unionssealed-classes)

## Example

> Using the CLI

```sh
 ffc generate -s schema.graphql --scalars '{"jsonb": "Map<String, dynamic>","timestamptz": "DateTime", "UUID": "String"}' -m 'Create$Input' -m 'Update$Input' -m 'Upsert$Input' -m 'Delete$Input'
```

> Given the following GraphQL schema below

```graphql
# schema.graphql
type Movie {
  id: ID!
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
  length: Float
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

> Generated file

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

// TODO: Merge InputTypes with ObjectType as union/sealed classconst
@freezed
class Movie with _$Movie {
  const factory Movie({
    required String id,
    required String title,
  }) = _Movie;

  const factory Movie.createInput({
    required String title,
  }) = _CreateMovieInput;

  const factory Movie.upsertInput({
    required String id,
    required String title,
  }) = _UpsertMovieInput;

  const factory Movie.updateInput({
    required String id,
    String title,
  }) = _UpdateMovieInput;

  const factory Movie.deleteInput({
    required String id,
  }) = _DeleteMovieInput;

  factory Movie.fromJson(Map<String, dynamic> json) => _$MovieFromJson(json);
}

// Without mergeInputs
@freezed
class Movie with _$Movie{
  const factory Movie({
    required String id,
    required String title,
  }) = _Movie;

factory Movie.fromJson(Map<String, dynamic> json) => _$MovieFromJson(json);
}

@freezed
class CreateMovieInput with _$CreateMovieInput{
  const factory CreateMovieInput({
    required String title,
  }) = _CreateMovieInput;

factory CreateMovieInput.fromJson(Map<String, dynamic> json) => _$CreateMovieInputFromJson(json);
}

@freezed
class UpdateMovieInput with _$UpdateMovieInput{
  const factory UpdateMovieInput({
    required String id,
     String? title,
  }) = _UpdateMovieInput;

factory UpdateMovieInput.fromJson(Map<String, dynamic> json) => _$UpdateMovieInputFromJson(json);
}

@freezed
class UpsertMovieInput with _$UpsertMovieInput{
  const factory UpsertMovieInput({
    required String id,
    required String title,
  }) = _UpsertMovieInput;

factory UpsertMovieInput.fromJson(Map<String, dynamic> json) => _$UpsertMovieInputFromJson(json);
}


@freezed
class DeleteMovieInput with _$DeleteMovieInput{
  const factory DeleteMovieInput({
    required String id,
  }) = _DeleteMovieInput;

factory DeleteMovieInput.fromJson(Map<String, dynamic> json) => _$DeleteMovieInputFromJson(json);
}

```

## Getting started

### Flutter Setup

1. Install [freezed](https://pub.dev/packages/freezed#install) in your flutter project

2. Install [json_serializable](https://pub.dev/packages/json_serializable) in your flutter project

3. Download your GraphQL schema in graphql format and place it at the root of your Flutter project

```sh
npm install -g graphqurl

gq <graphql-endpoint>  --introspect > schema.graphql

# if your graphql endpoint requires authentication:
gq <graphql-endpoint> -H "Authorization: Bearer <token>" --introspect > schema.graphql
```

### Generator setup

1. Install the generator globally from [npm](npm)

2. Generate your Freezed classes with the CLI

## CLI Usage

### Description

Generate Freezed classes from your GraphQL Schema

### Usage

```sh
ffc generate [-jeuEpOS -s <string> -o <string> -f <string> -i <string> -m <string> -c <string> -w <string|string[]|boolean|undefined> -T <number>]
```

### Options

| Options                                              | Type Definition           | Default values | Description                                                                                             |
| ---------------------------------------------------- | ------------------------- | -------------- | :------------------------------------------------------------------------------------------------------ |
| -s, --schema                                         | string                    | optional       | the path to the GraphQL Schema. Default: ./schema.graphql                                               |
| -o, --output                                         | string                    | optional       | the full path of the output file. Default: `./lib/generated/app_models.dart`                            |
| -f, --fileName, --file-name                          | string                    | app_models     | the name of the output file without the .dart extension. Appends/replaces the fileName in output option |
| -i, --ignore, --ignoreTypes, --ignore-types          | string[]                  | []             | names of GraphQL types to ignore when generating Freezed classes                                        |
| -j, --json, --fromJsonToJson, --from-json-to-json    | boolean                   | true           | generate fromJson and toJson methods on the classes with [json_serialization]()                         |
| -e, --enum, --lowercaseEnums, --lowercase-enums      | boolean                   | true           | make enum fields lowercase                                                                              |
| -u, --union, --unionConstructor, --union-constructor | boolean                   | true           | generate empty constructors for Union Types                                                             |
| -m, --merge, --mergeInputs, --merge-inputs           | string[]                  | []             | merge InputTypes of a pattern with an ObjectType as a union/sealed class                                |
| -c, --scalars, --customScalars, --custom-scalars     | string                    | optional       | a JSON.stringify object map of custom Scalars to Dart built-in types                                    |
| -w, --watch                                          | string\|string[]\|boolean | optional       | regenerate when GraphQL schemas changes. Accepts a boolean or an array of glob patterns                 |
| -E, --errorsOnly, --errors-only                      | boolean                   | optional       | print only errors                                                                                       |
| -p, --usePolling, --use-polling                      | boolean                   | optional       | poll for changes when watch is unavailable on system                                                    |
| -T, --interval                                       | number                    | optional       | poll every x millisecond                                                                                |
| -O, --overwrite                                      | boolean                   | true           | overwrite files if they already exist                                                                   |
| -S, --silent                                         | boolean                   | optional       | suppress printing errors when they occur                                                                |

## Contribution

What you can do to help

1. Star this repo on GitHub

2. Send in PRs

3. Share the word
