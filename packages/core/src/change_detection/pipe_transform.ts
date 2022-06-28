/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * An interface that is implemented by pipes in order to perform a transformation.
 * Angular invokes the `transform` method with the value of a binding
 * as the first argument, and any parameters as the second argument in list form.
 *
 * 一个需要由管道实现的接口，用于执行转换操作。
 * Angular 会调用它的 `transform`
 * 方法，并把要绑定的值作为第一个参数传入，其它参数会依次从第二个参数的位置开始传入。
 *
 * @usageNotes
 *
 * In the following example, `TruncatePipe` returns the shortened value with an added ellipses.
 *
 * 在以下示例中，`TruncatePipe` 会返回添加了省略号的缩短值。
 *
 * <code-example path="core/ts/pipes/simple_truncate.ts" header="simple_truncate.ts"></code-example>
 *
 * Invoking `{{ 'It was the best of times' | truncate }}` in a template will produce `It was...`.
 *
 * 调用 `{{ 'It was the best of times' | truncate }}` 模板中的 `{{ 'It was the best of times' |
 * truncate }}` 将生成 `It was...` 。
 *
 * In the following example, `TruncatePipe` takes parameters that sets the truncated length and the
 * string to append with.
 *
 * 在以下示例中，`TruncatePipe` 接受设置截断长度的参数和要附加的字符串。
 *
 * <code-example path="core/ts/pipes/truncate.ts" header="truncate.ts"></code-example>
 *
 * Invoking `{{ 'It was the best of times' | truncate:4:'....' }}` in a template will produce `It
 * was the best....`.
 *
 * 在模板中调用 `{{ 'ok' | repeat:3 }}` 的结果是 `okokok`。
 *
 * @publicApi
 */
export interface PipeTransform {
  transform(value: any, ...args: any[]): any;
}
