import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

const TEAM_MEMBERS = ['Akshay', 'Akash', 'Arun', 'PKV', 'MKV'];

const Login = () => {
  const { login } = useAuth();

  return (
    <div className="flex items-center justify-center h-full flex-grow mt-20">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
            <LogIn className="w-8 h-8 text-blue-600 dark:text-blue-300" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tasky</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to manage team tasks</p>
        </div>

        <div className="space-y-4">
          <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
            Select your profile to continue
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {TEAM_MEMBERS.map(member => (
              <button
                key={member}
                onClick={() => login(member)}
                className="flex items-center justify-center px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-gray-600 dark:hover:border-gray-500 transition-all text-gray-700 dark:text-gray-200 font-medium group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-300 mr-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                  {member.charAt(0)}
                </div>
                {member}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
