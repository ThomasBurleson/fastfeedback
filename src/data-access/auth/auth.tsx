import React, { useState, useEffect, useContext, createContext } from 'react';
import firebase from './firebase';

const PROVIDER_LOGOS = {
  'github.com'  : '/github.svg',
  'twittter.com': '/twitter.svg',
  'google.com'  : '/google.svg'
};

const NOOP = () => {},
  authContext = createContext<AuthInfo>({
    user            : null,
    signOut         : NOOP,
    signInWithGithub: NOOP,
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
  const [user, setUser] = useState<User>(null);
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((current) => {
      return updateUser(current?.providerData[0]);
    });

    return () => unsubscribe();
  }, []);

  const updateUser = (rawData: User | null) => {
    const current = parseUser(rawData);
    setUser(current);
    return current;
  };
  const signInWithGithub = async () => {
    const provider = new firebase.auth.GithubAuthProvider();
    return firebase.auth().signInWithPopup(provider).then(({ user : credentials }) => {
      const user = credentials?.providerData[0];
      return updateUser(user);
    });
  };
  const signOut = async () => {
    return firebase.auth().signOut().then(() => {
      return updateUser(null);
    });
  };

  return {
    user,
    signInWithGithub,
    signOut
  };
}

// ******************************************
// Public Exports
// ******************************************

export interface User extends firebase.UserInfo {   // same as Github ProviderData item
}

export interface AuthInfo {
  user: User | null;
  signInWithGithub: () => void;
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
