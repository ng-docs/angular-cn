Config options recognized by the image loader function.

图像加载器功能识别的配置选项。

Image file name to be added to the image request URL.

要添加到图像请求 URL 的图像文件名。

Width of the requested image \(to be used when generating srcset\).

请求图像的宽度（生成 srcset 时使用）。

Additional user-provided parameters for use by the ImageLoader.

供 ImageLoader 使用的其他用户提供的参数。

Represents an image loader function. Image loader functions are used by the
NgOptimizedImage directive to produce full image URL based on the image name and its width.

表示图像加载器函数。NgOptimizedImage 指令使用图像加载器函数根据图像名称及其宽度生成完整的图像 URL。

Noop image loader that does no transformation to the original src and just returns it as is.
This loader is used as a default one if more specific logic is not provided in an app config.

Noop 图像加载器，不对原始 src 进行转换，只是按原样返回。如果应用程序配置中未提供更具体的逻辑，则此加载器将用作默认加载器。

Metadata about the image loader.

关于图像加载器的元数据。

Injection token that configures the image loader function.

配置图像加载器功能的注入令牌。

a function returning a full URL based on loader's configuration

一个基于加载器配置返回完整 URL 的函数

example of full URLs for a given loader \(used in error messages\)

给定加载程序的完整 URL 示例（在错误消息中使用）

a set of DI providers corresponding to the configured image loader

一组与配置的图像加载器对应的 DI 提供程序

Internal helper function that makes it easier to introduce custom image loaders for the
`NgOptimizedImage` directive. It is enough to specify a URL builder function to obtain full DI
configuration for a given loader: a DI token corresponding to the actual loader function, plus DI
tokens managing preconnect check functionality.

内部辅助函数，可以更轻松地为 `NgOptimizedImage` 指令引入自定义图像加载器。指定一个 URL 构建器函数就足以为给定的加载器获取完整的 DI 配置：一个对应于实际加载器函数的 DI 令牌，加上管理预连接检查功能的 DI 令牌。