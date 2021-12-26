const {Marker, defaultSelectors, DomDocumentFragment} = require('@awesome-fe/translate');

function mark(text) {
  // 对 cheatsheet页做特殊处理
  if (text?.includes('<h1 class="no-toc">Cheat Sheet</h1>')) {
    text = text.replace(/<(td|th)>\s*<p>([\s\S]*?)<\/p>\s*<\/\1>/g, '<$1>$2</$1>');
  }
  const marker = new Marker([...defaultSelectors, (node) => node.isTagOf('header') || node.isTagOf('section')]);
  const doc = DomDocumentFragment.parse(text);
  marker.addIdForHeaders(doc);
  marker.markAndSwapAll(doc);
  return doc.toHtml();
}

module.exports = {
  mark,
};
