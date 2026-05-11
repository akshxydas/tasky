import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { format, parseISO } from 'date-fns';
import { MessageSquare, Send } from 'lucide-react';

const CommentSection = ({ task }) => {
  const [newComment, setNewComment] = useState('');
  const { addComment } = useTasks();

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(task.id, newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
        <MessageSquare className="w-4 h-4" /> Comments ({task.comments.length})
      </h4>
      
      <div className="flex-1 overflow-y-auto pr-2 max-h-48 space-y-3 mb-3 custom-scrollbar">
        {task.comments.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">No comments yet.</p>
        ) : (
          task.comments.map(comment => (
            <div key={comment.id} className="bg-white dark:bg-gray-700 p-2.5 rounded-lg border border-gray-100 dark:border-gray-600 shadow-sm">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-semibold text-gray-900 dark:text-white">{comment.author}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {format(parseISO(comment.timestamp), 'MMM d, h:mm a')}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-200">{comment.text}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAddComment} className="mt-auto relative">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="input-field pr-10 text-sm py-2"
        />
        <button 
          type="submit" 
          disabled={!newComment.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-600 disabled:text-gray-400 dark:disabled:text-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
