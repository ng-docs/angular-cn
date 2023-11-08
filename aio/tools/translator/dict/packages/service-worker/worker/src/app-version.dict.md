A specific version of the application, identified by a unique manifest
as determined by its hash.

应用程序的特定版本，由唯一清单标识，该清单由其哈希确定。

Each `AppVersion` can be thought of as a published version of the app
that can be installed as an update to any previously installed versions.

每个 `AppVersion` 都可以被认为是应用程序的已发布版本，可以作为对任何以前安装的版本的更新安装。

Fully initialize this version of the application. If this Promise resolves successfully, all
required
data has been safely downloaded.

完全初始化此版本的应用程序。如果此 Promise 成功解析，则已安全下载了所有必需的数据。

Determine whether the request is a navigation request.
Takes into account: Request method and mode, `Accept` header, `navigationUrls` patterns.

确定请求是否是导航请求。考虑了：请求模式、 `Accept` 标头、 `navigationUrls` 模式。

Check this version for a given resource with a particular hash.

检查此版本以获取具有特定哈希的给定资源。

Check this version for a given resource regardless of its hash.

检查给定资源的此版本，无论其哈希值如何。

List all unhashed resources from all asset groups.

列出所有资产组中的所有未哈希资源。

Return a list of the names of all caches used by this version.

返回此版本使用的所有缓存名称的列表。

Get the opaque application data which was provided with the manifest.

获取清单附带的不透明应用程序数据。