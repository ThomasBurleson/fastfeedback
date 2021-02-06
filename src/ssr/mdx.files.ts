import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

import { getFiles } from './files';

export const getMdxFiles = async (dir = 'data/guides', noSuffix = true): Promise<string[]> => {
  const MDX = /(\.mdx|\.md)$/gim;
  const removeDir = (f: string) => f.split(`${dir}/`)[1];
  const stripSuffix = (f: string) => (noSuffix ? f.replace(MDX, '') : f);

  let files = await getFiles(dir, ['.mdx', '.md']);
  return files.map(removeDir).map(stripSuffix);
};

/**
 * Each markdown document 'should' have YAML-style meta data associated with the document:
 * e.g.
 *   ---
 *   title: Become a Better Software Architect
 *   description: Important skills of a software architect.
 *   tags: software, architect, skills
 *   author: Thomas Burleson
 *   createdOn: August 19, 2018
 *   lang: en
 *   --
 */
export type SlugInfo = {
  title: string; // title of MDX document
  description: string; // description details
  tags: string; // tags associated
  lang: string; // language of content
  slug: string; // filename prefix
  author: string;
  createdOn: string;
};

// Markdown document 'root' is `<repo-path>/data/`
export const MDX_ROOT_PATH = path.join(process.cwd(), 'data');

export async function getAllFilesFrontMatter(dir = 'guides'): Promise<SlugInfo[]> {
  const files = await getMdxFiles('data/guides', false);

  return files.reduce((allPosts, postSlug) => {
    const source = fs.readFileSync(path.join(MDX_ROOT_PATH, dir, postSlug), 'utf8');
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
