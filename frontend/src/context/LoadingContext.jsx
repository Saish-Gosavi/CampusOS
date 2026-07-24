import React, { createContext, useContext, useState } from "react";
import { Loader } from "@/components/common/Loader";

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const [globalLoading, setGlobalLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading...");

  const startLoading = (text = "Loading...") => {
    setLoadingText(text);
    setGlobalLoading(true);
  };

  const stopLoading = () => {
    setGlobalLoading(false);
  };

  return (
    <LoadingContext.Provider value={{ globalLoading, startLoading, stopLoading }}>
      {children}
      {globalLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Loader size="lg" label={loadingText} />
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
