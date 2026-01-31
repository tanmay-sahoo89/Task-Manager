import { Calendar, GripVertical } from 'lucide-react';
import { Task } from '../../types';
import { useTasks } from '../../context/TaskContext';
import { formatDate, isOverdue, getInitials } from '../../utils/dateUtils';
import { PRIORITY_COLORS, PRIORITY_LABELS } from '../../utils/constants';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

export const TaskCard = ({ task, onClick, draggable, onDragStart, onDragEnd }: TaskCardProps) => {
  const { getUserById, getProjectById } = useTasks();
  const assignee = getUserById(task.assignedTo);
  const project = getProjectById(task.categoryId);
  const overdue = isOverdue(task.dueDate) && task.status !== 'completed';

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-2">
        {draggable && (
          <GripVertical className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2">
              {task.title}
            </h3>
            <span
              className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
                PRIORITY_COLORS[task.priority]
              }`}
            >
              {PRIORITY_LABELS[task.priority]}
            </span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
            {task.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {assignee && (
                <div
                  className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium"
                  title={assignee.name}
                >
                  {getInitials(assignee.name)}
                </div>
              )}
              {project && (
                <span
                  className="px-2 py-1 rounded text-xs font-medium"
                  style={{ backgroundColor: `${project.color}20`, color: project.color }}
                >
                  {project.name}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="w-3.5 h-3.5" />
              <span className={overdue ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
                {formatDate(task.dueDate)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
