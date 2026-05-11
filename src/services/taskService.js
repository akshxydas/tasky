import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  serverTimestamp,
  arrayUnion
} from "firebase/firestore";
import { db } from "../firebase";

const TASKS_COLLECTION = "tasks";

// Create a new task
export const createTask = async (taskData) => {
  try {
    const docRef = await addDoc(collection(db, TASKS_COLLECTION), {
      ...taskData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

// Update an existing task
export const updateTask = async (taskId, updates) => {
  try {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    await updateDoc(taskRef, updates);
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

// Add a comment to a task
export const addComment = async (taskId, commentData, activityData) => {
  try {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    await updateDoc(taskRef, {
      comments: arrayUnion(commentData),
      activityLog: arrayUnion(activityData)
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

// Subscribe to tasks collection for real-time updates
export const subscribeToTasks = (onUpdate, onError) => {
  const q = collection(db, TASKS_COLLECTION);
  return onSnapshot(q, 
    (snapshot) => {
      const tasks = snapshot.docs.map(doc => {
        const data = doc.data();
        // Convert Firestore Timestamp to ISO string to maintain UI compatibility
        const createdAtStr = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString();
        return {
          id: doc.id,
          ...data,
          createdAt: createdAtStr
        };
      });
      onUpdate(tasks);
    },
    (error) => {
      console.error("Error fetching tasks:", error);
      if (onError) onError(error);
    }
  );
};
