import { createContext, useContext, useMemo } from "react";

// Create the context with default values
const UserContext = createContext({
  user: null,
  setUser: () => console.warn("setUser called without UserProvider"),
  isAuthenticated: false,
  loading: true,
  fetchUser: async () => console.warn("fetchUser called without UserProvider"),
  logout: () => console.warn("logout called without UserProvider"),
});

// Custom hook for accessing context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Export the context for the provider to use
export default UserContext;