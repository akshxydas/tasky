import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';
import { 
  createTask as createTaskService, 
  updateTask as updateTaskService, 
  deleteTask as deleteTaskService, 
  addComment as addCommentService,
  subscribeToTasks 
} from '../services/taskService';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to Firestore real-time updates
    const unsubscribe = subscribeToTasks(
      (updatedTasks) => {
        setTasks(updatedTasks);
        setLoading(false);
      },
      (error) => {
        console.error("TaskContext: Error subscribing to tasks:", error);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const addTask = async (taskData) => {
    if (!currentUser) return;
    
    const newTask = {
      ...taskData,
      status: 'pending',
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
    
    try {
      await createTaskService(newTask);
    } catch (error) {
      console.error("Failed to add task", error);
    }
  };

  const updateTask = async (id, updates) => {
    if (!currentUser) return;

    const task = tasks.find(t => t.id === id);
    if (!task) return;

    let details = 'Task updated';
    if (updates.status && updates.status !== task.status) {
      details = `Status changed to ${updates.status}`;
    }
    
    const newActivity = {
      id: uuidv4(),
      action: 'updated',
      user: currentUser,
      timestamp: new Date().toISOString(),
      details
    };

    try {
      await updateTaskService(id, {
        ...updates,
        activityLog: [...(task.activityLog || []), newActivity]
      });
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteTaskService(id);
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const addComment = async (taskId, text) => {
    if (!currentUser) return;

    const newComment = {
      id: uuidv4(),
      text,
      author: currentUser,
      timestamp: new Date().toISOString()
    };

    const newActivity = {
      id: uuidv4(),
      action: 'commented',
      user: currentUser,
      timestamp: new Date().toISOString(),
      details: 'Added a comment'
    };

    try {
      await addCommentService(taskId, newComment, newActivity);
    } catch (error) {
      console.error("Failed to add comment", error);
    }
  };
  
  const importTasks = async (importedTasks) => {
    // Loops over imported tasks and creates them in Firestore
    if (!Array.isArray(importedTasks)) return;
    
    for (const task of importedTasks) {
        const { id, createdAt, ...rest } = task; // Strip local ID, let Firestore generate one
        try {
           await createTaskService(rest);
        } catch(err) {
           console.error("Failed to import a task", err);
        }
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, loading, addTask, updateTask, deleteTask, addComment, importTasks }}>
      {children}
    </TaskContext.Provider>
  );
};
