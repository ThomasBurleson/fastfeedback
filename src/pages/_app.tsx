import '../styles/index.css';

import { AuthProvider } from '../shared/data-access';
import { AppHeader } from '../components';

function MyApp({ Component, pageProps, router }) {
  return (
    <AuthProvider>
      <AppHeader />

      <Component {...pageProps} key={router.route} />
    </AuthProvider>
  );
}

export default MyApp;
