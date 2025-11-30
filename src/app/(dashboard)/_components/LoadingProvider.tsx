'use client';

import { createContext, useContext, useState } from 'react';

const LoadingContext = createContext({
  isLoading: false,
  setIsLoading: (loading: boolean) => {}
});

export const useLoading = () => useContext(LoadingContext);

export default function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}