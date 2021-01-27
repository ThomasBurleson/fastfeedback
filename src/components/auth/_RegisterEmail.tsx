import React, { useState } from 'react';
import { useAuth } from '@mdlp/data-access';

export interface RegisterEmailProps {
  onClose: () => void;
}

export const RegisterEmail: React.FC<RegisterEmailProps> = React.memo(({ onClose = () => {} }) => {
  const { user, error, ...auth } = useAuth();
  const [email, setEmail] = useState<string>(user?.email || '');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(!!user?.uid);

  const onSignin = (e: React.UIEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (email.length && password.length) {
      auth.createWithEmail(email, password, rememberMe);
    }
  };
  const onFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    switch (name) {
      case 'email': {
        setEmail(value);
        break;
      }
      case 'password': {
        setPassword(value);
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
      <div className="absolute top-0 right-0 text-gray-500 cursor-pointer" onClick={onClose}>
        <img className="h-8 w-auto" src="/close_btn.svg" alt="Close dialog" />
      </div>
      <form className="space-y-2 mt-8" action="#" method="POST">
        <div>
          <div className="mt-1">
            <input
              required
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email address"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={email}
              onChange={onFieldChange}
            />
          </div>
        </div>

        <div>
          <div className="mt-1">
            <input
              required
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={password}
              onChange={onFieldChange}
            />
          </div>
        </div>

        <div className="flex items-center justify-end content-end">
          <div className="flex items-center ">
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
        </div>

        <div>
          <button
            type="submit"
            onClick={(e) => onSignin(e)}
            className="mt-12 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create My Account
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
