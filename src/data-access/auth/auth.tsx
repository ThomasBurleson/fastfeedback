import React, { useState, useEffect, useContext, createContext } from 'react';
 
import firebase from 'firebase';
import { saveUser } from '../database';

const PROVIDER_LOGOS = {
  [firebase.auth.GithubAuthProvider.PROVIDER_ID] : '/github.svg',
  [firebase.auth.TwitterAuthProvider.PROVIDER_ID]: '/twitter.svg',
  [firebase.auth.GoogleAuthProvider.PROVIDER_ID] : '/google.svg'
};
export enum AUTH_STATE {
  LOADING,  // Only true during app startup
  ERROR,
  CONFIRMED,
  UNCONFIRMED
};

const NOOP = () => {},
  authContext = createContext<AuthInfo>({
    user             : null,
    error            : null,
    state            : AUTH_STATE.LOADING,
    
    isAuthenticated  : false,
    isLoading        : true,
    hasError         : false,

    signOut          : NOOP,
    signInWithGithub : NOOP,
    signInWithGoogle : NOOP,
    signInWithTwitter: NOOP,
  });

// validate fields
const parseUser = (rawData: User | null = {} as User): User | null => {
  const providerId = rawData?.providerId || 'unknown';
  return { ...rawData, providerId  };
};

/**
 * Internal custom hook to enable callbacks for GitHub authentication and signout
 * Also provides access to the authenticated 'user' information.
 */
function useProvideAuth(): AuthInfo {
  const [user, setUser]   = useState<User>(null);
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
      saveUser(current);
      setError(null);
    }
    setAuthState(state);
    setUser(current);

    return current;
  };
  const reportError = (error: Error) => {
    
    setUser(null);
    setError(error);
    setAuthState(AUTH_STATE.ERROR);
    
    return error;
  }
  const providerSignIn = async (provider: firebase.auth.AuthProvider) => {
    try {
      const { user } = await firebase.auth().signInWithPopup(provider);
      return user;
    } catch(e) {
      reportError(e);
    }
    return null;
  }
  
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

  const signOut = async () => {
    return firebase.auth().signOut().then(() => {
      return updateUser(null);
    });
  };

  return {
    user,
    error,
    state,
    isAuthenticated: user && (state === AUTH_STATE.CONFIRMED),
    isLoading: (state === AUTH_STATE.LOADING),
    hasError: (state === AUTH_STATE.ERROR),
    signInWithGithub,
    signInWithGoogle,
    signInWithTwitter,
    signOut
  };
}

// ******************************************
// Public Exports
// ******************************************

export interface User extends firebase.UserInfo {   // same as Github ProviderData item
}

export interface Error extends firebase.auth.AuthError {

}

export interface AuthInfo {
  state: AUTH_STATE,
  user: User | null;
  error: Error | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasError: boolean;
  signInWithGithub: () => void;
  signInWithGoogle: () => void;
  signInWithTwitter: () => void;
  signOut: () => void;
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
