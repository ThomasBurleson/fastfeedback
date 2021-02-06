import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';
import mdxPrism from 'mdx-prism-2';
import remarkSlug from 'remark-slug';
import remarkCodeTitles from 'remark-code-titles';
import rehypeHeadings from 'rehype-autolink-headings';
import reactRenderToString from 'next-mdx-remote/render-to-string';

import { MdxRemote } from 'next-mdx-remote/types';

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
 *  What is the context/category for the Slug content
 */
export enum SlugCategory {
  Unknown = '',
  Guides = 'guides'
}
/**
 * Load MDX content by file in `${path.cwd()}/<type>/<slug>.mdx`
 * Parse and render as HTML string
 *
 * @param slug Filename (without suffix)
 * @param type Directory segment
 */
export async function getFileBySlug(slug: string, type = SlugCategory.Unknown): Promise<FileBySlugResults> {
  const srcPath = path.join(MDX_ROOT_PATH, type, `${slug}.mdx`);
  const source = fixInvalidMarkdown(fs.readFileSync(srcPath, 'utf8'));
  const { data, content }: matter.GrayMatterFile<string> = matter(source);

  const mdxSource = await reactRenderToString(content, {
    components: MDXComponents(slug),
    mdxOptions: {
      remarkPlugins: [remarkSlug, remarkCodeTitles],
      rehypePlugins: [[rehypeHeadings, { behavior: 'wrap' }], mdxPrism]
    }
  });

  return {
    mdxSource, // Static render-now verison + render-later, rehydratable version
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
