import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:flutter/foundation.dart';

part 'app_models.freezed.dart;
part 'app_models.g.dart';


@freezed
class AInput with _$AInput{
  const factory AInput({
    required BInput b,
  }) = _AInput;

factory AInput.fromJson(Map<String, dynamic> json) => _$AInputFromJson(json);
}

@freezed
class BInput with _$BInput{
  const factory BInput({
    required CInput c,
  }) = _BInput;

factory BInput.fromJson(Map<String, dynamic> json) => _$BInputFromJson(json);
}

@freezed
class CInput with _$CInput{
  const factory CInput({
    required AInput a,
  }) = _CInput;

factory CInput.fromJson(Map<String, dynamic> json) => _$CInputFromJson(json);
}

@freezed
class Character with _$Character{
  const factory Character({
    required List<Episode?> appearsIn,
     List<Character?>? friends,
    required String id,
    required String name,
  }) = _Character;  

factory Character.fromJson(Map<String, dynamic> json) => _$CharacterFromJson(json);
}

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
    required String i,
  }) = _ComplexType;  

factory ComplexType.fromJson(Map<String, dynamic> json) => _$ComplexTypeFromJson(json);
}

@freezed
class CreateMovieInput with _$CreateMovieInput{
  const factory CreateMovieInput({
    required String title,
  }) = _CreateMovieInput;

factory CreateMovieInput.fromJson(Map<String, dynamic> json) => _$CreateMovieInputFromJson(json);
}

@freezed
class DeleteMovieInput with _$DeleteMovieInput{
  const factory DeleteMovieInput({
    required String id,
  }) = _DeleteMovieInput;

factory DeleteMovieInput.fromJson(Map<String, dynamic> json) => _$DeleteMovieInputFromJson(json);
}

@freezed
class Droid with _$Droid{
  const factory Droid({
    required List<Episode?> appearsIn,
     List<Character?>? friends,
    required String id,
    required String name,
     String? primaryFunction,
  }) = _Droid;  

factory Droid.fromJson(Map<String, dynamic> json) => _$DroidFromJson(json);
}

enum Episode {
   EMPIRE,
  JEDI,
  NEWHOPE,
}

@freezed
class Human with _$Human{
  const factory Human({
    required List<Episode?> appearsIn,
     List<Character?>? friends,
    required String id,
    required String name,
     List<Starship?>? starships,
     int? totalCredits,
  }) = _Human;  

factory Human.fromJson(Map<String, dynamic> json) => _$HumanFromJson(json);
}

@freezed
class Movie with _$Movie{
  const factory Movie({
    required String id,
    required String title,
  }) = _Movie;  

const factory Movie.createInput({
    required String title,
}) = _CreateMovieInput;

const factory Movie.updateInput({
    required String id,
     String? title,
}) = _UpdateMovieInput;

const factory Movie.deleteInput({
    required String id,
}) = _DeleteMovieInput;

factory Movie.fromJson(Map<String, dynamic> json) => _$MovieFromJson(json);
}

@freezed
class SearchResult with _$SearchResult{

const factory SearchResult.droid({ 
    required List<Episode?> appearsIn,
     List<Character?>? friends,
    required String id,
    required String name,
     String? primaryFunction,
}) = _Droid;

const factory SearchResult.human({ 
    required List<Episode?> appearsIn,
     List<Character?>? friends,
    required String id,
    required String name,
     List<Starship?>? starships,
     int? totalCredits,
}) = _Human;

const factory SearchResult.starship({ 
    required String id,
     double? length,
    required String name,
}) = _Starship;


factory SearchResult.fromJson(Map<String, dynamic> json) => _$SearchResultFromJson(json);
}

@freezed
class Starship with _$Starship{
  const factory Starship({
    required String id,
     double? length,
    required String name,
  }) = _Starship;  

factory Starship.fromJson(Map<String, dynamic> json) => _$StarshipFromJson(json);
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
