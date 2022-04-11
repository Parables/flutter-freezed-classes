#!/usr/bin/env node
import { generate } from '@graphql-codegen/cli';
import { cli, command, defaultCommand, option } from 'typed-cli';
import chalk from 'chalk';
import validator from 'validator';
import fs from 'fs';
export { plugin } from './plugin';
const code = (value) => chalk.italic.bgGray(value);
cli.commands({
    program: 'ffc',
    description: 'Generates Freezed classes for Flutter from your GraphQL Schema',
    completer: true,
}, {
    [defaultCommand]: command({
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
    generate: command({
        description: 'Generate Freezed classes from your GraphQL Schema',
        options: {
            schema: option.string
                .alias('s')
                .description(`the path to the GraphQL Schema. Default: ${code('./schema.graphql')}`)
                .validate(`Expected a GraphQL endpoint URL or valid GraphQL schema file with ${code('.graphql')} ${code('.json')} extension`, value => value == undefined || validator.isURL(value) || value.endsWith('.graphql') || value.endsWith('.json')),
            output: option.string
                .alias('o')
                .description(`the full path of the output file. Default: ${code('./lib/generated/app_models.dart')}`),
            fileName: option.string
                .alias('f')
                .default('app_models')
                .description(`the name of the output file without the ${code('.dart')} extension. Appends/replaces the fileName in output option`),
            ignoreTypes: option.string
                .array()
                .alias('i')
                .alias('ignore')
                .description(`names of GraphQL types to ignore when generating Freezed classes`),
            fromJsonToJson: option.boolean
                .alias('j')
                .alias('json')
                .default(true)
                .description(`generate fromJson & toJson methods on the classes with json_serialization`),
            lowercaseEnums: option.boolean.alias('e').alias('enum').default(true).description(`make enum fields lowercase`),
            unionConstructor: option.boolean
                .alias('u')
                .alias('union')
                .default(true)
                .description(`generate empty constructors for Union Types`),
            mergeInputs: option.string
                .array()
                .alias('m')
                .alias('merge')
                .description(`merge InputTypes of a pattern with an ObjectType as a union/sealed class`),
            customScalars: option.string
                .alias('c')
                .alias('scalars')
                .description(`a JSON.stringify object of custom Scalars to Dart built-in types`),
            watch: option.boolean
                .label('string|string[]|boolean|undefined')
                .alias('w')
                .default(false)
                .description(`regenerate when GraphQL schemas changes. Accepts a boolean or an array of glob patterns`),
            errorsOnly: option.boolean.alias('E').default(false).description(`print only errors`),
            usePolling: option.boolean.alias('p').default(false).description(`poll for changes`),
            interval: option.number.alias('T').description(`poll every x millisecond`),
            overwrite: option.boolean.alias('O').default(true).description(`overwrite files if they already exist`),
            silent: option.boolean.alias('S').default(false).description(`suppress printing errors when they occur`),
        },
    }).handle(async (data) => {
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
        await generate({
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
    }),
});
function hasPubspecFile() {
    if (!fs.existsSync('pubspec.yaml')) {
        console.warn(`${chalk.bold.yellow('WARNING:')} You are running from a non Flutter/Dart project directory\n`);
    }
}
function setSchema(schema) {
    if (schema) {
        return schema;
    }
    if (fs.existsSync('./schema.json')) {
        return './schema.json';
    }
    else if (fs.existsSync('./schema.graphql')) {
        return './schema.graphql';
    }
    else {
        console.error(`${chalk.bold.red('Error: GraphQL schema not found:')} Expected a GraphQL schema at the root of project folder or specify the path/URL with the ${chalk.italic.grey('-s')} or ${chalk.italic.grey('--schema')} option`);
        process.exit();
    }
}
