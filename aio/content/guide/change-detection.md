# Angular change detection and runtime optimization

# Angular 变更检测和运行时优化

**Change detection** is the process through which Angular checks to see whether your application state has changed, and if any DOM needs to be updated. At a high level, Angular walks your components from top to bottom, looking for changes. Angular runs its change detection mechanism periodically so that changes to the data model are reflected in an application’s view. Change detection can be triggered either manually or through an asynchronous event (for example, a user interaction or an XMLHttpRequest completion).

**变更检测**是 Angular 检查你的应用程序状态是否已更改以及是否需要更新任何 DOM 的过程。大体而言，Angular 会从上到下遍历你的组件，寻找更改。Angular 会定期运行其变更检测机制，以便对数据模型的更改反映在应用程序的视图中。变更检测可以手动触发，也可以通过异步事件（比如用户交互或 XHR 自动完成）来触发。

Change detection is a highly optimized performant, but it can still cause slowdowns if the application runs it too frequently.

变更检测具有一种高度优化的性能，但如果应用程序过于频繁的运行它，它仍然会导致变慢。

In this guide, you’ll learn how to control and optimize the change detection mechanism by skipping parts of your application and running change detection only when necessary.

在本指南中，你将了解如何通过跳过应用程序的某些部分并仅在必要时运行变更检测来控制和优化变更检测机制。

Watch this video if you prefer to learn more about performance optimizations in a media format:

如果你更想了解有关媒体格式性能优化的更多信息，请观看此视频：

<div class="video-container">
  <video controls>
    <source src="http://videos.angular.cn/4 Runtime Performance Optimizations-f8sA-i6gkGQ.webm" type="video/webm">
    <source src="http://videos.angular.cn/4 Runtime Performance Optimizations-f8sA-i6gkGQ.mp4" type="video/mp4">
    <track src="http://videos.angular.cn/4 Runtime Performance Optimizations-f8sA-i6gkGQ.en.vtt" label="English" kind="subtitles" srclang="en">
    <track src="http://videos.angular.cn/4 Runtime Performance Optimizations-f8sA-i6gkGQ.cn.vtt" label="简体中文" kind="subtitles" srclang="cn" default>
    <p>注意：本视频不支持 IE 浏览器</p>
  </video>
</div>

@reviewed 2022-05-04