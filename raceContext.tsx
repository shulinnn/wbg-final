import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define the shape of the context data (types for the state and function)
interface AppContextType {
  myString: string;
  updateString: (newString: string) => void;
}

// Create the context with an initial value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create a provider component that wraps the app and provides the context
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [myString, setMyString] = useState<string>(''); // State for the string

  const updateString = (newString: string) => {
    setMyString(newString);
  };

  return (
    <AppContext.Provider value={{ myString, updateString }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to access the context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};