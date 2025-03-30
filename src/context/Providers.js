'use client';

import { AuthProvider } from '@/context/AuthContext';
import { UserProvider } from '@/context/UserContext';
import { QueryProvider } from '@/context/QueryProvider';

export function Providers({ children }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <UserProvider>
          {children}
        </UserProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
