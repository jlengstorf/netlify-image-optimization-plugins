/*
 * This code is lifted directly from the Blocks editor by John Otander.
 * See https://git.io/JeQSz
 */
const visit = require('unist-util-visit');

const isCloseTag = (str = '') => str.startsWith('</') || str.endsWith('/>');
const isOpenTag = (str = '') => !isCloseTag(str) && str.endsWith('>');

module.exports = () => ast => {
  visit(ast, 'jsx', (node, index, parent) => {
    if (!isCloseTag(node.value)) {
      return;
    }

    for (let i = index - 1; i >= 0; i--) {
      // This should eventually check to also make sure that the JSX blocks
      // wrapping Markdown have matching tag names as well.
      if (isOpenTag(parent.children[i].value)) {
        const open = parent.children[i];
        open.children = [{ type: 'jsx', value: open.value }];

        for (let j = i + 1; j <= index; j++) {
          const child = parent.children[j];
          open.children.push(child);
        }

        parent.children.splice(i + 1, index - 1);
        delete open.value;
      }
    }
  });

  return ast;
};
