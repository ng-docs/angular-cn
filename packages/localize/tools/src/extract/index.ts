/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {AbsoluteFsPath, FileSystem, Logger, PathManipulation} from '@angular/compiler-cli/private/localize';
import {ɵParsedMessage} from '@angular/localize';

import {DiagnosticHandlingStrategy, Diagnostics} from '../diagnostics';

import {checkDuplicateMessages} from './duplicates';
import {MessageExtractor} from './extraction';
import {ArbTranslationSerializer} from './translation_files/arb_translation_serializer';
import {FormatOptions} from './translation_files/format_options';
import {SimpleJsonTranslationSerializer} from './translation_files/json_translation_serializer';
import {LegacyMessageIdMigrationSerializer} from './translation_files/legacy_message_id_migration_serializer';
import {TranslationSerializer} from './translation_files/translation_serializer';
import {Xliff1TranslationSerializer} from './translation_files/xliff1_translation_serializer';
import {Xliff2TranslationSerializer} from './translation_files/xliff2_translation_serializer';
import {XmbTranslationSerializer} from './translation_files/xmb_translation_serializer';


export interface ExtractTranslationsOptions {
  /**
   * The locale of the source being processed.
   *
   * 正在处理的源的区域设置。
   *
   */
  sourceLocale: string;
  /**
   * The base path for other paths provided in these options.
   * This should either be absolute or relative to the current working directory.
   *
   * 这些选项中提供的其他路径的基本路径。这应该是绝对的或相对于当前工作目录。
   *
   */
  rootPath: string;
  /**
   * An array of paths to files to search for translations. These should be relative to the
   * rootPath.
   *
   * 要搜索翻译的文件路径数组。这些应该是相对于 rootPath 的。
   *
   */
  sourceFilePaths: string[];
  /**
   * The format of the translation file.
   *
   * 翻译文件的格式。
   *
   */
  format: string;
  /**
   * A path to where the translation file will be written. This should be relative to the rootPath.
   *
   * 将写入翻译文件的路径。这应该是相对于 rootPath 的。
   *
   */
  outputPath: string;
  /**
   * The logger to use for diagnostic messages.
   *
   * 用于诊断消息的记录器。
   *
   */
  logger: Logger;
  /**
   * Whether to generate source information in the output files by following source-map mappings
   * found in the source file.
   *
   * 是否通过遵循源文件中找到的 source-map 映射在输出文件中生成源信息。
   *
   */
  useSourceMaps: boolean;
  /**
   * Whether to use the legacy id format for messages that were extracted from Angular templates
   *
   * 是否对从 Angular 模板提取的消息使用旧版 id 格式
   *
   */
  useLegacyIds: boolean;
  /**
   * How to handle messages with the same id but not the same text.
   *
   * 如何处理具有相同 id 但文本不同的消息。
   *
   */
  duplicateMessageHandling: DiagnosticHandlingStrategy;
  /**
   * A collection of formatting options to pass to the translation file serializer.
   *
   * 要传递给翻译文件序列化器的格式选项的集合。
   *
   */
  formatOptions?: FormatOptions;
  /**
   * The file-system abstraction to use.
   *
   * 要使用的文件系统抽象。
   *
   */
  fileSystem: FileSystem;
}

export function extractTranslations({
  rootPath,
  sourceFilePaths,
  sourceLocale,
  format,
  outputPath: output,
  logger,
  useSourceMaps,
  useLegacyIds,
  duplicateMessageHandling,
  formatOptions = {},
  fileSystem: fs,
}: ExtractTranslationsOptions) {
  const basePath = fs.resolve(rootPath);
  const extractor = new MessageExtractor(fs, logger, {basePath, useSourceMaps});

  const messages: ɵParsedMessage[] = [];
  for (const file of sourceFilePaths) {
    messages.push(...extractor.extractMessages(file));
  }

  const diagnostics = checkDuplicateMessages(fs, messages, duplicateMessageHandling, basePath);
  if (diagnostics.hasErrors) {
    throw new Error(diagnostics.formatDiagnostics('Failed to extract messages'));
  }

  const outputPath = fs.resolve(rootPath, output);
  const serializer = getSerializer(
      format, sourceLocale, fs.dirname(outputPath), useLegacyIds, formatOptions, fs, diagnostics);
  const translationFile = serializer.serialize(messages);
  fs.ensureDir(fs.dirname(outputPath));
  fs.writeFile(outputPath, translationFile);

  if (diagnostics.messages.length) {
    logger.warn(diagnostics.formatDiagnostics('Messages extracted with warnings'));
  }
}

function getSerializer(
    format: string, sourceLocale: string, rootPath: AbsoluteFsPath, useLegacyIds: boolean,
    formatOptions: FormatOptions = {}, fs: PathManipulation,
    diagnostics: Diagnostics): TranslationSerializer {
  switch (format) {
    case 'xlf':
    case 'xlif':
    case 'xliff':
      return new Xliff1TranslationSerializer(
          sourceLocale, rootPath, useLegacyIds, formatOptions, fs);
    case 'xlf2':
    case 'xlif2':
    case 'xliff2':
      return new Xliff2TranslationSerializer(
          sourceLocale, rootPath, useLegacyIds, formatOptions, fs);
    case 'xmb':
      return new XmbTranslationSerializer(rootPath, useLegacyIds, fs);
    case 'json':
      return new SimpleJsonTranslationSerializer(sourceLocale);
    case 'arb':
      return new ArbTranslationSerializer(sourceLocale, rootPath, fs);
    case 'legacy-migrate':
      return new LegacyMessageIdMigrationSerializer(diagnostics);
  }
  throw new Error(`No translation serializer can handle the provided format: ${format}`);
}
