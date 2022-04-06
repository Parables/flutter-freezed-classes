import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:flutter/foundation.dart';

part 'app_models.freezed.dart;'


@freezed
class AInput with _$AInput {
  const factory AInput({
    required BInput b,
  }) = _AInput;
}

@freezed
class BInput with _$BInput {
  const factory BInput({
    required CInput c,
  }) = _BInput;
}

@freezed
class CInput with _$CInput {
  const factory CInput({
    required AInput a,
  }) = _CInput;
}

@freezed
class Character with _$Character {
  const factory Character({
    required List<Episode?> appearsIn,
     List<Character?>? friends,
    required String id,
    required String name,
  }) = _Character;  
}

@freezed
class ComplexType with _$ComplexType {
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
}

@freezed
class CreateMovieInput with _$CreateMovieInput {
  const factory CreateMovieInput({
    required String title,
  }) = _CreateMovieInput;
}

@freezed
class DeleteMovieInput with _$DeleteMovieInput {
  const factory DeleteMovieInput({
    required String id,
  }) = _DeleteMovieInput;
}

@freezed
class Droid with _$Droid {
  const factory Droid({
    required List<Episode?> appearsIn,
     List<Character?>? friends,
    required String id,
    required String name,
     String? primaryFunction,
  }) = _Droid;  
}

enum Episode {
   EMPIRE,
  JEDI,
  NEWHOPE,
}

@freezed
class Human with _$Human {
  const factory Human({
    required List<Episode?> appearsIn,
     List<Character?>? friends,
    required String id,
    required String name,
     List<Starship?>? starships,
     int? totalCredits,
  }) = _Human;  
}

@freezed
class Movie with _$Movie {
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
}

@freezed
class SearchResult with _$SearchResult {

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

}

@freezed
class Starship with _$Starship {
  const factory Starship({
    required String id,
     double? length,
    required String name,
  }) = _Starship;  
}

@freezed
class UpdateMovieInput with _$UpdateMovieInput {
  const factory UpdateMovieInput({
    required String id,
     String? title,
  }) = _UpdateMovieInput;
}

@freezed
class UpsertMovieInput with _$UpsertMovieInput {
  const factory UpsertMovieInput({
    required String id,
    required String title,
  }) = _UpsertMovieInput;
}
