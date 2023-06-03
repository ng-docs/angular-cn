/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {inject, Injectable, Renderer2, ɵRuntimeError as RuntimeError} from '@angular/core';

import {DOCUMENT} from '../../dom_tokens';
import {RuntimeErrorCode} from '../../errors';

import {DEFAULT_PRELOADED_IMAGES_LIMIT, PRELOADED_IMAGES} from './tokens';

/**
 * @description
 *
 * Contains the logic needed to track and add preload link tags to the `<head>` tag. It
 * will also track what images have already had preload link tags added so as to not duplicate link
 * tags.
 *
 * 包含跟踪预加载链接标签并将其添加到 `<head>` 标签所需的逻辑。 它还将跟踪哪些图像已经添加了预加载链接标签，以免重复链接标签。
 *
 * In dev mode this service will validate that the number of preloaded images does not exceed the
 * configured default preloaded images limit: {@link DEFAULT_PRELOADED_IMAGES_LIMIT}.
 *
 * 在开发模式下，此服务将验证预加载图像的数量是否不超过配置的默认预加载图像限制：{@link DEFAULT_PRELOADED_IMAGES_LIMIT}。
 *
 */
@Injectable({providedIn: 'root'})
export class PreloadLinkCreator {
  private readonly preloadedImages = inject(PRELOADED_IMAGES);
  private readonly document = inject(DOCUMENT);

  /**
   * @description
   *
   * Add a preload `<link>` to the `<head>` of the `index.html` that is served from the
   * server while using Angular Universal and SSR to kick off image loads for high priority images.
   *
   * 将预加载 `<link>` 添加到服务器提供的 `index.html` 的 `<head>` 中，同时使用 Angular Universal 和 SSR 启动高优先级图像的图像加载。
   *
   * The `sizes` \(passed in from the user\) and `srcset` \(parsed and formatted from `ngSrcset`\)
   * properties used to set the corresponding attributes, `imagesizes` and `imagesrcset`
   * respectively, on the preload `<link>` tag so that the correctly sized image is preloaded from
   * the CDN.
   *
   * `sizes` （从用户传入）和 `srcset` （从 `ngSrcset` 解析和格式化）属性分别用于在 preload `<link>` 标签上设置相应的属性 `imagesizes` 和 `imagesrcset` ，以便从 CDN 预加载正确大小的图像。
   *
   * {@link https://web.dev/preload-responsive-images/#imagesrcset-and-imagesizes}
   *
   * @param renderer The `Renderer2` passed in from the directive
   *
   * 从指令传入的 `Renderer2`
   *
   * @param src The original src of the image that is set on the `ngSrc` input.
   *
   * 在 `ngSrc` 输入上设置的图像的原始 src。
   *
   * @param srcset The parsed and formatted srcset created from the `ngSrcset` input
   *
   * 从 `ngSrcset` 输入创建的经过解析和格式化的 srcset
   *
   * @param sizes The value of the `sizes` attribute passed in to the `<img>` tag
   *
   * 传递给 `<img>` 标签的 `sizes` 属性的值
   *
   */
  createPreloadLinkTag(renderer: Renderer2, src: string, srcset?: string, sizes?: string): void {
    if (ngDevMode) {
      if (this.preloadedImages.size >= DEFAULT_PRELOADED_IMAGES_LIMIT) {
        throw new RuntimeError(
            RuntimeErrorCode.TOO_MANY_PRELOADED_IMAGES,
            ngDevMode &&
                `The \`NgOptimizedImage\` directive has detected that more than ` +
                    `${DEFAULT_PRELOADED_IMAGES_LIMIT} images were marked as priority. ` +
                    `This might negatively affect an overall performance of the page. ` +
                    `To fix this, remove the "priority" attribute from images with less priority.`);
      }
    }

    if (this.preloadedImages.has(src)) {
      return;
    }

    this.preloadedImages.add(src);

    const preload = renderer.createElement('link');
    renderer.setAttribute(preload, 'as', 'image');
    renderer.setAttribute(preload, 'href', src);
    renderer.setAttribute(preload, 'rel', 'preload');
    renderer.setAttribute(preload, 'fetchpriority', 'high');

    if (sizes) {
      renderer.setAttribute(preload, 'imageSizes', sizes);
    }

    if (srcset) {
      renderer.setAttribute(preload, 'imageSrcset', srcset);
    }

    renderer.appendChild(this.document.head, preload);
  }
}
