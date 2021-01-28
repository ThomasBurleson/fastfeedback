import React, { useState } from 'react';
import { motion } from 'framer-motion';

import { pageSlide, delayedFadeIn } from '@mdlp/motion';
import { useAuth } from '@mdlp/data-access';

export interface ResendPasswordProps {
  email?: string;
  onClose: () => void;
}

export const ResendPassword: React.FC<ResendPasswordProps> = React.memo((props) => {
  const { error, ...auth } = useAuth();
  const [email, setEmail] = useState<string>(props.email || '');

  const onSignin = (e: React.UIEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (email.length) {
      auth.resendPassword(email);
    }
  };
  const onFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    switch (name) {
      case 'email': {
        setEmail(value);
        break;
      }
    }
  };

  return (
    <motion.div {...pageSlide(0, 20)}>
      <div className="absolute mb-10 top-0 right-0 text-gray-500  cursor-pointer" onClick={props.onClose}>
        <motion.img variants={delayedFadeIn} className="h-8 w-auto" src="/close_btn.svg" alt="Close dialog" />
      </div>
      <form className="space-y-2 mt-6" action="#" method="POST">
        <div>
          <div className="mt-1">
            <input
              required
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email Address"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={email}
              onChange={onFieldChange}
            />
          </div>
        </div>

        <div>
          <div className="flex space-x-4 justify-start">
            <button
              type="submit"
              onClick={(e) => onSignin(e)}
              className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Resend my password
            </button>
          </div>
          {error && (
            <p className="mt-4 text-sm text-red-600" id="email-error">
              {error.message}
            </p>
          )}
        </div>
      </form>
    </motion.div>
  );
});
