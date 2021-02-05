import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

const CustomLink = (slug) => ({ href, passHref, ...props }) => {
  const isInternalLink = href && (href.startsWith('/') || href.startsWith('#'));
  if (isInternalLink) {
    console.log(`${slug}${href}`);
    return (
      <Link href={`${slug}${href}`} passHref={true} shallow={href.startsWith('#')}>
        <a {...props} />
      </Link>
    );
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
};

export const MDXComponents = (slug) => ({
  Image
  // a: CustomLink(slug)
});
