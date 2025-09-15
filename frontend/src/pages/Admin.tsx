import React from 'react';

const Admin: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Admin Panel
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          System administration and user management.
        </p>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Admin panel features will be implemented here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
