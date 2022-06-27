/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */


/**
 * A metric is measures values
 *
 * 度量是度量值
 *
 */
export abstract class Metric {
  /**
   * Starts measuring
   *
   * 开始测量
   *
   */
  beginMeasure(): Promise<any> {
    throw new Error('NYI');
  }

  /**
   * Ends measuring and reports the data
   * since the begin call.
   *
   * 结束测量并报告自 begin 调用以来的数据。
   *
   * @param restart: Whether to restart right after this.
   */
  endMeasure(restart: boolean): Promise<{[key: string]: any}> {
    throw new Error('NYI');
  }

  /**
   * Describes the metrics provided by this metric implementation.
   * (e.g. units, ...)
   *
   * 描述此度量实现提供的度量。 （例如单位，……）
   *
   */
  describe(): {[key: string]: string} {
    throw new Error('NYI');
  }
}
