#!/usr/bin/env sh

# markdown 文档
nt extract content/\(cli\|errors\|guide\|start\|tutorial\|special-elements\|extended-diagnostics\)/*.md --dict ./tools/translator/dict/angular

# html 文档
nt extract content/**/*.html '!content/examples/**/*.html' --dict ./tools/translator/dict/angular

# 导航菜单
nt extract content/navigation.json --dict ./tools/translator/dict/angular --jsonProperties=title --jsonProperties=tooltip

# 社区资源
nt extract content/marketing/resources.json --dict ./tools/translator/dict/angular --jsonProperties=title --jsonProperties=desc

# 帮助文件
nt extract content/cli-src/help/*.json --dict ./tools/translator/dict/angular --jsonProperties=description --jsonProperties=shortDescription --jsonProperties=longDescription

# 源码
nt extract '../packages/**/!(*.d|*.spec|*_spec).ts' -et internal -et nodoc --dict ./tools/translator/dict/angular
