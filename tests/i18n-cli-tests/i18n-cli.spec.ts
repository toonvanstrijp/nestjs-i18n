import {
  GenerateTypesArguments,
  GenerateTypesCommand,
} from '../../src/commands/generate-types.command';
import os from 'os';
import path from 'path';
import yargs from 'yargs';
import fs from 'fs';

describe('config file', () => {
  const generateTypesCommand = new GenerateTypesCommand();
  let typesOutputPath: string;
  let mockExit;

  beforeEach(() => {
    mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
      return undefined as never;
    });

    const randomNumber = Math.floor(Math.random() * 1000000000);
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

  it('should use options file', async () => {
    await generateTypesCommand.handler({
      typesOutputPath: typesOutputPath,
      watch: false,
      debounce: 200,
      translationsPath: [],
      loaderType: [],
      optionsFile: path.join(__dirname, '../app/config/i18n-options.ts'),
    } as yargs.Arguments<GenerateTypesArguments>);

    const newFileContent = fs.readFileSync(typesOutputPath).toString();

    expect(newFileContent).toContain(`"validation": {
        "email": string;
        "password": string;
        "NOT_EMPTY": string;
        "INVALID_EMAIL": string;
        "INVALID_BOOLEAN": string;
        "MIN": string;
        "MAX": string;
    };`);
  });

  it('should use nearest package.json file', async () => {
    try {
      fs.unlinkSync(`/tmp/i18n-generated.ts`);
    } catch (e) {}

    const mockCwd = jest.spyOn(process, 'cwd').mockImplementation(() => {
      return __dirname;
    });

    const outputPath = `/tmp/i18n-918372399-generated.ts`;

    await generateTypesCommand.handler({
      typesOutputPath: '',
      watch: false,
      debounce: 200,
      translationsPath: [],
      loaderType: [],
    } as yargs.Arguments<GenerateTypesArguments>);

    const newFileContent = fs.readFileSync(outputPath).toString();

    expect(newFileContent).toContain(`"validation": {
        "email": string;
        "password": string;
        "NOT_EMPTY": string;
        "INVALID_EMAIL": string;
        "INVALID_BOOLEAN": string;
        "MIN": string;
        "MAX": string;
    };`);

    fs.unlinkSync(outputPath);

  });
});
