Fields which exist on either directive or component definitions, and need to be copied from
parent to child classes by the `ɵɵCopyDefinitionFeature`.

指令或组件定义中存在的字段，需要通过 `ɵɵCopyDefinitionFeature` 从父类复制到子类。

Fields which exist only on component definitions, and need to be copied from parent to child
classes by the `ɵɵCopyDefinitionFeature`.

仅存在于组件定义中的字段，需要通过 `ɵɵCopyDefinitionFeature` 从父类复制到子类。

The type here allows any field of `ComponentDef` which is not also a property of `DirectiveDef`,
since those should go in `COPY_DIRECTIVE_FIELDS` above.

这里的类型允许 `ComponentDef` 的任何字段，这不是 `DirectiveDef` 的属性，因为这些应该在上面的
`COPY_DIRECTIVE_FIELDS` 中。

The definition of a child class which inherits from a parent class with its
own definition.

从具有自己定义的父类继承的子类的定义。

Copies the fields not handled by the `ɵɵInheritDefinitionFeature` from the supertype of a
definition.

从定义的超类型复制 `ɵɵInheritDefinitionFeature` 的字段。

This exists primarily to support ngcc migration of an existing View Engine pattern, where an
entire decorator is inherited from a parent to a child class. When ngcc detects this case, it
generates a skeleton definition on the child class, and applies this feature.

这主要是为了支持现有视图引擎模式的 ngcc 迁移，其中整个装饰器是从父类继承到子类。当 ngcc
检测到这种情况时，它会在子类上生成一个骨架定义，并应用此特性。

The `ɵɵCopyDefinitionFeature` then copies any needed fields from the parent class' definition,
including things like the component template function.

然后，`ɵɵCopyDefinitionFeature` 会从父类的定义中复制任何需要的字段，包括组件模板函数之类的东西。