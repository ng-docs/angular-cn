/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Resolves and loads resource files that are referenced in Angular metadata.
 *
 * 解析并加载 Angular 元数据中引用的资源文件。
 *
 * Note that `preload()` and `load()` take a `resolvedUrl`, which can be found
 * by calling `resolve()`. These two steps are separated because sometimes the
 * resolved URL to the resource is needed as well as its contents.
 *
 * 请注意， `preload()` 和 `load()` 接受一个 `resolvedUrl` ，可以通过调用 `resolve()`
 * 来找到它。这两个步骤是分开的，因为有时需要资源的解析 URL 及其内容。
 *
 */
export interface ResourceLoader {
  /**
   * True if this resource loader can preload resources.
   *
   * 如果此资源加载器可以预加载资源，则为 True。
   *
   * Sometimes a `ResourceLoader` is not able to do asynchronous pre-loading of resources.
   *
   * 有时 `ResourceLoader` 无法对资源进行异步预加载。
   *
   */
  canPreload: boolean;

  /**
   * If true, the resource loader is able to preprocess inline resources.
   *
   * 如果为 true，则资源加载器能够预处理内联资源。
   *
   */
  canPreprocess: boolean;

  /**
   * Resolve the url of a resource relative to the file that contains the reference to it.
   * The return value of this method can be used in the `load()` and `preload()` methods.
   *
   * 解析资源相对于包含对它的引用的文件的 url。此方法的返回值可在 `load()` 和 `preload()`
   * 方法中使用。
   *
   * @param url The, possibly relative, url of the resource.
   *
   * 资源的可能是相对的 url。
   *
   * @param fromFile The path to the file that contains the URL of the resource.
   *
   * 包含资源 URL 的文件的路径。
   *
   * @returns
   *
   * A resolved url of resource.
   *
   * 资源的解析 url。
   *
   * @throws An error if the resource cannot be resolved.
   *
   * 如果无法解析资源，则会出现错误。
   *
   */
  resolve(file: string, basePath: string): string;

  /**
   * Preload the specified resource, asynchronously. Once the resource is loaded, its value
   * should be cached so it can be accessed synchronously via the `load()` method.
   *
   * 异步预加载指定的资源。加载资源后，应该缓存其值，以便可以通过 `load()` 方法同步访问它。
   *
   * @param resolvedUrl The url (resolved by a call to `resolve()`) of the resource to preload.
   *
   * 要预加载的资源的 url（通过调用 `resolve()` 来解析）。
   *
   * @param context Information regarding the resource such as the type and containing file.
   *
   * 有关资源的信息，例如类型和包含文件。
   *
   * @returns
   *
   * A Promise that is resolved once the resource has been loaded or `undefined`
   * if the file has already been loaded.
   *
   * 加载资源后解析的 Promise ，如果已加载文件，则为 `undefined` 。
   *
   * @throws An Error if pre-loading is not available.
   *
   * 如果预加载不可用，则会出现错误。
   *
   */
  preload(resolvedUrl: string, context: ResourceLoaderContext): Promise<void>|undefined;

  /**
   * Preprocess the content data of an inline resource, asynchronously.
   *
   * 异步预处理内联资源的内容数据。
   *
   * @param data The existing content data from the inline resource.
   *
   * 内联资源中的现有内容数据。
   *
   * @param context Information regarding the resource such as the type and containing file.
   *
   * 有关资源的信息，例如类型和包含文件。
   *
   * @returns
   *
   * A Promise that resolves to the processed data. If no processing occurs, the
   * same data string that was passed to the function will be resolved.
   *
   * 解析为已处理数据的 Promise。如果不发生处理，则将解析传递给函数的同一个数据字符串。
   *
   */
  preprocessInline(data: string, context: ResourceLoaderContext): Promise<string>;

  /**
   * Load the resource at the given url, synchronously.
   *
   * 同步加载给定 url 的资源。
   *
   * The contents of the resource may have been cached by a previous call to `preload()`.
   *
   * 资源的内容可能已通过先前对 `preload()` 的调用而被缓存。
   *
   * @param resolvedUrl The url (resolved by a call to `resolve()`) of the resource to load.
   *
   * 要加载的资源的 url（通过调用 `resolve()` 来解析）。
   *
   * @returns
   *
   * The contents of the resource.
   *
   * 资源的内容。
   *
   */
  load(resolvedUrl: string): string;
}

/**
 * Contextual information used by members of the ResourceLoader interface.
 *
 * ResourceLoader 接口成员使用的上下文信息。
 *
 */
export interface ResourceLoaderContext {
  /**
   * The type of the component resource.
   *
   * 组件资源的类型。
   *
   * * Resources referenced via a component's `styles` or `styleUrls` properties are of
   *   type `style`.
   *
   *   通过组件的 `styles` 或 `styleUrls` 属性引用的资源是 `style` 类型。
   *
   * * Resources referenced via a component's `template` or `templateUrl` properties are of type
   *   `template`.
   *
   *   通过组件的 `template` 或 `templateUrl` 属性引用的资源是 `template` 类型。
   *
   */
  type: 'style'|'template';

  /**
   * The absolute path to the file that contains the resource or reference to the resource.
   *
   * 包含资源或对资源引用的文件的绝对路径。
   *
   */
  containingFile: string;
}
