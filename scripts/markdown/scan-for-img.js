var unified = require('unified');
var markdown = require('remark-parse');
var visit = require('unist-util-visit');
const stringify = require('remark-stringify');
const filter = require('unist-util-flat-filter');

const { findChildImage, filterImageNodes } = require('./utils/ast-utils');

/**
 * Scan markdown-formatted content for all image urls
 * Parse content uing `markdown` processor with unified to visit the 'image' nodes
 *
 * @param mdContent is string | Buffer
 * @return Array of image URLs (without SSL protocols)
 */
exports.scanForImageUrls = async (mdContent) => {
  const imageUrls = [];
  const onlyImageNodes = (_) => (tree) => {
    visit(tree, filterImageNodes, (node) => {
      const imageNode = findChildImage(node);
      if (imageNode) {
        imageUrls.push(imageNode.url);
      }
    });
  };
  const extractor = unified().use([markdown, onlyImageNodes, stringify]);
  await extractor.process(mdContent);

  return imageUrls.map((it) => it.replace('https', 'http'));
};
