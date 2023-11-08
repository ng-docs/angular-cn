Regular expression that detects pass-through constructors for ES5 output. This Regex
intends to capture the common delegation pattern emitted by TypeScript and Babel. Also
it intends to capture the pattern where existing constructors have been downleveled from
ES2015 to ES5 using TypeScript w/ downlevel iteration. e.g.

检测 ES5 输出的传递构造函数的正则表达式。此正则表达式旨在捕获 TypeScript 和 Babel
发出的通用委托模式。它还打算捕获使用带有下级迭代的 TypeScript 将现有构造函数从 ES2015 降级到 ES5
的模式。例如

downleveled to ES5 with `downlevelIteration` for TypeScript &lt; 4.2:

对于 TypeScript &lt; 4.2，使用 `downlevelIteration` 降级到 ES5：

or downleveled to ES5 with `downlevelIteration` for TypeScript >= 4.2:

或使用 `downlevelIteration` for TypeScript >= 4.2 降级到 ES5：

More details can be found in: https://github.com/angular/angular/issues/38453.

更多详细信息，请参阅：https://github.com/angular/angular/issues/38453。

Regular expression that detects ES2015 classes which extend from other classes.

检测从其他类扩展的 ES2015 类的正则表达式。

Regular expression that detects ES2015 classes which extend from other classes and
have an explicit constructor defined.

检测从其他类扩展并定义了显式构造函数的 ES2015 类的正则表达式。

Regular expression that detects ES2015 classes which extend from other classes
and inherit a constructor.

检测从其他类扩展并继承构造函数的 ES2015 类的正则表达式。

Determine whether a stringified type is a class which delegates its constructor
to its parent.

确定字符串化类型是否是将其构造函数委托给其父级的类。

This is not trivial since compiled code can actually contain a constructor function
even if the original source code did not. For instance, when the child class contains
an initialized instance property.

这并非易事，因为编译后的代码实际上可以包含构造函数，即使原始源代码不包含。例如，当子类包含已初始化的实例属性时。