Index of the element in the LView array

LView 数组中元素的索引

Name of the DOM Node

DOM 节点的名称

Index of the element's attributes in the `consts` array.

元素属性在 `consts` 数组中的索引。

Index of the element's local references in the `consts` array.

元素的本地引用在 `consts` 数组中的索引。

This function returns itself so that it may be chained.

此函数返回自己，以便它可以被链接。

Attributes and localRefs are passed as an array of strings where elements with an even index
hold an attribute name and elements with an odd index hold an attribute value, ex.:
['id', 'warning5', 'class', 'alert']

属性和 localRefs
以字符串数组的形式传递，其中具有偶数索引的元素保存属性名称，具有奇数索引的元素保存属性值，例如：
['id'、'warning5'、'class'、'alert']['id', 'warning5', 'class', 'alert']

Create DOM element. The instruction must later be followed by `elementEnd()` call.

创建 DOM 元素。该指令稍后必须跟 `elementEnd()` 调用。

Mark the end of the element.

标记元素的结尾。

Index of the element in the data array

数据数组中元素的索引

Creates an empty element using {&commat;link elementStart} and {&commat;link elementEnd}

使用 {&commat;link elementStart} 和 {&commat;link elementEnd} 创建一个空元素

Enables hydration code path \(to lookup existing elements in DOM\)
in addition to the regular creation mode of element nodes.

除了元素节点的常规创建模式之外，还启用水合代码路径（以查找 DOM 中的现有元素）。