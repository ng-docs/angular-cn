A `MetadataReader` that can read metadata from `.d.ts` files, which have static Ivy properties
from an upstream compilation already.

一个 `MetadataReader`，可以从 `.d.ts` 文件中读取元数据，这些文件已经具有来自上游编译的静态 Ivy
属性。

`Reference` to the class of interest, with the context of how it was obtained.

对感兴趣的类的 `Reference`，以及它是如何获取的上下文。

Read the metadata from a class that has already been compiled somehow \(either it's in a .d.ts
file, or in a .ts file with a handwritten definition\).

从已经以某种方式编译的类中读取元数据（它在 .d.ts 文件中，或在具有手写定义的 .ts 文件中）。

Read directive \(or component\) metadata from a referenced class in a .d.ts file.

从 .d.ts 文件中的引用类读取指令（或组件）元数据。

Read pipe metadata from a referenced class in a .d.ts file.

从 .d.ts 文件中的引用类读取管道元数据。