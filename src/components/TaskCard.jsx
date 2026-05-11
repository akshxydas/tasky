import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { format, parseISO } from 'date-fns';
import { ChevronDown, ChevronUp, Clock, User, Trash2, Edit2, AlertCircle } from 'lucide-react';
import CommentSection from './CommentSection';
import ActivityLog from './ActivityLog';

const TaskCard = ({ task, onEdit, statusInfo }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { updateTask, deleteTask } = useTasks();

  const handleStatusChange = (e) => {
    e.stopPropagation();
    const newStatus = e.target.checked ? 'completed' : 'pending';
    updateTask(task.id, { status: newStatus });
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };

  const formattedDueDate = task.dueDate ? format(parseISO(task.dueDate), 'MMM d, yyyy') : 'No due date';
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border ${statusInfo.isOverdue ? 'border-red-300 dark:border-red-800' : 'border-gray-200 dark:border-gray-700'} shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md`}>
      {/* Collapsed View (Header) */}
      <div 
        className="p-4 flex items-center gap-4 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-shrink-0" onClick={e => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={task.status === 'completed'}
            onChange={handleStatusChange}
            className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 cursor-pointer"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-medium truncate ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
            {task.title}
          </h3>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {task.assignedTo}
            </span>
            {task.dueDate && (
              <span className={`flex items-center gap-1 ${statusInfo.isOverdue ? 'text-red-500 font-medium' : ''}`}>
                <Clock className="w-3.5 h-3.5" />
                {formattedDueDate}
              </span>
            )}
            {statusInfo.isOverdue && (
              <span className="flex items-center gap-1 text-red-500 font-medium text-xs bg-red-50 dark:bg-red-900/30 px-1.5 py-0.5 rounded">
                <AlertCircle className="w-3 h-3" /> Overdue
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors"
            title="Edit Task"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={handleDelete}
            className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="p-1.5 text-gray-400">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* Expanded View */}
      {isExpanded && (
        <div className="border-t border-gray-100 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</h4>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap text-sm border-l-2 border-blue-500 pl-3 py-1">
              {task.description || 'No description provided.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CommentSection task={task} />
            <ActivityLog task={task} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
