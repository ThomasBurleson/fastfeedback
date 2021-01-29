import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

import { animateWith, Transition } from '@mdlp/motion';
import { useAuth } from 'shared/data-access';

import { EmailLogin } from './forms/_EmailLogin';
import { SocialLogin } from './forms/_SocialLogin';
import { RegisterEmail } from './forms/_RegisterEmail';
import { ResendPassword } from './forms/_ResendPassword';
import Spinner from '../loading/Spinner';

enum LoginType {
  LOGIN_EXISTING,
  REGISTER_NEW,
  RESEND_PASSWORD
}

export interface LoginProps {
  redirectUrl?: string;
}

// prettier-ignore
const TITLES = {
  [LoginType.LOGIN_EXISTING] : 'Sign in to your account:',
  [LoginType.REGISTER_NEW]   : 'Register a new account:',
  [LoginType.RESEND_PASSWORD]: 'Request a new password:'
};

export const LoginForm: React.FC<LoginProps> = ({ redirectUrl = '' }) => {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();
  const [loginType, setLoginType] = useState<LoginType>(LoginType.LOGIN_EXISTING);

  const onRegisterNewUser = useCallback(() => setLoginType(LoginType.REGISTER_NEW), [setLoginType]);
  const onResendPassword = useCallback(() => setLoginType(LoginType.RESEND_PASSWORD), [setLoginType]);
  const onCloseResend = useCallback(() => setLoginType(LoginType.LOGIN_EXISTING), [setLoginType]);

  /**
   * Prefetch the redirected page (if specified)
   * Once authenticated, reroute
   */
  useEffect(() => {
    if (!!redirectUrl) {
      router.prefetch(redirectUrl);
      if (isAuthenticated) {
        router.replace(redirectUrl);
      }
    }
  }, [redirectUrl, isAuthenticated]);

  const showingLoginExisting = loginType === LoginType.LOGIN_EXISTING;
  const showingRegisterNew = loginType === LoginType.REGISTER_NEW;
  const showingResendPassword = loginType === LoginType.RESEND_PASSWORD;

  return (
    <Transition location={{ pathname: router.pathname }}>
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-xl font-extrabold text-gray-900">
            <span>{TITLES[loginType]}</span>
          </h2>
          {showingLoginExisting && (
            <p className="mt-2 text-center text-sm text-gray-600 max-w cursor-pointer">
              Or
              <a onClick={onRegisterNewUser} className="ml-2 font-medium text-indigo-600 hover:text-indigo-500 ">
                create your free account
              </a>
            </p>
          )}
        </div>

        <div className="relative mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className={`registerEmail relative bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 `}>
            {showingLoginExisting && (
              <motion.div {...animateWith()}>
                <SocialLogin />
                <div className="mt-10 mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>
                </div>
                <EmailLogin onResendPassword={onResendPassword} />
              </motion.div>
            )}
            {showingRegisterNew && <RegisterEmail onClose={onCloseResend} />}
            {showingResendPassword && <ResendPassword onClose={onCloseResend} />}
          </div>
          {isLoading && <Spinner />}
        </div>
      </div>
    </Transition>
  );
};
