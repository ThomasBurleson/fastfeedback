import fs from 'fs';
import matter from 'gray-matter';
import mdxPrism from 'mdx-prism';
import path from 'path';
import renderToString from 'next-mdx-remote/render-to-string';

import { MDXComponents } from '../components/MDXComponents';

export interface FileBySlugResults {
  mdxSource: string;
  frontMatter: {
    wordCount: number;
    slug: string;
  };
}

const root = process.cwd();

export async function getFiles(type) {
  return fs.readdirSync(path.join(root, 'data', type));
}

/**
 * Load MDX content by file in `<cwd>/<type>/<slug>.mdx`
 * Parse and render as HTML string
 *
 * @param type Directory segment
 * @param slug Filename (without suffix)
 */
export async function getFileBySlug(type: string, slug: string): Promise<FileBySlugResults> {
  const source = slug
    ? fs.readFileSync(path.join(root, 'data', type, `${slug}.mdx`), 'utf8')
    : fs.readFileSync(path.join(root, 'data', `${type}.mdx`), 'utf8');

  const { data, content }: matter.GrayMatterFile<string> = matter(source);
  const mdxSource = await renderToString(content, {
    components: MDXComponents,
    mdxOptions: {
      remarkPlugins: [require('remark-autolink-headings'), require('remark-slug'), require('remark-code-titles')],
      rehypePlugins: [mdxPrism]
    }
  });

  return {
    mdxSource,
    frontMatter: {
      wordCount: content.split(/\s+/gu).length,
      slug: slug || null,
      ...data
    }
  };
}

export async function getAllFilesFrontMatter(type) {
  const files = fs.readdirSync(path.join(root, 'data', type));

  return files.reduce((allPosts, postSlug) => {
    const source = fs.readFileSync(path.join(root, 'data', type, postSlug), 'utf8');
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
