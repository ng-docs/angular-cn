Given a current DOM node and a serialized information about the views
in a container, walks over the DOM structure, collecting the list of
dehydrated views.

给定一个当前 DOM 节点和一个关于容器中视图的序列化信息，遍历 DOM 结构，收集脱水视图列表。

Reference to a function that searches for a matching dehydrated views
stored on a given lContainer.
Returns `null` by default, when hydration is not enabled.

对搜索存储在给定 lContainer 上的匹配脱水视图的函数的引用。未启用水合时，默认返回 `null`。

Retrieves the next dehydrated view from the LContainer and verifies that
it matches a given template id \(from the TView that was used to create this
instance of a view\). If the id doesn't match, that means that we are in an
unexpected state and can not complete the reconciliation process. Thus,
all dehydrated views from this LContainer are removed \(including corresponding
DOM nodes\) and the rendering is performed as if there were no dehydrated views
in this container.

从 LContainer 中检索下一个脱水视图并验证它是否与给定的模板 ID 匹配（来自用于创建此视图实例的 TView）。如果 id 不匹配，则意味着我们处于意外状态，无法完成对帐过程。因此，此 LContainer 中的所有脱水视图都将被删除（包括相应的 DOM 节点），并且执行渲染时就好像此容器中没有脱水视图一样。