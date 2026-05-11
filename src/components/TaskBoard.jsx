import React, { useState, useMemo } from 'react';
import { useTasks } from '../context/TaskContext';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import { Plus, Search, Filter, ListTodo } from 'lucide-react';
import { isBefore, parseISO, startOfDay } from 'date-fns';

const TEAM_MEMBERS = ['All', 'Akshay', 'Akash', 'Arun', 'PKV', 'MKV'];

const TaskBoard = () => {
  const { tasks } = useTasks();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('dueDate');

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              task.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' ? true : task.status === statusFilter;
        const matchesAssignee = assigneeFilter === 'All' ? true : task.assignedTo === assigneeFilter;
        return matchesSearch && matchesStatus && matchesAssignee;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        } else if (sortBy === 'createdAt') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
      });
  }, [tasks, searchQuery, statusFilter, assigneeFilter, sortBy]);

  const today = startOfDay(new Date());

  const getTaskStatusInfo = (task) => {
    if (task.status === 'completed') return { isOverdue: false };
    if (!task.dueDate) return { isOverdue: false };
    
    const isOverdue = isBefore(parseISO(task.dueDate), today);
    return { isOverdue };
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="relative flex-1 w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field py-1.5 px-3"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="input-field py-1.5 px-3"
            >
              {TEAM_MEMBERS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field py-1.5 px-3"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="createdAt">Sort by Newest</option>
            </select>
          </div>

          <button onClick={() => setIsFormOpen(true)} className="btn-primary flex items-center gap-2 ml-auto md:ml-0">
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-auto rounded-xl">
        {filteredAndSortedTasks.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 border-dashed">
            <ListTodo className="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" />
            <p className="text-lg">No tasks found</p>
            <p className="text-sm">Try adjusting your filters or create a new task.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 pb-12">
            {filteredAndSortedTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onEdit={() => handleEdit(task)} 
                statusInfo={getTaskStatusInfo(task)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Task Form Modal */}
      {isFormOpen && (
        <TaskForm onClose={closeForm} taskToEdit={editingTask} />
      )}
    </div>
  );
};

export default TaskBoard;
