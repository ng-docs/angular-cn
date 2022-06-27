/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {MappingItem, RawSourceMap, SourceMapConsumer} from 'source-map';

import {NgtscTestEnvironment} from './env';

class TestSourceFile {
  private lineStarts: number[];

  constructor(public url: string, public contents: string) {
    this.lineStarts = this.getLineStarts();
  }

  getSegment(key: 'generated'|'original', start: MappingItem|any, end: MappingItem|any): string {
    const startLine = start[key + 'Line'];
    const startCol = start[key + 'Column'];
    const endLine = end[key + 'Line'];
    const endCol = end[key + 'Column'];
    return this.contents.substring(
        this.lineStarts[startLine - 1] + startCol, this.lineStarts[endLine - 1] + endCol);
  }

  getSourceMapFileName(generatedContents: string): string {
    const match = /\/\/# sourceMappingURL=(.+)/.exec(generatedContents);
    if (!match) {
      throw new Error('Generated contents does not contain a sourceMappingURL');
    }
    return match[1];
  }

  private getLineStarts(): number[] {
    const lineStarts = [0];
    let currentPos = 0;
    const lines = this.contents.split('\n');
    lines.forEach(line => {
      currentPos += line.length + 1;
      lineStarts.push(currentPos);
    });
    return lineStarts;
  }
}

/**
 * A mapping of a segment of generated text to a segment of source text.
 *
 * 生成的文本段到源文本段的映射。
 *
 */
export interface SegmentMapping {
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
 * Process a generated file to extract human understandable segment mappings.
 * These mappings are easier to compare in unit tests that the raw SourceMap mappings.
 *
 * 处理生成的文件以提取人类可理解的段映射。与原始 SourceMap
 * 映射相比，这些映射在单元测试中更容易比较。
 *
 * @param env the environment that holds the source and generated files.
 *
 * 包含源文件和生成文件的环境。
 *
 * @param generatedFileName The name of the generated file to process.
 *
 * 要处理的生成文件的名称。
 *
 * @returns
 *
 * An array of segment mappings for each mapped segment in the given generated file.
 *
 * 给定生成文件中每个映射段的段映射数组。
 *
 */
export function getMappedSegments(
    env: NgtscTestEnvironment, generatedFileName: string): SegmentMapping[] {
  const generated = new TestSourceFile(generatedFileName, env.getContents(generatedFileName));
  const sourceMapFileName = generated.getSourceMapFileName(generated.contents);

  const sources = new Map<string, TestSourceFile>();
  const mappings: MappingItem[] = [];

  const mapContents = env.getContents(sourceMapFileName);
  const sourceMapConsumer = new SourceMapConsumer(JSON.parse(mapContents) as RawSourceMap);
  sourceMapConsumer.eachMapping(item => {
    if (!sources.has(item.source)) {
      sources.set(item.source, new TestSourceFile(item.source, env.getContents(item.source)));
    }
    mappings.push(item);
  });

  const segments: SegmentMapping[] = [];
  let currentMapping = mappings.shift();
  while (currentMapping) {
    const nextMapping = mappings.shift();
    if (nextMapping) {
      const source = sources.get(currentMapping.source)!;
      const segment = {
        generated: generated.getSegment('generated', currentMapping, nextMapping),
        source: source.getSegment('original', currentMapping, nextMapping),
        sourceUrl: source.url
      };
      if (segment.generated !== segment.source) {
        segments.push(segment);
      }
    }
    currentMapping = nextMapping;
  }

  return segments;
}
