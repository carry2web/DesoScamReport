'use client';

import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/context/AuthContext';
import { UserProvider } from '@/context/UserContext';
import { QueryProvider } from '@/context/QueryProvider';
import { EditorPostProvider } from '@/context/EditorPostContext';

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
            <EditorPostProvider>
              {children}         
            </EditorPostProvider>   
          </UserProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>   
  );
}
