Current implementation of inject.

注入的当前实现。

By default, it is `injectInjectorOnly`, which makes it `Injector`-only aware. It can be changed
to `directiveInject`, which brings in the `NodeInjector` system of ivy. It is designed this
way for two reasons:

默认情况下，它是 `injectInjectorOnly`，这使得它可以感知 `Injector`。它可以更改为
`directiveInject`，它会引入 ivy 的 `NodeInjector` 系统。它是这样设计的，有两个原因：

`Injector` should not depend on ivy logic.

`Injector` 不应该依赖于 ivy 逻辑。

To maintain tree shake-ability we don't want to bring in unnecessary code.

为了保持树的抖动能力，我们不想引入不必要的代码。

Sets the current inject implementation.

设置当前的注入实现。

Injects `root` tokens in limp mode.

以 limp 模式注入 `root` 标记。

If no injector exists, we can still inject tree-shakable providers which have `providedIn` set to
`"root"`. This is known as the limp mode injection. In such case the value is stored in the
injectable definition.

如果不存在注入器，我们仍然可以注入 providerIn `providedIn` 为 `"root"` 的可 tree-shakable
提供程序。这被称为跛行模式注入。在这种情况下，该值存储在可注入定义中。

Function which it should not equal to

它不应该等于的函数

Assert that `_injectImplementation` is not `fn`.

断言 `_injectImplementation` 不是 `fn`。

This is useful, to prevent infinite recursion.

这对防止无限递归很有用。