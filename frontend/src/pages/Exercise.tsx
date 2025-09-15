import React from 'react';

const Exercise: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Exercise Logging
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Log your workouts and track your fitness progress.
        </p>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Exercise logging features will be implemented here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exercise;
