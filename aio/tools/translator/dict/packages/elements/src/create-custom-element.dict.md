[Angular Elements Overview](guide/elements "Turning Angular components into custom elements")

[Angular 元素概述](guide/elements "将 Angular 组件变成自定义元素")

Prototype for a class constructor based on an Angular component
that can be used for custom element registration. Implemented and returned
by the {&commat;link createCustomElement createCustomElement\(\) function}.

基于 Angular 组件的类构造函数的原型，该原型可用于自定义元素注册。由 {&commat;link createCustomElement
createCustomElement\(\) 函数} 实现并返回。

An array of observed attribute names for the custom element,
derived by transforming input property names from the source component.

被监视的自定义元素的属性名称的数组，该属性名称是通过转换源组件中的输入属性名称而得出的。

If provided, overrides the configured injector.

如果提供，将覆盖已配置的注入器。

Initializes a constructor instance.

初始化构造函数实例。

Implements the functionality needed for a custom element.

实现自定义元素所需的功能。

The strategy that controls how a component is transformed in a custom element.

控制如何把组件转换为自定义元素的策略。

A subscription to change, connect, and disconnect events in the custom element.

在自定义元素中的对更改，连接和断开事件的订阅。

The name of the attribute that has changed.

更改的属性的名称。

The previous value of the attribute.

属性的先前值。

The new value of the attribute.

属性的新值。

The namespace in which the attribute is defined.

定义属性的名称空间。

Nothing.

无。

Prototype for a handler that responds to a change in an observed attribute.

本处理器原型用于响应观察到的属性更改。

Prototype for a handler that responds to the insertion of the custom element in the DOM.

本处理器原型用来响应自定义元素在 DOM 中插入。

Prototype for a handler that responds to the deletion of the custom element from the DOM.

本处理器原型用来响应自 DOM 中删除自定义元素。

Additional type information that can be added to the NgElement class,
for properties that are added based
on the inputs and methods of the underlying component.

可以添加到 NgElement 类的其他类型信息，用于基于基础组件的输入和方法添加的属性。

A configuration that initializes an NgElementConstructor with the
dependencies and strategy it needs to transform a component into
a custom element class.

一种配置，它使用将组件转换为自定义元素类所需的依赖项和策略来初始化 NgElementConstructor。

The injector to use for retrieving the component's factory.

本注入器用于检索组件工厂。

An optional custom strategy factory to use instead of the default.
The strategy controls how the transformation is performed.

要使用的可选自定义策略工厂，而不是默认工厂。该策略控制转换的执行方式。

Creates a custom element class based on an Angular component.

基于 Angular 组件创建自定义元素类。

Builds a class that encapsulates the functionality of the provided component and
uses the configuration information to provide more context to the class.
Takes the component factory's inputs and outputs to convert them to the proper
custom element API and add hooks to input changes.

构建一个类，该类封装给定组件的功能，并使用配置信息为该类提供更多上下文。获取组件工厂的输入和输出，以将它们转换为适当的自定义元素
API，并为输入变更添加钩子。

The configuration's injector is the initial injector set on the class,
and used by default for each created instance.This behavior can be overridden with the
static property to affect all newly created instances, or as a constructor argument for
one-off creations.

这里配置的注入器是在类上设置的初始注入器，默认情况下用于每个创建的实例。此行为可以用静态属性覆盖以影响所有新创建的实例，也可以用作一次性创建的构造函数参数。

The component to transform.

要转换的组件。

A configuration that provides initialization information to the created class.

为创建的类提供初始化信息的配置。

The custom-element construction class, which can be registered with
a browser's `CustomElementRegistry`.

自定义元素的构造类，可以注册到浏览器的 `CustomElementRegistry` 中。