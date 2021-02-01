const { fileNameFromDir } = require('./url-utils');

const log = (node) => {
  console.dir(node, { depth: null });
  return node;
};
exports.log = log;

function reportActivity(dir, mdFile, numImages) {
  if (!mdFile) {
    log(`----------------`);
    log(`Scanning ${dir}:`);
    log(`----------------`);
    return;
  }

  const message = numImages ? `${numImages} images downloaded and converted.` : 'No images founds.';
  const fileName = fileNameFromDir(dir, mdFile);

  log(`${fileName}: ${message} `);
}
exports.reportActivity = reportActivity;
