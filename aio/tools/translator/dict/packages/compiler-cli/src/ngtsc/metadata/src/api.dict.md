Metadata collected for an `NgModule`.

为 `NgModule` 收集的元数据。

The raw `ts.Expression` which gave rise to `declarations`, if one exists.

产生 `declarations` 的原始 `ts.Expression`（如果存在）。

If this is `null`, then either no declarations exist, or no expression was available \(likely
because the module came from a .d.ts file\).

如果这是 `null`，则不存在声明，或没有表达式可用（可能是因为模块来自 .d.ts 文件）。

The raw `ts.Expression` which gave rise to `imports`, if one exists.

产生 `imports` 的原始 `ts.Expression`（如果存在）。

If this is `null`, then either no imports exist, or no expression was available \(likely
because the module came from a .d.ts file\).

如果这是 `null`，则不存在导入，或没有表达式可用（可能是因为模块来自 .d.ts 文件）。

The raw `ts.Expression` which gave rise to `exports`, if one exists.

导致 `exports` 的原始 `ts.Expression`（如果存在）。

If this is `null`, then either no exports exist, or no expression was available \(likely
because the module came from a .d.ts file\).

如果这是 `null`，则不存在导出，或没有表达式可用（可能是因为模块来自 .d.ts 文件）。

The primary decorator associated with this `ngModule`.

与此 `ngModule` 关联的主要装饰器。

If this is `null`, no decorator exists, meaning it's probably from a .d.ts file.

如果这是 `null`，则不存在装饰器，这意味着它可能来自 .d.ts 文件。

Whether this NgModule may declare providers.

这个 NgModule 是否可以声明提供者。

If the compiler does not know if the NgModule may declare providers, this will be `true` \(for
example, NgModules declared outside the current compilation are assumed to declare providers\).

如果编译器不知道 NgModule 是否可以声明提供者，这将是 `true` （例如，假设在当前编译之外声明的 NgModule 声明提供者）。

Typing metadata collected for a directive within an NgModule's scope.

在 NgModule 范围内键入为指令收集的元数据。

List of static `ngTemplateGuard_xx` members found on the Directive's class.

在 Directive 的类上找到的静态 `ngTemplateGuard_xx` 成员列表。

Whether the Directive's class has a static ngTemplateContextGuard function.

指令的类是否具有静态 ngTemplateContextGuard 函数。

The set of input fields which have a corresponding static `ngAcceptInputType_` on the
Directive's class. This allows inputs to accept a wider range of types and coerce the input to
a narrower type with a getter/setter. See https://angular.io/guide/template-typecheck.

在 Directive 的类上具有对应的静态 `ngAcceptInputType_`
的输入字段集。这允许输入接受更广泛的类型，并使用 getter/setter
将输入强制转换为更窄的类型。请参阅 https://angular.io/guide/template-typecheck。

The set of input fields which map to `readonly`, `private`, or `protected` members in the
Directive's class.

映射到 Directive 类中的 `readonly`、`private` 或 `protected` 成员的输入字段集。

The set of input fields which are declared as string literal members in the Directive's class.
We need to track these separately because these fields may not be valid JS identifiers so
we cannot use them with property access expressions when assigning inputs.

在 Directive
类中声明为字符串文字成员的输入字段集。我们需要单独跟踪这些，因为这些字段可能不是有效的 JS
标识符，因此我们在分配输入时不能将它们与属性访问表达式一起使用。

The set of input fields which do not have corresponding members in the Directive's class.

在 Directive 类中没有对应成员的输入字段集。

Whether the Directive's class is generic, i.e. `class MyDir<T> {...}`.

指令的类是否是通用的，即 `class MyDir<T> {...}`。

Disambiguates different kinds of compiler metadata objects.

消除不同类型的编译器元数据对象的歧义。

Possible ways that a directive can be matched.

指令可以匹配的可能方式。

The directive was matched by its selector.

该指令与其选择器匹配。

The directive was applied as a host directive.

该指令已作为宿主指令应用。

Metadata for a single input mapping.

单个输入映射的元数据。

Metadata for an input's transform function.

输入转换函数的元数据。

Metadata collected for a directive within an NgModule's scope.

在 NgModule 范围内为指令收集的元数据。

Way in which the directive was matched.

指令匹配的方式。

Unparsed selector of the directive, or null if the directive does not have a selector.

指令的未解析的选择器，如果指令没有选择器，则为 null。

A mapping of input field names to the property names.

输入字段名称到属性名称的映射。

A mapping of output field names to the property names.

输出字段名称到属性名称的映射。

A `Reference` to the base class for the directive, if one was detected.

对指令的基类的 `Reference`（如果检测到）。

A value of `'dynamic'` indicates that while the analyzer detected that this directive extends
another type, it could not statically determine the base class.

值 `'dynamic'` 表示尽管分析器检测到此指令扩展了另一种类型，但它无法静态确定基类。

Whether the directive had some issue with its declaration that means it might not have complete
and reliable metadata.

该指令的声明是否存在问题，这意味着它可能没有完整且可靠的元数据。

Whether the directive is likely a structural directive \(injects `TemplateRef`\).

该指令是否可能是结构指令（注入 `TemplateRef`）。

Whether the directive is a standalone entity.

指令是否是独立实体。

Whether the directive is a signal entity.

指令是否为信号实体。

For standalone components, the list of imported types.

对于独立组件，为导入的类型列表。

For standalone components, the list of schemas declared.

对于独立组件，为声明的模式列表。

The primary decorator associated with this directive.

与此指令关联的主要装饰器。

Additional directives applied to the directive host.

应用于指令宿主的附加指令。

Whether the directive should be assumed to export providers if imported as a standalone type.

如果作为独立类型导入，是否应假定指令导出提供程序。

Metadata collected about an additional directive that is being applied to a directive host.

收集的有关应用于指令宿主的附加指令的元数据。

Reference to the host directive class.

引用宿主指令类。

Whether the reference to the host directive is a forward reference.

对宿主指令的引用是否为前向引用。

Inputs from the host directive that have been exposed.

来自已公开的宿主指令的输入。

Outputs from the host directive that have been exposed.

已公开的宿主指令的输出。

Metadata that describes a template guard for one of the directive's inputs.

描述指令输入之一的模板防护的元数据。

The input name that this guard should be applied to.

应应用此防护的输入名称。

Represents the type of the template guard.

表示模板防护的类型。

'invocation' means that a call to the template guard function is emitted so that its return
type can result in narrowing of the input type.

“调用” 意味着发出对模板保护函数的调用，以便其返回类型可以导致输入类型的缩小。

'binding' means that the input binding expression itself is used as template guard.

“binding” 意味着输入绑定表达式本身被用作模板保护。

Metadata for a pipe within an NgModule's scope.

NgModule 范围内的管道的元数据。

Reads metadata for directives, pipes, and modules from a particular source, such as .d.ts files
or a registry.

从特定源（例如 .d.ts 文件或注册表）读取指令、管道和模块的元数据。

A MetadataReader which also allows access to the set of all known trait classes.

一个 MetadataReader，它还允许访问所有已知特征类的集合。

An NgModuleIndex allows access to information about traits exported by NgModules.

NgModuleIndex 允许访问有关 NgModule 导出的特征的信息。

Registers new metadata for directives, pipes, and modules.

为指令、管道和模块注册新的元数据。