import { useTasks } from '../context/TaskContext';
import { Users, Mail, Briefcase } from 'lucide-react';
import { getInitials } from '../utils/dateUtils';

export const TeamPage = () => {
  const { users, tasks } = useTasks();

  const getTaskCount = (userId: string) => {
    return tasks.filter(t => t.assignedTo === userId).length;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {users.length} team {users.length === 1 ? 'member' : 'members'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div
            key={user.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-medium">
                {getInitials(user.name)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {user.name}
                </h3>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  {user.role}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Briefcase className="w-4 h-4" />
                <span>{getTaskCount(user.id)} active tasks</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Users className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Demo Team
            </h3>
            <p className="text-blue-700 dark:text-blue-300">
              This is a demo team with sample members. In a production environment, you would be
              able to invite team members, manage roles, and configure permissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
