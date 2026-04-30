import { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('bazi_token');
    const savedUser = localStorage.getItem('bazi_user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        // Invalid stored data, clear it
        localStorage.removeItem('bazi_token');
        localStorage.removeItem('bazi_user');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Handle Email/Password Login
   */
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save auth data
      localStorage.setItem('bazi_token', data.token);
      localStorage.setItem('bazi_user', JSON.stringify(data.user));
      
      setUser(data.user);
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Email/Password Signup
   */
  const signup = async (name, email, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Save auth data
      localStorage.setItem('bazi_token', data.token);
      localStorage.setItem('bazi_user', JSON.stringify(data.user));
      
      setUser(data.user);
      
      return { success: true, isNewUser: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      const token = localStorage.getItem('bazi_token');
      
      // Call logout endpoint (optional)
      if (token) {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (e) {
      // Ignore logout errors
    } finally {
      // Clear local storage
      localStorage.removeItem('bazi_token');
      localStorage.removeItem('bazi_user');
      setUser(null);
    }
  };

  /**
   * Get auth token for API calls
   */
  const getToken = () => {
    return localStorage.getItem('bazi_token');
  };

  /**
   * Make authenticated API request
   */
  const authFetch = async (url, options = {}) => {
    const token = getToken();
    
    const headers = {
      ...options.headers,
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    if (response.status === 401) {
      // Token expired or invalid
      logout();
      throw new Error('Session expired. Please login again.');
    }
    
    return response;
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    getToken,
    authFetch,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
