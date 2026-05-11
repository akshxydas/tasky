import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasky_tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem('tasky_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: uuidv4(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      createdBy: currentUser,
      comments: [],
      activityLog: [{
        id: uuidv4(),
        action: 'created',
        user: currentUser,
        timestamp: new Date().toISOString(),
        details: 'Task created'
      }]
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id, updates) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        let details = 'Task updated';
        if (updates.status && updates.status !== task.status) {
          details = `Status changed to ${updates.status}`;
        }
        
        return {
          ...task,
          ...updates,
          activityLog: [
            ...task.activityLog,
            {
              id: uuidv4(),
              action: 'updated',
              user: currentUser,
              timestamp: new Date().toISOString(),
              details
            }
          ]
        };
      }
      return task;
    }));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const addComment = (taskId, text) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          comments: [
            ...task.comments,
            {
              id: uuidv4(),
              text,
              author: currentUser,
              timestamp: new Date().toISOString()
            }
          ],
          activityLog: [
            ...task.activityLog,
            {
              id: uuidv4(),
              action: 'commented',
              user: currentUser,
              timestamp: new Date().toISOString(),
              details: 'Added a comment'
            }
          ]
        };
      }
      return task;
    }));
  };
  
  const importTasks = (importedTasks) => {
      setTasks(importedTasks);
  }

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, addComment, importTasks }}>
      {children}
    </TaskContext.Provider>
  );
};
