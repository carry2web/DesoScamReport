'use client';

import { useDeSoApi } from '@/api/useDeSoApi';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/queries';
import { Page } from "@/components/Page";
import { Post } from "@/components/Post";

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
    staleTime: 1000 * 30,
    cacheTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <Page><p>Loading post...</p></Page>;
  if (isError) return <Page><p style={{ color: 'red' }}>{error.message}</p></Page>;
  if (!data) return <Page><p>Post not found.</p></Page>;

  return (
    <Page>
      <Post post={data} username={rawParam} />
    </Page>
  );
}