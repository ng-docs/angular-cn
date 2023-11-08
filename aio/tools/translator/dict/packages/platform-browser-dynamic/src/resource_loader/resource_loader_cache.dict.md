This was previously necessary in some cases to test AOT-compiled components with View
    Engine, but is no longer since Ivy.

以前，在某些情况下，要使用 View Engine 测试 AOT 编译的组件，这是必要的，但从 Ivy
开始就不再是这样了。

An implementation of ResourceLoader that uses a template cache to avoid doing an actual
ResourceLoader.

ResourceLoader 的实现，该实现使用模板缓存来避免执行实际的 ResourceLoader。

The template cache needs to be built and loaded into window.$templateCache
via a separate mechanism.

模板缓存需要通过单独的机制构建并加载到 `window.$templateCache` 中。