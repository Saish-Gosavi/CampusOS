import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { LoadingProvider } from "@/context/LoadingContext";
import { UserProvider } from "@/context/UserContext";
import AppRoutes from "@/routes/AppRoutes";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <NotificationProvider>
            <LoadingProvider>
              <UserProvider>
                <AppRoutes />
                <Toaster position="top-right" />
              </UserProvider>
            </LoadingProvider>
          </NotificationProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
