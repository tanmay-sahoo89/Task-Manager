import { useState } from 'react';
import { Task } from '../../types';
import { useTasks } from '../../context/TaskContext';
import { TaskCard } from './TaskCard';
import { STATUS_LABELS } from '../../utils/constants';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

type Column = 'pending' | 'in-progress' | 'completed';

export const KanbanBoard = ({ tasks, onTaskClick }: KanbanBoardProps) => {
  const { updateTask } = useTasks();
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState<Column | null>(null);

  const columns: Column[] = ['pending', 'in-progress', 'completed'];

  const getTasksByStatus = (status: Column) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDraggedOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, column: Column) => {
    e.preventDefault();
    setDraggedOverColumn(column);
  };

  const handleDragLeave = () => {
    setDraggedOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, column: Column) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== column) {
      updateTask(draggedTask.id, { status: column });
    }
    setDraggedTask(null);
    setDraggedOverColumn(null);
  };

  const columnColors = {
    pending: 'bg-gray-50 dark:bg-gray-800/50',
    'in-progress': 'bg-blue-50 dark:bg-blue-900/10',
    completed: 'bg-green-50 dark:bg-green-900/10',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map(column => {
        const columnTasks = getTasksByStatus(column);
        const isOver = draggedOverColumn === column;

        return (
          <div
            key={column}
            onDragOver={e => handleDragOver(e, column)}
            onDragLeave={handleDragLeave}
            onDrop={e => handleDrop(e, column)}
            className={`rounded-lg p-4 min-h-[500px] transition-colors ${
              columnColors[column]
            } ${isOver ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {STATUS_LABELS[column]}
              </h3>
              <span className="px-2 py-1 bg-white dark:bg-gray-700 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300">
                {columnTasks.length}
              </span>
            </div>

            <div className="space-y-3">
              {columnTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p className="text-sm">No tasks</p>
                </div>
              ) : (
                columnTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => onTaskClick(task)}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    onDragEnd={handleDragEnd}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
