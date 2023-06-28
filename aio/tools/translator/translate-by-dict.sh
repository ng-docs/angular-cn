#!/usr/bin/env sh

# markdown 文档
nt translate '!content/(examples|demos)/**/*.md' --engine=dict --dict ./tools/translator/dict/angular

# html 文档
nt translate '!content/(examples|demos)/**/*.html' --engine=dict --dict ./tools/translator/dict/angular

# 导航菜单
nt translate content/navigation.json --jsonProperties=title --jsonProperties=tooltip --engine=dict --dict ./tools/translator/dict/angular

# 社区资源
nt translate content/marketing/resources.json --jsonProperties=title --jsonProperties=desc --engine=dict --dict ./tools/translator/dict/angular

# 帮助文件
nt translate content/cli/help/**/*.json --jsonProperties=description --jsonProperties=shortDescription --jsonProperties=longDescription --engine=dict --dict ./tools/translator/dict/angular

# 源码
nt translate '../packages/**/!(*.d|*.spec|*_spec).ts' -et internal -et nodoc --engine=dict --dict ./tools/translator/dict/angular
