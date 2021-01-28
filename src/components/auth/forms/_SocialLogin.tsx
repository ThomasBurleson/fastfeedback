import React from 'react';
import { useAuth } from '@mdlp/data-access';

export const SocialLogin: React.FC<{}> = React.memo(({}) => {
  const { user, ...auth } = useAuth();

  return (
    <div className="social-auths mt-6 grid mb-6 grid-cols-3 gap-3">
      <div onClick={() => auth.signInWithTwitter()}>
        <a className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-200 hover:bg-green-400">
          <span className="sr-only">with Twitter</span>
          <img className="w-5 h-5" src="/twitter.svg" alt="Twitter Logo" />
        </a>
      </div>

      <div onClick={() => auth.signInWithGithub()}>
        <a className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white-500    hover:bg-green-400">
          <span className="sr-only">with GitHub</span>
          <img className="w-5 h-5" src="/github.svg" alt="Github Logo" />
        </a>
      </div>

      <div onClick={() => auth.signInWithGoogle()}>
        <a className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white-500    hover:bg-green-400">
          <span className="sr-only">with Google</span>
          <img className="w-5 h-5" src="/google.svg" alt="Github Logo" />
        </a>
      </div>
    </div>
  );
});
