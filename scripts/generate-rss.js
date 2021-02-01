const { promises: fs } = require('fs');
const path = require('path');
const RSS = require('rss');
const matter = require('gray-matter');

async function generate() {
  const feed = new RSS({
    title: 'Fast Feedback',
    site_url: 'https://fastfeedback.vercel.app',
    feed_url: 'https://fastfeedback.vercel.app/feed.xml'
  });

  const posts = await fs.readdir(path.join(__dirname, '..', 'data', 'guides'));

  await Promise.all(
    posts.map(async (name) => {
      const content = await fs.readFile(path.join(__dirname, '..', 'data', 'guides', name));
      const frontmatter = matter(content);

      feed.item({
        title: frontmatter.data.title,
        url: 'https://fastfeedback.vercel.app/guides/' + name.replace(/\.mdx?/, ''),
        date: frontmatter.data.publishedAt,
        description: frontmatter.data.summary
      });
    })
  );

  await fs.writeFile('./public/feed.xml', feed.xml({ indent: true }));
}

generate();
