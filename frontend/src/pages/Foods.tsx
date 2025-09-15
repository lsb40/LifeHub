import React from 'react';

const Foods: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Food Database
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Search and explore our comprehensive food database.
        </p>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Food Search
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Search functionality will be implemented here
            </p>
            <div className="max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search for foods..."
                className="input w-full"
                disabled
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Foods;
