Provides a preloading strategy.

提供预加载策略。

Provides a preloading strategy that preloads all modules as quickly as possible.

提供一种预加载策略，以尽快预加载所有模块。

Provides a preloading strategy that does not preload any modules.

提供不预加载任何模块的预加载策略。

This strategy is enabled by default.

默认情况下启用此策略。

The preloader optimistically loads all router configurations to
make navigations into lazily-loaded sections of the application faster.

预加载器会乐观加载所有路由器配置，以使导航到应用程序的惰性加载部分的速度更快。

The preloader runs in the background. When the router bootstraps, the preloader
starts listening to all navigation events. After every such event, the preloader
will check if any configurations can be loaded lazily.

预加载器在后台运行。路由器引导时，预加载器开始监听所有导航事件。在每个此类事件之后，预加载器将检查是否可以惰性加载任何配置。

If a route is protected by `canLoad` guards, the preloaded will not load it.

如果路由受 `canLoad` 保护器保护，则预加载的路由不会加载该路由。