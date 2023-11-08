Template expression operators

模板表达式运算符

The Angular template expression language employs a subset of JavaScript syntax supplemented with a few special operators
for specific scenarios.

Angular 模板表达语言采用了 JavaScript 语法的子集，并为特定情况添加了一些特殊的运算符。

<a id="non-null-assertion-operator"></a>



The non-null assertion operator \(`!`\)

非空断言运算符（`!`）

When you use TypeScript's `--strictNullChecks` flag, you can prevent the type checker from throwing an error with Angular's non-null assertion operator, `!`.

使用 TypeScript 的 `--strictNullChecks` 标志时，可以防止类型检查器使用 Angular 的非空断言运算符 `!`。

The Angular non-null assertion operator causes the TypeScript type checker to suspend strict `null` and `undefined` checks for a specific property expression.

Angular 非空断言运算符使 TypeScript 类型检查器暂停对特定属性表达式的 `null` 和 `undefined` 的严格检查。

For example, you can assert that `item` properties are also defined.

比如，你可以断言 `item` 也是已定义的。

Often, you want to make sure that any property bindings aren't `null` or `undefined`.
However, there are situations in which such states are acceptable.
For those situations, you can use Angular's non-null assertion operator to prevent TypeScript from reporting that a property is `null` or `undefined`.

通常，你要确保任何属性绑定都不为 `null` 或 `undefined`。但是，在某些情况下，这种状态是可以接受的。对于这些情况，可以使用 Angular 的非空断言运算符来防止 TypeScript 报告某个属性为 `null` 或 `undefined`。

The non-null assertion operator, `!`, is optional unless you turn on strict null checks.

非空断言运算符 `!` 是可选的，除非你要启用严格的空检查。

For more information, see TypeScript's [strict null checking](http://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html "Strict null checking in TypeScript").

有关更多信息，请参见 TypeScript 的[严格空检查](http://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html "TypeScript 中严格的 null 检查")。

<a id="any-type-cast-function"></a>



The `$any()` type cast function

`$any()` 类型转换函数

Sometimes a binding expression triggers a type error during [AOT compilation](guide/aot-compiler) and it is not possible or difficult to fully specify the type.
To silence the error, you can use the `$any()` cast function to cast
the expression to the [`any` type](https://www.typescriptlang.org/docs/handbook/basic-types.html#any) as in the following example:

有时，绑定表达式会在 [AOT 编译](guide/aot-compiler)期间触发类型错误，并且不可能或很难完全指定类型。要使此错误静音，可以使用 `$any()` 强制转换函数把表达式强制转换为 [`any` 类型](https://www.typescriptlang.org/docs/handbook/basic-types.html#any)，如下例所示：

Using `$any()` prevents TypeScript from reporting that `bestByDate` is not a member of the `item` object.

使用 `$any()` 可以防止 TypeScript 报告 `bestByDate` 不是 `item` 对象成员的错误。

The `$any()` cast function also works with `this` to allow access to undeclared members of the component.

`$any()` 强制转换函数也可以与 `this` 一起使用，以允许访问组件的未声明成员。

The `$any()` cast function works anywhere in a binding expression where a method call is valid.

`$any()` 强制转换函数可在绑定表达式中任何进行方法调用的地方使用。

Also note that `$any()` only affects the typing. There is no method call in the generated code; the `$any()` function is entirely compiled away.

还要注意 `$any()` 只影响类型。生成的代码中没有此方法调用；`$any()` 函数完全被编译掉了。