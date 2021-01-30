import firebase from 'firebase';

export interface User extends firebase.UserInfo {} // same as Github ProviderData item
export interface Error extends firebase.auth.AuthError {}

/**
 * Authentication state
 */
export enum AUTH_STATE {
  LOADING, // Only true during app startup
  ERROR,
  CONFIRMED,
  UNCONFIRMED
}

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
