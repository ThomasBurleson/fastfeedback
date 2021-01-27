import React, { useState } from 'react';
import { useAuth } from '@mdlp/data-access';

export interface EmailLoginProps {
  onResendPassword: () => void;
}
export const EmailLogin: React.FC<EmailLoginProps> = React.memo(({ onResendPassword }) => {
  const { user, error, ...auth } = useAuth();

  const [email, setEmail] = useState<string>(user?.email || '');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(!!user?.uid);

  const onSignin = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (email.length && password.length) {
      auth.signInWithEmail(email.toLowerCase(), password, rememberMe);
    }
  };
  const onFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    console.log(`onFieldChange(${name}, ${value})`);

    switch (name) {
      case 'email': {
        setEmail(value);
        auth.clearError();
        break;
      }
      case 'password': {
        setPassword(value);
        auth.clearError();
        break;
      }
      case 'remember_me': {
        setRememberMe(!!value);
        break;
      }
    }
  };

  return (
    <>
      {' '}
      <form className="space-y-6" action="#" method="POST">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div className="mt-1">
            <input
              required
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={email}
              onChange={onFieldChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="mt-1">
            <input
              required
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={password}
              onChange={onFieldChange}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember_me"
              name="remember_me"
              type="checkbox"
              value={String(rememberMe)}
              onChange={onFieldChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div className="text-xs px-10 cursor-pointer">
            <a className="font-medium text-indigo-600 hover:text-indigo-500" onClick={onResendPassword}>
              Forgot your password?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            onClick={onSignin}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign in
          </button>
          {error && (
            <p className="mt-4 text-sm text-red-600" id="email-error">
              {error.message}
            </p>
          )}
        </div>
      </form>
    </>
  );
});
