import React, { useState, useEffect, useContext } from 'react';

import firebase from 'firebase';
import { saveUser } from './auth.user';

import { AuthenticationContext } from './auth.provider';
import { getDefaultAvatar } from './auth.constants';
import { AuthInfo, User, Error, AUTH_STATE } from './auth.interfaces';

// validate fields
const parseUser = (rawData: User | null = {} as User): User | null => {
  const providerId = rawData?.providerId || 'unknown';
  return { ...rawData, providerId };
};

// ******************************************
// Public Exports
// ******************************************

/**
 * Custom hook called from `AuthProvider` functional component
 *
 * Enable callbacks for GitHub authentication and signout
 * Also provides access to the authenticated 'user' information.
 */
export function useProvideAuth(): AuthInfo {
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
      current.photoURL = current.photoURL || getDefaultAvatar();
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

    console.error(error.message);

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

/**
 * Easy lookup for Auth features: signin, signout, and authenticated user
 * NOTE: must be called from a tree child of the AuthProvider component
 */
export const useAuth = (): AuthInfo => {
  return useContext(AuthenticationContext);
};
