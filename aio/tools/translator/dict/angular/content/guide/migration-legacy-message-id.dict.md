Migrating legacy localization IDs

迁移旧版本地化 ID

Why this migration is necessary

为什么需要进行迁移

The Angular translation system works by matching a message ID to a translated message in a different language.
One option for creating these IDs is to have the translation system generate them for you.
Previously, the format for these IDs are not stable when there are insignificant changes, such as to whitespace.
The new format is much more robust.

Angular 的翻译体系会根据消息 ID 与另一种语言的译后消息进行匹配。创建这些 ID 的方法之一是让翻译体系为你生成它们。以前，这些 ID 的格式在发生细微更改时（比如，加减空格）是不稳定的。而新格式会更加稳健。

This topic describes how to migrate old localization IDs to help you future-proof your application in the event that the old format is removed.

本主题描述了如何迁移旧的本地化 ID，来帮你提前适应完全停止支持旧格式的那一刻。

What this migration does

此迁移的作用

Angular version 11 introduced a new format for generating localization IDs.
These new IDs are more robust than the previous legacy format.
However, applications created before version 11 still used the legacy format for their IDs.

Angular 11 版引入了一种用于生成本地化 ID 的新格式。这些新的 ID 比以前的旧格式更健壮。但是，在版本 11 之前创建的应用程序仍然将旧格式用作其 ID。

With the release of Angular version 12, you now have how tools available to help you migrate any legacy localization IDs to IDs that use the latest algorithms.

随着 Angular 版本 12 的发布，你现在可以使用工具将任何旧版的本地化 ID 迁移到基于最新算法的 ID。

You have two options for migrating legacy IDs.
The first method uses the Angular CLI to locate legacy IDs in your application.
The second method uses a standalone script, `localize-extract`, to locate the legacy IDs.

你有两个用于迁移旧版 ID 的选项。第一种方法使用 Angular CLI 在你的应用程序中定位旧版 ID。第二种方法使用独立脚本 `localize-extract` 来定位旧版 ID。

Migrating legacy IDs using the CLI

使用 CLI 迁移旧版 ID

To migrate legacy localization IDs using the CLI:

要使用 CLI 迁移旧版本地化 ID，请执行以下操作：

Run the `ng extract-i18n` command.

运行 `ng extract-i18n` 命令。

After running this command, you have a migration file, `messages.json`, containing a mapping between legacy localization IDs and new IDs that you can use to update your application.

运行此命令后，你将拥有一个迁移文件 `messages.json`，其中包含旧版本地化 ID 与新版 ID 之间的映射，可用于更新应用程序。

Update the IDs in your application using the `npx localize-migrate` command.

`npx localize-migrate` 命令更新应用程序中的 ID。

Commit the updated files to your source control system.

将更新后的文件提交到你的源码管理系统。

After you complete the migration, set the Angular Compiler option, `enableI18nLegacyMessageIdFormat`, to `false`.
For more information about this option, see [Angular Compiler Options](guide/angular-compiler-options#enablei18nlegacymessageidformat).

完成迁移后，将 Angular Compiler 选项 `enableI18nLegacyMessageIdFormat` 设置为 `false`。有关此选项的更多信息，请参见[Angular 编译器选项](guide/angular-compiler-options#enablei18nlegacymessageidformat)。

Migrate legacy IDs using `localize-extract`

用 `localize-extract` 迁移旧版 ID

If you are not using the Angular CLI, you can migrate legacy localization IDs using `localize-extract`:

如果你未使用 Angular CLI，则可以使用 `localize-extract` 来迁移旧版本地化 ID：

Run the `npx localize-extract` command.

运行 `npx localize-extract` 命令。

In this command, `./path/to/bundles/` represents the path to your distributable files.
You can set the `outputPath` parameter to any directory in your system.

在此命令中，`./path/to/bundles/` 表示你的可分发文件的路径。你可以将 `outputPath` 参数设置为系统中的任何目录。

{&commat;searchKeywords i18n}