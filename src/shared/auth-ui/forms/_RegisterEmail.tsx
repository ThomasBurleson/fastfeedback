import React, { useCallback } from 'react';
import { useFormik } from 'formik';
import { motion } from 'framer-motion';

import { animateWith } from '@mdlp/motion';
import { useAuth } from 'shared/auth-api';

import { FORM_STYLES as fs, isValidEmail } from '../utils/emailLogin.utils';
import { delayedFadeIn } from '../../motion/variants';

export interface RegisterEmailProps {
  onClose: () => void;
}

export const RegisterEmail: React.FC<RegisterEmailProps> = React.memo(({ onClose = () => {} }) => {
  const { user, error, ...auth } = useAuth();
  const formik = useFormik({
    initialValues: { email: user?.email || '', password: '', rememberMe: !!user?.uid },
    validate: (values) => ({
      email: !values.email ? 'Email Required' : !isValidEmail(values) ? 'Invalid email address' : '',
      password: !values.password ? 'Password Required' : ''
    }),
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        auth.createWithEmail(values.email, values.password, values.rememberMe);
        setSubmitting(false);
      }, 400);
    }
  });
  const hasError = useCallback((key) => formik.errors[key] && formik.touched[key], [formik]);

  return (
    <motion.div {...animateWith()}>
      <div className="absolute top-0 right-0  text-gray-500 cursor-pointer" onClick={onClose}>
        <motion.img variants={delayedFadeIn} className="h-8 w-auto" src="/close_btn.svg" alt="Close dialog" />
      </div>
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
        <div className="flex items-center justify-end content-end">
          <div className="flex items-center ">
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
        </div>
        <div>
          <button type="submit" disabled={formik.isSubmitting} className={fs.SUBMIT_BTN}>
            Create My Account
          </button>
          <p className="mt-4 text-xs text-red-600  pl-3" id="email-error">
            {hasError('email') && <p>{formik.errors.email}</p>}
            {hasError('password') && <p>{formik.errors.password}</p>}
            {error && error.message}
          </p>
        </div>
      </form>
    </motion.div>
  );
});
