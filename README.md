[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fthomasburleson%2Ffastfeedback)

# fastfeedback

Demo NextJS/React application with custom authentication UI/features using Firebase.

![image](https://user-images.githubusercontent.com/210413/106229065-6581a400-61b2-11eb-828f-ca6567e06183.png)

## Overview

- `pages/api/*` - [API routes](https://nextjs.org/docs/api-routes/introduction) powering [`/dashboard`](https://leerob.io/dashboard), newsletter subscription, and post views.
- `pages/blog/*` - Static pre-rendered blog pages using [MDX](https://github.com/mdx-js/mdx).
- `pages/dashboard` - [Personal dashboard](https://leerob.io/dashboard) containing metrics like sales, views, and subscribers.
- `pages/*` - All other static pages.

## Running Locally

```bash
$ git clone https://github.com/thomasburleson/fastfeedback.git
$ cd fastfeedback
$ yarn
$ yarn dev
```

Create a `.env.local` file similar to [`.env.example`](https://github.com/thomasburleson/fastfeedback/blob/master/.env.example).

## Built Using

- [Next.js](https://nextjs.org/)
- [Vercel](https://vercel.com)
- [MDX](https://github.com/mdx-js/mdx)
- [Tailwind CSS](https://tailwindcss.com/)
