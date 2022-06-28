# Deploy multiple locales

# 部署多个语言环境

If `myapp` is the directory that contains the distributable files of your project, you typically make different versions available for different locales in locale directories.
For example, your French version is located in the `myapp/fr` directory and the Spanish version is located in the `myapp/es` directory.

如果 `myapp` 是包含项目可分发文件的目录，你通常会在语言环境目录中为不同的语言环境提供不同的版本，比如法语版的 `myapp/fr` 和西班牙语版的 `myapp/es`。

The HTML `base` tag with the `href` attribute specifies the base URI, or URL, for relative links.
If you set the `"localize"` option in [`angular.json`][AioGuideWorkspaceConfig] workspace build configuration file to `true` or to an array of locale IDs, the CLI adjusts the base `href` for each version of the application.
To adjust the base `href` for each version of the application, the CLI adds the locale to the configured `"baseHref"`.
Specify the `"baseHref"` for each locale in your [`angular.json`][AioGuideWorkspaceConfig] workspace build configuration file.
The following example displays `"baseHref"` set to an empty string.

带有 `href` 属性的 HTML `base` 标签指定了相对链接的基本 URI 或 URL。如果你将工作空间构建配置文件 [`angular.json`][AioGuideWorkspaceConfig] 中的 `"localize"` 选项设置为 `true` 或语言环境 ID 数组，CLI 会为应用程序的每个版本调整 base `href`。要为应用程序的每个版本调整 base `href`，CLI 会将语言环境添加到配置的 `"baseHref"` 中。在工作区配置文件 [`angular.json`][AioGuideWorkspaceConfig] 中为每个语言环境指定 `"baseHref"`。以下示例展示了设置为空字符串的 `"baseHref"`。

<code-example header="angular.json" path="i18n/angular.json" region="i18n-baseHref"></code-example>

Also, to declare the base `href` at compile time, use the CLI `--baseHref` option with [`ng build`][AioCliBuild].

此外，要在编译时声明 base `href`，请将在 CLI 中使用带有 `--baseHref` 选项的 [ `ng build` ][AioCliBuild]。

## Configure a server

## 配置服务器

Typical deployment of multiple languages serve each language from a different subdirectory.
Users are redirected to the preferred language defined in the browser using the `Accept-Language` HTTP header.
If the user has not defined a preferred language, or if the preferred language is not available, then the server falls back to the default language.
To change the language, change your current location to another subdirectory.
The change of subdirectory often occurs using a menu implemented in the application.

多语言的典型部署方式是为来自不同子目录的每种语言提供服务。使用 `Accept-Language` HTTP 标头将用户重定向到浏览器中定义的首选语言。如果用户未定义首选语言，或者首选语言不可用，则服务器将回退到默认语言。要更改语言，就转到另一个子目录。
子目录的更改通常使用应用程序中实现的菜单进行。

<div class="alert is-helpful">

For more information on how to deploy apps to a remote server, see [Deployment][AioGuideDeployment].

有关如何将应用程序部署到远程服务器的更多信息，请参阅[部署][AioGuideDeployment]。

</div>

### Nginx example

### Nginx 范例

The following example displays an Nginx configuration.

以下示例展示了 Nginx 配置。

<code-example path="i18n/doc-files/nginx.conf" language="nginx"></code-example>

### Apache example

### Apache 范例

The following example displays an Apache configuration.

以下示例展示了 Apache 配置。

<code-example path="i18n/doc-files/apache2.conf" language="apache"></code-example>

<!-- links -->

[AioCliBuild]: cli/build "ng build | CLI | Angular"

[AioGuideDeployment]: guide/deployment "Deployment | Angular"

[AioGuideWorkspaceConfig]: guide/workspace-config "Angular workspace configuration | Angular"

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28