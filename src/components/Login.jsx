import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

const TEAM_MEMBERS = ['Akshay', 'Akash', 'Arun', 'PKV', 'MKV'];

const Login = () => {
  const { login } = useAuth();
  const [selectedUser, setSelectedUser] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (selectedUser) {
      login(selectedUser);
    }
  };

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

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="user" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Team Member
            </label>
            <select
              id="user"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="input-field py-3 text-lg"
              required
            >
              <option value="" disabled>Choose your name...</option>
              {TEAM_MEMBERS.map(member => (
                <option key={member} value={member}>
                  {member}
                </option>
              ))}
            </select>
          </div>
          
          <button
            type="submit"
            disabled={!selectedUser}
            className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
