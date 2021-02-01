import Image from 'next/image';

export interface GuideLayoutProps {
  frontMatter?: any;
}

export const GuideLayout: React.FC<GuideLayoutProps> = ({ children, frontMatter }) => {
  return <div className="prose dark:prose-dark max-w-none w-full">{children}</div>;
};
