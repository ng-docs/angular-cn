# Persistent disk cache

# 持久化磁盘缓存

Angular CLI saves a number of cachable operations on disk by default.

默认情况下，Angular CLI 会在磁盘上保存许多可缓存的操作。

When you re-run the same build, the build system restores the state of the previous build and re-uses previously performed operations, which decreases the time taken to build and test your applications and libraries.

当你重新运行相同的构建时，构建系统会恢复先前构建的状态并重新使用之前执行过的操作，从而减少构建和测试应用程序和库所需的时间。

To amend the default cache settings, add the `cli.cache` object to your [Workspace Configuration](guide/workspace-config).
The object goes under `cli.cache` at the top level of the file, outside the `projects` sections.

要修改默认缓存设置，请将 `cli.cache` 对象添加到你的[工作区配置](guide/workspace-config)中。该对象位于文件顶层的 `cli.cache` 下，位于 `projects` 部分之外。

```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "cli": {
    "cache": {
      ...
    }
  },
  "projects": {}
}
```

For more information, see [cache options](guide/workspace-config#cache-options).

有关更多信息，请参阅[缓存选项](guide/workspace-config#cache-options)。

### Enabling and disabling the cache

### 启用和禁用缓存

Caching is enabled by default. To disable caching run the following command:

默认情况下启用缓存。要禁用缓存，请运行以下命令：

```bash
ng config cli.cache.enabled false
```

To re-enable caching, set `cli.cache.enabled` to `true`.

要重新启用缓存，请将 `cli.cache.enabled` 设置为 `true` 。

### Cache environments

### 缓存环境

By default, disk cache is only enabled for local environments.

默认情况下，仅对本地环境启用磁盘缓存。

To enable caching for all environments, run the following command:

要为所有环境启用缓存，请运行以下命令：

```bash
ng config cli.cache.environment all
```

For more information, see `environment` in [cache options](guide/workspace-config#cache-options).

有关更多信息，请参阅[缓存选项](guide/workspace-config#cache-options)中的 `environment` 。

<div class="alert is-helpful">

The Angular CLI checks for the presence and value of the `CI` environment variable to determine in which environment it is running.

Angular CLI 会检查 `CI` 环境变量的是否存在及其值，以确定它正在哪个环境中运行。

</div>

### Cache path

### 缓存路径

By default, `.angular/cache` is used as a base directory to store cache results. To change this path, run the following command:

默认情况下， `.angular/cache` 用作存储缓存结果的基本目录。要更改此路径，请运行以下命令：

```bash
ng config cli.cache.path ".cache/ng"
```

### Clearing the cache

### 清除缓存

To clear the cache, run one of the following commands.

要清除缓存，请运行以下命令之一。

To clear the cache on Unix-based operating systems:

要清除基于 Unix 的操作系统上的缓存：

```bash
rm -rf .angular/cache
```

To clear the cache on Windows:

要清除 Windows 上的缓存：

```bash
rmdir /s /q .angular/cache
```

For more information, see [rm command](https://man7.org/linux/man-pages/man1/rm.1.html) and [rmdir command](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/rmdir).

有关详细信息，请参阅 [rm 命令](https://man7.org/linux/man-pages/man1/rm.1.html) 和 [rmdir 命令](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/rmdir)。
