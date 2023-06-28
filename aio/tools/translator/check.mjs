#!/usr/bin/env node
import {readFileSync} from 'fs';
import {globbySync} from 'globby';

const files = globbySync('/Users/twer/backup/tools/translator/translate/temp/export/docs/**/*.json');

for (let file of files) {
  const json = JSON.parse(readFileSync(file, 'utf-8'));
  const keyi = json.filter(item => item.distance >= 0.2);
  if (keyi.length > 0) {
    console.log(`Parsing ${file}...`);
  }
}
