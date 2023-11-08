Converts the given expression AST into an executable output AST, assuming the expression is
used in an action binding \(e.g. an event handler\).

假定表达式在操作绑定（例如事件处理程序）中使用，将给定的表达式 AST 转换为可执行的输出 AST。

Converts the given expression AST into an executable output AST, assuming the expression
is used in property binding. The expression has to be preprocessed via
`convertPropertyBindingBuiltins`.

假设表达式用于属性绑定，则将给定的表达式 AST 转换为可执行的输出 AST。表达式必须通过
`convertPropertyBindingBuiltins` 进行预处理。

The resolver to use to look up expressions by name appropriately

用于按名称适当地查找表达式的解析器

The expression representing the context variable used to create
the final argument expressions

表示用于创建最终参数表达式的上下文变量的表达式

The expression to visit to figure out what values need to
be resolved and what arguments list to build.

要访问的表达式，以找出需要解析的值以及要构建的参数列表。

A name prefix used to create temporary variable names if they're needed for the
arguments generated

如果生成的参数需要它们，则用于创建临时变量名称的名称前缀

An array of expressions that can be passed as arguments to instruction expressions like
`o.importExpr(R3.propertyInterpolate).callFn(result)`

可以作为参数传递给指令表达式的表达式数组，例如
`o.importExpr(R3.propertyInterpolate).callFn(result)`

Given some expression, such as a binding or interpolation expression, and a context expression to
look values up on, visit each facet of the given expression resolving values from the context
expression such that a list of arguments can be derived from the found values that can be used as
arguments to an external update instruction.

给定某些表达式，例如绑定或插值表达式，以及要在其上查找值的上下文表达式，请访问给定表达式的每个切面，以解析上下文表达式中的值，以便可以从找到的值中导出参数列表，用作外部更新指令的参数。