import React, { createContext } from 'react';
import { AuthInfo, AUTH_STATE } from './auth.interfaces';
import { useProvideAuth } from './auth.hook';

const NOOP = () => {};

/**
 * Create a context instance
 * NOTE: exported ONLY for lookup use in `auth.hook::useAuth()` hook
 */
export const authContext = createContext<AuthInfo>({
  user: null,
  error: null,
  status: AUTH_STATE.LOADING,

  isAuthenticated: false,
  isLoading: true,

  hasError: false,
  clearError: NOOP,

  createWithEmail: NOOP,
  resendPassword: NOOP,

  signOut: NOOP,
  signInWithGithub: NOOP,
  signInWithGoogle: NOOP,
  signInWithTwitter: NOOP,
  signInWithEmail: NOOP
});

/**
 * HOC Component wrapper
 * eg `<ProvideAuth> <App /> </ProvideAuth>`
 */
export const AuthProvider: React.FC = ({ children }) => {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};
