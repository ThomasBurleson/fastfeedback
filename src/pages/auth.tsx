import { useAuth } from '../data-access/auth';
import { LoginForm, LogoutForm } from '../components/auth';

export const AuthenticateUser: React.FC<{}> = ({}) => {
  const { user, signInWithGithub, signOut } = useAuth();
  return (
    <div className="login">
      {!user?.uid ? (
        <LoginForm user={user} signInWithGithub={signInWithGithub} />
      ) : (
        <LogoutForm user={user} signOut={signOut} />
      )}
    </div>
  );
};

export default AuthenticateUser;
