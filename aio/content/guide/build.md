# Building and serving Angular apps

# 构建并运行 Angular 应用

This page discusses build-specific configuration options for Angular projects.

本文讨论的是 Angular 项目中与构建有关的配置项。

<a id="app-environments"></a>

## Configuring application environments

## 配置应用环境

You can define different named build configurations for your project, such as `development` and `staging`, with different defaults.

你可以为你的项目定义不同的命名构建配置，例如 `development` 和 `staging` ，具有不同的默认值。

Each named configuration can have defaults for any of the options that apply to the various [builder targets](guide/glossary#target), such as `build`, `serve`, and `test`.
The [Angular CLI](cli) `build`, `serve`, and `test` commands can then replace files with appropriate versions for your intended target environment.

每个命名配置项都可以具有某些选项的默认值，并应用于各种[构建目标](guide/glossary#target)，比如 `build`、`serve` 和 `test`。[Angular CLI](cli) 的 `build`、`serve` 和 `test` 命令可以为不同的目标环境，把文件替换成合适的版本。

### Configure environment-specific defaults

### 配置针对特定环境的默认值

Using the Angular CLI, start by running the [generate environments command](cli/generate#environments-command) shown here to create the `src/environments/` directory and configure the project to use these files.

使用 Angular CLI，首先运行此处显示的[生成环境命令](cli/generate#environments-command)以创建 `src/environments/` 目录并将项目配置为使用这些文件。

<code-example format="shell" language="shell">

ng generate environments

</code-example>

The project's `src/environments/` directory contains the base configuration file, `environment.ts`, which provides configuration for `production`, the default environment.
You can override default values for additional environments, such as `development` and `staging`, in target-specific configuration files.

项目的 `src/environments/` 目录包含基本配置文件 `environment.ts` ，它提供 `production` 的配置，即默认环境。 你可以在特定于目标的配置文件中覆盖其他环境的默认值，例如 `development` 和 `staging` 。

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
          environment.development.ts
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
  production: true
};

</code-example>

The `build` command uses this as the build target when no environment is specified.
You can add further variables, either as additional properties on the environment object, or as separate objects.
For example, the following adds a default for a variable to the default environment:

当没有指定环境时，`build` 命令就会用它作为构建目标。你可以添加其它变量，可以用该环境对象附加属性的形式，也可以用独立对象的形式。比如：以下内容将会把一个变量添加到默认环境中：

<code-example format="typescript" language="typescript">

export const environment = {
  production: true,
  apiUrl: 'http://my-prod-url'
};

</code-example>

You can add target-specific configuration files, such as `environment.development.ts`.
The following content sets default values for the development build target:

你可以添加特定于目标的配置文件，例如 `environment.development.ts` 。 以下内容为开发构建目标设置了默认值：

<code-example format="typescript" language="typescript">

export const environment = {
  production: false,
  apiUrl: 'http://my-api-url'
};

</code-example>

### Using environment-specific variables in your app

### 在应用中使用针对特定环境的变量

The following application structure configures build targets for `development` and `staging` environments:

以下应用程序结构为 `development` 和 `staging` 环境配置构建目标：

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
              environment.development.ts
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

The following code in the component file \(`app.component.ts`\) uses an environment variable defined in the configuration files.

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
      console.log(environment.production); // Logs false for development environment
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
    "development": {
      "fileReplacements": [
          {
            "replace": "src/environments/environment.ts",
            "with": "src/environments/environment.development.ts"
          }
        ],
        &hellip;

</code-example>

This means that when you build your development configuration with `ng build --configuration development`, the `src/environments/environment.ts` file is replaced with the target-specific version of the file, `src/environments/environment.development.ts`.

这意味着当你使用 `ng build --configuration development` 构建开发配置时， `src/environments/environment.ts` 文件将替换为文件的目标特定版本 `src/environments/environment.development.ts` 。

You can add additional configurations as required.
To add a staging environment, create a copy of `src/environments/environment.ts` called `src/environments/environment.staging.ts`, then add a `staging` configuration to `angular.json`:

你还可以按需添加更多配置文件。要想添加预生产环境，把 `src/environments/environment.ts` 复制为 `src/environments/environment.staging.ts`，然后在 `angular.json` 中添加 `staging` 配置：

<code-example format="json" language="json">

  "configurations": {
    "development": { &hellip; },
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
      "development": {
        "browserTarget": "your-project-name:build:development"
      },
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
      "budgets": []
    }
  }
}

</code-example>

You can specify size budgets for the entire app, and for particular parts.
Each budget entry configures a budget of a given type.
Specify size values in the following formats:

你可以为整个应用指定大小范围，也可以为特定部分。每个条目会为一种特定的类型配置大小范围。用下列各式来指定大小的值：

| Size value      | Details                                                                     |
| :-------------- | :-------------------------------------------------------------------------- |
| 大小值          | 详情                                                                        |
| `123` or `123b` | Size in bytes.                                                              |
| `123` 或 `123b` | 大小（以字节为单位）。                                                      |
| `123kb`         | Size in kilobytes.                                                          |
| `123kb`         | 大小（以千字节为单位）。                                                    |
| `123mb`         | Size in megabytes.                                                          |
| `123mb`         | 大小（以 MB 为单位）。                                                      |
| `12%`           | Percentage of size relative to baseline. \(Not valid for baseline values.\) |
| `12%`           | 相对于基线（baseline）大小的百分比大小。（不能用作 baseline 的值。）        |

When you configure a budget, the build system warns or reports an error when a given part of the application reaches or exceeds a boundary size that you set.

如果配置了大小范围，构建系统就会在发现应用的某个部分达到或超过了你设置的大小范围时发出警告或报错。

Each budget entry is a JSON object with the following properties:

每个范围条目是一个 JSON 对象，它具有下列属性：

| Property         | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| :--------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 属性             | 值                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| type             | The type of budget. One of: <table> <thead> <tr> <th> Value </th> <th> Details </th> </tr> </thead> <tbody> <tr> <td> <code>bundle</code> </td> <td> The size of a specific bundle. </td> </tr> <tr> <td> <code>initial</code> </td> <td> The size of JavaScript needed for bootstrapping the application. Defaults to warning at 500kb and erroring at 1mb. </td> </tr> <tr> <td> <code>allScript</code> </td> <td> The size of all scripts. </td> </tr> <tr> <td> <code>all</code> </td> <td> The size of the entire application. </td> </tr> <tr> <td> <code>anyComponentStyle</code> </td> <td> This size of any one component stylesheet. Defaults to warning at 2kb and erroring at 4kb. </td> </tr> <tr> <td> <code>anyScript</code> </td> <td> The size of any one script. </td> </tr> <tr> <td> <code>any</code> </td> <td> The size of any file. </td> </tr> </tbody> </table> |
| 类型【模糊翻译】 | 预算的类型。 之一：                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| name             | The name of the bundle \(for `type=bundle`\).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 姓名             | 包的名称（对于 `type=bundle` ）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| baseline         | The baseline size for comparison.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| baseline         | 一个表示基准大小的绝对值，用做比例值的基数。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| maximumWarning   | The maximum threshold for warning relative to the baseline.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| maximumWarning   | 当大小超过基线的这个阈值百分比时给出警告。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| maximumError     | The maximum threshold for error relative to the baseline.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| maximumError     | 当大小超过基线的这个阈值百分比时报错。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| minimumWarning   | The minimum threshold for warning relative to the baseline.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| minimumWarning   | 当大小小于基线的这个阈值百分比时给出警告。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| minimumError     | The minimum threshold for error relative to the baseline.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| minimumError     | 相对于基线的最小误差阈值。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| warning          | The threshold for warning relative to the baseline \(min & max\).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 警告             | 相对于基线的警告阈值（最小值和最大值）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| error            | The threshold for error relative to the baseline \(min & max\).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 错误             | 相对于基线的误差阈值（最小值和最大值）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

<a id="commonjs "></a>

## Configuring CommonJS dependencies

## 配置 CommonJS 依赖项

<div class="alert is-important">

It is recommended that you avoid depending on CommonJS modules in your Angular applications.
Depending on CommonJS modules can prevent bundlers and minifiers from optimizing your application, which results in larger bundle sizes.
Instead, it is recommended that you use [ECMAScript modules](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import) in your entire application.
For more information, see [How CommonJS is making your bundles larger](https://web.dev/commonjs-larger-bundles).

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

The Angular CLI uses [Browserslist](https://github.com/browserslist/browserslist) to ensure compatibility with different browser versions. [Autoprefixer](https://github.com/postcss/autoprefixer) is used for CSS vendor prefixing and [&commat;babel/preset-env](https://babeljs.io/docs/en/babel-preset-env) for JavaScript syntax transformations.

Angular CLI 使用 [Browserslist](https://github.com/browserslist/browserslist) 来确保对不同浏览器版本的兼容性。
[Autoprefixer](https://github.com/postcss/autoprefixer) 用于为 CSS 添加供应商前缀，而 [&commat;babel/preset-env](https://babeljs.io/docs/en/babel-preset-env) 用于进行 JavaScript 语法转换。

Internally, the Angular CLI uses the below `browserslist` configuration which matches the [browsers that are supported](guide/browser-support) by Angular.

在内部，Angular CLI 使用如下 `browserslist` 配置，以匹配 Angular [所支持的浏览器](guide/browser-support)。

  <code-example format="none" language="text">
  last 2 Chrome versions
  last 1 Firefox version
  last 2 Edge major versions
  last 2 Safari major versions
  last 2 iOS major versions
  Firefox ESR
  </code-example>

To override the internal configuration, run [`ng generate config browserslist`](cli/generate#config-command), which generates a `.browserslistrc` configuration file in the the project directory.

要覆盖内部配置，请运行[`ng generate config browserslist`](cli/generate#config-command) ，它会在项目目录中生成一个 `.browserslistrc` 配置文件。

See the [browserslist repository](https://github.com/browserslist/browserslist) for more examples of how to target specific browsers and versions.

有关如何以特定浏览器和版本为目标的更多示例，请参阅[browserslist 存储库](https://github.com/browserslist/browserslist)。

<div class="alert is-helpful">

Use [browsersl.ist](https://browsersl.ist) to display compatible browsers for a `browserslist` query.

</div>

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

Proxy log levels are `info` \(the default\), `debug`, `warn`, `error`, and `silent`.

代理的有效日志级别是 `info`（默认值）、`debug`、`warn`、`error` 和 `silent`。

### Proxy multiple entries

### 代理多个条目

You can proxy multiple entries to the same target by defining the configuration in JavaScript.

通过用 JavaScript 定义此配置，你还可以把多个条目代理到同一个目标。

Set the proxy configuration file to `proxy.conf.mjs` \(instead of `proxy.conf.json`\), and specify configuration files as in the following example.

将代理配置文件设置为 `proxy.conf.mjs` （而不是 `proxy.conf.json` ），并按照以下示例指定配置文件。

<code-example format="javascript" language="javascript">

export default [
  {
    context: [
        '/my',
        '/many',
        '/endpoints',
        '/i',
        '/need',
        '/to',
        '/proxy'
    ],
    target: 'http://localhost:3000',
    secure: false
  }
];

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
      "proxyConfig": "src/proxy.conf.mjs"
    },
&hellip;

</code-example>

### Bypass the proxy

### 绕过代理

If you need to optionally bypass the proxy, or dynamically change the request before it's sent, add the bypass option, as shown in this JavaScript example.

如果你需要根据情况绕过此代理，或在发出请求前先动态修改一下，可以添加 `bypass` 选项，就像下例的 JavaScript 所示。

<code-example format="javascript" language="javascript">

export default {
  '/api/proxy': {
    "target": 'http://localhost:3000',
    "secure": false,
    "bypass": function (req, res, proxyOptions) {
        if (req.headers.accept.includes('html')) {
            console.log('Skipping proxy for browser request.');
            return '/index.html';
        }
        req.headers['X-Custom-Header'] = 'yes';
    }
  }
};

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

import HttpsProxyAgent from 'https-proxy-agent';

const proxyConfig = [{
  context: '/api',
  target: 'http://your-remote-server.com:3000',
  secure: false
}];

export default (proxyConfig) => {
  const proxyServer = process.env.http_proxy &verbar;&verbar; process.env.HTTP_PROXY;
  if (proxyServer) {
    const agent = new HttpsProxyAgent(proxyServer);
    console.log('Using corporate proxy server: ' + proxyServer);

    for (const entry of proxyConfig) {
      entry.agent = agent;
    }
  }

  return proxyConfig;
};

</code-example>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2023-01-17
