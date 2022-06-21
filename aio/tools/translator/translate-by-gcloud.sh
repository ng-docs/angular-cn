#!/usr/bin/env sh

# markdown 文档
nt translate content/\(cli\|errors\|guide\|start\|tutorial\|special-elements\)/*.md --engine=gcloud --domain=angular

# html 文档
nt translate content/**/*.html --engine=gcloud --domain=angular

# 导航菜单
nt translate content/navigation.json --engine=gcloud --domain=angular

# 源码
nt translate '../packages/**/*.ts' '!../packages/**/*.d.ts' '!../packages/**/*_spec.ts' '!../packages/**/*.spec.ts' -et internal  --engine=gcloud --domain=angular
