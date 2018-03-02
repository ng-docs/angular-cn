import { expect } from 'chai';
import { dirs } from './dirs';
import { dict, kernelText, lookup, normalizeLines, translate } from './translate';


describe('根据字典进行翻译', () => {
  it('忽略明显错误的条目', function () {
    expect(dict.filter(entry => /^<div/.test(entry.original))).eql([]);
  });

  it('抽取核心字符', function () {
    expect(kernelText(' # Forms   ABC ')).eql('# Forms ABC');
  });

  it('查字典', () => {
    expect(lookup('# Forms')[0].translation).eql('# 表单');
  });

  it('把“- * 1. #”等处理成空行分隔的格式，以便处理', function () {
    const lines = normalizeLines('1. abc\n11. def\n');
    expect(lines).eql('1. abc\n\n11. def\n');
  });

  it('自动根据字典翻译单个文件', function () {
    const fs = require('fs');
    const content = fs.readFileSync(__dirname + '/../../../../content-en/' + 'guide/forms.md', 'utf-8');
    const result = translate(content);
    fs.writeFileSync(dirs.content + 'guide/forms.md', result.join('\n\n'), 'utf-8');
  });
});
