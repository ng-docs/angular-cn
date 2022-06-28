/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {AbsoluteFsPath, ReadonlyFileSystem} from '../../../src/ngtsc/file_system';
import {ConsoleLogger, LogLevel} from '../../../src/ngtsc/logging';
import {SourceFileLoader} from '../../../src/ngtsc/sourcemaps';

/**
 * Check the source-mappings of the generated source file against mappings stored in the expected
 * source file.
 *
 * 根据存储在预期源文件中的映射检查生成的源文件的 source-mappings 。
 *
 * The source-mappings are encoded into the expected source file in the form of an end-of-line
 * comment that has the following syntax:
 *
 * source-mappings 以具有以下语法的行尾注释的形式编码到预期的源文件中：
 *
 * ```
 * <generated code> // SOURCE: "</path/to/original>" "<original source>"
 * ```
 *
 * The `path/to/original` path will be absolute within the mock file-system, where the root is the
 * directory containing the `TEST_CASES.json` file. The `generated code` and the `original source`
 * are not trimmed of whitespace - but there is a single space after the generated and a single
 * space before the original source.
 *
 * `path/to/original` 路径在模拟文件系统中将是绝对路径，其中的根是包含 `TEST_CASES.json`
 * 文件的目录。 `generated code` 和 `original source` 不会删除空格 -
 * 但生成的代码和原始源代码之前有一个空格。
 *
 * @param fs The test file-system where the source, generated and expected files are stored.
 *
 * 存储源文件、生成文件和预期文件的测试文件系统。
 *
 * @param generated The content of the generated source file.
 *
 * 生成的源文件的内容。
 *
 * @param generatedPath The absolute path, within the test file-system, of the generated source
 *     file.
 *
 * 生成的源文件在测试文件系统中的绝对路径。
 *
 * @param expectedSource The content of the expected source file, containing mapping information.
 *
 * 预期的源文件的内容，包含映射信息。
 *
 * @returns
 *
 * The content of the expected source file, stripped of the mapping information.
 *
 * 预期的源文件的内容，删除了映射信息。
 *
 */
export function checkMappings(
    fs: ReadonlyFileSystem, generated: string, generatedPath: AbsoluteFsPath,
    expectedSource: string, expectedPath: AbsoluteFsPath): string {
  const actualMappings = getMappedSegments(fs, generatedPath, generated);

  const {expected, mappings} = extractMappings(fs, expectedSource);

  const failures: string[] = [];
  for (const expectedMapping of mappings) {
    const failure = checkMapping(actualMappings, expectedMapping);
    if (failure !== null) {
      failures.push(failure);
    }
  }

  if (failures.length > 0) {
    throw new Error(
        `When checking mappings for ${generatedPath} against ${expectedPath} expected...\n\n` +
        `${failures.join('\n\n')}\n\n` +
        `All the mappings:\n\n${dumpMappings(actualMappings)}`);
  }

  return expected;
}

/**
 * A mapping of a segment of generated text to a segment of source text.
 *
 * 生成的文本段到源文本段的映射。
 *
 */
interface SegmentMapping {
  /**
   * The generated text in this segment.
   *
   * 此段中生成的文本。
   *
   */
  generated: string;
  /**
   * The source text in this segment.
   *
   * 此句段中的源文本。
   *
   */
  source: string;
  /**
   * The URL of the source file for this segment.
   *
   * 此段的源文件的 URL。
   *
   */
  sourceUrl: string;
}

/**
 * Extract the source-map information (encoded in comments - see `checkMappings()`) from the given
 * `expected` source content, returning both the `mappings` and the `expected` source code, stripped
 * of the source-mapping comments.
 *
 * 从给定的 `expected` 源内容中提取 source-map 信息（在注释中编码 - 请参阅 `checkMappings()`
 *），返回 `mappings` 和 `expected` 的源代码，去除源映射注释。
 *
 * @param expected The content of the expected file containing source-map information.
 *
 * 包含 source-map 信息的预期文件的内容。
 *
 */
function extractMappings(
    fs: ReadonlyFileSystem, expected: string): {expected: string, mappings: SegmentMapping[]} {
  const mappings: SegmentMapping[] = [];
  // capture and remove source mapping info
  // Any newline at the end of an expectation line is removed, as a mapping expectation for a
  // segment within a template literal would otherwise force a newline to be matched in the template
  // literal.
  expected = expected.replace(
      /^(.*?) \/\/ SOURCE: "([^"]*?)" "(.*?)"(?:\n|$)/gm,
      (_, rawGenerated: string, rawSourceUrl: string, rawSource: string) => {
        // Since segments need to appear on a single line in the expected file, any newlines in the
        // segment being checked must be escaped in the expected file and then unescaped here before
        // being checked.
        const generated = unescape(rawGenerated);
        const source = unescape(rawSource);
        const sourceUrl = fs.resolve(rawSourceUrl);

        mappings.push({generated, sourceUrl, source});
        return generated;
      });
  return {expected, mappings};
}

function unescape(str: string): string {
  const replacements: Record<any, string> = {'\\n': '\n', '\\r': '\r', '\\\\': '\\', '\\"': '\"'};
  return str.replace(/\\[rn"\\]/g, match => replacements[match]);
}

/**
 * Process a generated file to extract human understandable segment mappings.
 *
 * 处理生成的文件以提取人类可理解的段映射。
 *
 * These mappings are easier to compare in unit tests than the raw SourceMap mappings.
 *
 * 与原始 SourceMap 映射相比，这些映射在单元测试中更容易比较。
 *
 * @param fs the test file-system that holds the source and generated files.
 *
 * 包含源文件和生成文件的测试文件系统。
 *
 * @param generatedPath The path of the generated file to process.
 *
 * 要处理的生成文件的路径。
 *
 * @param generatedContents The contents of the generated file to process.
 *
 * 要处理的生成文件的内容。
 *
 * @returns
 *
 * An array of segment mappings for each mapped segment in the given generated file. An
 *     empty array is returned if there is no source-map file found.
 *
 * 给定生成文件中每个映射段的段映射数组。如果找不到 source-map 文件，则返回空数组。
 *
 */
function getMappedSegments(
    fs: ReadonlyFileSystem, generatedPath: AbsoluteFsPath,
    generatedContents: string): SegmentMapping[] {
  const logger = new ConsoleLogger(LogLevel.debug);
  const loader = new SourceFileLoader(fs, logger, {});
  const generatedFile = loader.loadSourceFile(generatedPath, generatedContents);
  if (generatedFile === null) {
    return [];
  }

  const segments: SegmentMapping[] = [];
  for (let i = 0; i < generatedFile.flattenedMappings.length - 1; i++) {
    const mapping = generatedFile.flattenedMappings[i];
    const generatedStart = mapping.generatedSegment;
    const generatedEnd = generatedFile.flattenedMappings[i + 1].generatedSegment;
    const originalFile = mapping.originalSource;
    const originalStart = mapping.originalSegment;
    let originalEnd = originalStart.next;
    // Skip until we find an end segment that is after the start segment
    while (originalEnd !== undefined && originalEnd.next !== originalEnd &&
           originalEnd.position === originalStart.position) {
      originalEnd = originalEnd.next;
    }
    if (originalEnd === undefined || originalEnd.next === originalEnd) {
      continue;
    }

    const segment = {
      generated: generatedFile.contents.substring(generatedStart.position, generatedEnd.position),
      source: originalFile.contents.substring(originalStart.position, originalEnd!.position),
      sourceUrl: originalFile.sourcePath
    };
    segments.push(segment);
  }

  return segments;
}

/**
 * Check that the `expected` segment appears in the collection of `mappings`.
 *
 * 检查 `expected` 的段是否出现在 `mappings` 集合中。
 *
 * @returns
 *
 * An error message if a matching segment cannot be found, or null if it can.
 *
 * 如果找不到匹配的段，则显示错误消息，如果可以，则为 null 。
 *
 */
function checkMapping(mappings: SegmentMapping[], expected: SegmentMapping): string|null {
  if (mappings.some(
          m => m.generated === expected.generated && m.source === expected.source &&
              m.sourceUrl === expected.sourceUrl)) {
    return null;
  }
  const matchingGenerated = mappings.filter(m => m.generated === expected.generated);
  const matchingSource = mappings.filter(m => m.source === expected.source);

  const message = [
    'Expected mappings to contain the following mapping',
    prettyPrintMapping(expected),
  ];
  if (matchingGenerated.length > 0) {
    message.push('');
    message.push('There are the following mappings that match the generated text:');
    matchingGenerated.forEach(m => message.push(prettyPrintMapping(m)));
  }
  if (matchingSource.length > 0) {
    message.push('');
    message.push('There are the following mappings that match the source text:');
    matchingSource.forEach(m => message.push(prettyPrintMapping(m)));
  }

  return message.join('\n');
}

function prettyPrintMapping(mapping: SegmentMapping): string {
  return [
    '{',
    `  generated: ${JSON.stringify(mapping.generated)}`,
    `  source   : ${JSON.stringify(mapping.source)}`,
    `  sourceUrl: ${JSON.stringify(mapping.sourceUrl)}`,
    '}',
  ].join('\n');
}

/**
 * Helper function for debugging failed mappings.
 * This lays out the segment mappings in the console to make it easier to compare.
 *
 * 用于调试失败的映射的帮助器函数。这会在控制台中列出段映射，以更轻松地进行比较。
 *
 */
function dumpMappings(mappings: SegmentMapping[]): string {
  return mappings
      .map(
          mapping => padValue(mapping.sourceUrl, 20, 0) + ' : ' +
              padValue(JSON.stringify(mapping.source), 100, 23) + ' : ' +
              JSON.stringify(mapping.generated))
      .join('\n');
}

function padValue(value: string, max: number, start: number): string {
  const padding = value.length > max ? ('\n' +
                                        ' '.repeat(max + start)) :
                                       ' '.repeat(max - value.length);
  return value + padding;
}
