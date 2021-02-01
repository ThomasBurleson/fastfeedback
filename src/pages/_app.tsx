import '@mdlp/styles';

import { MDXProvider } from '@mdx-js/react';
import { AuthProvider } from '@mdlp/auth-api';
import { AppHeader } from '../components';

function MyApp({ Component, pageProps, router }) {
  return (
    <AuthProvider>
      <AppHeader />

      <MDXProvider>
        <Component {...pageProps} key={router.route} />
      </MDXProvider>
    </AuthProvider>
  );
}

export default MyApp;
