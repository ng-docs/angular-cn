Metadata of a class which captures the original Angular decorators of a class. The original
decorators are preserved in the generated code to allow TestBed APIs to recompile the class
using the original decorator with a set of overrides applied.

捕获类的原始 Angular 装饰器的类的元数据。原始装饰器保留在生成的代码中，以允许 TestBed API
使用原始装饰器并应用一组覆盖来重新编译类。

The class type for which the metadata is captured.

要捕获其元数据的类类型。

An expression representing the Angular decorators that were applied on the class.

表示应用于类的 Angular 装饰器的表达式。

An expression representing the Angular decorators applied to constructor parameters, or `null`
if there is no constructor.

表示应用于构造函数参数的 Angular 装饰器的表达式，如果没有构造函数，则为 `null`。

An expression representing the Angular decorators that were applied on the properties of the
class, or `null` if no properties have decorators.

表示应用于类属性的 Angular 装饰器的表达式，如果没有属性具有装饰器，则为 `null`。