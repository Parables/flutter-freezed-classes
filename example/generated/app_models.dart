
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:flutter/foundation.dart';

part 'app_models.freezed.dart;
part '${config.fileName}.g.dart';

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

enum Episode {
   EMPIRE,
  JEDI,
  NEWHOPE,
}

enum Gender {
   FEMALE,
  MALE,
}

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
