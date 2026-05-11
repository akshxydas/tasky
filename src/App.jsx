import React from 'react';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import Navbar from './components/Navbar';
import TaskBoard from './components/TaskBoard';

function App() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      {currentUser && <Navbar />}
      <main className="flex-grow flex flex-col p-4 md:p-8 max-w-7xl mx-auto w-full">
        {!currentUser ? <Login /> : <TaskBoard />}
      </main>
    </div>
  );
}

export default App;
