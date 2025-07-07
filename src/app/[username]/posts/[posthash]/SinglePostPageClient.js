'use client';

import { useDeSoApi } from '@/api/useDeSoApi';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys, uiKeys } from '@/queries';
import { Post } from "@/components/Post";

import { useAuth } from '@/context/AuthContext';

export const SinglePostPageClient = ({ postHash, rawParam }) => {
  // throw new Error("Testing error boundary");
  const { getSinglePost } = useDeSoApi();

  const { userPublicKey } = useAuth();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    //queryKey: queryKeys.singlePost(postHash),
    queryKey: [...queryKeys.singlePost(postHash), userPublicKey],
    queryFn: async () => {
      const response = await getSinglePost({
        PostHashHex: postHash,
        FetchParents: true,
        ReaderPublicKeyBase58Check: userPublicKey,
      });
      if (!response.success) throw new Error(response.error || 'Failed to fetch post');

      const post = response.data?.PostFound || null;

      if (post) {
        queryClient.setQueryData(
          uiKeys.postLiked(post.PostHashHex),
          post.PostEntryReaderState?.LikedByReader === true
        );
      }

      return post;      

      //return response.data?.PostFound || null;
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