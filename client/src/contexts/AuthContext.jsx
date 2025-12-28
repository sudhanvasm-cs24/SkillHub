import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Restore auth state from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Failed to restore auth state:', err);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://skill-hub-1h3a.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      const userObj = { _id: data._id, name: data.name, email: data.email, completedSteps: data.completedSteps };
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(userObj));
      setToken(data.token);
      setUser(userObj);
      return { success: true, user: userObj };
    } catch (err) {
      setError(err.message || 'Registration failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://skill-hub-1h3a.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      const userObj = { _id: data._id, name: data.name, email: data.email, completedSteps: data.completedSteps };
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(userObj));
      setToken(data.token);
      setUser(userObj);
      return { success: true, user: userObj };
    } catch (err) {
      setError(err.message || 'Login failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (name, email) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://skill-hub-1h3a.onrender.com/api/auth/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Profile update failed');

      const userObj = { _id: data._id, name: data.name, email: data.email, completedSteps: data.completedSteps };
      localStorage.setItem('user', JSON.stringify(userObj));
      setUser(userObj);
      return { success: true, user: userObj };
    } catch (err) {
      setError(err.message || 'Update failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [token]);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://skill-hub-1h3a.onrender.com/api/auth/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Return structured error so callers can react to HTTP status codes
        return { success: false, error: data.message || 'Password change failed', status: res.status };
      }
      return { success: true, message: data.message };
    } catch (err) {
      setError(err.message || 'Password change failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [token]);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, error, register, login, logout, updateProfile, changePassword, isAuthenticated: !!user && !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
