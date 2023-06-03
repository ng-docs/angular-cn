/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {createImageLoader, ImageLoaderConfig, ImageLoaderInfo} from './image_loader';

/**
 * Name and URL tester for Imgix.
 *
 * Imgix 的名称和 URL 测试器。
 *
 */
export const imgixLoaderInfo: ImageLoaderInfo = {
  name: 'Imgix',
  testUrl: isImgixUrl
};

const IMGIX_LOADER_REGEX = /https?\:\/\/[^\/]+\.imgix\.net\/.+/;
/**
 * Tests whether a URL is from Imgix CDN.
 *
 * 测试 URL 是否来自 Imgix CDN。
 *
 */
function isImgixUrl(url: string): boolean {
  return IMGIX_LOADER_REGEX.test(url);
}

/**
 * Function that generates an ImageLoader for Imgix and turns it into an Angular provider.
 *
 * 为 Imgix 生成 ImageLoader 并将其转换为 Angular 提供程序的函数。
 *
 * @param path path to the desired Imgix origin,
 * e.g. https://somepath.imgix.net or https://images.mysite.com
 *
 * 所需 Imgix 来源的路径，例如 https://somepath.imgix.net 或 https://images.mysite.com
 *
 * @returns
 *
 * Set of providers to configure the Imgix loader.
 *
 * 一组用于配置 Imgix 加载器的提供程序。
 *
 * @publicApi
 */
export const provideImgixLoader =
    createImageLoader(createImgixUrl, ngDevMode ? ['https://somepath.imgix.net/'] : undefined);

function createImgixUrl(path: string, config: ImageLoaderConfig) {
  const url = new URL(`${path}/${config.src}`);
  // This setting ensures the smallest allowable format is set.
  url.searchParams.set('auto', 'format');
  if (config.width) {
    url.searchParams.set('w', config.width.toString());
  }
  return url.href;
}
