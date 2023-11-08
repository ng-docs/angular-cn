The DOM node whose data needs to be cleaned.

需要清理其数据的 DOM 节点。

Clean the jqLite/jQuery data on the element and all its descendants.
Equivalent to how jqLite/jQuery invoke `cleanData()` on an Element when removed:

清理元素及其所有后代上的 jqLite/jQuery 数据。等效于 jqLite/jQuery 删除时如何在 Element 上调用
`cleanData()`：

https://github.com/angular/angular.js/blob/2e72ea13fa98bebf6ed4b5e3c45eaf5f990ed16f/src/jqLite.js#L349-L355
  https://github.com/jquery/jquery/blob/6984d1747623dbc5e87fd6c261a5b6b1628c107c/src/manipulation.js#L182



NOTE:
`cleanData()` will also invoke the AngularJS `$destroy` DOM event on the element:
  https://github.com/angular/angular.js/blob/2e72ea13fa98bebf6ed4b5e3c45eaf5f990ed16f/src/Angular.js#L1932-L1945

注意：`cleanData()` 还将调用元素上的 AngularJS `$destroy` DOM 事件：
https://github.com/angular/angular.js/blob/2e72ea13fa98bebf6ed4b5e3c45eaf5f990ed16f/src/Angular.js#L1932-L1945

Destroy an AngularJS app given the app `$injector`.

销毁给定应用程序 `$injector` 的 AngularJS 应用程序。

NOTE: Destroying an app is not officially supported by AngularJS, but try to do our best by
      destroying `$rootScope` and clean the jqLite/jQuery data on `$rootElement` and all
      descendants.

注意：AngularJS 不官方支持销毁应用程序，但请尽量通过销毁 `$rootScope` 并清理 `$rootElement`
和所有后代上的 jqLite/jQuery 数据来做到最好。

Whether the passed-in component implements the subset of the
    `ControlValueAccessor` interface needed for AngularJS `ng-model`
    compatibility.

传入的组件是否实现 AngularJS `ng-model` 兼容性所需的 `ControlValueAccessor` 接口的子集。

Glue the AngularJS `NgModelController` \(if it exists\) to the component
\(if it implements the needed subset of the `ControlValueAccessor` interface\).

将 AngularJS `NgModelController`（如果存在）粘合到组件（如果它实现了所需的
`ControlValueAccessor` 接口的子集）。

Test two values for strict equality, accounting for the fact that `NaN !== NaN`.

测试两个值的严格相等，考虑 `NaN !== NaN` 的事实。