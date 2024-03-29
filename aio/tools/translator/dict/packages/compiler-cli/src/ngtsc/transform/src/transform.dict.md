Metadata to support &commat;fileoverview blocks \(Closure annotations\) extracting/restoring.

支持 &commat;fileoverview 块（闭包注解）提取/恢复的元数据。

Visits all classes, performs Ivy compilation where Angular decorators are present and collects
result in a Map that associates a ts.ClassDeclaration with Ivy compilation results. This visitor
does NOT perform any TS transformations.

访问所有类，在存在 Angular 装饰器的地方执行 Ivy 编译，并在 Map 中收集结果，该 Map 将
ts.ClassDeclaration 与 Ivy 编译结果相关联。此访问者不执行任何 TS 转换。

Visits all classes and performs transformation of corresponding TS nodes based on the Ivy
compilation results \(provided as an argument\).

访问所有类并根据 Ivy 编译结果（作为参数提供）对相应的 TS 节点执行转换。

A transformer which operates on ts.SourceFiles and applies changes from an `IvyCompilation`.

一个在 ts.SourceFiles 上运行并应用 `IvyCompilation` 中的更改的转换器。

Compute the correct target output for `$localize` messages generated by Angular

为 Angular 生成的 `$localize` 消息计算正确的目标输出

In some versions of TypeScript, the transformation of synthetic `$localize` tagged template
literals is broken. See https://github.com/microsoft/TypeScript/issues/38485

在某些版本的 TypeScript 中，合成 `$localize`
标记模板文字的转换被破坏了。请参阅 https://github.com/microsoft/TypeScript/issues/38485

Here we compute what the expected final output target of the compilation will
be so that we can generate ES5 compliant `$localize` calls instead of relying upon TS to do the
downleveling for us.

在这里，我们计算编译的预期最终输出目标是什么，以便我们可以生成符合 ES5 的 `$localize`
调用，而不是依赖 TS 为我们进行降级。

Creates a `NodeArray` with the correct offsets from an array of decorators.

从装饰器数组创建一个具有正确偏移量的 `NodeArray`。