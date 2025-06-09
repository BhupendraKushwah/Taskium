// UserProvider.js
import React, { useState, useEffect } from "react";
import UserContext from "./UserContext"; // Import the context
import useApi from "../../hooks/instance"
import { useNavigate } from "react-router";

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const api = useApi();
  const navigate = useNavigate();

  // Fetch user data (customize this based on your needs)
  const fetchUser = async () => {
    try {
      setLoading(true);
      let response = await api.get('/users/');      

      if (!response.success) throw new Error("Failed to fetch user");
      const userData = response.data.user;
      setUser(userData);
    } catch (error) {
      console.error("Fetch user error:", error);
      setUser(null);
      localStorage.removeItem('persistantState');
      navigate('/login')
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    // Add any additional cleanup logic
  };

  // Initialize user on mount (if applicable)
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("persistantState"))?.token;
    if (token && !user) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  // Context value
  const value = {
    user,
    setUser,
    isAuthenticated: !!user,
    loading,
    fetchUser,
    logout,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;