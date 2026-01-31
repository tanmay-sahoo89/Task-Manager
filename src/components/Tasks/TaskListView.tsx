import { useState, useMemo } from 'react';
import { Task } from '../../types';
import { useTasks } from '../../context/TaskContext';
import { ArrowUpDown, Edit, Trash2 } from 'lucide-react';
import { formatDate, getInitials } from '../../utils/dateUtils';
import { PRIORITY_LABELS, STATUS_LABELS, PRIORITY_COLORS } from '../../utils/constants';

interface TaskListViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

type SortField = 'title' | 'assignedTo' | 'priority' | 'dueDate' | 'status';
type SortOrder = 'asc' | 'desc';

export const TaskListView = ({ tasks, onTaskClick, onEditTask, onDeleteTask }: TaskListViewProps) => {
  const { getUserById, getProjectById, updateTask } = useTasks();
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'assignedTo') {
        aValue = getUserById(a.assignedTo)?.name || '';
        bValue = getUserById(b.assignedTo)?.name || '';
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [tasks, sortField, sortOrder, getUserById]);

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400"
    >
      {label}
      <ArrowUpDown className="w-4 h-4" />
    </button>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <SortButton field="title" label="Title" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <SortButton field="assignedTo" label="Assignee" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <SortButton field="priority" label="Priority" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <SortButton field="dueDate" label="Due Date" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <SortButton field="status" label="Status" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedTasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  No tasks found
                </td>
              </tr>
            ) : (
              sortedTasks.map(task => {
                const assignee = getUserById(task.assignedTo);
                const project = getProjectById(task.categoryId);

                return (
                  <tr
                    key={task.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                    onClick={() => onTaskClick(task)}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{task.title}</p>
                        {project && (
                          <span
                            className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium"
                            style={{ backgroundColor: `${project.color}20`, color: project.color }}
                          >
                            {project.name}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                          {assignee ? getInitials(assignee.name) : 'U'}
                        </div>
                        <span className="text-gray-900 dark:text-white">{assignee?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${PRIORITY_COLORS[task.priority]}`}>
                        {PRIORITY_LABELS[task.priority]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">
                      {formatDate(task.dueDate)}
                    </td>
                    <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                      <select
                        value={task.status}
                        onChange={e => updateTask(task.id, { status: e.target.value as Task['status'] })}
                        className="px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">{STATUS_LABELS.pending}</option>
                        <option value="in-progress">{STATUS_LABELS['in-progress']}</option>
                        <option value="completed">{STATUS_LABELS.completed}</option>
                      </select>
                    </td>
                    <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEditTask(task)}
                          className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                          title="Edit task"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          title="Delete task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
