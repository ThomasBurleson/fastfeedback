export interface GuideLayoutProps {
  frontMatter?: any;
}

export const GuideLayout: React.FC<GuideLayoutProps> = ({ children, frontMatter }) => {
  return <div className="prose lg:prose-xl dark:prose-dark max-w-none m-auto w-2/3">{children}</div>;
};
