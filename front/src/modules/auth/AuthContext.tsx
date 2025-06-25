// src/context/AuthContext.tsx
import { createContext, useEffect, useState, useContext } from 'react';

export interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const defaultAuth: AuthContextType = {
  token: null,
  login: () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuth);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const localToken = localStorage.getItem('token');
    if (localToken) setToken(localToken);
  }, []);

  const login = (loginToken: string) => {
    localStorage.setItem('token', loginToken);
    setToken(loginToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook de conveniencia para usar el contexto
export function useAuth() {
  return useContext(AuthContext);
}
