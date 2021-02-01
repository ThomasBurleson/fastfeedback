import React, { Fragment } from 'react';

import { useAuth } from '@mdlp/auth-api';
import { LoginForm } from '@mdlp/auth-ui';

import { Spinner } from './loading/Spinner';

type ProtectedPageProps = {};

export const ProtectedPage: React.FC<ProtectedPageProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return <Fragment>{!isAuthenticated ? <LoginForm /> : children}</Fragment>;
};
export default ProtectedPage;
