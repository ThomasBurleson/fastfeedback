import fs from 'fs';
import { promisify } from 'util';
import { resolve } from 'path';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

/**
 * Scan specified directory for all files with matching
 * suffices. If no suffices are provided, match all files in the dir.
 * Does not recurse.
 *
 * @param string dir string     e.g. `data/guides`
 * @param string[] suffices array e.g ['.md', '.mdx']
 */
export const getFiles = async (dir: string, suffices = [], ignoreHidden = true): Promise<string[]> => {
  const endsWithSuffices = (f: string) => {
    return !suffices.length
      ? true
      : suffices.reduce((result, s) => {
          return result || f.endsWith(s);
        }, false);
  };
  const subdirs = await readdir(dir, 'utf-8');
  const files = (await Promise.all(
    subdirs.map(async (subdir) => {
      const res = resolve(dir, subdir);
      return (await stat(res)).isDirectory() ? getFiles(res) : res;
    })
  )) as string[];
  const ignoreHiddenFiles = (f: string) => (!ignoreHidden ? f : f.indexOf('/_') == -1);

  return [...files].filter(endsWithSuffices).filter(ignoreHiddenFiles);
};

/**
 * Return filename without suffix
 * @param segment string Directory segment; eg  'data/guides'
 * @param filePath string full or relative filename; eg 'data/guides/top-10-rules.mdx'
 * @param suffix string Optional trailing suffix to strip; eg '.mdx'
 */
export const fileNameFromDir = (segment: string, fullPath: string, stripSuffix = '') => {
  let fileName = fullPath.split(`${segment}/`)[1];
  if (stripSuffix) {
    fileName = fileName.split(stripSuffix)[0];
  }
  return fileName;
};
