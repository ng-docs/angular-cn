Example

例子

Marks a view and all of its ancestors dirty.

将视图及其所有祖先标记为脏。

This can be used to ensure an {&commat;link ChangeDetectionStrategy#OnPush OnPush} component is
checked when it needs to be re-rendered but the two normal triggers haven't marked it
dirty \(i.e. inputs haven't changed and events haven't fired in the view\).

这可用于确保在需要重新渲染但两个普通触发器尚未将其标记为脏（即输入没有更改并且事件没有触发）时检查 {&commat;link
ChangeDetectionStrategy#OnPush OnPush} 组件在视图中）。

The following example defines a component with a large list of readonly data.
Imagine the data changes constantly, many times per second. For performance reasons,
we want to check and update the list every five seconds. We can do that by detaching
the component's change detector and doing a local check every five seconds.

以下示例定义了一个具有大量只读数据列表的组件。想象一下数据不断变化，每秒很多次。出于性能原因，我们希望每五秒检查并更新一次列表。我们可以通过分离组件的变更检测器并每五秒进行一次本地检查来实现。

Detaches the view from the change detection tree.

将视图从变更检测树中分离。

Detached views will not be checked during change detection runs until they are
re-attached, even if they are dirty. `detach` can be used in combination with
{&commat;link ChangeDetectorRef#detectChanges detectChanges} to implement local change
detection checks.

在重新连接之前，在变更检测运行期间不会检查分离的视图，即使它们是脏的。`detach` 可以与 {&commat;link
ChangeDetectorRef#detectChangesdetectChanges} 结合使用来实现本地变更检测检查。

The following example creates a component displaying `live` data. The component will detach
its change detector from the main change detector tree when the component's live property
is set to false.

以下示例创建一个显示 `live` 数据的组件。当组件的 live 属性设置为 false
时，组件将其变更检测器与主变更检测器树分离。

Re-attaches a view to the change detection tree.

将视图重新附加到变更检测树。

This can be used to re-attach views that were previously detached from the tree
using {&commat;link ChangeDetectorRef#detach detach}. Views are attached to the tree by default.

这可用于重新附加以前使用 {&commat;link ChangeDetectorRef#detach detach}
从树中分离的视图。默认情况下，视图附加到树。

The following example defines a component with a large list of readonly data.
Imagine, the data changes constantly, many times per second. For performance reasons,
we want to check and update the list every five seconds.

以下示例定义了一个具有大量只读数据列表的组件。想象一下，数据会不断变化，每秒很多次。出于性能原因，我们希望每五秒检查并更新一次列表。

We can do that by detaching the component's change detector and doing a local change detection
check every five seconds.

我们可以通过分离组件的变更检测器并每五秒进行一次本地变更检测检查来实现。

See {&commat;link ChangeDetectorRef#detach detach} for more information.

有关更多信息，请参阅 {&commat;link ChangeDetectorRef#detach detach}。

Checks the view and its children.

检查视图及其子项。

This can also be used in combination with {&commat;link ChangeDetectorRef#detach detach} to implement
local change detection checks.

这也可以与 {&commat;link ChangeDetectorRef#detach detach} 结合使用来实现本地变更检测检查。

Checks the change detector and its children, and throws if any changes are detected.

检查变更检测器及其子项，如果检测到任何更改，则抛出。

This is used in development mode to verify that running change detection doesn't
introduce other changes.

这在开发模式下用于验证正在运行的变更检测不会引入其他更改。