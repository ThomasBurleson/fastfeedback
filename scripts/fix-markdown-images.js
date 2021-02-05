const fs = require('fs');
const path = require('path');

const unified = require('unified');
const markdown = require('remark-parse');
const remarkToc = require('remark-toc');
const remarkSlug = require('remark-slug');
const stringify = require('remark-stringify');
const frontmatter = require('remark-frontmatter');
const prettier = require('prettier');

const { imgToJsx } = require('./markdown/img-to-jsx');
const { scanForImageUrls } = require('./markdown/scan-for-img');
const { downloadImage } = require('./markdown/download-img');

const { reportActivity } = require('./markdown/utils/log-utils');
const { getFiles, validateDirectory } = require('./markdown/utils/file-utils');
const {
  imageUrlToFilename,
  buildLocalStorePath,
  urlToLocalStore,
  fileNameFromDir
} = require('./markdown/utils/url-utils');

// ************************************************************************
//
// Markdown documents can be optimized using NextJS Image components
// and storing the remote images in a localized CDN
//
// ************************************************************************

optimizeDocuments('data/guides');

/**
 * For all markdown docs, scan for <img> urls,
 * download images, and convert <img> to optimizied NextJS <Image> tags
 * which reference local images urls
 *
 * @param {*} dir Target directory with 1...n '.md' | '.mdx' files.
 */
async function optimizeDocuments(dir) {
  reportActivity(dir);

  const files = await getFiles(dir, ['.md', '.mdx']);
  files.map(async (mdFilePath) => {
    const numImages = await downloadAllImages(mdFilePath);
    reportActivity(dir, mdFilePath, numImages);
    if (numImages) {
      await makeNextImages(mdFilePath, dir);
    }
  });
}

/**
 * For the directory with 1..n markdown files,
 * download all images to local store in using format
 * `public/static/images/<filename>/*.*`
 */
async function downloadAllImages(filePath) {
  let downloaded = [];
  const content = fs.readFileSync(filePath);
  const images = await scanForImageUrls(content);
  const outputDir = buildLocalStorePath(filePath, path.join(process.cwd(), 'public'));

  // Only make the dir if we have 1..n images
  if (images.length) {
    validateDirectory(outputDir);

    downloaded = await Promise.all(
      images.map(async (imgUrl) => {
        const fileName = imageUrlToFilename(imgUrl);
        await downloadImage(imgUrl, `${outputDir}/${fileName}`);
        return imgUrl;
      })
    );
  }

  return downloaded.length;
}

/**
 * For the specified markdown file, scan for all markdown image tags
 * and convert to NextJS image tags. Write a new markdown document to
 * the `destDir || srcDir` using the same source file name.
 *
 * Note: if the markdown contains `## Table of contents`
 * our transformer now adds TOC generation with anchor links
 *
 * @param {*} mdFilePath
 * @param {*} srcDir
 * @param {*} destDir
 */
async function makeNextImages(mdFilePath, srcDir, destDir) {
  destDir = destDir || srcDir;

  const content = fs.readFileSync(mdFilePath);
  const convertUrl = urlToLocalStore(mdFilePath);
  const transformer = unified()
    .use([markdown, remarkToc, remarkSlug]) //
    .use(imgToJsx(convertUrl))
    .use(stringify)
    .use(frontmatter, ['yaml']);
  const results = await transformer.process(content);

  const prettierConfig = await prettier.resolveConfig('./.prettierrc.js');
  const formatted = prettier.format(results.toString(), {
    ...prettierConfig,
    parser: 'markdown'
  });

  const fileName = fileNameFromDir(srcDir, mdFilePath);
  const fullDestDir = path.join(process.cwd(), destDir);

  validateDirectory(fullDestDir, false);
  fs.writeFileSync(`${fullDestDir}/${fileName}`, fixInvalidHTMLBreaks(formatted));
}

const HTML_BREAKS = /(\<[br\s/]+\>)/gim;
/**
 * FIX possible invalid Break (which require self closing tag)
 */
function fixInvalidHTMLBreaks(source) {
  return source.replace(HTML_BREAKS, '<br />');
}
