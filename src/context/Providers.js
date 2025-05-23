'use client';

import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/context/AuthContext';
import { UserProvider } from '@/context/UserContext';
import { QueryProvider } from '@/context/QueryProvider';

export function Providers({ children }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="dark"
      storageKey="deso-ui-theme"
    > 
      <QueryProvider>
        <AuthProvider>
          <UserProvider>
            {children}         
          </UserProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>   
  );
}
