'use client';

import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/context/AuthContext';
import { UserProvider } from '@/context/UserContext';
import { QueryProvider } from '@/context/QueryProvider';
import { EditorPostProvider } from '@/context/EditorPostContext';
import { PermissionProvider } from '@/context/PermissionContext';

export function Providers({ children }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="dark"
      storageKey="deso-ui-theme"
    > 
      <QueryProvider>
        <AuthProvider>
          <PermissionProvider>
            <UserProvider>
              <EditorPostProvider>
                {children}         
              </EditorPostProvider>   
            </UserProvider>
          </PermissionProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>   
  );
}