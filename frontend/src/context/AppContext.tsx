import React, { createContext } from 'react';

const AppContext = createContext<any>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
};