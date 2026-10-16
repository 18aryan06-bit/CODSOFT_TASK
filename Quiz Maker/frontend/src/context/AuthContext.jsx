import { createContext, useContext, useMemo, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);

function readUser() {
  try {
    return JSON.parse(localStorage.getItem("quiz_user") || "null");
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);
  const [token, setToken] = useState(() => localStorage.getItem("quiz_token"));

  function saveSession(data) {
    localStorage.setItem("quiz_token", data.token);
    localStorage.setItem("quiz_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }

  async function login(credentials) {
    const { data } = await api.post("/auth/login", credentials);
    saveSession(data);
    return data.user;
  }

  async function register(details) {
    const { data } = await api.post("/auth/register", details);
    saveSession(data);
    return data.user;
  }

  function logout() {
    localStorage.removeItem("quiz_token");
    localStorage.removeItem("quiz_user");
    setToken(null);
    setUser(null);
  }

  const value = useMemo(() => ({
    user, token, isAuthenticated: Boolean(token && user), login, register, logout,
  }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
