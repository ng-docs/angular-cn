# Prerendering static pages

# 预先渲染静态页面

Angular Universal lets you prerender the pages of your application.
Prerendering is the process where a dynamic page is processed at build time generating static HTML.

Angular Universal 允许你预先渲染应用程序的页面。预先渲染是在构建时处理动态页面生成静态 HTML 的过程。

## How to prerender a page

## 如何预先渲染页面

To prerender a static page make sure to add Server-Side Rendering (SSR) capabilities to your application.
For more information see the [universal guide](guide/universal).
Once SSR is added, run the following command:

要预先渲染静态页面，要先向你的应用程序添加服务端渲染（SSR）功能。有关更多信息，请参阅 [Universal 指南](guide/universal)。添加 SSR 后，运行以下命令：

<code-example format="shell" language="shell">

npm run prerender

</code-example>

### Build options for prerendering

### 预先渲染的构建选项

When you add prerendering to your application, the following build options are available:

向应用程序添加预先渲染时，可以使用以下构建选项：

| Options | Details |
| :------ | :------ |
| 选项 | 详情 |
| `browserTarget` | Specify the target to build. |
| `browserTarget` | 指定要构建的目标。 |
| `serverTarget` | Specify the Server target to use for prerendering the application. |
| `serverTarget` | 指定用于预先渲染的应用程序的服务器目标。 |
| `routes` | Define an array of extra routes to prerender. |
| `routes` | 定义要预先渲染的额外路由数组。 |
| `guessRoutes` | Whether builder should extract routes and guess which paths to render. Defaults to `true`. |
| `guessRoutes` | 构建器是否应该提取路由并猜测要渲染的路径。默认为 `true`。 |
| `routesFile` | Specify a file that contains a list of all routes to prerender, separated by newlines. This option is useful if you have a large number of routes. |
| `routesFile` | 指定一个文件，其中包含要预先渲染的所有路由的列表，以换行符分隔。如果你有大量路由，则此选项很有用。 |
| `numProcesses` | Specify the number of CPUs to be used while running the prerendering command. |
| `numProcesses` | 指定在运行预先渲染命令时要使用的 CPU 数量。 |

### Prerendering dynamic routes

### 预先渲染动态路由

You can prerender dynamic routes.
An example of a dynamic route is `product/:id`, where `id` is dynamically provided.

你还可以预先渲染动态路由。动态路由的一个例子是 `product/:id`，其中 `id` 是动态提供的。

To prerender dynamic routes, choose one from the following options:

要预先渲染动态路由，请从以下选项中选择一个：

* Provide extra routes in the command line

  在命令行中提供额外的路由

* Provide routes using a file

  使用文件来提供路由

* Prerender specific routes

  预先渲染指定路由

#### Provide extra routes in the command line

#### 在命令行中提供额外的路由

While running the prerender command, you can provide extra routes.
For example:

在运行 prerender 命令时，你可以提供额外的路由。比如：

<code-example format="shell" language="shell">

ng run &lt;app-name&gt;:prerender --routes /product/1 /product/2

</code-example>

#### Providing extra routes using a file

#### 使用文件提供额外的路由

You can provide routes using a file to create static pages.
This method is useful if you have a large number of routes to create. For example, product details for an e-commerce application, which might come from an external source, like a Database or Content Management System (CMS).

你可以使用文件提供路由以创建静态页面。如果你要创建的大量路由（比如电子商务应用程序的产品详细信息）可能来自外部源，比如数据库或内容管理系统（CMS），则此方法很有用。

To provide routes using a file, use the `--routes-file` option with the name of a `.txt` file containing the routes.

要使用文件来提供路由，请使用 `--routes-file` 选项和包含路由的 `.txt` 文件的名称。

For example, you could create this file by using a script to extract IDs from a database and save them to a `routes.txt` file:

比如，你可以通过使用脚本从数据库中提取 ID 并将它们保存到 `routes.txt` 文件来创建此文件：

<code-example language="none" header="routes.txt">

/products/1
/products/555

</code-example>

When your `.txt` file is ready, run the following command to prerender the static files with dynamic values:

当你的 `.txt` 文件准备好后，运行以下命令以使用一些动态值来预先渲染静态文件：

<code-example format="shell" language="shell">

ng run &lt;app-name&gt;:prerender --routes-file routes.txt

</code-example>

#### Prerendering specific routes

#### 预先渲染特定路由

You can also pass specific routes to the prerender command.
If you choose this option, make sure to turn off the `guessRoutes` option.

你还可以将特定路由传递给 prerender 命令。如果你选择此选项，请确保关闭 `guessRoutes` 选项。

<code-example format="shell" language="shell">

ng run &lt;app-name&gt;:prerender --no-guess-routes --routes /product/1 /product/1

</code-example>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28