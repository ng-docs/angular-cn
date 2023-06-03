/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {createImageLoader, ImageLoaderConfig} from './image_loader';

/**
 * Function that generates an ImageLoader for [Cloudflare Image
 * Resizing](https://developers.cloudflare.com/images/image-resizing/) and turns it into an Angular
 * provider. Note: Cloudflare has multiple image products - this provider is specifically for
 * Cloudflare Image Resizing; it will not work with Cloudflare Images or Cloudflare Polish.
 *
 * 为[Cloudflare Image Resizing](https://developers.cloudflare.com/images/image-resizing/)生成 ImageLoader 并将其转换为 Angular 提供程序的函数。 注意：Cloudflare 有多种图像产品——该提供商专门针对 Cloudflare Image Resizing； 它不适用于 Cloudflare Images 或 Cloudflare Polish。
 *
 * @param path Your domain name, e.g. https://mysite.com
 *
 * 你的域名，例如 https://mysite.com
 *
 * @returns
 *
 * Provider that provides an ImageLoader function
 *
 * 提供 ImageLoader 功能的提供程序
 *
 * @publicApi
 */
export const provideCloudflareLoader = createImageLoader(
    createCloudflareUrl,
    ngDevMode ? ['https://<ZONE>/cdn-cgi/image/<OPTIONS>/<SOURCE-IMAGE>'] : undefined);

function createCloudflareUrl(path: string, config: ImageLoaderConfig) {
  let params = `format=auto`;
  if (config.width) {
    params += `,width=${config.width}`;
  }
  // Cloudflare image URLs format:
  // https://developers.cloudflare.com/images/image-resizing/url-format/
  return `${path}/cdn-cgi/image/${params}/${config.src}`;
}
