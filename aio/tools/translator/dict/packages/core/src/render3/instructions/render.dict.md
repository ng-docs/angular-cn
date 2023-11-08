The `TView` that contains the blueprint for syncing

包含同步蓝图的 `TView`

The view to sync

要同步的视图

Syncs an LView instance with its blueprint if they have gotten out of sync.

如果 LView 实例不同步，则将它们与其蓝图同步。

Typically, blueprints and their view instances should always be in sync, so the loop here
will be skipped. However, consider this case of two components side-by-side:

通常，蓝图和它们的视图实例应该总是同步的，所以这里的循环将被跳过。但是，并排考虑两个组件的情况：

App template:

应用模板：

The following will happen:



App template begins processing.



First <comp> is matched as a component and its LView is created.



Second <comp> is matched as a component and its LView is created.



App template completes processing, so it's time to check child templates.



First <comp> template is checked. It has a directive, so its def is pushed to blueprint.



Second <comp> template is checked. Its blueprint has been updated by the first
<comp> template, but its LView was created before this update, so it is out of sync.



Note that embedded views inside ngFor loops will never be out of sync because these views
are processed as soon as they are created.

请注意，ngFor 循环中的嵌入式视图永远不会不同步，因为这些视图在创建后会立即处理。

Processes a view in the creation mode. This includes a number of steps in a specific order:

在创建模式下处理视图。这包括按特定顺序执行的多个步骤：

creating view query functions \(if any\);

创建视图查询函数（如果有的话）；

executing a template function in the creation mode;

在创建模式下执行模板函数；

updating static queries \(if any\);

更新静态查询（如果有的话）；

creating child components defined in a given view.

创建在给定视图中定义的子组件。

Renders child components in the current view \(creation mode\).

在当前视图（创建模式）中渲染子组件。