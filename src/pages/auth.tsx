import { useAuth, Error } from '@mdlp/data-access';
import { LoginForm, LogoutForm } from '@mdlp/ui';

export const AuthenticateUser: React.FC<{}> = ({}) => {
  const auth = useAuth();
  const {user, error} = auth;
  return <div className="login">{
    !!error    ? <LoginError error={error} />  :
    !user?.uid ? <LoginForm  auth={auth} />    : 
                 <LogoutForm user={user} onSignOut={() => auth.signOut()} />
  }</div>;
};

export const LoginError: React.FC<{ error: Error }> = ({ error }) => {
  return <div>{JSON.stringify(error)}</div>;
};

export default AuthenticateUser;
