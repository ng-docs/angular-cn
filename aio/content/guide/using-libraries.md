# Usage of Angular libraries published to npm

# 使用已发布到 npm 的 Angular 库

When you build your Angular application, take advantage of sophisticated first-party libraries, as well as rich ecosystem of third-party libraries.
[Angular Material][AngularMaterialMain] is an example of a sophisticated first-party library.
For links to the most popular libraries, see [Angular Resources][AioResources].

## Install libraries

## 安装库

Libraries are published as [npm packages][AioGuideNpmPackages], usually together with schematics that integrate them with the Angular CLI.
To integrate reusable library code into an application, you need to install the package and import the provided functionality in the location you use it.
For most published Angular libraries, use the `ng add <lib_name>` Angular CLI command.

The `ng add` Angular CLI command uses a package manager to install the library package and invokes schematics that are included in the package to other scaffolding within the project code.
Examples of package managers include [npm][NpmjsMain] or [yarn][YarnpkgMain].
Additional scaffolding within the project code includes import statements, fonts, and themes.

A published library typically provides a `README` file or other documentation on how to add that library to your application.
For an example, see the [Angular Material][AngularMaterialMain] documentation.

### Library typings

### 库的类型信息

Typically, library packages include typings in `.d.ts` files; see examples in `node_modules/@angular/material`.
If the package of your library does not include typings and your IDE complains, you might need to install the `@types/<lib_name>` package with the library.

For example, suppose you have a library named `d3`:

比如，假设你有一个名为 `d3` 的库：

<code-example format="shell" language="shell">

npm install d3 --save
npm install &commat;types/d3 --save-dev

</code-example>

Types defined in a `@types/` package for a library installed into the workspace are automatically added to the TypeScript configuration for the project that uses that library.
TypeScript looks for types in the `node_modules/@types` directory by default, so you do not have to add each type package individually.

已安装到工作区中的 `@types/` 包中所定义的类型，会自动添加到使用该库的项目的 TypeScript 配置文件中。TypeScript 默认就会在 `node_modules/@types` 文件夹中查找类型，所以你不必单独添加每一个类型包。

If a library does not have typings available at `@types/`, you may use it by manually adding typings for it.
To do this:

如果某个库没有 `@types/` 类型信息，你仍然可以手动为它添加一些类型信息。为此你要：

1. Create a `typings.d.ts` file in your `src/` directory.
   This file is automatically included as global type definition.

   在 `src/` 文件夹中创建一个 `typings.d.ts` 文件。该文件会自动包含在全局类型定义中。

1. Add the following code in `src/typings.d.ts`:

   在 `src/typings.d.ts` 中添加如下代码。

   <code-example format="typescript" language="typescript">

   declare module 'host' {
     export interface Host {
       protocol?: string;
       hostname?: string;
       pathname?: string;
     }
     export function parse(url: string, queryString?: string): Host;
   }

   </code-example>

1. In the component or file that uses the library, add the following code:

   在使用该库的组件或文件中，添加如下代码。

   <code-example format="typescript" language="typescript">

   import * as host from 'host';
   const parsedUrl = host.parse('https://angular.io');
   console.log(parsedUrl.hostname);

   </code-example>

Define more typings as needed.

按需定义更多类型。

## Updating libraries

## 更新这些库

A library is able to be updated by the publisher, and also has individual dependencies which need to be kept current.
To check for updates to your installed libraries, use the [`ng update`][AioCliUpdate] Angular CLI command.

Use `ng update <lib_name>` Angular CLI command to update individual library versions.
The Angular CLI checks the latest published release of the library, and if the latest version is newer than your installed version, downloads it and updates your `package.json` to match the latest version.

使用 `ng update <lib_name>` 命令来单独更新某个库的版本。Angular CLI 会检查库中最新发布的版本，如果最新版本比你已安装的版本新，就会下载它并更新你的 `package.json` 以匹配最新版本。

When you update Angular to a new version, you need to make sure that any libraries you are using are current.
If libraries have interdependencies, you might have to update them in a particular order.
See the [Angular Update Guide][AngularUpdateMain] for help.

## Adding a library to the runtime global scope

## 把某个库添加到运行时的全局范围中

If a legacy JavaScript library is not imported into an application, you may add it to the runtime global scope and load it as if it was added in a script tag.
Configure the Angular CLI to do this at build time using the `scripts` and `styles` options of the build target in the [`angular.json`][AioGuideWorkspaceConfig] workspace build configuration file.

For example, to use the [Bootstrap 4][GetbootstrapDocs40GettingStartedIntroduction] library

1. Install the library and the associated dependencies using the npm package manager:

   使用 npm 包管理器安装库和相关的依赖项：

   <code-example format="shell" language="shell">

   npm install jquery --save
   npm install popper.js --save
   npm install bootstrap --save

   </code-example>

1. In the `angular.json` configuration file, add the associated script files to the `scripts` array:

   在 `angular.json` 配置文件中，把关联的脚本文件添加到 "scripts" 数组中：

   <code-example format="json" language="json">

   "scripts": [
     "node_modules/jquery/dist/jquery.slim.js",
     "node_modules/popper.js/dist/umd/popper.js",
     "node_modules/bootstrap/dist/js/bootstrap.js"
   ],

   </code-example>

1. Add the `bootstrap.css` CSS file to the `styles` array:

   把 `bootstrap.css` 文件添加到 "styles" 数组中：

   <code-example format="css" language="css">

   "styles": [
     "node_modules/bootstrap/dist/css/bootstrap.css",
     "src/styles.css"
   ],

   </code-example>

1. Run or restart the `ng serve` Angular CLI command to see Bootstrap 4 work in your application.

   运行或重启 `ng serve`，看看你的应用是否正在使用 Bootstrap 4。

### Using runtime-global libraries inside your app

### 在你的应用中使用运行时全局库

After you import a library using the "scripts" array, do **not** import it using an import statement in your TypeScript code.
The following code snippet is an example import statement.

通过 “scripts” 数组导入某个库之后，**不要**在 TypeScript 代码中再次使用 import 语句导入它。以下代码片段是一个示例导入语句。

<code-example format="typescript" language="typescript">

import * as &dollar; from 'jquery';

</code-example>

If you import it using import statements, you have two different copies of the library: one imported as a global library, and one imported as a module.
This is especially bad for libraries with plugins, like JQuery, because each copy includes different plugins.

Instead, run the `npm install @types/jquery` Angular CLI command to download typings for your library and then follow the library installation steps.
This gives you access to the global variables exposed by that library.

相反，运行 `npm install @types/jquery` Angular CLI 命令为你的库下载类型信息，然后按照库的安装步骤进行操作。这样你就可以访问该库公开的全局变量了。

### Defining typings for runtime-global libraries

### 定义运行时全局库的类型信息

If the global library you need to use does not have global typings, you can declare them manually as `any` in `src/typings.d.ts`.

如果你要用的全局库没有全局类型信息，就可以在 `src/typings.d.ts` 中手动声明它们。

For example:

比如：

<code-example format="typescript" language="typescript">

declare var libraryName: any;

</code-example>

Some scripts extend other libraries; for instance with JQuery plugins:

有些脚本扩展了其它库，例如 JQuery 插件：

<code-example format="typescript" language="typescript">

&dollar;('.test').myPlugin();

</code-example>

In this case, the installed `@types/jquery` does not include `myPlugin`, so you need to add an interface in `src/typings.d.ts`.
For example:

在这种情况下，所安装的 `@types/jquery` 就不包含 `myPlugin`，所以你需要在 `src/typings.d.ts` 中添加一个接口。例如：

<code-example format="typescript" language="typescript">

interface JQuery {
  myPlugin(options?: any): any;
}

</code-example>

If you do not add the interface for the script-defined extension, your IDE shows an error:

如果不为这个由脚本定义的扩展添加接口，IDE 就会显示错误：

<code-example format="none" language="none">

[TS][Error] Property 'myPlugin' does not exist on type 'JQuery'

</code-example>

<!-- links -->

[AioCliUpdate]: cli/update "ng update | CLI |Angular"

[AioGuideNpmPackages]: guide/npm-packages "Workspace npm dependencies | Angular"

[AioGuideWorkspaceConfig]: guide/workspace-config "Angular workspace configuration | Angular"

[AioResources]: resources "Explore Angular Resources | Angular"

<!-- external links -->

[AngularMaterialMain]: https://material.angular.io "Angular Material | Angular"

[AngularUpdateMain]: https://update.angular.io "Angular Update Guide | Angular"

[GetbootstrapDocs40GettingStartedIntroduction]: https://getbootstrap.com/docs/4.0/getting-started/introduction "Introduction | Bootstrap"

[NpmjsMain]: https://www.npmjs.com "npm"

[YarnpkgMain]: https://yarnpkg.com " Yarn"

<!-- end links -->

@reviewed 2022-01-05