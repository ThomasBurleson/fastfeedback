import hydrate from 'next-mdx-remote/hydrate';

import { getFiles, getFileBySlug, MDXComponents, GuideLayout } from '@mdlp/layouts';

export default function Guide({ mdxSource, frontMatter }) {
  const content = hydrate(mdxSource, {
    components: MDXComponents
  });

  return <GuideLayout frontMatter={frontMatter}>{content}</GuideLayout>;
}

export async function getStaticPaths() {
  const posts = await getFiles('blog');

  return {
    paths: posts.map((p) => ({
      params: {
        slug: p.replace(/\.mdx/, '')
      }
    })),
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const post = await getFileBySlug('guides', params.slug);

  return { props: post };
}
