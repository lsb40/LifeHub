import React from 'react';
import { 
  ChartBarIcon, 
  DropletIcon, 
  FireIcon, 
  FaceSmileIcon,
  UserGroupIcon,
  BeakerIcon,
  TargetIcon
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  // Mock data for demonstration
  const stats = [
    {
      name: 'Calories Today',
      value: '1,847',
      target: '2,000',
      unit: 'kcal',
      icon: FireIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      progress: 92
    },
    {
      name: 'Water Intake',
      value: '1,250',
      target: '2,000',
      unit: 'ml',
      icon: DropletIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      progress: 63
    },
    {
      name: 'Steps Today',
      value: '8,500',
      target: '10,000',
      unit: 'steps',
      icon: UserGroupIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      progress: 85
    },
    {
      name: 'Mood Score',
      value: '8.2',
      target: '8.0',
      unit: '/10',
      icon: FaceSmileIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      progress: 100
    }
  ];

  const recentActivities = [
    { id: 1, type: 'nutrition', action: 'Logged breakfast', time: '2 hours ago', icon: BeakerIcon },
    { id: 2, type: 'water', action: 'Drank 250ml water', time: '1 hour ago', icon: DropletIcon },
    { id: 3, type: 'exercise', action: 'Completed 30min run', time: '3 hours ago', icon: FireIcon },
    { id: 4, type: 'mood', action: 'Logged mood: Happy', time: '4 hours ago', icon: FaceSmileIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Welcome back! Here's your health overview for today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {stat.value}
                    </p>
                    <p className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                      {stat.unit}
                    </p>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        Goal: {stat.target} {stat.unit}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {stat.progress}%
                      </span>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(stat.progress, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Weekly Overview Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Weekly Overview
            </h3>
          </div>
          <div className="card-body">
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-center">
                <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Chart visualization will be implemented here
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Using Recharts library
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Recent Activity
            </h3>
          </div>
          <div className="card-body">
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivities.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== recentActivities.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                            <activity.icon className="h-4 w-4 text-primary-600" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-900 dark:text-gray-100">
                              {activity.action}
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Quick Actions
          </h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <button className="btn-secondary p-4 text-center">
              <BeakerIcon className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm">Log Food</span>
            </button>
            <button className="btn-secondary p-4 text-center">
              <DropletIcon className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm">Add Water</span>
            </button>
            <button className="btn-secondary p-4 text-center">
              <FaceSmileIcon className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm">Log Mood</span>
            </button>
            <button className="btn-secondary p-4 text-center">
              <FireIcon className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm">Add Exercise</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
