#!/usr/bin/env sh

# markdown 文档
nt translate 'content/**/*.md' '!content/(examples|demos)/**/*.md' --engine=extractor --dict ./tools/translator/dict/angular

# html 文档
nt translate 'content/**/*.html' '!content/(examples|demos)/**/*.html' --engine=extractor --dict ./tools/translator/dict/angular

# 导航菜单
nt translate content/navigation.json --engine=extractor --dict ./tools/translator/dict/angular --jsonProperties=title --jsonProperties=tooltip

# 社区资源
nt translate content/marketing/resources.json --engine=extractor --dict ./tools/translator/dict/angular --jsonProperties=title --jsonProperties=desc

# 帮助文件
nt translate content/cli-src/help/*.json --engine=extractor --dict ./tools/translator/dict/angular --jsonProperties=description --jsonProperties=shortDescription --jsonProperties=longDescription

# 源码
nt translate '../packages/**/*.ts' '!../packages/**/*.d.ts' '!../packages/**/*_spec.ts' '!../packages/**/*.spec.ts' -et internal -et nodoc --engine=extractor --dict ./tools/translator/dict/angular
