import { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user session on mount
  useEffect(() => {
    let isMounted = true;
    const restoreSession = async () => {
      try {
        const res = await authService.getMe();
        if (isMounted) {
          setUser(res.data?.data?.user || null);
        }
      } catch (err) {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    const userData = res.data?.data?.user;
    setUser(userData);
    return userData;
  };

  const register = async (formData) => {
    const res = await authService.register(formData);
    const userData = res.data?.data?.user;
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      // Proceed with local logout regardless of error
    } finally {
      setUser(null);
      localStorage.removeItem('canteen_cart');
      window.location.href = '/login';
    }
  };

  const updateUser = async (data) => {
    const res = await authService.updateProfile(data);
    const updated = res.data?.data?.user;
    if (updated) {
      setUser(updated);
    }
    return updated;
  };

  const value = {
    user,
    setUser,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAdmin: user?.role === 'admin',
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
};

export default AuthContext;
