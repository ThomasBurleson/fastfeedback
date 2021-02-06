// *************************************************
// Client-side Component(s)
// *************************************************

import { InferGetStaticPropsType } from 'next';

/**
 * getStaticProps returns a FileBySlugResults, so lets infer
 * that type from the function meta data
 */
type GuideProps = InferGetStaticPropsType<typeof getStaticProps>;

/**
 * Render a listing of all the available MDX guides; each with a routing link
 */
export default function Guides({ guides }: GuideProps) {
  return (
    <div className="prose dark:prose-dark max-w-none m-auto w-2/3">
      <div className="flow-root">
        <ul className="-mb-8">
          {guides.map(({ slug, title, description, author, createdOn }, index) => {
            const url = `/guides/${slug.replace(/\.mdx?/, '')}`;
            return (
              <li key={index}>
                <div className="relative pb-8">
                  <span
                    className="vertical-line absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  ></span>
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                        <img className="h-8 w-auto" src="/logos/mdx.svg" alt="" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500" style={{ marginTop: '-5px;' }}>
                          <Link href={`${url}`}>
                            <a className="text-lg font-medium text-gray-900">{title}</a>
                          </Link>
                        </p>
                        <p className="font-medium text-gray-600">{description}</p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        <time dateTime={createdOn}>{createdOn}</time>
                        <p className="text-blue-400" style={{ marginTop: '-5px;' }}>
                          {' '}
                          {author}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// *************************************************
// Server Functions
// *************************************************

import Link from 'next/link';
import { GetStaticProps } from 'next';

import { getAllFilesFrontMatter, SlugInfo } from '@mdlp/ssr';

// Expected props type
type GetStaticPropResults = { guides: SlugInfo[] };

/**
 * Get the frontmatter and mdx content associated with
 * the 'slug' (mdx filename prefix)
 *
 * @param FileBySlugResults is the 'post' type
 */
export const getStaticProps: GetStaticProps<GetStaticPropResults> = async () => {
  let guides = await getAllFilesFrontMatter('guides');

  return { props: { guides } };
};
