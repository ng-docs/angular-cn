/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {createImageLoader, ImageLoaderConfig, ImageLoaderInfo} from './image_loader';

/**
 * Name and URL tester for ImageKit.
 *
 * ImageKit 的名称和 URL 测试器。
 *
 */
export const imageKitLoaderInfo: ImageLoaderInfo = {
  name: 'ImageKit',
  testUrl: isImageKitUrl,
};

const IMAGE_KIT_LOADER_REGEX = /https?\:\/\/[^\/]+\.imagekit\.io\/.+/;
/**
 * Tests whether a URL is from ImageKit CDN.
 *
 * 测试 URL 是否来自 ImageKit CDN。
 *
 */
function isImageKitUrl(url: string): boolean {
  return IMAGE_KIT_LOADER_REGEX.test(url);
}

/**
 * Function that generates an ImageLoader for ImageKit and turns it into an Angular provider.
 *
 * 为 ImageKit 生成 ImageLoader 并将其转换为 Angular 提供程序的函数。
 *
 * @param path Base URL of your ImageKit images
 * This URL should match one of the following formats:
 * https://ik.imagekit.io/myaccount
 * https://subdomain.mysite.com
 *
 * ImageKit 图像的基本 URL 此 URL 应匹配以下格式之一：https://ik.imagekit.io/myaccount https://subdomain.mysite.com
 *
 * @returns
 *
 * Set of providers to configure the ImageKit loader.
 *
 * 一组用于配置 ImageKit 加载器的提供程序。
 *
 * @publicApi
 */
export const provideImageKitLoader = createImageLoader(
    createImagekitUrl,
    ngDevMode ? ['https://ik.imagekit.io/mysite', 'https://subdomain.mysite.com'] : undefined);

export function createImagekitUrl(path: string, config: ImageLoaderConfig): string {
  // Example of an ImageKit image URL:
  // https://ik.imagekit.io/demo/tr:w-300,h-300/medium_cafe_B1iTdD0C.jpg
  const {src, width} = config;
  let urlSegments: string[];

  if (width) {
    const params = `tr:w-${width}`;
    urlSegments = [path, params, src];
  } else {
    urlSegments = [path, src];
  }

  return urlSegments.join('/');
}
