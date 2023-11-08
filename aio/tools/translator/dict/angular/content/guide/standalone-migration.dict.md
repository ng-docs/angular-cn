Migrate an existing Angular project to standalone

将现有的 Angular 项目迁移到独立项目

As of version 15.2.0, Angular offers a [schematic](guide/schematics) to help project authors convert existing projects to [the new standalone APIs](guide/standalone-components). The schematic aims to transform as much code as possible automatically, but it may require some manual fixes by the project author. Run the schematic with the following command:

从版本 15.2.0 开始，Angular 提供了一个[原理图](guide/schematics)来帮助项目作者将现有项目转换为[新的独立 API](guide/standalone-components)。该原理图旨在自动转换尽可能多的代码，但可能需要项目作者进行一些手动修复。使用以下命令运行原理图：

Prerequisites

前提条件

Before using the schematic, please ensure that the project:

在使用本原理图之前，请确保项目：

Is using Angular 15.2.0 or later.

使用的是 Angular 15.2.0 或更高版本。

Builds without any compilation errors.

构建没有任何编译错误。

Is on a clean Git branch and all work is saved.

在干净的 Git 分支上，所有工作都已保存。

Schematic options

原理图选项

The path to migrate, relative to the project root. You can use this option to migrate sections of your project incrementally.

相对于项目根目录的迁移路径。你可以使用此选项以增量方式迁移项目的各个部分。

The transformation to perform. See [Migration modes](#migration-modes) below for details on the available options.

要执行的转换。有关可用选项的详细信息，请参阅下面的[迁移模式](#migration-modes)。

Option

选项

Details

详情

Migrations steps

迁移步骤

The migration process is composed of three steps. You'll have to run it multiple times and check manually that the project builds and behaves as expected.

迁移过程由三个步骤组成。你必须多次运行它并手动检查项目是否能按预期构建和运行。

Run the migration in the order listed below, verifying that your code builds and runs between each step:

按照下面列出的顺序运行迁移，验证你的代码在每个步骤之间构建和运行：

Run `ng g @angular/core:standalone` and select "Convert all components, directives and pipes to standalone"

运行 `ng g @angular/core:standalone` 并选择 “Convert all components, directives and pipes to standalone”

Run `ng g @angular/core:standalone` and select "Remove unnecessary NgModule classes"

运行 `ng g @angular/core:standalone` 并选择 “Remove unnecessary NgModule classes”

Run `ng g @angular/core:standalone` and select "Bootstrap the project using standalone APIs"

运行 `ng g @angular/core:standalone` 并选择 “Bootstrap the project using standalone APIs”

Run any linting and formatting checks, fix any failures, and commit the result

运行任何静态分析（lint）和格式检查，修复任何故障，并提交结果

After the migration

迁移后

Congratulations, your application has been converted to standalone 🎉. These are some optional follow-up steps you may want to take now:

恭喜，你的应用程序已转换为独立应用程序 🎉。这些是你现在可能想要采取的一些可选的后续步骤：

Find and remove any remaining `NgModule` declarations: since the ["Remove unnecessary NgModules" step](#remove-unnecessary-ngmodules) cannot remove all modules automatically, you may have to remove the remaining declarations manually.

查找并删除任何剩余的 `NgModule` 声明：由于[“删除不必要的 NgModule”步骤](#remove-unnecessary-ngmodules)不能自动删除所有模块，你可能必须手动删除剩余的声明。

Run the project's unit tests and fix any failures.

运行项目的单元测试并修复所有故障。

Run any code formatters, if the project uses automatic formatting.

如果项目使用了自动格式化，则运行所有代码格式化程序。

Run any linters in your project and fix new warnings. Some linters support a `--fix` flag that may resolve so warnings automatically.

在你的项目中运行任何静态分析器（linter）并修复新警告。一些静态分析器支持 `--fix` 标志，可以自动解决一些警告。

Migration modes

迁移模式

The migration has the following modes:

迁移有以下几个步骤：

Convert declarations to standalone.

将声明转换为独立的。

Remove unnecessary NgModules.

移除不必要的 NgModule。

Switch to standalone bootstrapping API.
You should run these migrations in the order given.

切换到独立的引导启动 API。

Convert declarations to standalone

将声明转换为独立的

In this mode, the migration converts all components, directives and pipes to standalone by setting `standalone: true` and adding dependencies to their `imports` array.

在这种模式下，迁移通过设置 `standalone: true` 并将依赖项添加到它们的 `imports` 数组来将所有组件、指令和管道转换为独立的。

**Before:**

**之前：**

**After:**

**之后：**

Remove unnecessary NgModules

移除不必要的 NgModule

After converting all declarations to standalone, many NgModules can be safely removed. This step deletes such module declarations and as many corresponding references as possible. If the migration cannot delete a reference automatically, it leaves the following TODO comment so that you can delete the NgModule manually:

在将所有声明都转换为独立声明后，就可以安全地删除许多 NgModule 了。此步骤会删除这类模块声明和尽可能多的相应引用。如果迁移无法自动删除引用，它就会留下以下 TODO 注释，以便你可以手动删除 NgModule：

The migration considers a module safe to remove if that module:

如果该模块满足以下条件，则迁移器就认为该模块可以安全删除了：

Has no `declarations`.

没有 `declarations`。

Has no `providers`.

没有 `providers`。

Has no `bootstrap` components.

没有 `bootstrap` 组件。

Has no `imports` that reference a `ModuleWithProviders` symbol or a module that can't be removed.

没有引用 `ModuleWithProviders` 符号或无法删除的模块的 `imports`。

Has no class members. Empty constructors are ignored.

没有类成员。空构造函数将被忽略。

Switch to standalone bootstrapping API

切换到独立的引导 API

This step converts any usages of  `bootstrapModule` to the new, standalone-based `bootstrapApplication`. It also switches the root component to `standalone: true` and deletes the root NgModule. If the root module has any `providers` or `imports`, the migration attempts to copy as much of this configuration as possible into the new bootstrap call.

此步骤将 `bootstrapModule` 的任何用法转换为新的、基于独立的 `bootstrapApplication`。它还会将根组件切换为 `standalone: true` 并删除根 NgModule。如果根模块有任何 `providers` 或 `imports`，迁移会尝试将尽可能多的配置复制到新的引导程序调用中。

Common problems

常见问题

Some common problems that may prevent the schematic from working correctly include:

一些可能阻止原理图正常工作的常见问题包括：

Compilation errors - if the project has compilation errors, Angular cannot analyze and migrate it correctly.

编译错误 —— 如果项目有编译错误，Angular 就无法正确分析和迁移它。

Files not included in a tsconfig - the schematic determines which files to migrate by analyzing your project's `tsconfig.json` files. The schematic excludes any files not captured by a tsconfig.

文件未包含在 tsconfig 中 —— 原理图通过分析项目的 `tsconfig.json` 文件来确定要迁移的文件。该原理图不会包括任何未被 tsconfig 捕获的文件。

Code that cannot be statically analyzed - the schematic uses static analysis to understand your code and determine where to make changes. The migration may skip any classes with metadata that cannot be statically analyzed at build time.

无法静态分析的代码 —— 原理图使用静态分析来理解你的代码并确定在哪里进行更改。迁移可能会跳过任何包含在构建时无法静态分析的元数据的类。

Limitations

限制

Due to the size and complexity of the migration, there are some cases that the schematic cannot handle:

由于迁移的规模和复杂性，有一些情况是原理图无法处理的：

Because unit tests are not ahead-of-time \(AoT\) compiled, `imports` added to components in unit tests might not be entirely correct.

因为单元测试不是预先（AoT）编译的，所以在单元测试中往组件的 `imports` 中添加类可能不完全正确。

The schematic relies on direct calls to Angular APIs. The schematic cannot recognize custom wrappers around Angular APIs. For example, if there you define a custom `customConfigureTestModule` function that wraps `TestBed.configureTestingModule`, components it declares may not be recognized.

该原理图依赖于对 Angular API 的直接调用。原理图无法识别围绕 Angular API 的自定义包装器。例如，如果你在那里定义了一个自定义的 `customConfigureTestModule` 函数来包装 `TestBed.configureTestingModule`，它声明的组件可能无法被识别。