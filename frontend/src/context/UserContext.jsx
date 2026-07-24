import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [preferences, setPreferences] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user_preferences");
      return stored ? JSON.parse(stored) : { emailNotifications: true, systemAlerts: true };
    }
    return { emailNotifications: true, systemAlerts: true };
  });

  useEffect(() => {
    if (user) {
      // Initialize profile from AuthContext user payload
      setProfile({
        name: user.name || "Academic User",
        email: user.email,
        role: user.role,
        avatar: user.avatar || null,
      });
    } else {
      setProfile(null);
    }
  }, [user]);

  const updatePreferences = (newPrefs) => {
    setPreferences((prev) => {
      const updated = { ...prev, ...newPrefs };
      localStorage.setItem("user_preferences", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <UserContext.Provider value={{ profile, setProfile, preferences, updatePreferences }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
