// *************************************************
// Client-side Component(s)
// *************************************************

import { InferGetStaticPropsType } from 'next';
import hydrate from 'next-mdx-remote/hydrate';

import { MDXComponents, GuideLayout } from '@mdlp/layouts';

/**
 * getStaticProps returns a FileBySlugResults, so lets infer
 * that type from the function meta data
 */
type GuideProps = InferGetStaticPropsType<typeof getStaticProps>;

/**
 * Render the MDX content as an in-app guide page...
 * @param FileBySlugResults
 */
export const GuideContainer: React.FC<GuideProps> = ({ mdxSource, frontMatter }) => {
  const content = hydrate(mdxSource, {
    components: MDXComponents(frontMatter.slug)
  });
  return <GuideLayout frontMatter={frontMatter}>{content}</GuideLayout>;
};

export default GuideContainer;

// *************************************************
// Server Functions
// *************************************************

import { GetStaticProps, GetStaticPaths } from 'next';
import { getMdxFiles, getFileBySlug, FileBySlugResults, SlugCategory } from '@mdlp/ssr';

/**
 * Gather list of static pages to pre-generate
 */
export const getStaticPaths: GetStaticPaths = async () => {
  let guides = await getMdxFiles('data/guides');

  return {
    paths: guides.map((slug) => ({
      params: {
        slug
      }
    })),
    fallback: false
  };
};

/**
 * These dynamic routes with contain a 'slug' parameter
 * which is the filename prefix of the routed mdx document;
 * a document loaded from 'data/guides/[slug].mdx'
 *
 * NOTE: these 'slug' values are published in getStaticPaths() above
 */
type ParamProps = { slug: string };

/**
 * Get the FileBySlugResults [frontmatter and mdx content] associated with
 * the 'slug' (mdx filename prefix)
 *
 * @param FileBySlugResults is the 'post' type
 */
export const getStaticProps: GetStaticProps<FileBySlugResults, ParamProps> = async ({ params }) => {
  const post = await getFileBySlug(params.slug, SlugCategory.Guides);

  return { props: post };
};
