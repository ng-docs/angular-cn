# Building and serving Angular apps

# 构建并运行 Angular 应用

This page discusses build-specific configuration options for Angular projects.

本文讨论的是 Angular 项目中与构建有关的配置项。

<a id="app-environments"></a>

## Configuring application environments

## 配置应用环境

You can define different named build configurations for your project, such as *staging* and *production*, with different defaults.

你可以用不同的默认值来为项目定义出不同的命名配置项，比如 *staging* 和 *production*。

Each named configuration can have defaults for any of the options that apply to the various [builder targets](guide/glossary#target), such as `build`, `serve`, and `test`.
The [Angular CLI](cli) `build`, `serve`, and `test` commands can then replace files with appropriate versions for your intended target environment.

每个命名配置项都可以具有某些选项的默认值，并应用于各种[构建目标](guide/glossary#target)，比如 `build`、`serve` 和 `test`。[Angular CLI](cli) 的 `build`、`serve` 和 `test` 命令可以为不同的目标环境，把文件替换成合适的版本。

### Configure environment-specific defaults

### 配置针对特定环境的默认值

A project's `src/environments/` folder contains the base configuration file, `environment.ts`, which provides a default environment.
You can add override defaults for additional environments, such as production and staging, in target-specific configuration files.

项目的 `src/environments/` 文件夹包含基础配置文件 `environment.ts`，它提供了一个默认环境。你可以在针对特定目标的配置文件中，为其它环境（比如生产和预生产）覆盖这些默认值。

For example:

比如：

<div class="filetree">
    <div class="file">
        myProject/src/environments
    </div>
    <div class="children">
        <div class="file">
          environment.ts
        </div>
        <div class="file">
          environment.prod.ts
        </div>
        <div class="file">
          environment.staging.ts
        </div>
    </div>
</div>

The base file `environment.ts`, contains the default environment settings.
For example:

基础环境 `environment.ts` 包含了默认的环境设置。比如：

<code-example format="typescript" language="typescript">

export const environment = {
  production: false
};

</code-example>

The `build` command uses this as the build target when no environment is specified.
You can add further variables, either as additional properties on the environment object, or as separate objects.
For example, the following adds a default for a variable to the default environment:

当没有指定环境时，`build` 命令就会用它作为构建目标。你可以添加其它变量，可以用该环境对象附加属性的形式，也可以用独立对象的形式。比如：以下内容将会把一个变量添加到默认环境中：

<code-example format="typescript" language="typescript">

export const environment = {
  production: false,
  apiUrl: 'http://my-api-url'
};

</code-example>

You can add target-specific configuration files, such as `environment.prod.ts`.
The following content sets default values for the production build target:

你可以添加针对特定目标的配置文件，比如 `environment.prod.ts`。
下面的代码会设置针对生产环境构建目标的默认值：

<code-example format="typescript" language="typescript">

export const environment = {
  production: true,
  apiUrl: 'http://my-prod-url'
};

</code-example>

### Using environment-specific variables in your app

### 在应用中使用针对特定环境的变量

The following application structure configures build targets for production and staging environments:

下面的应用结构会为生产和预生产环境配置构建目标：

<div class="filetree">
    <div class="file">
        src
    </div>
    <div class="children">
        <div class="file">
          app
        </div>
        <div class="children">
            <div class="file">
              app.component.html
            </div>
            <div class="file">
              app.component.ts
            </div>
        </div>
        <div class="file">
          environments
        </div>
        <div class="children">
            <div class="file">
              environment.ts
            </div>
            <div class="file">
              environment.prod.ts
            </div>
            <div class="file">
              environment.staging.ts
            </div>
        </div>
    </div>
</div>

To use the environment configurations you have defined, your components must import the original environments file:

要使用已定义的配置环境，组件必须导入原始版的环境文件：

<code-example format="typescript" language="typescript">

import { environment } from './../environments/environment';

</code-example>

This ensures that the build and serve commands can find the configurations for specific build targets.

这会确保 `build` 和 `serve` 命令能找到针对特定目标的配置。

The following code in the component file (`app.component.ts`) uses an environment variable defined in the configuration files.

组件文件（`app.component.ts`）中的下列代码可以使用该配置文件中定义的环境变量。

<code-example format="typescript" language="typescript">

import { Component } from '&commat;angular/core';
import { environment } from './../environments/environment';

&commat;Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor() {
    console.log(environment.production); // Logs false for default environment
  }
  title = 'app works!';
}

</code-example>

<a id="file-replacement"></a>

## Configure target-specific file replacements

## 配置针对特定目标的文件替换规则

The main CLI configuration file, `angular.json`, contains a `fileReplacements` section in the configuration for each build target, which lets you replace any file in the TypeScript program with a target-specific version of that file.
This is useful for including target-specific code or variables in a build that targets a specific environment, such as production or staging.

CLI 的主配置文件 `angular.json` 中的每个构建目标下都包含了一个 `fileReplacements` 区段。这能让你把 TypeScript 程序中的任何文件替换为针对特定目标的版本。当构建目标需要包含针对特定环境（比如生产或预生产）的代码或变量时，这非常有用。

By default no files are replaced.
You can add file replacements for specific build targets.
For example:

默认情况下不会替换任何文件。你可以为特定的构建目标添加文件替换规则。比如：

<code-example format="json" language="json">

"configurations": {
  "production": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.prod.ts"
      }
    ],
    &hellip;

</code-example>

This means that when you build your production configuration with `ng build --configuration production`, the `src/environments/environment.ts` file is replaced with the target-specific version of the file, `src/environments/environment.prod.ts`.

这意味着当你使用 `ng build --configuration production` 构建生产配置时，就会把 `src/environments/environment.ts` 文件替换成针对特定目标的版本 `src/environments/environment.prod.ts`。

You can add additional configurations as required.
To add a staging environment, create a copy of `src/environments/environment.ts` called `src/environments/environment.staging.ts`, then add a `staging` configuration to `angular.json`:

你还可以按需添加更多配置文件。要想添加预生产环境，把 `src/environments/environment.ts` 复制为 `src/environments/environment.staging.ts`，然后在 `angular.json` 中添加 `staging` 配置：

<code-example format="json" language="json">

"configurations": {
  "production": { &hellip; },
  "staging": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.staging.ts"
      }
    ]
  }
}

</code-example>

You can add more configuration options to this target environment as well.
Any option that your build supports can be overridden in a build target configuration.

你还可以往目标环境中添加更多配置项。你的构建目标支持的任何选项都可以在构建目标配置中进行覆盖。

To build using the staging configuration, run the following command:

要想使用预生产环境（staging）的配置进行构建，请运行下列命令：

<code-example format="shell" language="shell">

ng build --configuration=staging

</code-example>

You can also configure the `serve` command to use the targeted build configuration if you add it to the "serve:configurations" section of `angular.json`:

如果将其添加到 `angular.json` 的 "serve:configurations" 区段，你还可以配置 `serve` 命令来使用 目标构建配置：

<code-example format="json" language="json">

"serve": {
  "builder": "&commat;angular-devkit/build-angular:dev-server",
  "options": {
    "browserTarget": "your-project-name:build"
  },
  "configurations": {
    "production": {
      "browserTarget": "your-project-name:build:production"
    },
    "staging": {
      "browserTarget": "your-project-name:build:staging"
    }
  }
},

</code-example>

<a id="size-budgets"></a>
<a id="configure-size-budgets"></a>

## Configuring size budgets

## 配置文件大小预算

As applications grow in functionality, they also grow in size.
The CLI lets you set size thresholds in your configuration to ensure that parts of your application stay within size boundaries that you define.

当应用的功能不断增长时，其文件大小也会同步增长。CLI 允许你通过配置项来限制文件大小，以确保应用的各个部分都处于你定义的大小范围内。

Define your size boundaries in the CLI configuration file, `angular.json`, in a `budgets` section for each [configured environment](#app-environments).

你可以在 CLI 配置文件 `angular.json` 的 `budgets` 区段为每个[所配置的环境](#app-environments)定义这些大小范围。

<code-example format="json" language="json">

{
  &hellip;
  "configurations": {
    "production": {
      &hellip;
      budgets: []
    }
  }
}

</code-example>

You can specify size budgets for the entire app, and for particular parts.
Each budget entry configures a budget of a given type.
Specify size values in the following formats:

你可以为整个应用指定大小范围，也可以为特定部分。每个条目会为一种特定的类型配置大小范围。用下列各式来指定大小的值：

| Size value | Details |
| :--------- | :------ |
| 大小值 | 详情 |
| `123` or `123b` | Size in bytes. |
| `123` 或 `123b` | 大小（以字节为单位）。 |
| `123kb` | Size in kilobytes. |
| `123kb` | 大小（以千字节为单位）。 |
| `123mb` | Size in megabytes. |
| `123mb` | 大小（以 MB 为单位）。 |
| `12%` | Percentage of size relative to baseline. (Not valid for baseline values.) |
| `12%` | 相对于基线（baseline）大小的百分比大小。（不能用作 baseline 的值。） |

When you configure a budget, the build system warns or reports an error when a given part of the application reaches or exceeds a boundary size that you set.

如果配置了大小范围，构建系统就会在发现应用的某个部分达到或超过了你设置的大小范围时发出警告或报错。

Each budget entry is a JSON object with the following properties:

每个范围条目是一个 JSON 对象，它具有下列属性：

| Property | Value |
| :------- | :---- |
| 属性 | 值 |
| type | 预算的类型。下列值之一：<table><thead><tr><th>值</th><th>详细信息</th></tr></thead><tbody><tr><td><code>bundle</code></td><td>特定包的大小。</td></tr><tr><td><code>initial</code></td><td>引导应用程序所需的 JavaScript 的大小。默认为 500kb 的警告和 1mb 的错误。</td></tr><tr><td><code>allScript</code></td><td>所有脚本的大小。</td></tr><tr><td><code>all</code></td><td>整个应用程序的大小。</td></tr><tr><td><code>anyComponentStyle</code></td><td>任何一个组件样式表的此大小。默认为 2kb 的警告和 4kb 的错误。</td></tr><tr><td><code>anyScript</code></td><td>任何一个脚本的大小。</td></tr><tr><td><code>any</code></td><td>任何文件的大小。</td></tr></tbody></table> |
| name | The name of the bundle (for `type=bundle`). |
| name | 包的名称（对于 `type=bundle`）。 |
| baseline | The baseline size for comparison. |
| baseline | 一个表示基准大小的绝对值，用做比例值的基数。 |
| maximumWarning | The maximum threshold for warning relative to the baseline. |
| maximumWarning | 当大小超过基线的这个阈值百分比时给出警告。 |
| maximumError | The maximum threshold for error relative to the baseline. |
| maximumError | 当大小超过基线的这个阈值百分比时报错。 |
| minimumWarning | The minimum threshold for warning relative to the baseline. |
| minimumWarning | 当大小小于基线的这个阈值百分比时给出警告。 |
| minimumError | The minimum threshold for error relative to the baseline. |
| minimumError | 当大小小于基线的这个阈值百分比时报错。 |
| warning | The threshold for warning relative to the baseline (min & max). |
| warning | 当大小达到或小于基线的这个阈值百分比时都给出警告。 |
| error | The threshold for error relative to the baseline (min & max). |
| error | 当大小达到或小于基线的这个阈值百分比时都报错。 |

<a id="commonjs "></a>

## Configuring CommonJS dependencies

## 配置 CommonJS 依赖项

<div class="alert is-important">

It is recommended that you avoid depending on CommonJS modules in your Angular applications.
Depending on CommonJS modules can prevent bundlers and minifiers from optimizing your application, which results in larger bundle sizes.
Instead, it is recommended that you use [ECMAScript modules](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import) in your entire application.
For more information, see [How CommonJS is making your bundles larger](https://web.dev/commonjs-larger-bundles).

建议你在 Angular 应用中避免依赖 CommonJS 模块。对 CommonJS 模块的依赖会阻止打包器和压缩器优化你的应用，这会导致更大的打包尺寸。
建议你在整个应用中都使用 [ECMAScript 模块](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import)。
欲知详情，参阅[为什么 CommonJS 会导致更大的打包尺寸](https://web.dev/commonjs-larger-bundles)。

</div>

The Angular CLI outputs warnings if it detects that your browser application depends on CommonJS modules.
To disable these warnings, add the CommonJS module name to `allowedCommonJsDependencies` option in the `build` options located in `angular.json` file.

如果 Angular CLI 检测到你的浏览器端应用依赖了 CommonJS 模块，就会发出警告。要禁用这些警告，你可以把这些 CommonJS 模块的名字添加到 `angular.json` 文件的 `build` 区的 `allowedCommonJsDependencies` 选项中。

<code-example language="json">

"build": {
  "builder": "&commat;angular-devkit/build-angular:browser",
  "options": {
     "allowedCommonJsDependencies": [
        "lodash"
     ]
     &hellip;
   }
   &hellip;
},

</code-example>

<a id="browser-compat"></a>

## Configuring browser compatibility

## 配置浏览器兼容性

The CLI uses [Autoprefixer](https://github.com/postcss/autoprefixer) to ensure compatibility with different browser and browser versions.
You might find it necessary to target specific browsers or exclude certain browser versions from your build.

CLI 使用 [Autoprefixer](https://github.com/postcss/autoprefixer) 来确保对不同浏览器及其版本的兼容性。你会发现当你要从构建中针对特定的目标浏览器或排除指定的浏览器版本时，这是很有必要的。

Internally, Autoprefixer relies on a library called [Browserslist](https://github.com/browserslist/browserslist) to figure out which browsers to support with prefixing.
Browserlist looks for configuration options in a `browserslist` property of the package configuration file, or in a configuration file named `.browserslistrc`.
Autoprefixer looks for the `browserslist` configuration when it prefixes your CSS.

在内部，Autoprefixer 依赖一个名叫 [Browserslist](https://github.com/browserslist/browserslist) 的库来指出需要为哪些浏览器加前缀。Browserlist 会在 `package.json` 的 `browserlist` 属性中或一个名叫 `.browserslistrc` 的配置文件中来配置这些选项。当 Autoprefixer 为你的 CSS 加前缀时，就会查阅 Browserlist 的配置。

* Tell Autoprefixer what browsers to target by adding a browserslist property to the package configuration file, `package.json`:

  可以为 `package.json` 添加 `browserslist` 属性来告诉 Autoprefixer，要针对哪些浏览器：

  <code-example format="json" language="json">

  "browserslist": [
    "&gt; 1%",
    "last 2 versions"
  ]

  </code-example>

* Alternatively, you can add a new file, `.browserslistrc`, to the project directory, that specifies browsers you want to support:

  或者你也可以在项目目录下添加一个新文件 `.browserslistrc`，用于指定你要支持哪些浏览器：

  <code-example format="none" language="text">

  &num;&num;&num; Supported Browsers
  &gt; 1%
  last 2 versions

  </code-example>

See the [browserslist repo](https://github.com/browserslist/browserslist) for more examples of how to target specific browsers and versions.

参阅 [browserslist 的代码库](https://github.com/browserslist/browserslist)以得到如何指定浏览器及其版本的更多例子。

<a id="proxy"></a>

## Proxying to a backend server

## 代理到后端服务器

Use the [proxying support](https://webpack.js.org/configuration/dev-server/#devserverproxy) in the `webpack` development server to divert certain URLs to a backend server, by passing a file to the `--proxy-config` build option.
For example, to divert all calls for `http://localhost:4200/api` to a server running on `http://localhost:3000/api`, take the following steps.

可以用 `webpack` 开发服务器中的[代理支持](https://webpack.js.org/configuration/dev-server/#devserver-proxy)来把特定的 URL 转发给后端服务器，只要传入 `--proxy-config` 选项就可以了。
比如，要把所有到 `http://localhost:4200/api` 的调用都转给运行在 `http://localhost:3000/api` 上的服务器，可采取如下步骤。

1. Create a file `proxy.conf.json` in your project's `src/` folder.

   在项目的 `src/` 目录下创建一个 `proxy.conf.json` 文件。

1. Add the following content to the new proxy file:

   往这个新的代理配置文件中添加如下内容：

   <code-example format="json" language="json">

   {
     "/api": {
       "target": "http://localhost:3000",
       "secure": false
     }
   }

   </code-example>

1. In the CLI configuration file, `angular.json`, add the `proxyConfig` option to the `serve` target:

   在 CLI 配置文件 `angular.json` 中为 `serve` 目标添加 `proxyConfig` 选项：

   <code-example format="json" language="json">

   &hellip;
   "architect": {
     "serve": {
       "builder": "&commat;angular-devkit/build-angular:dev-server",
       "options": {
         "browserTarget": "your-application-name:build",
         "proxyConfig": "src/proxy.conf.json"
       },
   &hellip;

   </code-example>

1. To run the development server with this proxy configuration, call `ng serve`.

   要使用这个代理选项启动开发服务器，请运行 `ng serve` 命令。

Edit the proxy configuration file to add configuration options; following are some examples.
For a description of all options, see [webpack DevServer documentation](https://webpack.js.org/configuration/dev-server/#devserverproxy).

可以编辑这个代理配置文件，以添加配置项，下面是一些例子。要查看所有选项的详细说明，参阅 [webpack DevServer 文档](https://webpack.js.org/configuration/dev-server/#devserver-proxy)。

<div class="alert is-helpful">

**NOTE**: <br />
If you edit the proxy configuration file, you must relaunch the `ng serve` process to make your changes effective.

**注意**：<br />
如果你编辑了这个代理配置文件，就必须重启 `ng serve`，来让你的修改生效。

</div>

### Rewrite the URL path

### 重写 URL 路径

The `pathRewrite` proxy configuration option lets you rewrite the URL path at run time.
For example, specify the following `pathRewrite` value to the proxy configuration to remove "api" from the end of a path.

`pathRewrite` 代理配置项能让你在运行时重写 URL 路径。比如，可以在代理配置中指定如下的 `pathRewrite` 值，以移除路径末尾的 "api" 部分。

<code-example format="json" language="json">

{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "pathRewrite": {
      "^/api": ""
    }
  }
}

</code-example>

If you need to access a backend that is not on `localhost`, set the `changeOrigin` option as well.
For example:

如果你要访问的后端不在 `localhost` 上，还要设置 `changeOrigin` 选项。比如：

<code-example format="json" language="json">

{
  "/api": {
    "target": "http://npmjs.org",
    "secure": false,
    "pathRewrite": {
      "^/api": ""
    },
    "changeOrigin": true
  }
}

</code-example>

To help determine whether your proxy is working as intended, set the `logLevel` option.
For example:

要想了解你的代理是否在如预期般工作，可以设置 `logLevel` 选项。比如：

<code-example format="json" language="json">

{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "pathRewrite": {
      "^/api": ""
    },
    "logLevel": "debug"
  }
}

</code-example>

Proxy log levels are `info` (the default), `debug`, `warn`, `error`, and `silent`.

代理的有效日志级别是 `info`（默认值）、`debug`、`warn`、`error` 和 `silent`。

### Proxy multiple entries

### 代理多个条目

You can proxy multiple entries to the same target by defining the configuration in JavaScript.

通过用 JavaScript 定义此配置，你还可以把多个条目代理到同一个目标。

Set the proxy configuration file to `proxy.conf.js` (instead of `proxy.conf.json`), and specify configuration files as in the following example.

将代理配置文件设置为 `proxy.conf.js`（代替 `proxy.conf.json`），并指定如下例子中的配置文件。

<code-example format="javascript" language="javascript">

const PROXY_CONFIG = [
    {
        context: [
            "/my",
            "/many",
            "/endpoints",
            "/i",
            "/need",
            "/to",
            "/proxy"
        ],
        target: "http://localhost:3000",
        secure: false
    }
]

module.exports = PROXY_CONFIG;

</code-example>

In the CLI configuration file, `angular.json`, point to the JavaScript proxy configuration file:

在 CLI 配置文件 `angular.json` 中，指向 JavaScript 配置文件：

<code-example format="json" language="json">

&hellip;
"architect": {
  "serve": {
    "builder": "&commat;angular-devkit/build-angular:dev-server",
    "options": {
      "browserTarget": "your-application-name:build",
      "proxyConfig": "src/proxy.conf.js"
    },
&hellip;

</code-example>

### Bypass the proxy

### 绕过代理

If you need to optionally bypass the proxy, or dynamically change the request before it's sent, add the bypass option, as shown in this JavaScript example.

如果你需要根据情况绕过此代理，或在发出请求前先动态修改一下，可以添加 `bypass` 选项，就像下例的 JavaScript 所示。

<code-example format="javascript" language="javascript">

const PROXY_CONFIG = {
    "/api/proxy": {
        "target": "http://localhost:3000",
        "secure": false,
        "bypass": function (req, res, proxyOptions) {
            if (req.headers.accept.indexOf("html") !== -1) {
                console.log("Skipping proxy for browser request.");
                return "/index.html";
            }
            req.headers["X-Custom-Header"] = "yes";
        }
    }
}

module.exports = PROXY_CONFIG;

</code-example>

### Using corporate proxy

### 使用公司代理

If you work behind a corporate proxy, the backend cannot directly proxy calls to any URL outside your local network.
In this case, you can configure the backend proxy to redirect calls through your corporate proxy using an agent:

如果你在某个公司代理之后，此后端就无法直接代理到局域网之外的任何 URL。这种情况下，你可以把这个后端代理配置为，借助 agent 通过你的公司代理转发此调用：

<code-example format="shell" language="shell">

npm install --save-dev https-proxy-agent

</code-example>

When you define an environment variable `http_proxy` or `HTTP_PROXY`, an agent is automatically added to pass calls through your corporate proxy when running `npm start`.

如果你定义了环境变量 `http_proxy` 或 `HTTP_PROXY`，当运行 `npm start` 时，就会自动添加一个 agent 来通过你的企业代理转发网络调用。

Use the following content in the JavaScript configuration file.

请在 JavaScript 配置文件中使用如下内容。

<code-example format="javascript" language="javascript">

var HttpsProxyAgent = require('https-proxy-agent');
var proxyConfig = [{
  context: '/api',
  target: 'http://your-remote-server.com:3000',
  secure: false
}];

function setupForCorporateProxy(proxyConfig) {
  var proxyServer = process.env.http_proxy &verbar;&verbar; process.env.HTTP_PROXY;
  if (proxyServer) {
    var agent = new HttpsProxyAgent(proxyServer);
    console.log('Using corporate proxy server: ' + proxyServer);
    proxyConfig.forEach(function(entry) {
      entry.agent = agent;
    });
  }
  return proxyConfig;
}

module.exports = setupForCorporateProxy(proxyConfig);

</code-example>

<a id="browser-compat"></a>

## Configuring browser compatibility

## 配置浏览器兼容性

See [browser support guide](guide/browser-support).

参见[浏览器支持指南](guide/browser-support)。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28