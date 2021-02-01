const visit = require('unist-util-visit');
const sizeOf = require('image-size');
const filter = require('unist-util-flat-filter');

const { findChildImage, filterImageNodes } = require('./utils/ast-utils');

/**
 *  Convert original Markdown Image node to NextJS Image node
 */
const convertToNextJSImage = (convertURL) => (node) => {
  const imageNode = findChildImage(node);
  if (imageNode) {
    const imageUrl = convertURL(imageNode.url); // optionally use alternate CDN location
    const localStoredImage = `${process.cwd()}/public${imageUrl}`;

    const dimensions = sizeOf(localStoredImage);
    imageNode.type = 'html';
    imageNode.value = `
    <Image
      src={\`${imageUrl}\`}
      alt={\`${imageNode.alt}\`}
      width={${dimensions.width}}
      height={${dimensions.height}}
    />
  `;
    node.children = [imageNode];
  }
};

exports.imgToJsx = (convertURL) => (options) => async (tree) => {
  const onlyImageNodes = (tree) => {
    filter(tree, filterImageNodes);
  };
  visit(tree, filterImageNodes, convertToNextJSImage(convertURL));
};
