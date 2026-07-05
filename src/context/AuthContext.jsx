import { createContext, useContext, useState, useCallback } from "react";
import { api, getToken, setToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
  const [error, setError] = useState(null);

  const login = useCallback(async (username, password) => {
    setError(null);
    try {
      const data = await api.login({ username, password });
      console.log("Login successful, received data:", data);
      setToken(data.token);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message);
      return false;
    }
  }, []);

  const register = useCallback(
    async ({ username, password, fullName, email }) => {
      setError(null);
      try {
        const data = await api.register({
          username,
          password,
          fullName,
          email,
        });
        setToken(data.token);
        //setIsAuthenticated(true);
        return true;
      } catch (err) {
        setError(err.message);
        return false;
      }
    },
    [],
  );

  const logout = useCallback(() => {
    setToken(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        error,
        login,
        register,
        logout,
        clearError: () => setError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
