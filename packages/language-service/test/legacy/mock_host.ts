/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {NgCompilerOptions} from '@angular/compiler-cli/src/ngtsc/core/api';
import {join} from 'path';
import * as ts from 'typescript/lib/tsserverlibrary';

import {isTypeScriptFile} from '../../src/utils';

const logger: ts.server.Logger = {
  close(): void{},
  hasLevel(level: ts.server.LogLevel): boolean {
    return false;
  },
  loggingEnabled(): boolean {
    return false;
  },
  perftrc(s: string): void{},
  info(s: string): void{},
  startGroup(): void{},
  endGroup(): void{},
  msg(s: string, type?: ts.server.Msg): void{},
  getLogFileName(): string |
      undefined {
        return;
      },
};

export const TEST_SRCDIR = process.env.TEST_SRCDIR!;
export const PROJECT_DIR =
    join(TEST_SRCDIR, 'angular', 'packages', 'language-service', 'test', 'legacy', 'project');
export const TSCONFIG = join(PROJECT_DIR, 'tsconfig.json');
export const APP_COMPONENT = join(PROJECT_DIR, 'app', 'app.component.ts');
export const APP_MAIN = join(PROJECT_DIR, 'app', 'main.ts');
export const PARSING_CASES = join(PROJECT_DIR, 'app', 'parsing-cases.ts');
export const TEST_TEMPLATE = join(PROJECT_DIR, 'app', 'test.ng');

const NOOP_FILE_WATCHER: ts.FileWatcher = {
  close() {}
};

class MockWatcher implements ts.FileWatcher {
  constructor(
      private readonly fileName: string,
      private readonly cb: ts.FileWatcherCallback,
      readonly close: () => void,
  ) {}

  changed() {
    this.cb(this.fileName, ts.FileWatcherEventKind.Changed);
  }

  deleted() {
    this.cb(this.fileName, ts.FileWatcherEventKind.Deleted);
  }
}

/**
 * A mock file system impacting configuration files.
 * Queries for all other files are deferred to the underlying filesystem.
 *
 * 影响配置文件的模拟文件系统。对所有其他文件的查询被延迟到底层文件系统。
 *
 */
export class MockConfigFileFs implements
    Pick<ts.server.ServerHost, 'readFile'|'fileExists'|'watchFile'> {
  private configOverwrites = new Map<string, string>();
  private configFileWatchers = new Map<string, MockWatcher>();

  overwriteConfigFile(configFile: string, contents: {angularCompilerOptions?: NgCompilerOptions}) {
    if (!configFile.endsWith('.json')) {
      throw new Error(`${configFile} is not a configuration file.`);
    }
    this.configOverwrites.set(configFile, JSON.stringify(contents));
    this.configFileWatchers.get(configFile)?.changed();
  }

  readFile(file: string, encoding?: string): string|undefined {
    const read = this.configOverwrites.get(file) ?? ts.sys.readFile(file, encoding);
    return read;
  }

  fileExists(file: string): boolean {
    return this.configOverwrites.has(file) || ts.sys.fileExists(file);
  }

  watchFile(path: string, callback: ts.FileWatcherCallback) {
    if (!path.endsWith('.json')) {
      // We only care about watching config files.
      return NOOP_FILE_WATCHER;
    }
    const watcher = new MockWatcher(path, callback, () => {
      this.configFileWatchers.delete(path);
    });
    this.configFileWatchers.set(path, watcher);
    return watcher;
  }

  clear() {
    for (const [fileName, watcher] of this.configFileWatchers) {
      this.configOverwrites.delete(fileName);
      watcher.changed();
    }
    this.configOverwrites.clear();
  }
}

function createHost(configFileFs: MockConfigFileFs): ts.server.ServerHost {
  return {
    ...ts.sys,
    fileExists(absPath: string): boolean {
      return configFileFs.fileExists(absPath);
    },
    readFile(absPath: string, encoding?: string): string |
        undefined {
          return configFileFs.readFile(absPath, encoding);
        },
    watchFile(path: string, callback: ts.FileWatcherCallback): ts.FileWatcher {
      return configFileFs.watchFile(path, callback);
    },
    watchDirectory(path: string, callback: ts.DirectoryWatcherCallback): ts.FileWatcher {
      return NOOP_FILE_WATCHER;
    },
    setTimeout() {
      throw new Error('setTimeout is not implemented');
    },
    clearTimeout() {
      throw new Error('clearTimeout is not implemented');
    },
    setImmediate() {
      throw new Error('setImmediate is not implemented');
    },
    clearImmediate() {
      throw new Error('clearImmediate is not implemented');
    },
  };
}


/**
 * Create a ConfiguredProject and an actual program for the test project located
 * in packages/language-service/test/legacy/project. Project creation exercises the
 * actual code path, but a mock host is used for the filesystem to intercept
 * and modify test files.
 *
 * 为位于 packages/language-service/test/legacy/project 中的测试项目创建一个 ConfiguredProject
 * 和一个实际程序。项目创建会练习实际的代码路径，但文件系统会使用模拟宿主来截获和修改测试文件。
 *
 */
export function setup() {
  const configFileFs = new MockConfigFileFs();
  const projectService = new ts.server.ProjectService({
    host: createHost(configFileFs),
    logger,
    cancellationToken: ts.server.nullCancellationToken,
    useSingleInferredProject: true,
    useInferredProjectPerProjectRoot: true,
    typingsInstaller: ts.server.nullTypingsInstaller,
    session: undefined
  });
  // Opening APP_COMPONENT forces a new ConfiguredProject to be created based
  // on the tsconfig.json in the test project.
  projectService.openClientFile(APP_COMPONENT);
  const project = projectService.findProject(TSCONFIG);
  if (!project) {
    throw new Error(`Failed to create project for ${TSCONFIG}`);
  }
  // The following operation forces a ts.Program to be created.
  const tsLS = project.getLanguageService();
  return {
    service: new MockService(project, projectService),
    project,
    tsLS,
    configFileFs,
  };
}

interface OverwriteResult {
  /**
   * Position of the cursor, -1 if there isn't one.
   *
   * 光标的位置，如果没有，则为 -1 。
   *
   */
  position: number;
  /**
   * Overwritten content without the cursor.
   *
   * 没有光标的覆盖内容。
   *
   */
  text: string;
}

export class MockService {
  private readonly overwritten = new Set<ts.server.NormalizedPath>();

  constructor(
      private readonly project: ts.server.Project,
      private readonly ps: ts.server.ProjectService,
  ) {}

  /**
   * Overwrite the entire content of `fileName` with `newText`. If cursor is
   * present in `newText`, it will be removed and the position of the cursor
   * will be returned.
   *
   * 使用 `newText` 覆盖 `fileName` 的全部内容。如果 `newText`
   * 中存在光标，它将被删除并返回光标的位置。
   *
   */
  overwrite(fileName: string, newText: string): OverwriteResult {
    const scriptInfo = this.getScriptInfo(fileName);
    return this.overwriteScriptInfo(scriptInfo, newText);
  }

  /**
   * Overwrite an inline template defined in `fileName` and return the entire
   * content of the source file (not just the template). If a cursor is present
   * in `newTemplate`, it will be removed and the position of the cursor in the
   * source file will be returned.
   *
   * 覆盖 `fileName` 中定义的内联模板，并返回源文件的全部内容（而不仅仅是模板）。如果 `newTemplate`
   * 中存在游标，它将被删除，并返回光标在源文件中的位置。
   *
   */
  overwriteInlineTemplate(fileName: string, newTemplate: string): OverwriteResult {
    const scriptInfo = this.getScriptInfo(fileName);
    const snapshot = scriptInfo.getSnapshot();
    const originalText = snapshot.getText(0, snapshot.getLength());
    const {position, text} =
        replaceOnce(originalText, /template: `([\s\S]+?)`/, `template: \`${newTemplate}\``);
    if (position === -1) {
      throw new Error(`${fileName} does not contain a component with template`);
    }
    return this.overwriteScriptInfo(scriptInfo, text);
  }

  reset(): void {
    if (this.overwritten.size === 0) {
      return;
    }
    for (const fileName of this.overwritten) {
      const scriptInfo = this.getScriptInfo(fileName);
      const reloaded = scriptInfo.reloadFromFile();
      if (!reloaded) {
        throw new Error(`Failed to reload ${scriptInfo.fileName}`);
      }
    }
    this.overwritten.clear();
    // updateGraph() will clear the internal dirty flag.
    this.project.updateGraph();
  }

  getScriptInfo(fileName: string): ts.server.ScriptInfo {
    const scriptInfo = this.ps.getScriptInfo(fileName);
    if (scriptInfo) {
      return scriptInfo;
    }
    // There is no script info for external template, so create one.
    // But we need to make sure it's not a TS file.
    if (isTypeScriptFile(fileName)) {
      throw new Error(`No existing script info for ${fileName}`);
    }
    const newScriptInfo = this.ps.getOrCreateScriptInfoForNormalizedPath(
        ts.server.toNormalizedPath(fileName),
        true,                   // openedByClient
        '',                     // fileContent
        ts.ScriptKind.Unknown,  // scriptKind
    );
    if (!newScriptInfo) {
      throw new Error(`Failed to create new script info for ${fileName}`);
    }
    newScriptInfo.attachToProject(this.project);
    return newScriptInfo;
  }

  /**
   * Remove the cursor from `newText`, then replace `scriptInfo` with the new
   * content and return the position of the cursor.
   *
   * 从 `newText` 中删除光标，然后将 `scriptInfo` 替换为新内容并返回光标的位置。
   *
   * @param scriptInfo
   * @param newText Text that possibly contains a cursor
   *
   * 可能包含光标的文本
   *
   */
  private overwriteScriptInfo(scriptInfo: ts.server.ScriptInfo, newText: string): OverwriteResult {
    const result = replaceOnce(newText, /¦/, '');
    const snapshot = scriptInfo.getSnapshot();
    scriptInfo.editContent(0, snapshot.getLength(), result.text);
    this.overwritten.add(scriptInfo.fileName);
    return result;
  }
}

/**
 * Replace at most one occurence that matches `regex` in the specified
 * `searchText` with the specified `replaceText`. Throw an error if there is
 * more than one occurrence.
 *
 * 使用指定的 `replaceText` `searchText` 与 `regex` 匹配的位置。如果出现多次，则抛出错误。
 *
 */
function replaceOnce(searchText: string, regex: RegExp, replaceText: string): OverwriteResult {
  regex = new RegExp(regex.source, regex.flags + 'g' /* global */);
  let position = -1;
  const text = searchText.replace(regex, (...args) => {
    if (position !== -1) {
      throw new Error(`${regex} matches more than one occurrence in text: ${searchText}`);
    }
    position = args[args.length - 2];  // second last argument is always the index
    return replaceText;
  });
  return {position, text};
}
