import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('carloc_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulation d'authentification
    if (email === 'admin@carloc.com' && password === 'admin123') {
      const adminUser = {
        id: '1',
        email: 'admin@carloc.com',
        name: 'Administrateur',
        role: 'admin' as const
      };
      setUser(adminUser);
      localStorage.setItem('carloc_user', JSON.stringify(adminUser));
      return true;
    } else if (email === 'user@carloc.com' && password === 'user123') {
      const regularUser = {
        id: '2',
        email: 'user@carloc.com',
        name: 'Utilisateur',
        role: 'user' as const
      };
      setUser(regularUser);
      localStorage.setItem('carloc_user', JSON.stringify(regularUser));
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulation d'inscription
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      role: 'user' as const
    };
    setUser(newUser);
    localStorage.setItem('carloc_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('carloc_user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};