/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {MeasureValues} from './measure_values';

/**
 * A Validator calculates a valid sample out of the complete sample.
 * A valid sample is a sample that represents the population that should be observed
 * in the correct way.
 *
 * Validator 会从完整样本中计算出有效样本。有效样本是代表应该以正确方式观察的总体的样本。
 *
 */
export abstract class Validator {
  /**
   * Calculates a valid sample out of the complete sample
   *
   * 从完整样本中计算有效样本
   *
   */
  validate(completeSample: MeasureValues[]): MeasureValues[]|null {
    throw new Error('NYI');
  }

  /**
   * Returns a Map that describes the properties of the validator
   * (e.g. sample size, ...)
   *
   * 返回描述验证器属性（例如样本大小，……）的 Map
   *
   */
  describe(): {[key: string]: any} {
    throw new Error('NYI');
  }
}
