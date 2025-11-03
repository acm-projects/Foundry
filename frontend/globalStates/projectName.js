"use client";
import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [projectName, setProjectName] = useState([]);

  return (
    <AppContext.Provider value={{ projectName, setProjectName }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
