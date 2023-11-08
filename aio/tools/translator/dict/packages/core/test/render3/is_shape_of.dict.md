A type used to create a runtime representation of a shape of object which matches the declared
interface at compile time.

一种用于创建与编译时声明的接口匹配的对象形状的运行时表示的类型。

The purpose of this type is to ensure that the object must match all of the properties of a type.
This is later used by `isShapeOf` method to ensure that a particular object has a particular
shape.

这种类型的目的是确保对象必须匹配一种类型的所有属性。`isShapeOf`
方法后来用它来确保特定对象具有特定的形状。

The above code would verify that `myShapeObj` has `foo` and `bar` properties. However if later
`MyShape` is refactored to change a set of properties we would like to have a compile time error
that the `ExpectedPropertiesOfShape` also needs to be changed.

上面的代码将验证 `myShapeObj` 是否具有 `foo` 和 `bar` 属性。但是，如果后来 `MyShape`
被重构以更改一组属性，我们希望有一个编译时错误，即 `ExpectedPropertiesOfShape` 也需要更改。

The above code will force through compile time checks that the `ExpectedPropertiesOfShape` match
that of `MyShape`.

上面的代码将强制通过编译时检查 `ExpectedPropertiesOfShape` 是否与 `MyShape` 匹配。

See: `isShapeOf`

请参阅：`isShapeOf`

Object to test for.

要测试的对象。

Desired shape.

所需的形状。

Determines if a particular object is of a given shape \(duck-type version of `instanceof`.\)

确定特定对象是否具有给定的形状（`instanceof` 的鸭型版本。）

The above code will be true if the `someObj` has both `foo` and `bar` property

如果 `someObj` 同时具有 `foo` 和 `bar` 属性，则上面的代码将成立

Determines if `obj` matches the shape `TI18n`.

确定 `obj` 是否与形状 `TI18n` 匹配。

Determines if `obj` matches the shape `TIcu`.

确定 `obj` 是否与形状 `TIcu` 匹配。

Determines if `obj` matches the shape `TView`.

确定 `obj` 是否与形状 `TView` 匹配。

Determines if `obj` is DOM `Node`.

确定 `obj` 是否为 DOM `Node`。

Determines if `obj` is DOM `Text`.

确定 `obj` 是否为 DOM `Text`。