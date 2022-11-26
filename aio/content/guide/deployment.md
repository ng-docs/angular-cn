# Deployment

# 部署

When you are ready to deploy your Angular application to a remote server, you have various options for deployment.

当你准备把 Angular 应用部署到远程服务器上时，有很多可选的部署方式。

<a id="dev-deploy"></a>
<a id="copy-files"></a>

## Simple deployment options

## 最简单的部署选项

Before fully deploying your application, you can test the process, build configuration, and deployed behavior by using one of these interim techniques.

在完整部署应用之前，你可以先临时用一种技术来测试流程、构建配置和部署行为。

### Building and serving from disk

### 从磁盘构建和提供服务

During development, you typically use the `ng serve` command to build, watch, and serve the application from local memory, using [webpack-dev-server](https://webpack.js.org/guides/development/#webpack-dev-server).
When you are ready to deploy, however, you must use the `ng build` command to build the application and deploy the build artifacts elsewhere.

在开发过程中，你通常会使用 `ng serve` 命令来借助 [webpack-dev-server](https://webpack.js.org/guides/development/#webpack-dev-server) 在本地内存中构建、监控和提供服务。但是，当你打算部署它时，就必须使用 `ng build` 命令来构建应用并在其它地方部署这些构建成果。

Both `ng build` and `ng serve` clear the output folder before they build the project, but only the `ng build` command writes the generated build artifacts to the output folder.

`ng build` 和 `ng serve` 在构建项目之前都会清除输出文件夹，但只有 `ng build` 命令会把生成的构建成果写入输出文件夹中。

<div class="alert is-helpful">

The output folder is `dist/project-name/` by default.
To output to a different folder, change the `outputPath` in `angular.json`.

默认情况下，输出目录是 `dist/project-name/`。要输出到其它文件夹，就要修改 `angular.json` 中的 `outputPath`。

</div>

As you near the end of the development process, serving the contents of your output folder from a local web server can give you a better idea of how your application will behave when it is deployed to a remote server.
You will need two terminals to get the live-reload experience.

当开发临近收尾时，让本地 Web 服务器使用输出文件夹中的内容提供服务可以让你更好地了解当应用部署到远程服务器时的行为。你需要用两个终端才能体验到实时刷新的特性。

* On the first terminal, run the [`ng build` command](cli/build) in *watch* mode to compile the application to the `dist` folder.

  在第一个终端上，在*监控（watch）*模式下执行 [`ng build` 命令](cli/build)把该应用编译进 `dist` 文件夹。

  <code-example format="shell" language="shell">

  ng build --watch

  </code-example>

  Like the `ng serve` command, this regenerates output files when source files change.

  与 `ng serve` 命令一样，当源文件发生变化时，就会重新生成输出文件。

* On the second terminal, install a web server (such as [lite-server](https://github.com/johnpapa/lite-server)), and run it against the output folder.
  For example:

  在第二个终端上，安装一个 Web 服务器（比如 [lite-server](https://github.com/johnpapa/lite-server)），然后使用输出文件夹中的内容运行它。比如：

  <code-example format="shell" language="shell">

  lite-server --baseDir="dist/project-name"

  </code-example>

  The server will automatically reload your browser when new files are output.

  每当输出了新文件时，服务器就会自动刷新你的浏览器。

<div class="alert is-critical">

This method is for development and testing only, and is not a supported or secure way of deploying an application.

该方法只能用于开发和测试，在部署应用时，它不受支持，也不是安全的方式。

</div>

### Automatic deployment with the CLI

### 使用 CLI 进行自动部署

The Angular CLI command `ng deploy` (introduced in version 8.3.0) executes the `deploy` [CLI builder](guide/cli-builder) associated with your project.
A number of third-party builders implement deployment capabilities to different platforms.
You can add any of them to your project by running `ng add [package name]`.

Angular CLI 命令 `ng deploy`（在版本 8.3.0 中引入）执行与你的项目关联的 `deploy` [CLI 构建器](guide/cli-builder)。有许多第三方构建器实现了到不同平台的部署功能。你可以通过运行 `ng add [package name]` 把它们中的任何一个添加到项目中。

When you add a package with deployment capability, it'll automatically update your workspace configuration (`angular.json` file) with a `deploy` section for the selected project.
You can then use the `ng deploy` command to deploy that project.

添加具有部署功能的程序包时，它将为所选项目自动更新自动更新工作区配置（`angular.json` 文件）中的 `deploy` 部分。然后，你就可以使用 `ng deploy` 命令来部署该项目了。

For example, the following command automatically deploys a project to Firebase.

比如，以下命令将项目自动部署到 Firebase。

<code-example format="shell" language="shell">

ng add @angular/fire
ng deploy

</code-example>

The command is interactive.
In this case, you must have or create a Firebase account, and authenticate using that account.
The command prompts you to select a Firebase project for deployment

该命令是交互式的。在这种情况下，你必须拥有或创建 Firebase 帐户，并使用该帐户进行身份验证。该命令提示你选择要部署的 Firebase 项目。

The command builds your application and uploads the production assets to Firebase.

该命令会构建你的应用，并将生产环境的资产文件上传到 Firebase。

In the table below, you can find a list of packages which implement deployment functionality to different platforms.
The `deploy` command for each package may require different command line options.
You can read more by following the links associated with the package names below:

在下表中，你可以找到实现了到不同平台部署功能的软件包列表。每个软件包的 `deploy` 命令可能需要不同的命令行选项。你可以通过以下与包名称相关的链接来阅读更多内容：

| Deployment to | Package |
| :------------ | :------ |
| 部署到 | 包 |
| [Firebase hosting](https://firebase.google.com/docs/hosting) | [`@angular/fire`](https://npmjs.org/package/@angular/fire) |
| [Firebase 托管](https://firebase.google.com/docs/hosting) | [`@angular/fire`](https://npmjs.org/package/@angular/fire) |
| [Vercel](https://vercel.com/solutions/angular) | [`vercel init angular`](https://github.com/vercel/vercel/tree/main/examples/angular) |
| [Netlify](https://www.netlify.com) | [`@netlify-builder/deploy`](https://npmjs.org/package/@netlify-builder/deploy) |
| [GitHub pages](https://pages.github.com) | [`angular-cli-ghpages`](https://npmjs.org/package/angular-cli-ghpages) |
| [GitHub 页面](https://pages.github.com) | [`angular-cli-ghpages`](https://npmjs.org/package/angular-cli-ghpages) |
| [NPM](https://npmjs.com) | [`ngx-deploy-npm`](https://npmjs.org/package/ngx-deploy-npm) |
| [Amazon Cloud S3](https://aws.amazon.com/s3/?nc2=h_ql_prod_st_s3) | [`@jefiozie/ngx-aws-deploy`](https://www.npmjs.com/package/@jefiozie/ngx-aws-deploy) |
| [亚马逊云 S3](https://aws.amazon.com/s3/?nc2=h_ql_prod_st_s3) | [`@jefiozie/ngx-aws-deploy`](https://www.npmjs.com/package/@jefiozie/ngx-aws-deploy) |

If you're deploying to a self-managed server or there's no builder for your favorite cloud platform, you can either create a builder that allows you to use the `ng deploy` command, or read through this guide to learn how to manually deploy your application.

如果要部署到自己管理的服务器上，或者缺少针对你喜欢的云平台的构建器，则可以创建支持你使用 `ng deploy` 命令的构建器，或者通读本指南以了解如何手动部署应用程序。

### Basic deployment to a remote server

### 最简化的部署方式

For the simplest deployment, create a production build and copy the output directory to a web server.

最简化的部署方式就是为开发环境构建，并把其输出复制到 Web 服务器上。

1. Start with the production build:

   使用开发环境进行构建

   <code-example format="shell" language="shell">

   ng build

   </code-example>

1. Copy *everything* within the output folder (`dist/project-name/` by default) to a folder on the server.

   把输出目录（默认为 `dist/`）下的*每个文件*都复制到到服务器上的某个目录下。

1. Configure the server to redirect requests for missing files to `index.html`.
   Learn more about server-side redirects [below](#fallback).

   配置服务器，让缺失的文件都重定向到 `index.html` 上。
   欲知详情，参阅[稍后](#fallback)的服务端重定向部分。

This is the simplest production-ready deployment of your application.

这是对应用进行生产环境部署的最简方式。

<a id="deploy-to-github"></a>

### Deploy to GitHub Pages

### 部署到 GitHub Pages

To deploy your Angular application to [GitHub Pages](https://help.github.com/articles/what-is-github-pages), complete the following steps:

要将 Angular 应用程序部署到 [GitHub Pages](https://help.github.com/articles/what-is-github-pages)，请遵循以下步骤：

1. [Create a GitHub repository](https://help.github.com/articles/create-a-repo) for your project.

   为你的项目[创建一个 GitHub Pages 仓库](https://help.github.com/articles/create-a-repo)。

1. Configure `git` in your local project by adding a remote that specifies the GitHub repository you created in previous step.
   GitHub provides these commands when you create the repository so that you can copy and paste them at your command prompt.
   The commands should be similar to the following, though GitHub fills in your project-specific settings for you:

   通过添加指定你在上一步中创建的 GitHub 存储库的远端地址，来在本地项目中配置 `git`。创建存储库时，GitHub 已提供了这些命令，以便你可以在命令提示符下复制和粘贴它们。尽管 GitHub 会为你填上某些特定于项目的设置，但这些命令应该类似于以下形式：

   <code-example format="shell" language="shell">

   git remote add origin https://github.com/your-username/your-project-name.git
   git branch -M main
   git push -u origin main

   </code-example>

   When you paste these commands from GitHub, they run automatically.

   当你从 GitHub 粘贴这些命令时，它们会自动运行。

1. Create and check out a `git` branch named `gh-pages`.

   创建并签出一个名为 `gh-pages` 的 `git` 分支。

   <code-example format="shell" language="shell">

   git checkout -b gh-pages

   </code-example>

1. Build your project using the GitHub project name, with the Angular CLI command [`ng build`](cli/build) and the following options, where `your_project_name` is the name of the project that you gave the GitHub repository in step 1.

   借助 Angular CLI 命令 [`ng build`](cli/build)和以下选项，使用 Github 项目名称构建应用。这里的 `your_project_name` 是你在步骤 1 中为 GitHub 存储库提供的项目的名称。

   Be sure to include the slashes on either side of your project name as in `/your_project_name/`.

   确保在项目名称的两边都包含有斜杠，如 `/your_project_name/` 的斜杠。

   <code-example format="shell" language="shell">

   ng build --output-path docs --base-href /your_project_name/

   </code-example>

1. When the build is complete, make a copy of `docs/index.html` and name it `docs/404.html`.

   当构建完成时，把 `docs/index.html` 复制为 `docs/404.html`。

1. Commit your changes and push.

   提交你的更改，并推送。

1. On the GitHub project page, go to Settings and scroll down to the GitHub Pages section to configure the site to [publish from the docs folder](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#choosing-a-publishing-source).

   在 GitHub 项目页面上，转到 Settings 并向下滚动到 GitHub Pages 部分，以配置[要从 docs 文件夹发布](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#choosing-a-publishing-source)的站点。

1. Click Save.

   单击保存。

1. Click on the GitHub Pages link at the top of the GitHub Pages section to see your deployed application.
   The format of the link is `https://<user_name>.github.io/<project_name>`.

   单击 GitHub Pages 区顶部的 “GitHub Pages” 链接，以查看已部署的应用程序。链接的格式为 `https://<user_name>.github.io/<project_name>`。

<div class="alert is-helpful">

Check out [angular-cli-ghpages](https://github.com/angular-buch/angular-cli-ghpages), a full-featured package that does all this for you and has extra functionality.

 参阅 [angular-cli-ghpages](https://github.com/angular-buch/angular-cli-ghpages)，这个包用到了全部这些特性，还提供了一些额外功能。

</div>

<a id="server-configuration"></a>

## Server configuration

## 服务端配置

This section covers changes you may have to make to the server or to files deployed on the server.

这一节涵盖了你可能对服务器或准备部署到服务器的文件要做的那些修改。

<a id="fallback"></a>

### Routed apps must fall back to `index.html`

### 带路由的应用必须以 `index.html` 作为后备页面

Angular applications are perfect candidates for serving with a simple static HTML server.
You don't need a server-side engine to dynamically compose application pages because
Angular does that on the client-side.

Angular 应用很适合用简单的静态 HTML 服务器提供服务。
你不需要服务端引擎来动态合成应用页面，因为 Angular 会在客户端完成这件事。

If the application uses the Angular router, you must configure the server to return the application's host page (`index.html`) when asked for a file that it does not have.

如果该应用使用 Angular 路由器，你就必须配置服务器，让它对不存在的文件返回应用的宿主页(`index.html`)。

<a id="deep-link"></a>

A routed application should support "deep links".
A *deep link* is a URL that specifies a path to a component inside the application.
For example, `http://www.mysite.com/heroes/42` is a *deep link* to the hero detail page that displays the hero with `id: 42`.

带路由的应用应该支持“深链接”。
所谓*深链接*就是指一个 URL，它用于指定到应用内某个组件的路径。
比如，`http://www.mysite.com/heroes/42` 就是一个到英雄详情页面的*深链接*，用于显示 `id: 42` 的英雄。

There is no issue when the user navigates to that URL from within a running client.
The Angular router interprets the URL and routes to that page and hero.

当用户从运行中的客户端应用导航到这个 URL 时，这没问题。
Angular 路由器会拦截这个 URL，并且把它路由到正确的页面。

But clicking a link in an email, entering it in the browser address bar, or merely refreshing the browser while on the hero detail page —all of these actions are handled by the browser itself, *outside* the running application.
The browser makes a direct request to the server for that URL, bypassing the router.

但是，当从邮件中点击链接或在浏览器地址栏中输入它或仅仅在英雄详情页刷新下浏览器时，所有这些操作都是由浏览器本身处理的，在应用的控制范围之外。
浏览器会直接向服务器请求那个 URL，路由器没机会插手。

A static server routinely returns `index.html` when it receives a request for `http://www.mysite.com/`.
But it rejects `http://www.mysite.com/heroes/42` and returns a `404 - Not Found` error *unless* it is configured to return `index.html` instead.

静态服务器会在收到对 `http://www.mysite.com/` 的请求时返回 `index.html`，但是会拒绝对 `http://www.mysite.com/heroes/42` 的请求，
并返回一个 `404 - Not Found` 错误，除非，它被配置成了返回 `index.html`。

#### Fallback configuration examples

#### 后备页面配置范例

There is no single configuration that works for every server.
The following sections describe configurations for some of the most popular servers.
The list is by no means exhaustive, but should provide you with a good starting point.

没有一种配置可以适用于所有服务器。
后面这些部分会描述对常见服务器的配置方式。
这个列表虽然不够详尽，但可以为你提供一个良好的起点。

| Servers | Details |
| :------ | :------ |
| 服务器 | 详细信息 |
| [Apache](https://httpd.apache.org) | Add a [rewrite rule](https://httpd.apache.org/docs/current/mod/mod_rewrite.html) to the `.htaccess` file as shown ([ngmilk.rocks/2015/03/09/angularjs-html5-mode-or-pretty-urls-on-apache-using-htaccess](https://ngmilk.rocks/2015/03/09/angularjs-html5-mode-or-pretty-urls-on-apache-using-htaccess)): <code-example format="apache" language="apache"> RewriteEngine On &NewLine;&nbsp; &num; If an existing asset or directory is requested go to it as it is &NewLine;&nbsp; RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR] &NewLine;&nbsp; RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d &NewLine;&nbsp; RewriteRule ^ - [L] &NewLine; &NewLine;&nbsp; &num; If the requested resource doesn't exist, use index.html &NewLine;&nbsp; RewriteRule ^ /index.html </code-example> |
| [Apache](https://httpd.apache.org) | 如图所示，向 `.htaccess` 文件添加[重写规则](https://httpd.apache.org/docs/current/mod/mod_rewrite.html)（[ngmilk.rocks/2015/03/09/angularjs-html5-mode-or-pretty-urls-on-apache-using-htaccess](https://ngmilk.rocks/2015/03/09/angularjs-html5-mode-or-pretty-urls-on-apache-using-htaccess)）：<code-example format="apache" language="apache"> RewriteEngine On &NewLine;&nbsp; &num; If an existing asset or directory is requested go to it as it is &NewLine;&nbsp; RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR] &NewLine;&nbsp; RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d &NewLine;&nbsp; RewriteRule ^ - [L] &NewLine; &NewLine;&nbsp; &num; If the requested resource doesn't exist, use index.html &NewLine;&nbsp; RewriteRule ^ /index.html </code-example> |
| [Nginx](https://nginx.org) | Use `try_files`, as described in [Front Controller Pattern Web Apps](https://www.nginx.com/resources/wiki/start/topics/tutorials/config_pitfalls/#front-controller-pattern-web-apps), modified to serve `index.html`: <code-example format="nginx" language="nginx"> try_files &dollar;uri &dollar;uri/ /index.html; </code-example> |
| [Nginx](https://nginx.org) | 使用 `try_files`，如[前端控制器模式 Web 应用程序](https://www.nginx.com/resources/wiki/start/topics/tutorials/config_pitfalls/#front-controller-pattern-web-apps)中所述，修改为提供 `index.html` ：<code-example format="nginx" language="nginx"> try_files &dollar;uri &dollar;uri/ /index.html; </code-example> |
| [Ruby](https://www.ruby-lang.org) | Create a Ruby server using ([sinatra](http://sinatrarb.com)) with a basic Ruby file that configures the server `server.rb`: <code-example format="ruby" language="ruby"> require 'sinatra' &NewLine; &NewLine;&num; Folder structure &NewLine;&num; . &NewLine;&num; -- server.rb &NewLine;&num; -- public &NewLine;&num; &nbsp;&nbsp; &verbar;-- project-name &NewLine;&num; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &verbar;-- index.html &NewLine; &NewLine;get '/' do &NewLine;&nbsp; folderDir = settings.public_folder + '/project-name'  &num; ng build output folder &NewLine;&nbsp; send_file File.join(folderDir, 'index.html') &NewLine;end </code-example> |
| [Ruby](https://www.ruby-lang.org) | 使用 ( [sinatra](http://sinatrarb.com) ) 和配置服务器 `server.rb` 的基本 Ruby 文件创建一个 Ruby 服务器：<code-example format="ruby" language="ruby"> require 'sinatra' &NewLine; &NewLine;&num; Folder structure &NewLine;&num; . &NewLine;&num; -- server.rb &NewLine;&num; -- public &NewLine;&num; &nbsp;&nbsp; &verbar;-- project-name &NewLine;&num; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &verbar;-- index.html &NewLine; &NewLine;get '/' do &NewLine;&nbsp; folderDir = settings.public_folder + '/project-name'  &num; ng build output folder &NewLine;&nbsp; send_file File.join(folderDir, 'index.html') &NewLine;end </code-example> |
| [IIS](https://www.iis.net) | Add a rewrite rule to `web.config`, similar to the one shown [here](https://stackoverflow.com/a/26152011): <code-example format="xml" language="xml"> &lt;system.webServer&gt; &NewLine;&nbsp; &lt;rewrite&gt; &NewLine;&nbsp;&nbsp;&nbsp; &lt;rules&gt; &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;rule name="Angular Routes" stopProcessing="true"&gt; &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;match url=".*" /&gt; &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;conditions logicalGrouping="MatchAll"&gt; &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" /&gt; &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" /&gt; &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;/conditions&gt; &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;action type="Rewrite" url="/index.html" /&gt; &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;/rule&gt; &NewLine;&nbsp;&nbsp;&nbsp; &lt;/rules&gt; &NewLine;&nbsp; &lt;/rewrite&gt; &NewLine;&lt;/system.webServer&gt; </code-example> |
| [IIS](https://www.iis.net) | 向 `web.config` 添加重写规则，类似于[此处](https://stackoverflow.com/a/26152011)显示的规则：<code-example format="xml" language="xml"> &lt;system.webServer&gt; &NewLine;&nbsp; &lt;rewrite&gt; &NewLine;&nbsp;&nbsp;&nbsp; &lt;rules&gt; &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;rule name="Angular Routes" stopProcessing="true"&gt; &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;match url=".*" /&gt; &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;conditions logicalGrouping="MatchAll"&gt; &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" /&gt; &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" /&gt; &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;/conditions&gt; &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;action type="Rewrite" url="/index.html" /&gt; &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;/rule&gt; &NewLine;&nbsp;&nbsp;&nbsp; &lt;/rules&gt; &NewLine;&nbsp; &lt;/rewrite&gt; &NewLine;&lt;/system.webServer&gt; </code-example> |
| [GitHub Pages](https://pages.github.com) | You can't [directly configure](https://github.com/isaacs/github/issues/408) the GitHub Pages server, but you can add a 404 page. Copy `index.html` into `404.html`. It will still be served as the 404 response, but the browser will process that page and load the application properly. It's also a good idea to [serve from `docs` on main](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#choosing-a-publishing-source) and to [create a `.nojekyll` file](https://www.bennadel.com/blog/3181-including-node-modules-and-vendors-folders-in-your-github-pages-site.htm) |
| [GitHub 页面](https://pages.github.com) | 你不能[直接配置](https://github.com/isaacs/github/issues/408) GitHub Pages 服务器，但可以添加 404 页面。将 `index.html` 复制到 `404.html` 中。它仍将作为 404 响应提供，但浏览器将处理该页面并正确加载应用程序。[从 main 上的 `docs` 提供服务](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#choosing-a-publishing-source)并[创建一个 `.nojekyll` 文件](https://www.bennadel.com/blog/3181-including-node-modules-and-vendors-folders-in-your-github-pages-site.htm)也是一个好主意 |
| [Firebase hosting](https://firebase.google.com/docs/hosting) | Add a [rewrite rule](https://firebase.google.com/docs/hosting/url-redirects-rewrites#section-rewrites). <code-example language="json"> "rewrites": [ { &NewLine;&nbsp; "source": "**", &NewLine;&nbsp; "destination": "/index.html" &NewLine;} ] </code-example> |
| [Firebase 托管](https://firebase.google.com/docs/hosting) | 添加[重写规则](https://firebase.google.com/docs/hosting/url-redirects-rewrites#section-rewrites)。<code-example language="json"> "rewrites": [ { &NewLine;&nbsp; "source": "**", &NewLine;&nbsp; "destination": "/index.html" &NewLine;} ] </code-example> |

<a id="mime"></a>

### Configuring correct MIME-type for JavaScript assets

### 为 JavaScript 资产配置正确的 MIME 类型

All of your application JavaScript files must be served by the server with the [`Content-Type` header](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Type) set to `text/javascript` or another [JavaScript-compatible MIME-type](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types#textjavascript).

你的所有应用程序 JavaScript 文件都必须由服务器提供出来，并将 [`Content-Type` 标头](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Type)设置为 `text/javascript` 或其他[与 JavaScript 兼容的 MIME-type](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types#textjavascript)。

Most servers and hosting services already do this by default.

默认情况下，大多数服务器和托管服务已经这样做了。

Server with misconfigured mime-type for JavaScript files will cause an application to fail to start with the following error:

如果服务器为 JavaScript 文件配置了错误的 MIME 类型，将导致应用程序无法启动并出现以下错误：

<code-example format="output" hideCopy language="shell">

Failed to load module script: The server responded with a non-JavaScript MIME type of "text/plain". Strict MIME type checking is enforced for module scripts per HTML spec.

</code-example>

If this is the case, you will need to check your server configuration and reconfigure it to serve `.js` files with `Content-Type: text/javascript`.
See your server's manual for instructions on how to do this.

如果是这种情况，你将需要检查你的服务器配置并将其重新配置为使用 `Content-Type: text/javascript` 来提供 `.js` 文件。有关如何执行此操作的说明，参阅服务器手册。

<a id="cors"></a>

### Requesting services from a different server (CORS)

### 请求来自另一个服务器的服务（CORS）

Angular developers may encounter a [*cross-origin resource sharing*](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing "Cross-origin resource sharing") error when making a service request (typically a data service request) to a server other than the application's own host server.
Browsers forbid such requests unless the server permits them explicitly.

Angular 开发者在向与该应用的宿主服务器不同域的服务器发起请求时，可能会遇到一种[*跨域资源共享*](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing "Cross-origin resource sharing")错误。
浏览器会阻止该请求，除非得到那台服务器的明确许可。

There isn't anything the client application can do about these errors.
The server must be configured to accept the application's requests.
Read about how to enable CORS for specific servers at [enable-cors.org](https://enable-cors.org/server.html "Enabling CORS server").

客户端应用对这种错误无能为力。
服务器必须配置成可以接受来自该应用的请求。
要了解如何对特定的服务器开启 CORS，参阅 [enable-cors.org](https://enable-cors.org/server.html "Enabling CORS server")。

<a id="optimize"></a>

## Production optimizations

## 为生产环境优化

The `production` configuration engages the following build optimization features.

`production` 配置项指定如下优化特性。

| Features | Details |
| :------- | :------ |
| 特性 | 详细信息 |
| [Ahead-of-Time (AOT) Compilation](guide/aot-compiler) | Pre-compiles Angular component templates. |
| [预先 (AOT) 编译](guide/aot-compiler) | 预编译 Angular 的组件模板。 |
| [Production mode](#enable-prod-mode) | Deploys the production environment which enables *production mode*. |
| [生产模式](#enable-prod-mode) | 部署到启用了*生产模式*的生产环境。 |
| Bundling | Concatenates your many application and library files into a few bundles. |
| 打包 | 把你的多个应用于库文件拼接到少量包（bundle）中。 |
| Minification | Removes excess whitespace, comments, and optional tokens. |
| 缩小 | 删除多余的空格、注释和可选标记。 |
| Uglification | Rewrites code to use short, cryptic variable and function names. |
| 丑化 | 重写代码，使用简短的、不容易理解的变量名和函数名。 |
| Dead code elimination | Removes unreferenced modules and much unused code. |
| 死代码消除 | 删除未引用过的模块和很多未用到的代码。 |

See [`ng build`](cli/build) for more about CLI build options and what they do.

要了解关于 CLI 构建选项及其作用的更多知识，参阅 [`ng build`](cli/build)。

<a id="enable-prod-mode"></a>

### Enable runtime production mode

### 启用生产模式

In addition to build optimizations, Angular also has a runtime production mode.
Angular applications run in development mode by default, as you can see by the following message on the browser console:

除了构建期优化之外，Angular 还支持运行期生产模式。Angular 应用默认运行在开发模式下，你可以在浏览器的控制台中看到如下信息：

<code-example format="output" hideCopy language="shell">

Angular is running in development mode.
Call `enableProdMode()` to enable production mode.

</code-example>

*Production mode* improves application performance by disabling development-only safety checks and debugging utilities, such as the expression-changed-after-checked detection.
Building your application with the production configuration automatically enables Angular's runtime production mode.

*生产模式*通过禁用仅供开发用的安全检查和调试工具（比如，expression-changed-after-checked 检测）来提高应用程序性能。使用生产配置构建应用程序时会自动启用 Angular 的运行时生产模式。

<a id="lazy-loading"></a>

### Lazy loading

### 惰性加载

You can dramatically reduce launch time by only loading the application modules that absolutely must be present when the application starts.

通过只加载应用启动时绝对必须的那些模块，你可以极大缩短应用启动的时间。

Configure the Angular Router to defer loading of all other modules (and their associated code), either by [waiting until the app has launched](guide/router-tutorial-toh#preloading "Preloading") or by [*lazy loading*](guide/router#lazy-loading "Lazy loading") them on demand.

可以配置 Angular 的路由器，来推迟所有其它模块（及其相关代码）的加载时机，方法有[一直等到应用启动完毕](guide/router-tutorial-toh#preloading "Preloading")，或者当用到时才按需[*惰性加载*](guide/router#lazy-loading "Lazy loading")。

<div class="callout is-helpful">

<header>Don't eagerly import something from a lazy-loaded module</header>

<header>不要急性（eagerly）导入来自惰性加载模块中的任何东西</header>

If you mean to lazy-load a module, be careful not to import it in a file that's eagerly loaded when the application starts (such as the root `AppModule`).
If you do that, the module will be loaded immediately.

如果要惰性加载某个模块，就要小心别在应用启动时要急性加载的模块（比如根模块 `AppModule`）中导入它。
如果那么做，该模块就会立刻加载起来。

The bundling configuration must take lazy loading into consideration.
Because lazy-loaded modules aren't imported in JavaScript, bundlers exclude them by default.
Bundlers don't know about the router configuration and can't create separate bundles for lazy-loaded modules.
You would have to create these bundles manually.

配置打包方式时必须考虑惰性加载。
因为默认情况下惰性加载的模块没有在 JavaScript 中导入过，因此打包器默认会排除它们。
打包器不认识路由器配置，也就不能为惰性加载的模块创建独立的包。
你必须手动创建这些包。

The CLI runs the [Angular Ahead-of-Time Webpack Plugin](https://github.com/angular/angular-cli/tree/main/packages/ngtools/webpack) which automatically recognizes lazy-loaded `NgModules` and creates separate bundles for them.

CLI 会运行 [Angular Ahead-of-Time Webpack 插件](https://github.com/angular/angular-cli/tree/main/packages/ngtools/webpack)，它会自动识别出惰性加载的 `NgModules`，并为它们创建独立的包。

</div>

<a id="measure"></a>

### Measure performance

### 测量性能

You can make better decisions about what to optimize and how when you have a clear and accurate understanding of what's making the application slow.
The cause may not be what you think it is.
You can waste a lot of time and money optimizing something that has no tangible benefit or even makes the application slower.
You should measure the application's actual behavior when running in the environments that are important to you.

如果你对哪些东西拖慢了应用有更加清晰、精确的了解，就可以更好地决定优化什么以及如何优化。
慢的原因可能和你所想的不一样。
你可能花费了大量的时间和金钱来优化一些实际上无关紧要的东西，甚至可能让应用变得更慢。
你应该测量应用在运行环境中的实际行为，这才是最重要的。

The [Chrome DevTools Network Performance page](https://developer.chrome.com/docs/devtools/network/reference "Chrome DevTools Network Performance") is a good place to start learning about measuring performance.

[Chrome DevTools 的网络和性能页](https://developer.chrome.com/docs/devtools/network/reference "Chrome DevTools 网络性能")是你开始学习如何测量性能的好地方。

The [WebPageTest](https://www.webpagetest.org) tool is another good choice that can also help verify that your deployment was successful.

[WebPageTest](https://www.webpagetest.org)工具是另一个不错的选择，它还能帮你验证这次部署是否成功。

<a id="inspect-bundle"></a>

### Inspect the bundles

### 检查发布包

The [source-map-explorer](https://github.com/danvk/source-map-explorer/blob/master/README.md) tool is a great way to inspect the generated JavaScript bundles after a production build.

[source-map-explorer](https://github.com/danvk/source-map-explorer/blob/master/README.md) 工具可以帮你在生产环境构建之后探查 JavaScript 包。

Install `source-map-explorer`:

安装 `source-map-explorer` ：

<code-example format="shell" language="shell">

npm install source-map-explorer --save-dev

</code-example>

Build your application for production *including the source maps*

为生产环境构建应用，包括源码映射表（source map）

<code-example format="shell" language="shell">

ng build --source-map

</code-example>

List the generated bundles in the `dist/project-name/` folder.

在 `dist/` 目录下列出生成的包。

<code-example format="shell" language="shell">

ls dist/project-name/*.js

</code-example>

Run the explorer to generate a graphical representation of one of the bundles.
The following example displays the graph for the *main* bundle.

运行浏览器来生成其中一个包的图形化表示。
下面的例子展示了 `main` 包的图表。

<code-example format="shell" language="shell">

node_modules/.bin/source-map-explorer dist/project-name/main*

</code-example>

The `source-map-explorer` analyzes the source map generated with the bundle and draws a map of all dependencies, showing exactly which classes are included in the bundle.

`source-map-explorer` 会分析与包一起生成的 source map，并画出所有依赖的地图，精确展示哪些类包含在哪个包中。

Here's the output for the *main* bundle of an example application called `cli-quickstart`.

下面是范例应用 `cli-quickstart` 中 `main` 包的输出。

<div class="lightbox">

<img alt="quickstart sourcemap explorer" src="generated/images/guide/deployment/quickstart-sourcemap-explorer.png">

</div>

<a id="base-tag"></a>

## The `base` tag

## `base` 标签

The HTML [`<base href="..." />`](guide/router) specifies a base path for resolving relative URLs to assets such as images, scripts, and style sheets.
For example, given the `<base href="/my/app/">`, the browser resolves a URL such as `some/place/foo.jpg` into a server request for `my/app/some/place/foo.jpg`.
During navigation, the Angular router uses the *base href* as the base path to component, template, and module files.

HTML 的 [`<base href="..." />`](guide/router) 标签指定了用于解析静态文件（如图片、脚本和样式表）相对地址的基地址。
比如，对于 `<base href="/my/app/">`，浏览器就会把 `some/place/foo.jpg` 这样的 URL 解析成到 `my/app/some/place/foo.jpg` 的请求。
在导航期间，Angular 路由器使用 *base href* 作为到组件模板文件和模块文件的基地址。

<div class="alert is-helpful">

See also the [`APP_BASE_HREF`](api/common/APP_BASE_HREF "API: APP_BASE_HREF") alternative.

另请参阅 [`APP_BASE_HREF`](api/common/APP_BASE_HREF "API: APP_BASE_HREF")。

</div>

In development, you typically start the server in the folder that holds `index.html`.
That's the root folder and you'd add `<base href="/">` near the top of `index.html` because `/` is the root of the application.

在开发期间，你通常会在存有 `index.html` 的目录下启动开发服务器。
那就是根目录，你要在 `index.html` 的顶部附近添加 `<base href="/">`，因为 `/` 就是该应用的根路径。

But on the shared or production server, you might serve the application from a subfolder.
For example, when the URL to load the application is something like `http://www.mysite.com/my/app`, the subfolder is `my/app/` and you should add `<base href="/my/app/">` to the server version of the `index.html`.

但是在共享或生产服务器上，你可能会在子目录下启动服务器。
比如，当前应用的加载地址可能类似于 `http://www.mysite.com/my/app`，这里的子目录就是 `my/app/`。所以你就要往服务端版本的 `index.html` 中添加 `<base href="/my/app/">`。

When the `base` tag is mis-configured, the application fails to load and the browser console displays `404 - Not Found` errors for the missing files.
Look at where it *tried* to find those files and adjust the base tag appropriately.

这里如果不配置 `base` 标签，应用就会失败，并在浏览器的控制台中为缺失的文件显示一个 `404 - Not Found` 错误。看看它*试图*从哪里去查找那些文件，并据此调整 base 标签。

<a id="deploy-url"></a>

## The `deploy` url

## 部署 url（`deploy-url`）

A command line option used to specify the base path for resolving relative URLs for assets such as images, scripts, and style sheets at *compile* time.
For example: `ng build --deploy-url /my/assets`.

一个命令行选项，用于指定在*编译*时解析图片、脚本和样式表等资产（assets）的相对 URL 的基础路径。比如：`ng build --deploy-url /my/assets`。

The effects of defining a `deploy url` and `base href` can overlap.

`deploy url` 和 `base href` 这两个定义的作用有所重叠。

* Both can be used for initial scripts, stylesheets, lazy scripts, and css resources.

  两者都可用于初始脚本、样式表、惰性脚本和 css 资源。

However, defining a `base href` has a few unique effects.

但是，定义 `base href` 有一些独有的作用。

* Defining a `base href` can be used for locating relative template (HTML) assets, and relative fetch/XMLHttpRequests.

  定义 `base href` 可用于定位相对路径模板 (HTML) 资产和针对相对路径的 fetch/XMLHttpRequests。

The `base href` can also be used to define the Angular router's default base (see [`APP_BASE_HREF`](api/common/APP_BASE_HREF)).
Users with more complicated setups may need to manually configure the `APP_BASE_HREF` token within the application (for example, application routing base is `/` but`assets/scripts/etc.` are at `/assets/`).

`base href` 也可用于定义 Angular 路由器的默认基地址（参阅[`APP_BASE_HREF`](api/common/APP_BASE_HREF)）。需要进行更复杂设置的用户可能需要在应用程序中手动配置 `APP_BASE_HREF` 令牌。（比如，应用程序路由基地址是 `/`，但各种资产、脚本等都在 `/assets/` 下）。

Unlike the `base href` which can be defined in a single place, the `deploy url` needs to be hard-coded into an application at build time.
This means specifying a `deploy url` will decrease build speed, but this is the unfortunate cost of using an option that embeds itself throughout an application.
That is why a `base href` is generally the better option.

与可以只在一个地方定义的 `base href` 不同，`deploy url` 需要在构建时硬编码到应用程序中。这意味着指定 `deploy url` 会降低构建速度，但这是使用在整个应用程序中嵌入自己的选项的代价。这也是为什么说 `base href` 通常是更好的选择。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28