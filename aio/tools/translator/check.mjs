#!/usr/bin/env node
import {readFileSync} from 'fs';
import {globbySync} from 'globby';

const files = globbySync('/Users/twer/backup/tools/translator/translate/temp/export/docs/**/*.json');

for (let file of files) {
  const json = JSON.parse(readFileSync(file, 'utf-8'));
  const result = json.filter(item => item.distance >= 0.2);
  if (result.length > 0) {
    console.log(`Parsing ${file}...`);
    result.forEach(item => {
      console.log(item.english);
      console.log(item.chinese);
      console.log('');
    });
  }
}
