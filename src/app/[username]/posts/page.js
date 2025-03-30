'use client';

import { useParams } from 'next/navigation';
import { useDeSoApi } from '@/api/useDeSoApi';
//import { useAuth } from '@/context/AuthContext';
import { isMaybePublicKey } from '@/utils/profileUtils';
import { useInfiniteQuery } from '@tanstack/react-query';

const POSTS_PER_PAGE = 10;

const PostsPage = () => {
  const rawParam = decodeURIComponent(useParams().username);
  const isPublicKey = isMaybePublicKey(rawParam);
  const lookupKey = isPublicKey
    ? rawParam
    : rawParam.startsWith('@')
    ? rawParam.slice(1)
    : rawParam;

  const { getPostsForPublicKey } = useDeSoApi();
  //const { userPublicKey } = useAuth();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['posts', lookupKey],
    queryFn: async ({ pageParam = '' }) => {
      const response = await getPostsForPublicKey({
        PublicKeyBase58Check: isPublicKey ? lookupKey : undefined,
        Username: isPublicKey ? undefined : lookupKey,
        //ReaderPublicKeyBase58Check: userPublicKey || undefined,
        LastPostHashHex: pageParam,
        NumToFetch: POSTS_PER_PAGE,
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch posts');
      }

      return response.data;
    },
    getNextPageParam: (lastPage) => {
      const posts = lastPage?.Posts || [];
      if (posts.length < POSTS_PER_PAGE) return undefined;
      return posts[posts.length - 1]?.PostHashHex;
    },
    staleTime: 1000 * 30,           // 30 seconds: data is considered fresh and won't be refetched
    cacheTime: 1000 * 60 * 5,       // 5 minutes: keep inactive data in cache before garbage collecting
    retry: false,                   // don't retry failed requests automatically
    refetchOnWindowFocus: false,    // don't refetch just because the window/tab is focused
  });

  if (isLoading) return <p>Loading posts...</p>;
  if (error) return <p style={{ color: 'red' }}>{error.message}</p>;

  const posts = data?.pages.flatMap((page) => page.Posts) || [];

  return (
    <div>
      <h1>Posts by {rawParam}</h1>

      {posts.length === 0 && <p>No posts found.</p>}

      <ul>
        {posts.map((post) => (
          <li key={post.PostHashHex} style={{ marginBottom: '1rem' }}>
            <h3>{post.Body?.slice(0, 100) || 'No content'}</h3>
            <p>Likes: {post.LikeCount}, Comments: {post.CommentCount}</p>
          </li>
        ))}
      </ul>

      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading more...' : 'Load more'}
        </button>
      )}
    </div>
  );
};

export default PostsPage;