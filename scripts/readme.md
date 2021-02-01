# Automation Scripts

- [Fix Markdown Images](#1-fix-markdown-images)
- [Generate RSS Feed](#2-generate-rss)
- [Generate Sitemap](#3-generate-sitemap)

<br/>
<br/>

### 1) Fix-Markdown-Images

NextJS provides features to render easily MDX content withing a page; regardless of rendering [CSR, SSR, or ISR. Both static pages and on-demand rendering support React components and markdown content.

Consider the following layout, where the Guides pages are generated entirely from MDX content. In the sidebar UI shown below, the list items "Guides" and "Management" are pages generated directly from Markdown documents

![image](https://user-images.githubusercontent.com/210413/106522421-55650f80-64a5-11eb-8d5b-409d9a2228a7.png)

<br/>

#### Image optimization

For optimal page performance, the MDX content should use the NextJS `<Image src="" width="" height="" />` tag.
Markdown editors, however, often use embedded markdown image tags like `![](https://i.imgur.com/D5Ypxex.png)`.

To achieve best performance, developers will need to perform the following tasks [for each markdown document]:

- each online image should be downloaded locally to the repository
- each image should be scanned to determine its default height/width values
- each image tag [in the markdown file] needs to be converted to a NextJS Image tag
- each document should be updated with the revised markdown content.

Fortunately - with some structure conventions and a `fix-markdown-images` script - these tasks can be automated.

> For details on `<Image>` tag, developers should read [NextJS Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)

<br/>

#### Convention-over-Configuration

To make the developer experience easy, developers could manually

- save `*.md` or `*.mdx` documents in the repository directories `\data\guides` or `\data\management`.
- extracted images [from those documents] should be saved in directory `\public\static\images\<md_filename>\*.*`.

![image](https://user-images.githubusercontent.com/210413/106521268-965c2480-64a3-11eb-811d-1341f1f35c03.png)

##### Automation Magic

The `fix-markdown-images` script will scan the markdown source directory, download the local stored images, and then update the Markdown document to use the correct `<Image src="">` components.

<br/>

#### Usage

1. Add markdown documents to the `data/guides` directory.

2. Use the `fix-markdown-images` script to perform all of these ^ tasks easily. Then use the npm/yarn command:

```bash
yarn fix:markdown
```

1. Commit the new or modified markdown files, directories, and image files to the Git repository.

<br/>

#### Developer Resources

Here are useful resources to study when considering Markdown AST, `unified()`, and Plugins:

- [Introduction to Remark and Unified](https://braincoke.fr/blog/2020/03/an-introduction-to-unified-and-remark/#the-unified-collective)
- [Unified - Compiler for your Content](https://egghead.io/playlists/unified-the-compiler-for-your-content-5b8ff958)
- [Introduction to Remark CLI](https://egghead.io/lessons/javascript-introduction-to-the-remark-cli)
- [Remark & Rehype Plugins](https://www.ryanfiller.com/blog/remark-and-rehype-plugins)
- [Custom Remark Plugins](https://www.gatsbyjs.com/tutorial/remark-plugin-tutorial/)
- [Modifying Nodes in AST](https://css-tricks.com/how-to-modify-nodes-in-an-abstract-syntax-tree/)

> Don't forget to use the powerful [AST Explorer](https://astexplorer.net/)

<br/>
<br/>

---

### 2) Generate RSS

<br/>
<br/>

---

### 3) Generate SiteMap
