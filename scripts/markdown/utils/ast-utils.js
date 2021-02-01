/**
 * Scan current node and see an 'image' node is nested
 * Images can be either:
 *
 *  `![](url)` == `<p><img></p>`, or
 *  `[![](url)](url)` == `<p><link><img></link></p>`
 *
 * @param {*} node
 */
const findChildImage = (node) => {
  const isImageNode = (n) => n.type === 'image' && !!n.url;
  const isWrapperLinkNode = (n) => n.type === 'link' && n.children.length == 1;

  if (node?.children?.length) {
    const link = node.children.find(isWrapperLinkNode);
    const image = node.children.find(isImageNode);
    return image || (link ? findChildImage(link) : null);
  }
  return null;
};

/**
 * Markdown Image nodes are always nested in the AST within a
 * standalone'paragraph' wrapper node
 *
 * @param {*} node
 */
const filterImageNodes = (node) => {
  const isParagraph = node.type === 'paragraph';
  const hasOneChild = node?.children?.length === 1;

  return isParagraph && hasOneChild ? !!findChildImage(node) : false;
};

exports.filterImageNodes = filterImageNodes;
exports.findChildImage = findChildImage;
