import '../styles/index.css';

import { AuthProvider } from '../data-access';

function MyApp({ Component, pageProps, router }) {
  return (
    <AuthProvider>
      <Component {...pageProps} key={router.route} />
    </AuthProvider>
  );
}

export default MyApp;
