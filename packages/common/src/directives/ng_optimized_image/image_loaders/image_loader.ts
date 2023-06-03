/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {InjectionToken, Provider, ɵRuntimeError as RuntimeError} from '@angular/core';

import {RuntimeErrorCode} from '../../../errors';
import {isAbsoluteUrl, isValidPath, normalizePath, normalizeSrc} from '../url';

/**
 * Config options recognized by the image loader function.
 *
 * 图像加载器功能识别的配置选项。
 *
 * @see `ImageLoader`
 * @see `NgOptimizedImage`
 * @publicApi
 */
export interface ImageLoaderConfig {
  /**
   * Image file name to be added to the image request URL.
   *
   * 要添加到图像请求 URL 的图像文件名。
   *
   */
  src: string;
  /**
   * Width of the requested image \(to be used when generating srcset\).
   *
   * 请求图像的宽度（生成 srcset 时使用）。
   *
   */
  width?: number;
  /**
   * Additional user-provided parameters for use by the ImageLoader.
   *
   * 供 ImageLoader 使用的其他用户提供的参数。
   *
   */
  loaderParams?: {[key: string]: any;};
}

/**
 * Represents an image loader function. Image loader functions are used by the
 * NgOptimizedImage directive to produce full image URL based on the image name and its width.
 *
 * 表示图像加载器函数。 NgOptimizedImage 指令使用图像加载器函数根据图像名称及其宽度生成完整的图像 URL。
 *
 * @publicApi
 */
export type ImageLoader = (config: ImageLoaderConfig) => string;

/**
 * Noop image loader that does no transformation to the original src and just returns it as is.
 * This loader is used as a default one if more specific logic is not provided in an app config.
 *
 * Noop 图像加载器，不对原始 src 进行转换，只是按原样返回。 如果应用程序配置中未提供更具体的逻辑，则此加载器将用作默认加载器。
 *
 * @see `ImageLoader`
 * @see `NgOptimizedImage`
 */
export const noopImageLoader = (config: ImageLoaderConfig) => config.src;

/**
 * Metadata about the image loader.
 *
 * 关于图像加载器的元数据。
 *
 */
export type ImageLoaderInfo = {
  name: string,
  testUrl: (url: string) => boolean
};

/**
 * Injection token that configures the image loader function.
 *
 * 配置图像加载器功能的注入令牌。
 *
 * @see `ImageLoader`
 * @see `NgOptimizedImage`
 * @publicApi
 */
export const IMAGE_LOADER = new InjectionToken<ImageLoader>('ImageLoader', {
  providedIn: 'root',
  factory: () => noopImageLoader,
});

/**
 * Internal helper function that makes it easier to introduce custom image loaders for the
 * `NgOptimizedImage` directive. It is enough to specify a URL builder function to obtain full DI
 * configuration for a given loader: a DI token corresponding to the actual loader function, plus DI
 * tokens managing preconnect check functionality.
 *
 * 内部辅助函数，可以更轻松地为 `NgOptimizedImage` 指令引入自定义图像加载器。 指定一个 URL 构建器函数就足以为给定的加载器获取完整的 DI 配置：一个对应于实际加载器函数的 DI 令牌，加上管理预连接检查功能的 DI 令牌。
 *
 * @param buildUrlFn a function returning a full URL based on loader's configuration
 *
 * 一个基于加载器配置返回完整 URL 的函数
 *
 * @param exampleUrls example of full URLs for a given loader \(used in error messages\)
 *
 * 给定加载程序的完整 URL 示例（在错误消息中使用）
 *
 * @returns
 *
 * a set of DI providers corresponding to the configured image loader
 *
 * 一组与配置的图像加载器对应的 DI 提供程序
 *
 */
export function createImageLoader(
    buildUrlFn: (path: string, config: ImageLoaderConfig) => string, exampleUrls?: string[]) {
  return function provideImageLoader(path: string) {
    if (!isValidPath(path)) {
      throwInvalidPathError(path, exampleUrls || []);
    }

    // The trailing / is stripped (if provided) to make URL construction (concatenation) easier in
    // the individual loader functions.
    path = normalizePath(path);

    const loaderFn = (config: ImageLoaderConfig) => {
      if (isAbsoluteUrl(config.src)) {
        // Image loader functions expect an image file name (e.g. `my-image.png`)
        // or a relative path + a file name (e.g. `/a/b/c/my-image.png`) as an input,
        // so the final absolute URL can be constructed.
        // When an absolute URL is provided instead - the loader can not
        // build a final URL, thus the error is thrown to indicate that.
        throwUnexpectedAbsoluteUrlError(path, config.src);
      }

      return buildUrlFn(path, {...config, src: normalizeSrc(config.src)});
    };

    const providers: Provider[] = [{provide: IMAGE_LOADER, useValue: loaderFn}];
    return providers;
  };
}

function throwInvalidPathError(path: unknown, exampleUrls: string[]): never {
  throw new RuntimeError(
      RuntimeErrorCode.INVALID_LOADER_ARGUMENTS,
      ngDevMode &&
          `Image loader has detected an invalid path (\`${path}\`). ` +
              `To fix this, supply a path using one of the following formats: ${
                  exampleUrls.join(' or ')}`);
}

function throwUnexpectedAbsoluteUrlError(path: string, url: string): never {
  throw new RuntimeError(
      RuntimeErrorCode.INVALID_LOADER_ARGUMENTS,
      ngDevMode &&
          `Image loader has detected a \`<img>\` tag with an invalid \`ngSrc\` attribute: ${
              url}. ` +
              `This image loader expects \`ngSrc\` to be a relative URL - ` +
              `however the provided value is an absolute URL. ` +
              `To fix this, provide \`ngSrc\` as a path relative to the base URL ` +
              `configured for this loader (\`${path}\`).`);
}
