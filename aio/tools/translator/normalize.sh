#!/usr/bin/env sh

# markdown 文档
nt translate 'content/**/*.md' '!content/(examples|demos)/**/*.md' --engine=normalizer

# html 文档
nt translate 'content/**/*.html' '!content/(examples|demos)/**/*.html' --engine=normalizer
