// utils/queryClientConfig.js
import { QueryClient } from '@tanstack/react-query';

// Network-aware retry function
const networkAwareRetry = (failureCount, error) => {
  // Don't retry if offline
  if (!navigator.onLine) return false;
  
  // Don't retry for 4xx errors (client errors)
  if (error?.status >= 400 && error?.status < 500) return false;
  
  // Retry up to 2 times for other errors
  return failureCount < 2;
};

// Progressive retry delay
const retryDelay = (attemptIndex) => {
  return Math.min(1000 * 2 ** attemptIndex, 15000); // Cap at 15 seconds
};

// Shared query client configuration
export const queryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: networkAwareRetry,
      retryDelay,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      throwOnError: false,
    },
    mutations: {
      retry: networkAwareRetry,
      retryDelay,
    },
  },
};

// Client-side query client (with full retry logic)
export const createClientQueryClient = () => {
  return new QueryClient(queryClientConfig);
};

// Server-side query client (no retry, simplified)
export const createServerQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 10,
        retry: false, // No retry on server
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    },
  });
};

/* 
 * UI State Management Notes:
 * 
 * This app also uses React Query for UI state management via:
 * - queryClient.getQueryData(uiKeys.*)
 * - queryClient.setQueryData(uiKeys.*)
 * 
 * These operations don't use the above query defaults since they're
 * direct cache operations, not useQuery/useInfiniteQuery calls.
 * 
 * If you need useQuery for UI state, consider creating UI-specific defaults:
 * - No network requests, so no retry/refetch settings needed
 * - Longer stale time for persistent UI state
 * - Immediate cache time for ephemeral UI state
 */