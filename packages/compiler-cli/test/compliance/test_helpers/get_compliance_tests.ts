/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {runfiles} from '@bazel/runfiles';

import {AbsoluteFsPath, NodeJSFileSystem, PathSegment, ReadonlyFileSystem} from '../../../src/ngtsc/file_system';

export const fs = new NodeJSFileSystem();

/**
 * Path to the test case sources.
 *
 * 测试用例源的路径。
 *
 */
const basePath = fs.resolve(
    runfiles.resolveWorkspaceRelative('packages/compiler-cli/test/compliance/test_cases'));

/**
 * Search the `test_cases` directory, in the real file-system, for all the compliance tests.
 *
 * 在真实文件系统中的 `test_cases` 目录中搜索所有合规性测试。
 *
 * Test are indicated by a `TEST_CASES.json` file which contains one or more test cases.
 *
 * 测试由包含一个或多个测试用例的 `TEST_CASES.json` 文件表示。
 *
 */
export function* getAllComplianceTests(): Generator<ComplianceTest> {
  const testConfigPaths = collectPaths(basePath, segment => segment === 'TEST_CASES.json');
  for (const testConfigPath of testConfigPaths) {
    yield* getComplianceTests(testConfigPath);
  }
}

/**
 * Extract all the compliance tests from the TEST_CASES.json file at the `testConfigPath`.
 *
 * 从 `testConfigPath` 的 TEST_CASES.json 文件中提取所有合规性测试。
 *
 * @param testConfigPath Absolute disk path of the `TEST_CASES.json` file that describes the tests.
 *
 * 描述测试的 `TEST_CASES.json` 文件的绝对磁盘路径。
 *
 */
export function* getComplianceTests(absTestConfigPath: AbsoluteFsPath): Generator<ComplianceTest> {
  const realTestPath = fs.dirname(absTestConfigPath);
  const testConfigJSON = loadTestCasesFile(fs, absTestConfigPath, basePath).cases;
  const testConfig = Array.isArray(testConfigJSON) ? testConfigJSON : [testConfigJSON];
  for (const test of testConfig) {
    const inputFiles = getStringArrayOrDefault(test, 'inputFiles', realTestPath, ['test.ts']);
    const compilationModeFilter = getStringArrayOrDefault(
                                      test, 'compilationModeFilter', realTestPath,
                                      ['linked compile', 'full compile']) as CompilationMode[];

    yield {
      relativePath: fs.relative(basePath, realTestPath),
      realTestPath,
      description: getStringOrFail(test, 'description', realTestPath),
      inputFiles,
      compilationModeFilter,
      expectations: parseExpectations(test.expectations, realTestPath, inputFiles),
      compilerOptions: getConfigOptions(test, 'compilerOptions', realTestPath),
      angularCompilerOptions: getConfigOptions(test, 'angularCompilerOptions', realTestPath),
      focusTest: test.focusTest,
      excludeTest: test.excludeTest,
    };
  }
}

function loadTestCasesFile(
    fs: ReadonlyFileSystem, testCasesPath: AbsoluteFsPath, basePath: AbsoluteFsPath) {
  try {
    return JSON.parse(fs.readFile(testCasesPath)) as {cases: TestCaseJson | TestCaseJson[]};
  } catch (e) {
    throw new Error(`Failed to load test-cases at "${fs.relative(basePath, testCasesPath)}":\n ${
        (e as Error).message}`);
  }
}

/**
 * Search the file-system from the `current` path to find all paths that satisfy the `predicate`.
 *
 * 从 `current` 路径搜索文件系统以查找满足 `predicate` 的所有路径。
 *
 */
function*
    collectPaths(current: AbsoluteFsPath, predicate: (segment: PathSegment) => boolean):
        Generator<AbsoluteFsPath> {
  if (!fs.exists(current)) {
    return;
  }
  for (const segment of fs.readdir(current)) {
    const absPath = fs.resolve(current, segment);
    if (predicate(segment)) {
      yield absPath;
    } else {
      if (fs.lstat(absPath).isDirectory()) {
        yield* collectPaths(absPath, predicate);
      }
    }
  }
}

function getStringOrFail(container: any, property: string, testPath: AbsoluteFsPath): string {
  const value = container[property];
  if (typeof value !== 'string') {
    throw new Error(`Test is missing "${property}" property in TEST_CASES.json: ` + testPath);
  }
  return value;
}

function getStringArrayOrDefault(
    container: any, property: string, testPath: AbsoluteFsPath, defaultValue: string[]): string[] {
  const value = container[property];
  if (typeof value === 'undefined') {
    return defaultValue;
  }
  if (!Array.isArray(value) || !value.every(item => typeof item === 'string')) {
    throw new Error(
        `Test has invalid "${property}" property in TEST_CASES.json - expected array of strings: ` +
        testPath);
  }
  return value;
}

function parseExpectations(
    value: any, testPath: AbsoluteFsPath, inputFiles: string[]): Expectation[] {
  const defaultFailureMessage = 'Incorrect generated output.';
  const tsFiles = inputFiles.filter(f => f.endsWith('.ts') && !f.endsWith('.d.ts'));
  const defaultFiles = tsFiles.map(inputFile => {
    const outputFile = inputFile.replace(/\.ts$/, '.js');
    return {expected: outputFile, generated: outputFile};
  });

  if (typeof value === 'undefined') {
    return [{
      failureMessage: defaultFailureMessage,
      files: defaultFiles,
      expectedErrors: [],
      extraChecks: []
    }];
  }

  if (!Array.isArray(value)) {
    return parseExpectations([value], testPath, inputFiles);
  }

  return value.map((expectation, i) => {
    if (typeof expectation !== 'object') {
      throw new Error(
          `Test has invalid "expectations" property in TEST_CASES.json - expected array of "expectation" objects: ${
              testPath}`);
    }

    const failureMessage: string = expectation.failureMessage ?? defaultFailureMessage;
    const expectedErrors = parseExpectedErrors(expectation.expectedErrors, testPath);
    const extraChecks = parseExtraChecks(expectation.extraChecks, testPath);

    if (typeof expectation.files === 'undefined') {
      return {failureMessage, files: defaultFiles, expectedErrors, extraChecks};
    }

    if (!Array.isArray(expectation.files)) {
      throw new Error(`Test has invalid "expectations[${
          i}].files" property in TEST_CASES.json - expected array of "expected files": ${
          testPath}`);
    }
    const files: ExpectedFile[] = expectation.files.map((file: any) => {
      if (typeof file === 'string') {
        return {expected: file, generated: file};
      }
      if (typeof file === 'object' && typeof file.expected === 'string' &&
          typeof file.generated === 'string') {
        return file;
      }
      throw new Error(`Test has invalid "expectations[${
          i}].files" property in TEST_CASES.json - expected each item to be a string or an "expected file" object: ${
          testPath}`);
    });

    return {failureMessage, files, expectedErrors, extraChecks};
  });
}

function parseExpectedErrors(expectedErrors: any = [], testPath: AbsoluteFsPath): ExpectedError[] {
  if (!Array.isArray(expectedErrors)) {
    throw new Error(
        'Test has invalid "expectedErrors" property in TEST_CASES.json - expected an array: ' +
        testPath);
  }

  return expectedErrors.map(error => {
    if (typeof error !== 'object' || typeof error.message !== 'string' ||
        (error.location && typeof error.location !== 'string')) {
      throw new Error(
          `Test has invalid "expectedErrors" property in TEST_CASES.json - expected an array of ExpectedError objects: ` +
          testPath);
    }
    return {message: parseRegExp(error.message), location: parseRegExp(error.location)};
  });
}

function parseExtraChecks(extraChecks: any = [], testPath: AbsoluteFsPath): ExtraCheck[] {
  if (!Array.isArray(extraChecks) ||
      !extraChecks.every(i => typeof i === 'string' || Array.isArray(i))) {
    throw new Error(
        `Test has invalid "extraChecks" property in TEST_CASES.json - expected an array of strings or arrays: ` +
        testPath);
  }
  return extraChecks;
}

function parseRegExp(str: string|undefined): RegExp {
  return new RegExp(str || '');
}

function getConfigOptions(
    container: any, property: string, testPath: AbsoluteFsPath): ConfigOptions|undefined {
  const options = container[property];
  if (options !== undefined && typeof options !== 'object') {
    throw new Error(
        `Test have invalid "${
            property}" property in TEST_CASES.json - expected config option object: ` +
        testPath);
  }
  return options;
}

/**
 * Describes a compliance test, as defined in a `TEST_CASES.json` file.
 *
 * 描述在 `TEST_CASES.json` 文件中定义的合规性测试。
 *
 */
export interface ComplianceTest {
  /**
   * The path, relative to the test_cases directory, of the directory containing this test.
   *
   * 包含此测试的目录的相对于 test_cases 目录的路径。
   *
   */
  relativePath: string;
  /**
   * The absolute path (on the real file-system) to the test case containing this test.
   *
   * 包含此测试的测试用例的绝对路径（在真实文件系统上）。
   *
   */
  realTestPath: AbsoluteFsPath;
  /**
   * A description of this particular test.
   *
   * 此特定测试的描述。
   *
   */
  description: string;
  /**
   * Any additional options to pass to the TypeScript compiler when compiling this test's source
   * files. These are equivalent to what you would put in `tsconfig.json`.
   *
   * 编译此测试的源文件时要传递给 TypeScript 编译器的任何其他选项。这些相当于你在 `tsconfig.json`
   * 中放入的内容。
   *
   */
  compilerOptions?: ConfigOptions;
  /**
   * Any additional options to pass to the Angular compiler when compiling this test's source
   * files. These are equivalent to what you would put in `tsconfig.json`.
   *
   * 编译此测试的源文件时要传递给 Angular 编译器的任何其他选项。这些相当于你在 `tsconfig.json`
   * 中放入的内容。
   *
   */
  angularCompilerOptions?: ConfigOptions;
  /**
   * A list of paths to source files that should be compiled for this test case.
   *
   * 应该为此测试用例编译的源文件的路径列表。
   *
   */
  inputFiles: string[];
  /**
   * Only run this test when the input files are compiled using the given compilation
   * modes. The default is to run for all modes.
   *
   * 仅在使用给定的编译模式编译输入文件时运行此测试。默认值是为所有模式运行。
   *
   */
  compilationModeFilter: CompilationMode[];
  /**
   * A list of expectations to check for this test case.
   *
   * 要检查此测试用例的期望列表。
   *
   */
  expectations: Expectation[];
  /**
   * If set to `true`, then focus on this test (equivalent to jasmine's 'fit()\`).
   *
   * 如果设置为 `true` ，则专注于此测试（等效于 jasmine 的 'fit()\`）。
   *
   */
  focusTest?: boolean;
  /**
   * If set to `true`, then exclude this test (equivalent to jasmine's 'xit()\`).
   *
   * 如果设置为 `true` ，则排除此测试（等效于 jasmine 的 'xit()\`）。
   *
   */
  excludeTest?: boolean;
}

export type CompilationMode = 'linked compile'|'full compile';

export interface Expectation {
  /**
   * The message to display if this expectation fails.
   *
   * 如果此预期失败，则要显示的消息。
   *
   */
  failureMessage: string;
  /**
   * A list of pairs of paths to expected and generated files to compare.
   *
   * 要比较的预期文件和生成文件的路径对列表。
   *
   */
  files: ExpectedFile[];
  /**
   * A collection of errors that should be reported when compiling the generated file.
   *
   * 编译生成的文件时应该报告的错误集合。
   *
   */
  expectedErrors: ExpectedError[];
  /**
   * Additional checks to run against the generated code.
   *
   * 针对生成的代码运行的额外检查。
   *
   */
  extraChecks: ExtraCheck[];
}

/**
 * A pair of paths to expected and generated files that should be compared in an `Expectation`.
 *
 * 应该在 `Expectation` 中比较的预期和生成文件的路径对。
 *
 */
export interface ExpectedFile {
  expected: string;
  generated: string;
}

/**
 * Regular expressions that should match an error message.
 *
 * 应该匹配错误消息的正则表达式。
 *
 */
export interface ExpectedError {
  message: RegExp;
  location: RegExp;
}

/**
 * The name (or name and arguments) of a function to call to run additional checks against the
 * generated code.
 *
 * 要调用的函数的名称（或名称和参数），以对生成的代码运行额外检查。
 *
 */
export type ExtraCheck = (string|[string, ...any]);

/**
 * Options to pass to configure the compiler.
 *
 * 要传递的选项以配置编译器。
 *
 */
export type ConfigOptions = Record<string, string|boolean|null>;



/**
 * Interface espressing the type for the json object found at ../test_cases/test_case_schema.json.
 *
 * 表示在 ../test_cases/test_case_schema.json 找到的 json 对象的类型的接口。
 *
 */
export interface TestCaseJson {
  description: string;
  compilationModeFilter?: ('fulll compile'|'linked compile')[];
  inputFiles?: string[];
  expectations?: {
    failureMessage?: string;
    files?: ExpectedFile[] | string;
    expectedErrors?: {message: string, location?: string};
    extraChecks?: (string | string[])[];
  };
  compilerOptions?: ConfigOptions;
  angularCompilerOptions?: ConfigOptions;
  focusTest?: boolean;
  excludeTest?: boolean;
}
