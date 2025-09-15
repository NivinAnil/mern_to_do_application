
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_BASEURL+"/api" || "http://localhost:5000/api",
  });

  api.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const register = async (username, email, password) => {
    await api.post("/auth/register", { username, email, password });
    // directly login after register
    await login(email, password);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, api }}>
      {children}
    </AuthContext.Provider>
  );
};
