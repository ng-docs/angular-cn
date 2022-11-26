# Skipping component subtrees

# 跳过组件子树

JavaScript, by default, uses mutable data structures that you can reference from multiple different components. Angular runs change detection over your entire component tree to make sure that the most up-to-date state of your data structures is reflected in the DOM.

默认情况下，JavaScript 会使用你可以从多个不同组件引用的可变数据结构。Angular 会在你的整个组件树上运行变更检测，以确保数据结构的最新状态反映在 DOM 中。

Change detection is sufficiently fast for most applications. However, when an application has an especially large component tree, running change detection across the whole application can cause performance issues. You can address this by configuring change detection to only run on a subset of the component tree.

对于大多数应用程序，变更检测都足够快。但是，当应用程序有特别大的组件树时，在整个应用程序中运行变更检测可能会导致性能问题。你可以通过将变更检测配置为仅在组件树的子集上运行来解决这个问题。

If you are confident that a part of the application is not affected by a state change, you can use [OnPush](https://angular.io/api/core/ChangeDetectionStrategy) to skip change detection in an entire component subtree.

如果你确信应用程序的一部分不受状态更改的影响，可以用 [OnPush](https://angular.io/api/core/ChangeDetectionStrategy) 跳过整个组件子树中的变更检测。

## Using `OnPush`

## 使用 OnPush

OnPush change detection instructs Angular to run change detection for a component subtree **only** when:

OnPush 变更检测会指示 Angular 仅在以下情况下为组件子树自动运行变更检测：
* The root component of the subtree receives new inputs as the result of a template binding. Angular compares the current and past value of the input with `==`

  子树的根组件接收到作为模板绑定的结果的新输入。Angular 将输入的当前值和过去值使用 `==` 进行比较

* Angular handles an event _(for example using event binding, output binding, or `@HostListener` )_ in the subtree's root component or any of its children whether they are using OnPush change detection or not.

  Angular 处理使用了 OnPush 变更检测策略的组件中的事件时

You can set the change detection strategy of a component to `OnPush` in the `@Component` decorator:

你可以在 `@Component` 装饰器中将组件的变更检测策略设置为 `OnPush` ：

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent {}
```

## Common change detection scenarios

## 常见的变更检测场景

This section examines several common change detection scenarios to illustrate Angular's behavior.

本节展示了几种常见的变更检测场景，以说明 Angular 的行为。

## An event is handled by a component with default change detection

## 事件由具有默认变更检测的组件处理

If Angular handles an event within a component without `OnPush` strategy, the framework executes change detection on the entire component tree. Angular will skip descendant component subtrees with roots using `OnPush`, which have not received new inputs.

如果 Angular 在没有 `OnPush` 策略的情况下处理组件中的事件，则框架会在整个组件树上执行变更检测。Angular 将跳过具有 `OnPush` 策略的组件的后代组件子树，如果该组件没有收到新输入的话。

As an example, if we set the change detection strategy of `MainComponent` to `OnPush` and the user interacts with a component outside the subtree with root `MainComponent`, Angular will check all the green components from the diagram below (`AppComponent`, `HeaderComponent`, `SearchComponent`, `ButtonComponent`) unless `MainComponent` receives new inputs:

比如，如果我们将 `MainComponent` 的变更检测策略设置为 `OnPush`，并且用户与具有根 `MainComponent` 的子树外的组件交互，Angular 将检查下图中的所有绿色组件（`AppComponent` 、 `HeaderComponent` 、 `SearchComponent` 、 `ButtonComponent`），除非 `MainComponent` 接收到了新的输入：

<div class="lightbox">
  <img alt="Change detection propagation from non-OnPush component" src="generated/images/guide/change-detection/event-trigger.svg">

</div>

## An event is handled by a component with OnPush

## 事件由具有 OnPush 的组件处理

If Angular handles an event within a component with OnPush strategy, the framework will execute change detection within the entire component tree. Angular will ignore component subtrees with roots using OnPush, which have not received new inputs and are outside the component which handled the event.

如果 Angular 使用 OnPush 策略处理组件中的事件，则框架将在整个组件树中执行变更检测。Angular 将忽略以具有 OnPush 策略的组件为根的组件子树（如果这个根组件尚未接收到新输入并且在处理此事件的组件外部）。

As an example, if Angular handles an event within `MainComponent`, the framework will run change detection in the entire component tree. Angular will ignore the subtree with root `LoginComponent` because it has `OnPush` and the event happened outside of its scope.

比如，如果 Angular 处理 `MainComponent` 中的事件，则框架将在整个组件树中运行变更检测。Angular 将忽略具有根 `LoginComponent` 的子树，因为该组件具有 `OnPush` 策略并且此事件发生在其范围之外。

<div class="lightbox">
  <img alt="Change detection propagation from OnPush component" src="generated/images/guide/change-detection/on-push-trigger.svg">

</div>

## An event is handled by a descendant of a component with OnPush

## 事件由具有 OnPush 的组件的后代处理

If Angular handles an event in a component with OnPush, the framework will execute change detection in the entire component tree, including the component’s ancestors.

如果 Angular 使用 OnPush 处理组件中的事件，则框架将在整个组件树中执行变更检测，包括组件的祖先。

As an example, in the diagram below, Angular handles an event in `LoginComponent` which uses OnPush. Angular will invoke change detection in the entire component subtree including `MainComponent` (`LoginComponent`’s parent), even though `MainComponent` has `OnPush` as well. Angular checks `MainComponent` as well because `LoginComponent` is part of its view.

比如，在下图中，Angular 会处理使用 OnPush 的 `LoginComponent` 中的事件。Angular 将在整个组件子树中调用变更检测，包括 `MainComponent`（`LoginComponent` 的父级），尽管 `MainComponent` 也有 `OnPush`。Angular 也会检查 `MainComponent`，因为 `LoginComponent` 是其视图的一部分。

<div class="lightbox">
  <img alt="Change detection propagation from nested OnPush component" src="generated/images/guide/change-detection/leaf-trigger.svg">

</div>

## New inputs to component with OnPush

## 具有 OnPush 策略的组件的新输入

Angular will run change detection within a child component with `OnPush` setting an input property as result of a template binding.

Angular 将在具有 `OnPush` 策略的子组件中运行变更检测，将 input 属性设置为模板绑定的结果。

For example, in the diagram below, `AppComponent` passes a new input to `MainComponent`, which has `OnPush`. Angular will run change detection in `MainComponent` but will not run change detection in `LoginComponent`, which also has `OnPush`, unless it receives new inputs as well.

比如，在下图中，`AppComponent` 会将新输入传递给 `MainComponent`，它具有 `OnPush` 策略。Angular 将在 `MainComponent` 中运行变更检测，但不会在同样具有 `OnPush` 策略的 `LoginComponent` 中运行变更检测，除非它也接收到新的输入。

<div class="lightbox">
  <img alt="Change detection propagation with OnPush component that receives new inputs" src="generated/images/guide/change-detection/on-push-input.svg">

</div>

## Edge cases

## 边缘情况

* **Modifying input properties in TypeScript code**. When you use an API like `@ViewChild` or `@ContentChild` to get a reference to a component in TypeScript and manually modify an `@Input` property, Angular will not automatically run change detection for OnPush components. If you need Angular to run change detection, you can inject `ChangeDetectorRef` in your component and call `changeDetectorRef.markForCheck()` to tell Angular to schedule a change detection.

  **修改 TypeScript 代码中的输入属性**。当你使用 `@ViewChild` 或 `@ContentChild` 等 API 来获取对 TypeScript 中组件的引用并手动修改 `@Input` 属性时，Angular 将不会自动为 OnPush 组件运行变更检测。如果你需要 Angular 运行变更检测，你可以在你的组件中注入 `ChangeDetectorRef` 并调用 `changeDetectorRef.markForCheck()` 来告诉 Angular 为其安排一次变更检测。

* **Modifying object references**. In case an input receives a mutable object as value and you modify the object but preserve the reference, Angular will not invoke change detection. That’s the expected behavior because the previous and the current value of the input point to the same reference.

  **修改对象引用**。如果输入接收到可变对象作为值，并且你修改了对象内容但引用没变，则 Angular 将不会调用变更检测。这是预期的行为，因为输入的前一个值和当前值都指向了同一个引用。

@reviewed 2022-05-04