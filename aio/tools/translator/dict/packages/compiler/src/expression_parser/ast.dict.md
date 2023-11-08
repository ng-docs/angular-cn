Receiver when something is accessed through `this` \(e.g. `this.foo`\). Note that this class
inherits from `ImplicitReceiver`, because accessing something through `this` is treated the
same as accessing it implicitly inside of an Angular template \(e.g. `[attr.title]="this.title"`
is the same as `[attr.title]="title"`.\). Inheriting allows for the `this` accesses to be treated
the same as implicit ones, except for a couple of exceptions like `$event` and `$any`.
TODO: we should find a way for this class not to extend from `ImplicitReceiver` in the future.

通过 `this` 访问某些内容时的接收器（例如 `this.foo`）。请注意，此类继承自 `ImplicitReceiver`
，因为通过 `this` 访问某些内容被视为与在 Angular 模板中隐式访问它相同（例如
`[attr.title]="this.title"` 与 `[attr.title]="title"`。）。继承允许 `this`
访问被视为与隐式访问相同，除了 `$event` 和 `$any` 等几个异常。
TODO：我们应该找到一种方法让这个类将来不要从 `ImplicitReceiver` 扩展。

Multiple expressions separated by a semicolon.

以分号分隔的多个表达式。

For backwards compatibility reasons, `Unary` inherits from `Binary` and mimics the binary AST
node that was originally used. This inheritance relation can be deleted in some future major,
after consumers have been given a chance to fully support Unary.

出于向后兼容的原因，`Unary` 继承自 `Binary` 并模仿最初使用的二进制 AST
节点。在消费者有机会完全支持一元之后，可以在未来的某些专业中删除这种继承关系。

Creates a unary minus expression "-x", represented as `Binary` using "0 - x".

创建一个一元减号表达式“-x”，使用“0 - x”表示为 `Binary`。

Creates a unary plus expression "+x", represented as `Binary` using "x - 0".

创建一个一元加表达式“+x”，使用“x - 0”表示为 `Binary`。

Records the absolute position of a text span in a source file, where `start` and `end` are the
starting and ending byte offsets, respectively, of the text span in a source file.

记录文本范围在源文件中的绝对位置，其中 `start` 和 `end`
分别是源文件中文本范围的开始和结束字节偏移量。

TemplateBinding refers to a particular key-value pair in a microsyntax
expression. A few examples are:

TemplateBinding 是指微语法表达式中的特定键值对。一些例子是：

6. \*ngIf="cond"

6. \*ngIf="cond"

cond

cond

expression

表达式

5. trackBy: func

5. trackBy: func

func

func

4. index as i

4. index as i

i

i

index

index

variable

变量

3. let x = y

3. let x = y

x

x

y

y

2. of items

2. of items

items

items

1. let item

1. let item

item

item

null

null

key

键

value

值

binding type

绑定类型

\(6\) is a notable exception because it is a binding from the template key in
the LHS of a HTML attribute to the expression in the RHS. All other bindings
in the example above are derived solely from the RHS.

\(6\) 是一个值得注意的异常，因为它是从 HTML 属性的 LHS 中的模板键到 RHS
中的表达式的绑定。上面的示例中的所有其他绑定都仅来自 RHS。

entire span of the binding.

绑定的整个跨度。

name of the LHS along with its span.

LHS 的名称及其跨度。

optional value for the RHS along with its span.

RHS 的可选值及其跨度。

binding name, like ngForOf, ngForTrackBy, ngIf, along with its
span. Note that the length of the span may not be the same as
`key.source.length`. For example,

绑定名称，例如 ngForOf、ngForTrackBy、ngIf 及其跨度。请注意，跨度的长度可能与
`key.source.length` 相同。例如

key.source = ngFor, key.span is for "ngFor"

key.source = ngFor, key.span 是供 "ngFor" 使用的

key.source = ngForOf, key.span is for "of"

key.source = ngForOf, key.span 是供 "of" 使用的

key.source = ngForTrackBy, key.span is for "trackBy"

key.source = ngForTrackBy, key.span 是供 "trackBy" 使用的

optional expression for the RHS.

RHS 的可选表达式。

The `visitUnary` method is declared as optional for backwards compatibility. In an upcoming
major release, this method will be made required.

为了向后兼容，`visitUnary` 方法被声明为可选。在即将到来的主要版本中，将使用此方法。

The `visitThisReceiver` method is declared as optional for backwards compatibility.
In an upcoming major release, this method will be made required.

为了向后兼容，`visitThisReceiver` 方法被声明为可选。在即将到来的主要版本中，将使用此方法。

node to visit

要访问的节点

context that gets passed to the node and all its children

传递给节点及其所有子项的上下文

This function is optionally defined to allow classes that implement this
interface to selectively decide if the specified `ast` should be visited.

此函数是可选定义的，以允许实现此接口的类选择性地决定是否应该访问指定的 `ast`。

ParsedVariable represents a variable declaration in a microsyntax expression.

ParsedVariable 表示微语法表达式中的变量声明。