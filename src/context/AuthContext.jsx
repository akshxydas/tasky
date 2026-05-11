import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('tasky_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('tasky_dark_mode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('tasky_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('tasky_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('tasky_dark_mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const login = (name) => setCurrentUser(name);
  const logout = () => setCurrentUser(null);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, darkMode, toggleDarkMode }}>
      {children}
    </AuthContext.Provider>
  );
};
