import React from 'react';
import { useAuthStore } from '../store/authStore';

const Profile: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Profile
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your personal information and preferences.
        </p>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="text-center">
            <div className="h-24 w-24 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-medium text-gray-700 dark:text-gray-300">
                {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">@{user?.username}</p>
            <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Profile management features will be implemented here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
