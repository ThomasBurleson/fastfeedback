import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

import { getFiles } from './files';

// Markdown document 'root' is `<repo-path>/data/`
export const MDX_ROOT_PATH = path.join(process.cwd(), 'data');

export const getMdxFiles = async (dir = 'data/guides', noSuffix = true) => {
  const MDX = /(\.mdx|\.md)$/gim;
  const removeDir = (f: string) => f.split(`${dir}/`)[1];
  const stripSuffix = (f: string) => (noSuffix ? f.replace(MDX, '') : f);

  let files = await getFiles(dir, ['.mdx', '.md']);
  return files.map(removeDir).map(stripSuffix);
};

export async function getAllFilesFrontMatter(type) {
  const files = await getMdxFiles('data/guides');

  return files.reduce((allPosts, postSlug) => {
    const source = fs.readFileSync(path.join(MDX_ROOT_PATH, type, postSlug), 'utf8');
    const { data } = matter(source);

    return [
      {
        ...data,
        slug: postSlug.replace('.mdx', '')
      },
      ...allPosts
    ];
  }, []);
}
