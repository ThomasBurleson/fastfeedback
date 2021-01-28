import React, { useCallback } from 'react';
import { useFormik } from 'formik';
import { useAuth } from '@mdlp/data-access';

import { FORM_STYLES as fs, isValidEmail } from '../utils/emailLogin.utils';

export interface EmailLoginProps {
  onResendPassword: () => void;
}

export const EmailLogin: React.FC<EmailLoginProps> = React.memo(({ onResendPassword }) => {
  const { user, error, ...auth } = useAuth();
  const formik = useFormik({
    initialValues: { email: user?.email || '', password: '', rememberMe: !!user?.uid },
    validate: (values) => {
      auth.clearError();
      return {
        email: !values.email ? 'Email Required' : !isValidEmail(values) ? 'Invalid email address' : '',
        password: !values.password ? 'Password Required' : ''
      };
    },
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        auth.signInWithEmail(values.email.toLowerCase(), values.password, values.rememberMe);
        setSubmitting(false);
      }, 400);
    }
  });
  const hasError = useCallback((key) => formik.errors[key] && formik.touched[key], [formik]);

  return (
    <>
      <form className="space-y-2 mt-8" onSubmit={formik.handleSubmit}>
        <div>
          <div className="mt-1">
            <input
              required
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email address"
              className={fs.INPUT_FIELD}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
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
              className={fs.INPUT_FIELD}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember_me"
              name="remember_me"
              type="checkbox"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={String(formik.values.rememberMe)}
              className={`${fs.REMEMBER_ME} ml-3`}
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
          <button type="submit" disabled={formik.isSubmitting} className={fs.SUBMIT_BTN}>
            Sign in
          </button>
          <p className="mt-4 text-xs text-red-600  pl-3" id="email-error">
            {hasError('email') && <p>{formik.errors.email}</p>}
            {hasError('password') && <p>{formik.errors.password}</p>}
            {error && error.message}
          </p>
        </div>
      </form>
    </>
  );
});
