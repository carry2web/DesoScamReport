'use client';

import { useParams } from 'next/navigation';
import { useDeSoApi } from '@/api/useDeSoApi';
import { isMaybePublicKey } from '@/utils/profileUtils';
import { useQuery } from '@tanstack/react-query';

import { Post } from '@/components/Post';

import styles from './page.module.css';

const SinglePostPage = () => {
  const params = useParams();
  const rawParam = decodeURIComponent(params.username);
  const postHash = decodeURIComponent(params.posthash);

  const isPublicKey = isMaybePublicKey(rawParam);
  const lookupKey = isPublicKey
    ? rawParam
    : rawParam.startsWith('@')
    ? rawParam.slice(1)
    : rawParam;

  const { getSinglePost } = useDeSoApi();

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['single-post', postHash],
    queryFn: async () => {
      const response = await getSinglePost({
        PostHashHex: postHash,
        FetchParents: true
      });

      if (!response.success) throw new Error(response.error || 'Failed to fetch post');
      return response.data?.PostFound || null;
    },
    staleTime: 1000 * 30,
    cacheTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <p>Loading post...</p>;
  if (error) return <p style={{ color: 'red' }}>{error.message}</p>;
  if (!data) return <p>Post not found.</p>;

  return (
    <div className={styles.pageContainer}>
      <h1>Post by {rawParam}</h1>
      <Post post={data} username={!isPublicKey ? lookupKey : undefined} />
    </div>
  );
};

export default SinglePostPage;