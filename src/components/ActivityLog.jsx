import React from 'react';
import { format, parseISO } from 'date-fns';
import { Activity } from 'lucide-react';

const ActivityLog = ({ task }) => {
  return (
    <div className="flex flex-col h-full border-l pl-6 md:pl-0 md:border-l-0 border-gray-200 dark:border-gray-700 relative">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
        <Activity className="w-4 h-4" /> Activity Log
      </h4>
      
      <div className="flex-1 overflow-y-auto pr-2 max-h-[14rem] custom-scrollbar">
        <div className="relative border-l-2 border-gray-200 dark:border-gray-600 ml-2 space-y-4 pb-2">
          {task.activityLog.slice().reverse().map((log, index) => (
            <div key={log.id} className="relative pl-4">
              <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white dark:bg-gray-800 border-2 border-blue-500"></span>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                  {format(parseISO(log.timestamp), 'MMM d, h:mm a')}
                </span>
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  <span className="font-medium">{log.user}</span> {log.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
