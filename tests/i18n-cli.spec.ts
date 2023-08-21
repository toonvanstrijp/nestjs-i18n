import {
  GenerateTypesArguments,
  GenerateTypesCommand,
} from '../src/commands/generate-types.command';
import os from 'os';
import path from 'path';
import yargs from 'yargs';
import fs from 'fs';

describe('generate types test', () => {
  const generateTypesCommand = new GenerateTypesCommand();
  let mockExit;
  let typesOutputPath: string;

  beforeEach(() => {
    mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
      return undefined as never;
    });

    typesOutputPath = path.join(
      os.tmpdir(),
      `/generated/i18n-${Math.floor(Math.random() * 1000000000)}.generated.ts`,
    );
  });

  afterEach(() => {
    try {
      fs.unlinkSync(typesOutputPath);
    } catch (e) {}

    jest.clearAllMocks();
  });

  it('should generate proper types for single source ', async () => {
    const args = {
      typesOutputPath: typesOutputPath,
      watch: false,
      debounce: 200,
      loaderType: ['json'],
      translationsPath: [path.join(__dirname, './i18n')],
    } as yargs.Arguments<GenerateTypesArguments>;
    await generateTypesCommand.handler(args);

    const fileContent = fs.readFileSync(typesOutputPath).toString();

    expect(fileContent).toContain('DO NOT EDIT, file generated by nestjs-i18n');
    expect(fileContent).toContain(
      'import { Path } from "nestjs-i18n";',
    );
    expect(fileContent).toContain('export type I18nTranslations');
    expect(fileContent).toContain('"CURRENT_LANGUAGE": string;');
    expect(fileContent).toContain('"validation": {');
    expect(fileContent).toContain('"email": string;');
    expect(fileContent).toContain(
      '{\n' + '                "nest3": string;\n' + '            };',
    );

    expect(fileContent).not.toContain(`"new_file": {
        "NEW_VALUE": string;
        "NEW_VALUE_OBJECT": {
            "NEW_VALUE_OBJECT_KEY": string;
        };
    };`);

    expect(mockExit).toHaveBeenCalledWith(0);
  });

  it('should generate proper types for multiple source', async () => {
    const args = {
      typesOutputPath: typesOutputPath,
      watch: false,
      debounce: 200,
      loaderType: ['json', 'json'],
      translationsPath: [
        path.join(__dirname, './i18n'),
        path.join(__dirname, './i18n-second'),
      ],
    } as yargs.Arguments<GenerateTypesArguments>;
    await generateTypesCommand.handler(args);

    const fileContent = fs.readFileSync(typesOutputPath).toString();

    expect(fileContent).toContain('DO NOT EDIT, file generated by nestjs-i18n');
    expect(fileContent).toContain(
      'import { Path } from "nestjs-i18n";',
    );
    expect(fileContent).toContain('export type I18nTranslations');
    expect(fileContent).toContain('"CURRENT_LANGUAGE": string;');
    expect(fileContent).toContain('"validation": {');
    expect(fileContent).toContain('"email": string;');
    expect(fileContent).toContain(
      '{\n' + '                "nest3": string;\n' + '            };',
    );

    expect(fileContent).toContain(`"new_file": {
        "NEW_VALUE": string;
        "NEW_VALUE_OBJECT": {
            "NEW_VALUE_OBJECT_KEY": string;
        };
    };`);

    expect(mockExit).toHaveBeenCalledWith(0);
  });

  it('invalid loader types count', async () => {
    const args = {
      typesOutputPath: typesOutputPath,
      watch: false,
      debounce: 200,
      loaderType: ['json'],
      translationsPath: [
        path.join(__dirname, './i18n'),
        path.join(__dirname, './i18n-second'),
      ],
    } as yargs.Arguments<GenerateTypesArguments>;
    await generateTypesCommand.handler(args);

    expect(mockExit).toHaveBeenCalledWith(1);
  });
});

describe('generate types with watch', () => {
  let generateTypesCommand: GenerateTypesCommand;
  let mockExit;
  let typesOutputPath: string;
  let newI18nPath: string;
  let newI18nSecondPath: string;

  beforeEach(() => {
    generateTypesCommand = new GenerateTypesCommand();
    mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
      return undefined as never;
    });

    const randomNumber = Math.floor(Math.random() * 1000000000);
    newI18nPath = path.join(os.tmpdir(), `./i18n-${randomNumber}`);
    newI18nSecondPath = path.join(os.tmpdir(), `./i18n-second-${randomNumber}`);

    fs.cpSync(path.join(__dirname, './i18n'), newI18nPath, {
      recursive: true,
      force: true,
    });

    fs.cpSync(path.join(__dirname, './i18n-second'), newI18nSecondPath, {
      recursive: true,
      force: true,
    });

    typesOutputPath = path.join(
      os.tmpdir(),
      `/generated/i18n-${randomNumber}.generated.ts`,
    );
  });

  afterEach(() => {
    try {
      fs.unlinkSync(typesOutputPath);
    } catch (e) {}
    jest.clearAllMocks();
  });

  it('add new file', async () => {
    const args = {
      typesOutputPath: typesOutputPath,
      watch: true,
      debounce: 200,
      loaderType: ['json'],
      translationsPath: [newI18nPath],
    } as yargs.Arguments<GenerateTypesArguments>;

    await generateTypesCommand.handler(args);

    const fileContent = fs.readFileSync(typesOutputPath).toString();

    expect(fileContent).toContain('"CURRENT_LANGUAGE": string;');
    expect(fileContent).not.toContain('new_file');

    fs.writeFileSync(
      path.join(newI18nPath, 'en', 'new_file.json'),
      JSON.stringify({ NEW_KEY: 'NEW_VALUE' }),
    );

    await new Promise((resolve) => setTimeout(resolve, 500));

    const newFileContent = fs.readFileSync(typesOutputPath).toString();
    expect(newFileContent).toContain(`"new_file": {
        "NEW_KEY": string;
    };`);
  });

  it('remove file', async () => {
    const args = {
      typesOutputPath: typesOutputPath,
      watch: true,
      debounce: 200,
      loaderType: ['json'],
      translationsPath: [newI18nPath],
    } as yargs.Arguments<GenerateTypesArguments>;

    await generateTypesCommand.handler(args);

    const fileContent = fs.readFileSync(typesOutputPath).toString();

    expect(fileContent).toContain('"ENGLISH_ONLY_KEY": string;');
    expect(fileContent).toContain('"email": string;');
    expect(fileContent).not.toContain('new_file');

    fs.rmSync(path.join(newI18nPath, 'en', 'test.json'));

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newFileContent = fs.readFileSync(typesOutputPath).toString();
    expect(newFileContent).not.toContain(`"ENGLISH_ONLY_KEY": string;`);
    expect(newFileContent).toContain('"email": string;');
  });

  it('update file', async () => {
    const args = {
      typesOutputPath: typesOutputPath,
      watch: true,
      debounce: 200,
      loaderType: ['json'],
      translationsPath: [newI18nPath],
    } as yargs.Arguments<GenerateTypesArguments>;

    await generateTypesCommand.handler(args);

    const fileContent = fs.readFileSync(typesOutputPath).toString();

    expect(fileContent).toContain(`"ENGLISH_ONLY_KEY": string;`);
    expect(fileContent).not.toContain('"AUTO_GENERATED_KEY": string;');
    expect(fileContent).toContain('"email": string;');

    const updateFilePath = path.join(newI18nPath, 'en', 'test.json');
    const fileContentToUpdate = fs.readFileSync(updateFilePath);
    const parsedToUpdate = JSON.parse(fileContentToUpdate.toString());

    delete parsedToUpdate['ENGLISH_ONLY_KEY'];
    parsedToUpdate['AUTO_GENERATED_KEY'] = 'AUTO_GENERATED_VALUE';

    fs.writeFileSync(updateFilePath, JSON.stringify(parsedToUpdate, null, 2));

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newFileContent = fs.readFileSync(typesOutputPath).toString();
    expect(newFileContent).not.toContain(`"ENGLISH_ONLY_KEY": string;`);
    expect(newFileContent).toContain(`"AUTO_GENERATED_KEY": string;`);
    expect(fileContent).toContain('"email": string;');
  });

  it('multiple sources one update, one remove, one new file in various folder, adding a new language with new files', async () => {
    const args = {
      typesOutputPath: typesOutputPath,
      watch: true,
      debounce: 200,
      loaderType: ['json', 'json'],
      translationsPath: [newI18nPath, newI18nSecondPath],
    } as yargs.Arguments<GenerateTypesArguments>;

    await generateTypesCommand.handler(args);

    const fileContent = fs.readFileSync(typesOutputPath).toString();

    expect(fileContent).toContain(`"ENGLISH_ONLY_KEY": string;`);
    expect(fileContent).not.toContain('"AUTO_GENERATED_KEY": string;');
    expect(fileContent).not.toContain('"NEW_FILE_AUTO_GENERATED_KEY": string;');
    expect(fileContent).not.toContain('"EN_UK_NEW_LANGUAGE": string;');
    expect(fileContent).toContain('"email": string;');
    expect(fileContent).toContain('"NEW_VALUE": string;');
    expect(fileContent).toContain('"NEW_VALUE_OBJECT_KEY": string;');
    expect(fileContent).toContain('"new_file":');

    const updateFilePath = path.join(newI18nPath, 'en', 'test.json');
    const fileContentToUpdate = fs.readFileSync(updateFilePath);
    const parsedToUpdate = JSON.parse(fileContentToUpdate.toString());

    const autogeneratedFilePath = path.join(
      newI18nSecondPath,
      'en',
      'autogenerated.json',
    );

    delete parsedToUpdate['ENGLISH_ONLY_KEY'];
    parsedToUpdate['AUTO_GENERATED_KEY'] = 'AUTO_GENERATED_VALUE';

    // update file
    fs.writeFileSync(updateFilePath, JSON.stringify(parsedToUpdate, null, 2));

    // create file
    fs.writeFileSync(
      autogeneratedFilePath,
      JSON.stringify({
        NEW_FILE_AUTO_GENERATED_KEY: 'AUTO_GENERATED_VALUE',
      }),
    );

    // remove few files
    fs.unlinkSync(path.join(newI18nSecondPath, 'en', 'new_file.json'));
    fs.unlinkSync(path.join(newI18nSecondPath, 'en', 'validation.json'));

    // remove subfolder
    fs.rmSync(path.join(newI18nSecondPath, 'en', 'subfolder'), {
      recursive: true,
      force: true,
    });

    const newLanguagePath = path.join(newI18nPath, 'en-uk');
    fs.mkdirSync(newLanguagePath);
    fs.writeFileSync(
      path.join(newLanguagePath, 'test.json'),
      JSON.stringify({
        EN_UK_NEW_LANGUAGE: 'AUTO_GENERATED_VALUE',
      }),
    );

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newFileContent = fs.readFileSync(typesOutputPath).toString();
    expect(newFileContent).not.toContain(`"ENGLISH_ONLY_KEY": string;`);
    expect(newFileContent).toContain('"AUTO_GENERATED_KEY": string;');
    expect(newFileContent).toContain('"NEW_FILE_AUTO_GENERATED_KEY": string;');
    expect(newFileContent).toContain('"EN_UK_NEW_LANGUAGE": string;');
    expect(newFileContent).not.toContain('"NEW_VALUE": string;');
    expect(newFileContent).not.toContain('"NEW_VALUE_OBJECT_KEY": string;');
    expect(newFileContent).not.toContain('"new_file":');
    expect(newFileContent).toContain('"email": string;');
  });
});
