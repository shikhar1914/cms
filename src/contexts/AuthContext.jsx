import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// Mock users for demo - in production, use real API
const MOCK_USERS = [
  { id: 1, email: "manager@demo.com", password: "manager123", role: "manager", name: "John Store Manager" },
  { id: 2, email: "storekeeper@demo.com", password: "store123", role: "storekeeper", name: "Jane Store Keeper" },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("cms_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const foundUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      const userData = {
        id: foundUser.id,
        email: foundUser.email,
        role: foundUser.role,
        name: foundUser.name,
      };
      setUser(userData);
      localStorage.setItem("cms_user", JSON.stringify(userData));
      return { success: true };
    }

    return { success: false, error: "Invalid email or password" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cms_user");
  };

  const isManager = () => user?.role === "manager";
  const isStoreKeeper = () => user?.role === "storekeeper";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isManager,
        isStoreKeeper,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
