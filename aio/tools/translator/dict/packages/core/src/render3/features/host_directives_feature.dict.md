Values that can be used to define a host directive through the `HostDirectivesFeature`.

可用于通过 `HostDirectivesFeature` 定义宿主指令的值。

This feature adds the host directives behavior to a directive definition by patching a
function onto it. The expectation is that the runtime will invoke the function during
directive matching.

此功能通过将函数修补到指令定义上，将宿主指令行为添加到指令定义中。期望运行时将在指令匹配期间调用该函数。

For example:

比如：

Converts an array in the form of `['publicName', 'alias', 'otherPublicName', 'otherAlias']` into
a map in the form of `{publicName: 'alias', otherPublicName: 'otherAlias'}`.

将 `['publicName', 'alias', 'otherPublicName', 'otherAlias']` 形式的数组转换为 `{publicName: 'alias', otherPublicName: 'otherAlias'}` 形式的映射。

`ngOnChanges` has some leftover legacy ViewEngine behavior where the keys inside the
`SimpleChanges` event refer to the *declared* name of the input, not its public name or its
minified name. E.g. in `@Input('alias') foo: string`, the name in the `SimpleChanges` object
will always be `foo`, and not `alias` or the minified name of `foo` in apps using property
minification.

`ngOnChanges` 有一些遗留的旧 ViewEngine 行为，其中 `SimpleChanges` 事件中的键指的是输入的*声明*名称，而不是其公共名称或其缩小名称。例如，在 `@Input('alias') foo: string` 中，`SimpleChanges` 对象中的名称将始终是 `foo`，而不是使用属性缩小的应用程序中 `foo` 的 `alias` 或缩小名称。

This is achieved through the `DirectiveDef.declaredInputs` map that is constructed when the
definition is declared. When a property is written to the directive instance, the
`NgOnChangesFeature` will try to remap the property name being written to using the
`declaredInputs`.

这是通过在声明定义时构造的 `DirectiveDef.declaredInputs` 映射来实现的。当属性被写入指令实例时，`NgOnChangesFeature` 将尝试使用 `declaredInputs` 重新映射正在写入的属性名称。

Since the host directive input remapping happens during directive matching, `declaredInputs`
won't contain the new alias that the input is available under. This function addresses the
issue by patching the host directive aliases to the `declaredInputs`. There is *not* a risk of
this patching accidentally introducing new inputs to the host directive, because `declaredInputs`
is used *only* by the `NgOnChangesFeature` when determining what name is used in the
`SimpleChanges` object which won't be reached if an input doesn't exist.

由于宿主指令输入重新映射发生在指令匹配期间，因此 `declaredInputs` 将不包含输入可用的新别名。此函数通过将宿主指令别名修补到 `declaredInputs` 来解决此问题。*不*存在此修补意外向宿主指令引入新输入的风险，因为 `declaredInputs`*仅*由 `NgOnChangesFeature` 在确定 `SimpleChanges` 对象中使用的名称时使用，如果输入不存在则无法访问。

Host directive configuration object.

宿主指令配置对象。

Directive definition of the host directive.

宿主指令的指令定义。

Directives that have been matched so far.

到目前为止已匹配的指令。

Verifies that the host directive has been configured correctly.

验证宿主指令是否已正确配置。

Kind of binding that is being validated. Used in the error message.

正在验证的绑定类型。在错误消息中使用。

Definition of the host directive that is being validated against.

正在验证的宿主指令的定义。

Host directive mapping object that shold be validated.

应验证的宿主指令映射对象。

Checks that the host directive inputs/outputs configuration is valid.

检查宿主指令输入/输出配置是否有效。