#!/usr/bin/env sh

# angular 模型已过期，暂用 spring 模型

# markdown 文档
nt translate content/\(cli\|errors\|guide\|start\|tutorial\|special-elements\|extended-diagnostics\)/*.md --engine=gcloud --domain=spring

# html 文档
nt translate content/**/*.html '!content/examples/**/*.html' --engine=gcloud --domain=spring

# 导航菜单
nt translate content/navigation.json --engine=gcloud --domain=spring --jsonProperties=title --jsonProperties=tooltip

# 资源列表
nt translate content/marketing/resources.json --engine=gcloud --domain=spring --jsonProperties=title --jsonProperties=desc

# 帮助文件
nt translate content/cli-src/help/*.json --engine=gcloud --domain=spring --jsonProperties=description --jsonProperties=shortDescription --jsonProperties=longDescription

cd ..
# 源码
nt translate 'packages/**/*.ts' '!packages/**/*.d.ts' '!packages/**/*_spec.ts' '!packages/**/*.spec.ts' -et internal -et=nodoc --engine=gcloud --domain=spring

cd -
