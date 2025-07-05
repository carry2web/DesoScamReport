'use client';

import { useDeSoApi } from '@/api/useDeSoApi';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/queries';
import { Post } from "@/components/Post";

export const SinglePostPageClient = ({ postHash, rawParam }) => {
  // throw new Error("Testing error boundary");
  const { getSinglePost } = useDeSoApi();

  const { data } = useQuery({
    queryKey: queryKeys.singlePost(postHash),
    queryFn: async () => {
      const response = await getSinglePost({
        PostHashHex: postHash,
        FetchParents: true,
      });
      if (!response.success) throw new Error(response.error || 'Failed to fetch post');
      return response.data?.PostFound || null;
    },
    suspense: true, // ✅ Enable Suspense
    // Using global defaults from QueryProvider
    // Global defaults: staleTime: 2min, gcTime: 10min, retry: networkAwareRetry,
    // refetchOnReconnect: false (fixes wake-from-sleep), etc.
  });

  return (
    <Post post={data} username={rawParam} />
  );
}