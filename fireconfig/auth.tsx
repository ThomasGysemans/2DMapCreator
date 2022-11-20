import type React from "react";
import { createContext, useEffect, useState, useContext } from "react";
import { auth } from "./firebase";

const AuthContext = createContext<AuthContextValue>({ loading: true, user: null });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthContextValue>({ loading: true, user: null });

  useEffect(() => {
    return auth.onAuthStateChanged(async (user) => {
      setUser({ loading: false, user });
    });
  }, []);

  return <AuthContext.Provider value={ user }> { children } </AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => useContext(AuthContext);