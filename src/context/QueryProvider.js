'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { createClientQueryClient } from '@/queries';

export function QueryProvider({ children }) {
  const [queryClient] = useState(() => createClientQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}