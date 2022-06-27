/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {AbsoluteFsPath, FileSystem} from '../../../src/ngtsc/file_system';
import {compileTest, getBuildOutputDirectory, initMockTestFileSystem} from '../test_helpers/compile_test';
import {ComplianceTest, getComplianceTests} from '../test_helpers/get_compliance_tests';
import {PartiallyCompiledFile, renderGoldenPartial} from '../test_helpers/golden_partials';

/**
 * Generate the golden partial output for the tests described in the `testConfigPath` config file.
 *
 * 为 `testConfigPath` 配置文件中描述的测试生成黄金部分输出。
 *
 * @param testConfigPath Absolute disk path of the `TEST_CASES.json` file that describes the tests.
 *
 * 描述测试的 `TEST_CASES.json` 文件的绝对磁盘路径。
 *
 */
export function generateGoldenPartial(absTestConfigPath: AbsoluteFsPath): void {
  const files: PartiallyCompiledFile[] = [];
  const tests = getComplianceTests(absTestConfigPath);
  for (const test of tests) {
    const fs = initMockTestFileSystem(test.realTestPath);
    for (const file of compilePartials(fs, test)) {
      files.push(file);
    }
  }
  writeGoldenPartial(files);
}

/**
 * Partially compile the source files specified by the given `test`.
 *
 * 部分编译给定的 `test` 指定的源文件。
 *
 * @param fs The mock file-system to use when compiling partials.
 *
 * 编译 partials 时要使用的模拟文件系统。
 *
 * @param test The information about the test being compiled.
 *
 * 有关正在编译的测试的信息。
 *
 */
function* compilePartials(fs: FileSystem, test: ComplianceTest): Generator<PartiallyCompiledFile> {
  const builtDirectory = getBuildOutputDirectory(fs);
  for (const generatedPath of compileTest(fs, test.inputFiles, test.compilerOptions, {
         compilationMode: 'partial',
         ...test.angularCompilerOptions
       }).emittedFiles) {
    yield {
      path: fs.relative(builtDirectory, generatedPath),
      content: fs.readFile(generatedPath),
    };
  }
}

/**
 * Write the partially compiled files to the appropriate output destination.
 *
 * 将部分编译的文件写入适当的输出目标。
 *
 * For now just push the concatenated partial files to standard out.
 *
 * 现在只需将连接的部分文件推送到标准输出。
 *
 * @param files The partially compiled files.
 *
 * 部分编译的文件。
 *
 */
function writeGoldenPartial(files: PartiallyCompiledFile[]): void {
  // tslint:disable-next-line: no-console
  console.log(renderGoldenPartial(files));
}
