import React, { Fragment } from 'react';

import { useAuth } from 'shared/data-access';

import { Loader } from '../loading/Loader';
import { LoginForm } from './Login';

type ProtectedPageProps = {};

export const ProtectedPage: React.FC<ProtectedPageProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return <Fragment>{!isAuthenticated ? <LoginForm /> : children}</Fragment>;
};
export default ProtectedPage;
