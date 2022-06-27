/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {NodeJSFileSystem} from '../../../src/ngtsc/file_system';
import {ConsoleLogger, LogLevel} from '../../../src/ngtsc/logging';
import {LinkerOptions} from '../../src/file_linker/linker_options';

import {ConfigAPI, PluginObj} from './babel_core';
import {createEs2015LinkerPlugin} from './es2015_linker_plugin';

/**
 * This is the Babel plugin definition that is provided as a default export from the package, such
 * that the plugin can be used using the module specifier of the package. This is the recommended
 * way of integrating the Angular Linker into a build pipeline other than the Angular CLI.
 *
 * 这是 Babel 插件定义，作为包的默认导出提供，因此可以用包的模块说明符来使用插件。这是将 Angular
 * 链接器集成到 Angular CLI 之外的构建管道中的推荐方式。
 *
 * When the module specifier `@angular/compiler-cli/linker/babel` is used as a plugin in a Babel
 * configuration, Babel invokes this function (by means of the default export) to create the plugin
 * instance according to the provided options.
 *
 * 当模块说明符 `@angular/compiler-cli/linker/babel` 用作 Babel 配置中的插件时，Babel
 * 会调用此函数（通过默认导出）根据提供的选项创建插件实例。
 *
 * The linker plugin that is created uses the native NodeJS filesystem APIs to interact with the
 * filesystem. Any logging output is printed to the console.
 *
 * 创建的链接器插件使用本机 NodeJS 文件系统 API 与文件系统交互。任何日志输出都会打印到控制台。
 *
 * @param api Provides access to the Babel environment that is configuring this plugin.
 *
 * 提供对正在配置此插件的 Babel 环境的访问。
 *
 * @param options The plugin options that have been configured.
 *
 * 已配置的插件选项。
 *
 */
export function defaultLinkerPlugin(api: ConfigAPI, options: Partial<LinkerOptions>): PluginObj {
  api.assertVersion(7);

  return createEs2015LinkerPlugin({
    ...options,
    fileSystem: new NodeJSFileSystem(),
    logger: new ConsoleLogger(LogLevel.info),
  });
}
