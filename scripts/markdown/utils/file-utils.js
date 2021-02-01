const fs = require('fs');
const rimraf = require('rimraf');
const { promisify } = require('util');
const { resolve } = require('path');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

/**
 * Scan specified directory for all files with matching
 * suffices. If no suffices are provided, match all files in the dir.
 * Does not recurse.
 *
 * @param {*} dir string     e.g. `data/guides`
 * @param {*} suffices array e.g ['.md', '.mdx']
 */
const getFiles = async (dir, suffices = []) => {
  const endsWith = (f) => {
    return !suffices.length
      ? true
      : suffices.reduce((result, s) => {
          return result || f.endsWith(s);
        }, false);
  };
  const subdirs = await readdir(dir);
  const files = await Promise.all(
    subdirs.map(async (subdir) => {
      const res = resolve(dir, subdir);
      return (await stat(res)).isDirectory() ? getFiles(res) : res;
    })
  );
  return files.reduce((a, f) => a.concat(f), []).filter(endsWith);
};
exports.getFiles = getFiles;

/**
 * Clear contents of existing directory
 * Ensure empty directory exists (recursively)
 */
const validateDirectory = (dir, cleanExisting = false) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    } else if (cleanExisting) {
      rimraf.sync(dir);
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (e) {
    console.log(JSON.stringify(e));
  }
};
exports.validateDirectory = validateDirectory;
