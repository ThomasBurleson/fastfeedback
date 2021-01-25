import React, { Fragment } from 'react';

import { useAuth } from '@mdlp/data-access';

import { Loader } from '../loading/Loader';
import { LoginForm } from './Login';

type ProtectedPageProps = {};

export const ProtectedPage: React.FC<ProtectedPageProps> = ({ children }) => {
  const auth = useAuth();
  const { isAuthenticated, isLoading } = auth;

  return <Fragment>{isLoading ? <Loader /> : !isAuthenticated ? <LoginForm auth={auth} /> : children}</Fragment>;
};
export default ProtectedPage;
