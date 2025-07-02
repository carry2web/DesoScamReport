'use client';

import { useDeSoApi } from '@/api/useDeSoApi';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/queries';
import { Post, PostPlaceholder } from "@/components/Post";

export const SinglePostPageClient = ({ postHash, rawParam }) => {
  const { getSinglePost } = useDeSoApi();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.singlePost(postHash),
    queryFn: async () => {
      const response = await getSinglePost({
        PostHashHex: postHash,
        FetchParents: true,
      });
      if (!response.success) throw new Error(response.error || 'Failed to fetch post');
      return response.data?.PostFound || null;
    },
    // Using global defaults from QueryProvider
    // Global defaults: staleTime: 2min, gcTime: 10min, retry: networkAwareRetry,
    // refetchOnReconnect: false (fixes wake-from-sleep), etc.
  });

  // if (isLoading) return <p>Loading post...</p>;
  // we actually never get loading state here since loading is on server side
  if (isLoading) {
    return (
      <PostPlaceholder />
    );
  }  
  if (isError) return <p style={{ color: 'red' }}>{error.message}</p>;
  if (!data) return <p>Post not found.</p>;

  return (
    <Post post={data} username={rawParam} />
  );
}