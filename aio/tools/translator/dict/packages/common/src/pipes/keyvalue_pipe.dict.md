A key value pair.
Usually used to represent the key value pairs from a Map or Object.

一个键值对。通常用于表示 Map 或 Object 中的键值对。

Transforms Object or Map into an array of key value pairs.

将 Object 或 Map 转换为键值对数组。

The output array will be ordered by keys.
By default the comparator will be by Unicode point value.
You can optionally pass a compareFn if your keys are complex types.

输出数组将通过键名排序。默认情况下，比较器将使用 Unicode 点位值。如果你的键名是复杂类型，则可以选择传入一个 compareFn。

Examples

例子

This examples show how an Object or a Map can be iterated by ngFor with the use of this
keyvalue pipe.

此示例演示了 ngFor 如何使用此键值管道对 Object 或 Map 进行迭代。

{&commat;example common/pipes/ts/keyvalue_pipe.ts region='KeyValuePipe'}