Generates an object that is used as a shared state between parent and all child contexts.

生成一个对象，用作父上下文和所有子上下文之间的共享状态。

Instruction index of i18nStart, which initiates this context

i18nStart 的指令索引，用于启动此上下文

Reference to a translation const that represents the content if thus context

对表示内容的翻译 const 的引用，如果是上下文

Nesting level defined for child contexts

为子上下文定义的嵌套级别

Instruction index of a template which this context belongs to

此上下文所属的模板的指令索引

Meta information \(id, meaning, description, etc\) associated with this context

与此上下文相关的元信息（id、含义、描述等）

I18nContext is a helper class which keeps track of all i18n-related aspects
\(accumulates placeholders, bindings, etc\) between i18nStart and i18nEnd instructions.

I18nContext 是一个帮助器类，它会跟踪 i18nStart 和 i18nEnd 指令之间的所有 i18n
相关切面（累积占位符、绑定等）。

When we enter a nested template, the top-level context is being passed down
to the nested component, which uses this context to generate a child instance
of I18nContext class \(to handle nested template\) and at the end, reconciles it back
with the parent context.

当我们输入嵌套模板时，顶级上下文正在被传递给嵌套组件，它使用此上下文生成 I18nContext
类的子实例（以处理嵌套模板），并最后将其与父级协调上下文。

Instruction index of corresponding i18nStart, which initiates this context

启动此上下文的相应 i18nStart 的指令索引

I18nContext instance

I18nContext 实例

Generates an instance of a child context based on the root one,
when we enter a nested template within I18n section.

当我们在 I18n 部分中输入嵌套模板时，会根据根上下文生成子上下文的实例。

Child I18nContext instance to be reconciled with parent context.

要与父上下文协调的子 I18nContext 实例。

Reconciles child context into parent one once the end of the i18n block is reached \(i18nEnd\).

到达 i18n 块的末尾（i18nEnd）后，将子上下文协调为父上下文。