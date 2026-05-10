import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => JSON.parse(localStorage.getItem('bookifyAuth') || 'null'));

  const login = (data) => {
    localStorage.setItem('bookifyAuth', JSON.stringify(data));
    setAuth(data);
  };

  const logout = () => {
    localStorage.removeItem('bookifyAuth');
    setAuth(null);
  };

  const value = useMemo(() => ({
    auth,
    user: auth?.user || null,
    token: auth?.token || null,
    login,
    logout
  }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
