#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = void 0;
const cli_1 = require("@graphql-codegen/cli");
const typed_cli_1 = require("typed-cli");
const chalk_1 = __importDefault(require("chalk"));
const validator_1 = __importDefault(require("validator"));
const fs_1 = __importDefault(require("fs"));
var plugin_1 = require("./plugin");
Object.defineProperty(exports, "plugin", { enumerable: true, get: function () { return plugin_1.plugin; } });
const code = (value) => chalk_1.default.italic.bgGray(value);
typed_cli_1.cli.commands({
    program: 'ffc',
    description: 'Generates Freezed classes for Flutter from your GraphQL Schema',
    completer: true,
}, {
    [typed_cli_1.defaultCommand]: (0, typed_cli_1.command)({
        name: 'ffc',
        description: 'Displays this help file',
    }).handle(() => {
        console.log(`Description:
    Stop creating manual class/models for your Flutter app. 
    Automate the development process by generating Freezed classes from your GraphQL schema
    
Usage:  ffc <command> [<args>] 

Type ffc --help for more

CLI made with typed-cli https://int0h.github.io/typed-cli-docs/`);
    }),
    generate: (0, typed_cli_1.command)({
        description: 'Generate Freezed classes from your GraphQL Schema',
        options: {
            schema: typed_cli_1.option.string
                .alias('s')
                .description(`the path to the GraphQL Schema. Default: ${code('./schema.graphql')}`)
                .validate(`Expected a GraphQL endpoint URL or valid GraphQL schema file with ${code('.graphql')} ${code('.json')} extension`, value => value == undefined || validator_1.default.isURL(value) || value.endsWith('.graphql') || value.endsWith('.json')),
            output: typed_cli_1.option.string
                .alias('o')
                .description(`the full path of the output file. Default: ${code('./lib/generated/app_models.dart')}`),
            fileName: typed_cli_1.option.string
                .alias('f')
                .default('app_models')
                .description(`the name of the output file without the ${code('.dart')} extension. Appends/replaces the fileName in output option`),
            ignoreTypes: typed_cli_1.option.string
                .array()
                .alias('i')
                .alias('ignore')
                .description(`names of GraphQL types to ignore when generating Freezed classes`),
            fromJsonToJson: typed_cli_1.option.boolean
                .alias('j')
                .alias('json')
                .default(true)
                .description(`generate fromJson & toJson methods on the classes with json_serialization`),
            lowercaseEnums: typed_cli_1.option.boolean.alias('e').alias('enum').default(true).description(`make enum fields lowercase`),
            unionConstructor: typed_cli_1.option.boolean
                .alias('u')
                .alias('union')
                .default(true)
                .description(`generate empty constructors for Union Types`),
            mergeInputs: typed_cli_1.option.string
                .array()
                .alias('m')
                .alias('merge')
                .description(`merge InputTypes of a pattern with an ObjectType as a union/sealed class`),
            customScalars: typed_cli_1.option.string
                .alias('c')
                .alias('scalars')
                .description(`a JSON.stringify object of custom Scalars to Dart built-in types`),
            watch: typed_cli_1.option.boolean
                .label('string|string[]|boolean|undefined')
                .alias('w')
                .default(false)
                .description(`regenerate when GraphQL schemas changes. Accepts a boolean or an array of glob patterns`),
            errorsOnly: typed_cli_1.option.boolean.alias('E').default(false).description(`print only errors`),
            usePolling: typed_cli_1.option.boolean.alias('p').default(false).description(`poll for changes`),
            interval: typed_cli_1.option.number.alias('T').description(`poll every x millisecond`),
            overwrite: typed_cli_1.option.boolean.alias('O').default(true).description(`overwrite files if they already exist`),
            silent: typed_cli_1.option.boolean.alias('S').default(false).description(`suppress printing errors when they occur`),
        },
    }).handle((data) => __awaiter(void 0, void 0, void 0, function* () {
        const { options: { schema: _schema, output: _output, fileName: _fileName, watch, overwrite, silent, errorsOnly, usePolling, interval, ignoreTypes, fromJsonToJson, lowercaseEnums, unionConstructor, mergeInputs, customScalars, }, } = data;
        hasPubspecFile();
        const schema = setSchema(_schema);
        const _defaultFileName = _fileName.endsWith('.dart') ? _fileName.replace('.dart', '') : _fileName;
        const output = _output
            ? _output.endsWith('.dart')
                ? _defaultFileName === 'app_models'
                    ? _output
                    : `${_output.split('/').slice(0, -1).join('/')}/${_defaultFileName}.dart`
                : _output.endsWith('/')
                    ? `${_output}${_defaultFileName}.dart`
                    : `${_output}/${_defaultFileName}.dart`
            : `${process.cwd()}/lib/generated/app_models.dart`;
        const fileName = output.split('/').slice(-1).join('').replace('.dart', '');
        yield (0, cli_1.generate)({
            watch: watch,
            overwrite: overwrite,
            silent: silent,
            errorsOnly: errorsOnly,
            watchConfig: {
                usePolling: usePolling,
                interval: interval,
            },
            schema: schema,
            generates: {
                [output]: {
                    plugins: ['dist/main/plugin.js'],
                    config: {
                        fileName: fileName,
                        ignoreTypes: ignoreTypes,
                        fromJsonToJson: fromJsonToJson,
                        lowercaseEnums: lowercaseEnums,
                        unionConstructor: unionConstructor,
                        customScalars: customScalars ? JSON.parse(customScalars) : undefined,
                        mergeInputs: mergeInputs,
                    },
                },
            },
        }, true);
    })),
});
function hasPubspecFile() {
    if (!fs_1.default.existsSync('pubspec.yaml')) {
        console.warn(`${chalk_1.default.bold.yellow('WARNING:')} You are running from a non Flutter/Dart project directory\n`);
    }
}
function setSchema(schema) {
    if (schema) {
        return schema;
    }
    if (fs_1.default.existsSync('./schema.json')) {
        return './schema.json';
    }
    else if (fs_1.default.existsSync('./schema.graphql')) {
        return './schema.graphql';
    }
    else {
        console.error(`${chalk_1.default.bold.red('Error: GraphQL schema not found:')} Expected a GraphQL schema at the root of project folder or specify the path/URL with the ${chalk_1.default.italic.grey('-s')} or ${chalk_1.default.italic.grey('--schema')} option`);
        process.exit();
    }
}
