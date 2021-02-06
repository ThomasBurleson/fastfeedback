import Image from 'next/image';

const CustomLink = (slug) => (props) => {
  const isInternalLink = props.href.startsWith('/') || props.href.startsWith('#');
  return (
    <a
      {...{
        ...props,
        ...(isInternalLink ? {} : { target: '_blank', rel: 'noopener noreferrer' })
      }}
    />
  );
};

export const MDXComponents = (slug) => ({
  Image,
  a: CustomLink(slug)
});
