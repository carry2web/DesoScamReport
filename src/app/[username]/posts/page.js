'use client';

import { useParams } from 'next/navigation';
import { useDeSoApi } from '@/api/useDeSoApi';
import { isMaybePublicKey } from '@/utils/profileUtils';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRef, useEffect } from 'react';

import { Post } from '@/components/Post';

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


  const loadMoreRef = useRef(null);

  // Infinite scroll using IntersectionObserver
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      {
        rootMargin: '200px 0px', // Load earlier when within 200px from the bottom
        threshold: 0,
      }
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);  

  if (isLoading) return <p>Loading posts...</p>;
  if (error) return <p style={{ color: 'red' }}>{error.message}</p>;

  // make sure posts is [] in case user has no posts and we get null as response
  const posts = data?.pages.flatMap((page) => page.Posts || []) || [];

  return (
    <div>
      <h1>Posts by {rawParam}</h1>

      {posts.length === 0 && <p>No posts found.</p>}

      <div>
        {posts.map((post) => (
          <div key={post.PostHashHex} style={{ marginBottom: '1rem' }}>
            <Post
              post={post}
              username={!isPublicKey ? lookupKey : undefined}
            />            
          </div>
        ))}
      </div>      

      {/* This div triggers loading more when visible */}
      <div ref={loadMoreRef} style={{ height: '1px' }} />

      {isFetchingNextPage && <p>Loading more...</p>}

    </div>
  );
};

export default PostsPage;