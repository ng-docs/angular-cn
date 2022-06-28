# Resolving Zone Pollution

# 解决区域（Zone）污染

**Zone.js** is a signaling mechanism that Angular uses to detect when an application state might have changed. It captures asynchronous operations like `setTimeout`, network requests, and event listeners. Angular schedules change detection based on signals from Zone.js

**Zone.js**是一种信号机制，Angular 用它来检测应用程序状态何时可能已更改。它捕获异步操作，比如 `setTimeout`、网络请求和事件侦听器。Angular 会根据来自 Zone.js 的信号安排变更检测

There are cases in which scheduled [tasks](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide#tasks) or [microtasks](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide#microtasks) don’t make any changes in the data model, which makes running change detection unnecessary. Common examples are:

在某些情况下，某些已安排的[任务](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide#tasks)或[微任务](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide#microtasks)不会对数据模型进行任何更改，这使得运行变更检测变得不必要。常见的例子是：

* `requestAnimationFrame`, `setTimeout` or `setInterval`

  `requestAnimationFrame` 、 `setTimeout` 或 `setInterval`

* Task or microtask scheduling by third-party libraries

  第三方库的任务或微任务调度

This section covers how to identify such conditions, and how to run code outside the Angular zone to avoid unnecessary change detection calls.

本节介绍如何识别此类条件，以及如何在 Angular 区域外运行代码以避免不必要的变更检测调用。

## Identifying unnecessary change detection calls

## 识别不必要的变更检测调用

You can detect unnecessary change detection calls using Angular DevTools. Often they appear as consecutive bars in the profiler’s timeline with source `setTimeout`, `setInterval`, `requestAnimationFrame`, or an event handler. When you have limited calls within your application of these APIs, the change detection invocation is usually caused by a third-party library.

你可以用 Angular DevTools 检测不必要的变更检测调用。它们通常在分析器的时间线中显示为连续的条形，其源为 `setTimeout`、`setInterval`、`requestAnimationFrame` 或事件处理程序。当你在应用程序中对这些 API 的调用有限时，变更检测调用通常是由第三方库引起的。

<div class="lightbox">
  <img alt="Angular DevTools profiler preview showing Zone pollution" src="generated/images/guide/change-detection/zone-pollution.png">

</div>

In the image above, there is a series of change detection calls triggered by event handlers associated with an element. That’s a common challenge when using third-party, non-native Angular components, which do not alter the default behavior of `NgZone`.

在上图中，有一系列由与元素关联的事件处理程序触发的变更检测调用。这是使用第三方非原生 Angular 组件时的常见挑战，这些组件不会更改 `NgZone` 的默认行为。

## Run tasks outside NgZone

## 在 NgZone 之外运行任务

In such cases, we can instruct Angular to avoid calling change detection for tasks scheduled by a given piece of code using  [NgZone](https://angular.io/guide/zone).

在这种情况下，我们可以指示 Angular 避免使用[NgZone](https://angular.io/guide/zone)为给定代码段调度的任务调用变更检测。

```ts
import { Component, NgZone, OnInit } from '@angular/core';
@Component(...)
class AppComponent implements OnInit {
  constructor(private ngZone: NgZone) {}
  ngOnInit() {
    this.ngZone.runOutsideAngular(() => setInterval(pollForUpdates), 500);
  }
}
```

The snippet above instructs Angular that it should execute the `setInterval` call outside the Angular Zone and skip running change detection after `pollForUpdates` runs.

上面的代码段告诉 Angular，它应该在 Angular Zone 之外执行 `setInterval` 调用，并在 `pollForUpdates` 运行之后跳过运行变更检测。

Third-party libraries commonly trigger unnecessary change detection cycles because they weren't authored with Zone.js in mind. Avoid these extra cycles by calling library APIs outside the Angular zone:

第三方库通常会触发不必要的变更检测周期，因为它们在创作时并没有考虑到 Zone.js。通过调用 Angular 区域外的库 API 来避免这些额外的周期：

```ts
import { Component, NgZone, OnInit } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';

@Component(...)
class AppComponent implements OnInit {
  constructor(private ngZone: NgZone) {}
  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      Plotly.newPlot('chart', data);
    });
  }
}
```

Running `Plotly.newPlot('chart', data);` within `runOutsideAngular` instructs the framework that it shouldn’t execute change detection after the execution of tasks scheduled by the initialization logic.

在 `runOutsideAngular` 中运行 `Plotly.newPlot('chart', data);` 会告诉框架它不应该在执行此初始化逻辑安排的这些任务之后执行变更检测。

For example, if `Plotly.newPlot('chart', data)` adds event listeners to a DOM element, Angular will not execute change detection after the execution of their handlers.

比如，如果 `Plotly.newPlot('chart', data)` 将事件侦听器添加到 DOM 元素，则 Angular 将不会在执行其处理程序之后执行变更检测。

@reviewed 2022-05-04