'use client'

import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider as TanstackQueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { GameProvider } from '@/app/gameContext';

export default function QueryClientProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
      <TanstackQueryClientProvider client={queryClient}>
        {children}
      </TanstackQueryClientProvider>
  )
}



export function ThemeProvider({
                                        children,
                                        ...props
                                      }: ThemeProviderProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Ensure the component only runs the theme logic after the client has mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Prevent rendering theme-dependent content until the component is mounted
    return <>{children}</>;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}


export function GameProviderLayout({
                                     children,
                                   }: {children: React.ReactNode}) {

  return <GameProvider>{children}</GameProvider>;
}