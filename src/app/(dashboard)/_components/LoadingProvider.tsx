'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Preloader from './Preloader';

const LoadingContext = createContext({
  isLoading: false,
  setIsLoading: (loading: boolean) => {}
});

export const useLoading = () => useContext(LoadingContext);

export default function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const pathname = usePathname();

  useEffect(() => {
    // Only show loading for dashboard page
    if (pathname === '/') {
      const timer = setTimeout(() => setIsLoading(false), 1500);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [pathname]);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {isLoading && <Preloader />}
      <div className={isLoading ? 'opacity-50 transition-opacity duration-300' : 'opacity-100 transition-opacity duration-300'}>
        {children}
      </div>
    </LoadingContext.Provider>
  );
}