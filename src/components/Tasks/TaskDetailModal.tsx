import { useState } from 'react';
import { Modal } from '../Common/Modal';
import { Task } from '../../types';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { Calendar, User, Flag, FolderKanban, Edit, Trash2, Clock } from 'lucide-react';
import { formatDate, getInitials } from '../../utils/dateUtils';
import { PRIORITY_LABELS, STATUS_LABELS } from '../../utils/constants';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit: () => void;
  onDelete: () => void;
}

export const TaskDetailModal = ({ isOpen, onClose, task, onEdit, onDelete }: TaskDetailModalProps) => {
  const { getUserById, getProjectById, addComment, updateTask } = useTasks();
  const { currentUser } = useAuth();
  const [comment, setComment] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!task) return null;

  const assignee = getUserById(task.assignedTo);
  const project = getProjectById(task.categoryId);

  const handleAddComment = () => {
    if (comment.trim()) {
      addComment(task.id, comment.trim());
      setComment('');
    }
  };

  const handleStatusChange = (newStatus: Task['status']) => {
    updateTask(task.id, { status: newStatus });
  };

  const handleDelete = () => {
    onDelete();
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task Details" size="lg">
      <div className="p-6 space-y-6">
        <div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{task.title}</h2>
              <p className="text-gray-600 dark:text-gray-400">{task.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                title="Edit task"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Assignee</p>
                <p className="font-medium">{assignee?.name || 'Unassigned'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Due Date</p>
                <p className="font-medium">{formatDate(task.dueDate)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Flag className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Priority</p>
                <p className="font-medium">{PRIORITY_LABELS[task.priority]}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <FolderKanban className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Project</p>
                <p className="font-medium">{project?.name || 'No project'}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={task.status}
              onChange={e => handleStatusChange(e.target.value as Task['status'])}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            >
              <option value="pending">{STATUS_LABELS.pending}</option>
              <option value="in-progress">{STATUS_LABELS['in-progress']}</option>
              <option value="completed">{STATUS_LABELS.completed}</option>
            </select>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Created {formatDate(task.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Updated {formatDate(task.updatedAt)}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Comments ({task.comments.length})
          </h3>

          <div className="space-y-4 mb-4">
            {task.comments.map(c => {
              const commentUser = getUserById(c.userId);
              return (
                <div key={c.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                    {commentUser ? getInitials(commentUser.name) : 'U'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {commentUser?.name || 'Unknown'}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(c.date)}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{c.text}</p>
                  </div>
                </div>
              );
            })}

            {task.comments.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No comments yet</p>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={comment}
              onChange={e => setComment(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleAddComment()}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
            <button
              onClick={handleAddComment}
              disabled={!comment.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 rounded-lg">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Delete Task?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
