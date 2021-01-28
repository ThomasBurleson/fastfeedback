import React, { useState, useEffect, useContext, createContext } from 'react';

import firebase from 'firebase';
import { saveUser } from '../database';

/**
 * Generic avatar image used when the user's photoURL is empty
 */
const AVATAR_NA =
  'data:image/png;base64,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';

/**
 * Firebase Social Authentication Providers
 */
const PROVIDER_LOGOS = {
  [firebase.auth.GithubAuthProvider.PROVIDER_ID]: '/github.svg',
  [firebase.auth.TwitterAuthProvider.PROVIDER_ID]: '/twitter.svg',
  [firebase.auth.GoogleAuthProvider.PROVIDER_ID]: '/google.svg'
};

/**
 * Authentication state
 */
export enum AUTH_STATE {
  LOADING, // Only true during app startup
  ERROR,
  CONFIRMED,
  UNCONFIRMED
}

// validate fields
const parseUser = (rawData: User | null = {} as User): User | null => {
  const providerId = rawData?.providerId || 'unknown';
  return { ...rawData, providerId };
};

/**
 * Internal custom hook to enable callbacks for GitHub authentication and signout
 * Also provides access to the authenticated 'user' information.
 */
function useProvideAuth(): AuthInfo {
  const [user, setUser] = useState<User>(null);
  const [error, setError] = useState<Error>(null);
  const [state, setAuthState] = useState<AUTH_STATE>(AUTH_STATE.LOADING);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((current) => {
      return updateUser(current);
    });

    return () => unsubscribe();
  }, []);

  const updateUser = (credentials: firebase.User) => {
    const current = parseUser(credentials?.providerData[0]);
    const state = !!current?.uid ? AUTH_STATE.CONFIRMED : AUTH_STATE.UNCONFIRMED;

    if (current) {
      current.photoURL = current.photoURL || AVATAR_NA;
      saveUser(current);
      setError(null);
    }
    setAuthState(state);
    setUser(current);

    return current;
  };
  const reportError = (error: Error) => {
    console.error(error.message);

    setUser(null);
    setError(error);
    setAuthState(AUTH_STATE.ERROR);

    return error;
  };
  const providerSignIn = async (provider: firebase.auth.AuthProvider) => {
    setAuthState(AUTH_STATE.LOADING);
    try {
      const { user } = await firebase.auth().signInWithPopup(provider);
      return user;
    } catch (e) {
      reportError(e);
    }
    return null;
  };

  /**
   *
   * Popup sign-in with Github, Twitter, Google
   * Useful for desktop, use 'redirecting' for mobile
   *
   */

  const signInWithGithub = async () => {
    const provider = new firebase.auth.GithubAuthProvider();
    const user = await providerSignIn(provider);

    return updateUser(user);
  };
  const signInWithTwitter = async () => {
    const provider = new firebase.auth.TwitterAuthProvider();
    const user = await providerSignIn(provider);

    return updateUser(user);
  };
  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    const user = await providerSignIn(provider);
    return updateUser(user);
  };
  const createWithEmail = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      const { user } = await firebase.auth().createUserWithEmailAndPassword(email, password);
      return updateUser(user);
    } catch (error) {
      reportError(error);
    }
  };
  const signInWithEmail = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      const { user } = await firebase.auth().signInWithEmailAndPassword(email, password);
      return updateUser(user);
    } catch (error) {
      reportError(error);
    }
  };
  const resendPassword = async (email: string) => {
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      return true;
    } catch (error) {
      reportError(error);
    }
  };

  const signOut = async () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        return updateUser(null);
      });
  };

  const clearError = () => {
    setError(null);
  };

  return {
    user,
    error,
    status: state,
    isAuthenticated: user && state === AUTH_STATE.CONFIRMED,
    isLoading: state === AUTH_STATE.LOADING,

    hasError: state === AUTH_STATE.ERROR,
    clearError,

    createWithEmail,
    resendPassword,

    signInWithGithub,
    signInWithGoogle,
    signInWithTwitter,
    signInWithEmail,
    signOut
  };
}

const NOOP = () => {};
const authContext = createContext<AuthInfo>({
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

// ******************************************
// Public Exports
// ******************************************

export interface User extends firebase.UserInfo {} // same as Github ProviderData item
export interface Error extends firebase.auth.AuthError {}

export interface AuthInfo {
  status: AUTH_STATE;
  user: User | null;
  error: Error | null;

  isAuthenticated: boolean;
  isLoading: boolean;

  hasError: boolean;
  clearError: () => void;

  signOut: () => void;
  signInWithGithub: () => void;
  signInWithGoogle: () => void;
  signInWithTwitter: () => void;
  signInWithEmail: (email: string, password: string, rememberMe?: boolean) => void;

  createWithEmail: (email: string, password: string, rememberMe?: boolean) => void;
  resendPassword: (email: string) => void;
}

// Easy lookup for Auth features: signin, signout, and authenticated user
export const useAuth = (): AuthInfo => {
  return useContext(authContext);
};

/**
 * HOC Component wrapper
 * eg `<ProvideAuth> <App /> </ProvideAuth>`
 */
export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const getAuthLogo = (u: User): string => {
  return PROVIDER_LOGOS[u?.providerId] || '';
};
