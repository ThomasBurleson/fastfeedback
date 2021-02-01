const path = require('path');

const REGEX_FILENAME_ONLY = /([\w\d_-]*\.?[^\\\/]*)$/i;
const REGEX_FILENAME_SUFFIX = /([^\/.]+)$|([^\/]+)(\.[^\/.]+)$/i;

/**
 * NextJS can easily host CDN images stored in local `/public` directory
 *
 * Note: `img.src` references starting with '/static/images'
 * will be relative to '/public'
 */
const URL_STATIC_IMAGES = '/static/images';

/**
 * For a URL specified in a Markdown file,
 * convert to local image storage for that document.
 *
 * @param {*} mdFilePath
 */
const urlToLocalStore = (mdFilePath) => (url) => {
  const outputDir = buildLocalStorePath(mdFilePath);
  const slug = imageUrlToFilename(url);
  return `${outputDir}/${slug}`;
};

/**
 * Filename suffix is used to create a storage directory
 * e.g. 'git-appendix.mdx' => `/static/images/git-appendix`
 *
 * @param {*} filePath string
 */
const buildLocalStorePath = (filePath, root = '') => {
  const filePrefix = filePath.match(REGEX_FILENAME_SUFFIX)[2];
  return `${path.join(root, URL_STATIC_IMAGES, filePrefix)}`;
};

const fileNameFromDir = (dir, filePath) => {
  return filePath.split(`${dir}/`)[1];
};

/**
 * Extract the filename from the full URL
 * @param {*} imgUrl string
 */
const imageUrlToFilename = (imgUrl) => {
  return imgUrl.match(REGEX_FILENAME_ONLY)[1];
};

exports.buildLocalStorePath = buildLocalStorePath;
exports.fileNameFromDir = fileNameFromDir;
exports.urlToLocalStore = urlToLocalStore;
exports.imageUrlToFilename = imageUrlToFilename;
