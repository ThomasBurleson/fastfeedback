import React, { useState, useCallback } from 'react';
import { AuthInfo } from '@mdlp/data-access';

import { EmailLogin } from './_EmailLogin';
import { SocialLogin } from './_SocialLogin';
import { RegisterEmail } from './_RegisterEmail';
import { ResendPassword } from './_ResendPassword';

enum LoginType {
  LOGIN_EXISTING,
  REGISTER_NEW,
  RESEND_PASSWORD
}

export interface LoginProps {
  auth: AuthInfo;
}

// prettier-ignore
const TITLES = {
  [LoginType.LOGIN_EXISTING] : 'Sign in to your account:',
  [LoginType.REGISTER_NEW]   : 'Register a new account:',
  [LoginType.RESEND_PASSWORD]: 'Request a new password:'
};

export const LoginForm: React.FC<LoginProps> = ({ auth }) => {
  const [loginType, setLoginType] = useState<LoginType>(LoginType.LOGIN_EXISTING);
  const onShowAs = useCallback(
    (type: LoginType) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      e.stopPropagation();

      setLoginType(type);
    },
    [loginType]
  );
  const onResendPassword = useCallback(() => setLoginType(LoginType.RESEND_PASSWORD), [setLoginType]);
  const onCloseResend = useCallback(() => setLoginType(LoginType.LOGIN_EXISTING), [setLoginType]);

  const showingLoginExisting = loginType === LoginType.LOGIN_EXISTING;
  const showingRegisterNew = loginType === LoginType.REGISTER_NEW;
  const showingResendPassword = loginType === LoginType.RESEND_PASSWORD;

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-xl font-extrabold text-gray-900">
          <span>{TITLES[loginType]}</span>
        </h2>
        {showingLoginExisting && (
          <p className="mt-2 text-center text-sm text-gray-600 max-w cursor-pointer">
            Or
            <a
              onClick={onShowAs(LoginType.REGISTER_NEW)}
              className="ml-2 font-medium text-indigo-600 hover:text-indigo-500 "
            >
              create your free account
            </a>
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="registerEmail relative bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 ">
          {showingLoginExisting && (
            <>
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
            </>
          )}
          {showingRegisterNew && <RegisterEmail onClose={onCloseResend} />}
          {showingResendPassword && <ResendPassword onClose={onCloseResend} />}
        </div>
      </div>
    </div>
  );
};
