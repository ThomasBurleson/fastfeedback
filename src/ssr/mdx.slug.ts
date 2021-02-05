import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';
import mdxPrism from 'mdx-prism-2';
import remarkSlug from 'remark-slug';
import remarkCodeTitles from 'remark-code-titles';
import rehypeHeadings from 'rehype-autolink-headings';
import { MdxRemote } from 'next-mdx-remote/types';
import renderToString from 'next-mdx-remote/render-to-string';

import { MDXComponents } from '../shared/layouts/components/MDXComponents';
import { MDX_ROOT_PATH } from './mdx.files';

// *************************************************
// Server Functions
// *************************************************

export interface FileBySlugResults {
  mdxSource: MdxRemote.Source;
  frontMatter: {
    wordCount: number;
    slug: string;
  };
}

/**
 * Load MDX content by file in `<cwd>/<type>/<slug>.mdx`
 * Parse and render as HTML string
 *
 * @param type Directory segment
 * @param slug Filename (without suffix)
 */
export async function getFileBySlug(type: string, slug: string): Promise<FileBySlugResults> {
  let source = slug
    ? fs.readFileSync(path.join(MDX_ROOT_PATH, type, `${slug}.mdx`), 'utf8')
    : fs.readFileSync(path.join(MDX_ROOT_PATH, `${type}.mdx`), 'utf8');

  const { data, content }: matter.GrayMatterFile<string> = matter(fixInvalidMarkdown(source));
  const mdxSource = await renderToString(content, {
    components: MDXComponents(slug),
    mdxOptions: {
      remarkPlugins: [remarkSlug, remarkCodeTitles],
      rehypePlugins: [[rehypeHeadings, { behavior: 'wrap' }], mdxPrism]
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

export { MDXComponents };

// ***********************************
// BUG FIXES
// ***********************************

/**
 * Authored markdown may have parts that are not
 * transformed properly. Below is a sequence of known fixes.
 * NOTE: this should be applied BEFORE the matter trans-compiler runs
 */
function fixInvalidMarkdown(source: string): string {
  source = fixInfoBlocks(source);
  source = fixInternalAnchor(source);
  return source;
}

const INFO_BLOCK = /(:{3}\w+[\s\n\r]+|:{3})/gim;
const INTERNAL_ANCHORS = /\((#[\-\w\d]+)\)/gim;

/**
 * rehypeHeadings creates anchor ids in 'lowercase'
 * yet the `<a href=""></a>` may contain mixed case url...
 */
function fixInternalAnchor(source: string): string {
  return source.replace(INTERNAL_ANCHORS, (url) => url.toLocaleLowerCase());
}

/**
 * Hackmd.io info blocks are not yet supported. Convert
 * ```
 *    :::info
 *    :bulb: <text here>
 *    :::
 * ```
 * to
 * ```
 *    > <text here>
 * ```
 *
 * @param source
 */
function fixInfoBlocks(source: string): string {
  return source.replace(INFO_BLOCK, '').replace(':bulb:', '>');
}
