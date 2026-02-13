import React, { createContext, useContext, useState, useCallback } from "react";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USERS = [
  { name: "Usuario Demo", email: "demo@mindwell.com", password: "123456" },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState(MOCK_USERS);

  const login = useCallback(async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 500));
    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
      setUser({ name: found.name, email: found.email });
      return true;
    }
    return false;
  }, [users]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 500));
    if (users.some((u) => u.email === email)) return false;
    const newUser = { name, email, password };
    setUsers((prev) => [...prev, newUser]);
    setUser({ name, email });
    return true;
  }, [users]);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
