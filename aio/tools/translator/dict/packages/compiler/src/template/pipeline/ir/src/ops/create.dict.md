An operation usable on the creation side of the IR.

可在 IR 的创建端使用的操作。

Representation of a local reference on an element.

表示元素上的局部引用。

User-defined name of the local ref variable.

本地 ref 变量的用户定义名称。

Target of the local reference variable \(often `''`\).

局部引用变量的目标（通常 `''` ）。

Base interface for `Element`, `ElementStart`, and `Template` operations, containing common fields
used to represent their element-like nature.

`Element` 、 `ElementStart` 和 `Template` 操作的基本接口，包含用于表示其类元素性质的公共字段。

`XrefId` allocated for this element.

为该元素分配的 `XrefId`。

This ID is used to reference this element from other IR structures.

此 ID 用于从其他 IR 结构中引用此元素。

Attributes of various kinds on this element.

此元素的各种属性。

Before attribute processing, this is an `ElementAttributes` structure representing the
attributes on this element.

在属性处理之前，这是一个 `ElementAttributes` 结构，表示该元素的属性。

After processing, it's a `ConstIndex` pointer into the shared `consts` array of the component
compilation.

处理后，它是指向组件编译的共享 `consts` 数组 `ConstIndex` 指针。

Local references to this element.

对该元素的本地引用。

Before local ref processing, this is an array of `LocalRef` declarations.

在本地引用处理之前，这是一个 `LocalRef` 声明数组。

The HTML tag name for this element.

此元素的 HTML 标记名称。

Logical operation representing the start of an element in the creation IR.

表示创建 IR 中元素开始的逻辑操作。

Create an `ElementStartOp`.

创建一个 `ElementStartOp`。

Logical operation representing an element with no children in the creation IR.

表示在创建 IR 中没有子元素的逻辑操作。

Logical operation representing an embedded view declaration in the creation IR.

表示创建 IR 中嵌入视图声明的逻辑操作。

The number of declaration slots used by this template, or `null` if slots have not yet been
assigned.

此模板使用的声明槽数，如果尚未分配槽，则为 `null`。

The number of binding variable slots used by this template, or `null` if binding variables have
not yet been counted.

此模板使用的绑定变量槽的数量，如果尚未计算绑定变量，则为 `null`。

Create a `TemplateOp`.

创建一个 `TemplateOp`。

Logical operation representing the end of an element structure in the creation IR.

表示创建 IR 中元素结构结束的逻辑操作。

Pairs with an `ElementStart` operation.

与 `ElementStart` 操作配对。

The `XrefId` of the element declared via `ElementStart`.

通过 `ElementStart` 声明的元素的 `XrefId`。

Create an `ElementEndOp`.

创建一个 `ElementEndOp`。

Logical operation representing the start of a container in the creation IR.

表示创建 IR 中容器开始的逻辑操作。

Logical operation representing an empty container in the creation IR.

在创建 IR 中表示空容器的逻辑操作。

Logical operation representing the end of a container structure in the creation IR.

表示创建 IR 中容器结构结束的逻辑操作。

Pairs with an `ContainerStart` operation.

与 `ContainerStart` 操作配对。

The `XrefId` of the element declared via `ContainerStart`.

通过 `ContainerStart` 声明的元素的 `XrefId`。

Logical operation representing a text node in the creation IR.

在创建 IR 中表示文本节点的逻辑操作。

`XrefId` used to reference this text node in other IR structures.

`XrefId` 用于在其他 IR 结构中引用此文本节点。

The static initial value of the text node.

文本节点的静态初始值。

Create a `TextOp`.

创建一个 `TextOp`。

Logical operation representing an event listener on an element in the creation IR.

表示创建 IR 中元素上的事件侦听器的逻辑操作。

Name of the event which is being listened to.

正在收听的事件的名称。

Tag name of the element on which this listener is placed.

放置此侦听器的元素的标签名称。

A list of `UpdateOp`s representing the body of the event listener.

表示事件侦听器主体的 `UpdateOp` 列表。

Name of the function

函数名称

Create a `ListenerOp`.

创建一个 `ListenerOp`。

An index into the `consts` array which is shared across the compilation of all views in a
component.

`consts` 数组的索引，它在组件中所有视图的编译中共享。