import { getAuthLogo, User } from '../../data-access/auth/auth';

export interface LogoutProps {
  user: User;
  signOut: () => void;
}

export const LogoutForm: React.FC<LogoutProps> = ({ user, signOut }) => {
  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 w-full">
          <h2 className="mt-6 text-center text-xl  text-indigo-500">
            <img
              className="w-16 h-16 rounded-full lg:w-20 lg:h-20 inline-block mr-4"
              src={user.photoURL}
              alt={`Photo ${user.displayName}`}
            />
            <div className="mt-6">
              {user?.displayName}
              <br />
              <span className="text-sm mt-2">{user.email}</span>
            </div>
          </h2>
          <div className="mt-10 mb-8 w-full">
            <div className="relative">
              <button
                type="button"
                onClick={() => signOut()}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
