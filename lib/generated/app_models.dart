import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:flutter/foundation.dart';

part 'app_models.freezed.dart;'
part 'app_models.g.dart';



@freezed
class Continent with _$Continent {
  const factory Continent({
    required String code,
    required List<Country> countries,
    required String name,
  }) = _Continent;  

factory Continent.fromJson(Map<String, dynamic> json) => _$ContinentFromJson(json);

}

@freezed
class ContinentFilterInput with _$ContinentFilterInput {
  const factory ContinentFilterInput({
     StringQueryOperatorInput? code,
  }) = _ContinentFilterInput;

factory ContinentFilterInput.fromJson(Map<String, dynamic> json) => _$ContinentFilterInputFromJson(json);

}

@freezed
class Country with _$Country {
  const factory Country({
     String? capital,
    required String code,
    required Continent continent,
     String? currency,
    required String emoji,
    required String emojiU,
    required List<Language> languages,
    required String name,
    required String native,
    required String phone,
    required List<State> states,
  }) = _Country;  

factory Country.fromJson(Map<String, dynamic> json) => _$CountryFromJson(json);

}

@freezed
class CountryFilterInput with _$CountryFilterInput {
  const factory CountryFilterInput({
     StringQueryOperatorInput? code,
     StringQueryOperatorInput? continent,
     StringQueryOperatorInput? currency,
  }) = _CountryFilterInput;

factory CountryFilterInput.fromJson(Map<String, dynamic> json) => _$CountryFilterInputFromJson(json);

}

@freezed
class Language with _$Language {
  const factory Language({
    required String code,
     String? name,
     String? native,
    required bool rtl,
  }) = _Language;  

factory Language.fromJson(Map<String, dynamic> json) => _$LanguageFromJson(json);

}

@freezed
class LanguageFilterInput with _$LanguageFilterInput {
  const factory LanguageFilterInput({
     StringQueryOperatorInput? code,
  }) = _LanguageFilterInput;

factory LanguageFilterInput.fromJson(Map<String, dynamic> json) => _$LanguageFilterInputFromJson(json);

}


@freezed
class State with _$State {
  const factory State({
     String? code,
    required Country country,
    required String name,
  }) = _State;  

factory State.fromJson(Map<String, dynamic> json) => _$StateFromJson(json);

}

@freezed
class StringQueryOperatorInput with _$StringQueryOperatorInput {
  const factory StringQueryOperatorInput({
     String? eq,
     String? glob,
     List<String?>? in,
     String? ne,
     List<String?>? nin,
     String? regex,
  }) = _StringQueryOperatorInput;

factory StringQueryOperatorInput.fromJson(Map<String, dynamic> json) => _$StringQueryOperatorInputFromJson(json);

}

@freezed
class Entity with _$Entity {
  const factory Entity({}) =  _Entity;

const factory Entity.continent({ 
    required String code,
    required List<Country> countries,
    required String name,
}) = _Continent;

const factory Entity.country({ 
     String? capital,
    required String code,
    required Continent continent,
     String? currency,
    required String emoji,
    required String emojiU,
    required List<Language> languages,
    required String name,
    required String native,
    required String phone,
    required List<State> states,
}) = _Country;

const factory Entity.language({ 
    required String code,
     String? name,
     String? native,
    required bool rtl,
}) = _Language;


factory Entity.fromJson(Map<String, dynamic> json) => _$EntityFromJson(json);

}

@freezed
class Service with _$Service {
  const factory Service({
    /// The sdl representing the federated service capabilities. Includes federation directives, removes federation types, and includes rest of full schema after schema directives have been applied
 String? sdl,
  }) = _Service;  

factory Service.fromJson(Map<String, dynamic> json) => _$ServiceFromJson(json);

}
