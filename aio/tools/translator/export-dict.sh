#!/usr/bin/env sh

sqlite3 tools/translator/dict/angular.sqlite ".mode tab" "select path, english, chinese, format from dict" > tools/translator/dict.tsv
