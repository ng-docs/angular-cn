#!/usr/bin/env sh

# markdown 文档
nt translate content/\(cli\|errors\|guide\|start\|tutorial\|special-elements\)/*.md --engine=dict --dict ./tools/translator/dict/angular

# html 文档
nt translate content/**/*.html --engine=dict --dict ./tools/translator/dict/angular

# 导航菜单
nt translate content/navigation.json --engine=dict --dict ./tools/translator/dict/angular

# 源码
nt translate '../packages/**/*.ts' '!../packages/**/*.d.ts' '!../packages/**/*_spec.ts' '!../packages/**/*.spec.ts' -et internal --engine=dict --dict ./tools/translator/dict/angular
