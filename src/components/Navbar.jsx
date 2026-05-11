import React, { useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { LogOut, Sun, Moon, CheckSquare, ListTodo, Download, Upload } from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout, darkMode, toggleDarkMode } = useAuth();
  const { tasks, importTasks } = useTasks();
  const fileInputRef = useRef(null);

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.length - completedTasks;

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "tasky_backup.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          importTasks(imported);
        } else {
          alert('Invalid file format.');
        }
      } catch (err) {
        alert('Error parsing JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-md">
              <CheckSquare className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">Tasky</span>
          </div>

          <div className="hidden md:flex gap-6 items-center">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 gap-1.5 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full">
              <ListTodo className="w-4 h-4 text-blue-500" />
              <span>Total: <strong>{tasks.length}</strong></span>
            </div>
            <div className="flex items-center text-sm text-green-600 dark:text-green-400 gap-1.5 bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-full">
              <CheckSquare className="w-4 h-4" />
              <span>Done: <strong>{completedTasks}</strong></span>
            </div>
            <div className="flex items-center text-sm text-amber-600 dark:text-amber-400 gap-1.5 bg-amber-50 dark:bg-amber-900/30 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>Pending: <strong>{pendingTasks}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex gap-2 mr-2">
               <button onClick={handleExport} className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors" title="Export Tasks">
                 <Download className="w-5 h-5" />
               </button>
               <button onClick={() => fileInputRef.current.click()} className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors" title="Import Tasks">
                 <Upload className="w-5 h-5" />
               </button>
               <input type="file" ref={fileInputRef} onChange={handleImport} accept=".json" className="hidden" />
            </div>

            <button 
              onClick={toggleDarkMode}
              className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-medium text-gray-900 dark:text-white leading-none">{currentUser}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Team Member</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                {currentUser.charAt(0)}
              </div>
            </div>

            <button 
              onClick={logout}
              className="ml-2 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
