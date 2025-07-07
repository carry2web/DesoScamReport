'use client';

import { useDeSoApi } from '@/api/useDeSoApi';
import { isMaybePublicKey } from '@/utils/profileUtils';
import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, useEffect } from 'react';
import { Post, PostPlaceholder } from '@/components/Post';
import { queryKeys, uiKeys } from '@/queries';

import { useAuth } from '@/context/AuthContext';

import { UserQuickLinks } from '@/components/UserQuickLinks';

import styles from './page.module.css';

const POSTS_PER_PAGE = 10;

export const PostsPageClient = ({ rawParam }) => {
  const isPublicKey = isMaybePublicKey(rawParam);
  const lookupKey = isPublicKey
    ? rawParam
    : rawParam.startsWith('@')
    ? rawParam.slice(1)
    : rawParam;

  const { getSingleProfile, getPostsForPublicKey } = useDeSoApi();

  const queryClient = useQueryClient();
  const { userPublicKey } = useAuth();

  // Hydrated profile query
  const {
    data: userProfile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = useQuery({
    queryKey: isPublicKey
      ? queryKeys.profileByPublicKey(rawParam)
      : queryKeys.profileByUsername(lookupKey),
    queryFn: async () => {
      const response = isPublicKey
        ? await getSingleProfile({ PublicKeyBase58Check: rawParam })
        : await getSingleProfile({ Username: lookupKey });

      if (!response.success || !response.data?.Profile) {
        throw new Error(response.error || 'Failed to load profile');
      }

      return response.data.Profile;
    },
    // Most settings removed - using global defaults from QueryProvider
    // Global defaults: staleTime: 2min, gcTime: 10min, retry: networkAwareRetry, etc.
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    //queryKey: queryKeys.userPosts(lookupKey),
    queryKey: [ ...queryKeys.userPosts(lookupKey), userPublicKey ],
    queryFn: async ({ pageParam = '' }) => {
      const response = await getPostsForPublicKey({
        PublicKeyBase58Check: isPublicKey ? lookupKey : undefined,
        Username: isPublicKey ? undefined : lookupKey,
        LastPostHashHex: pageParam,
        NumToFetch: POSTS_PER_PAGE,
        ReaderPublicKeyBase58Check: userPublicKey, // Include reader's public key for likedByReader
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch posts');
      }

      response.data?.Posts?.forEach((post) => {
        queryClient.setQueryData(
          uiKeys.postLiked(post.PostHashHex),
          post.PostEntryReaderState?.LikedByReader === true
        );
      });      

      return response.data;
    },
    getNextPageParam: (lastPage) => {
      const posts = lastPage?.Posts || [];
      return posts.length < POSTS_PER_PAGE ? undefined : posts.at(-1)?.PostHashHex;
    },
    // Using global defaults - much cleaner!
    // Optional: Only override if you need different behavior for posts
    staleTime: 1000 * 60, // Optional: 1 minute for posts (vs 2min global default)    
  });

  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { rootMargin: '200px 0px', threshold: 0 }
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // if (isLoading) return <p>Loading posts...</p>;
  if (isLoading) {
    return (
      <>
        <UserQuickLinks profile={userProfile} rawParam={rawParam} />
        <div className={styles.postsContainer}>
          {Array.from({ length: POSTS_PER_PAGE }).map((_, index) => (
            <PostPlaceholder key={index} />
          ))}
        </div>
      </>
    );
  }

  if (error) return <p style={{ color: 'red' }}>{error.message}</p>;

  const posts = data?.pages.flatMap((page) => page.Posts || []) || [];

  return (
    <>
      {/* <h2>
        Posts by{' '}
        {userProfile
          ? userProfile.ExtraData?.DisplayName || userProfile.Username
          : rawParam}
      </h2> */}

      <UserQuickLinks profile={userProfile} rawParam={rawParam} />

      {posts.length === 0 && <p>No posts found.</p>}

      <div className={styles.postsContainer}>
        {posts.map((post) => (
          <div key={post.PostHashHex}>
            <Post
              post={post}
              //username={!isPublicKey ? lookupKey : undefined}
              username={rawParam}
              userProfile={userProfile}
            />
          </div>
        ))}

        {isFetchingNextPage && (
          <>
            {Array.from({ length: POSTS_PER_PAGE }).map((_, index) => (
              <PostPlaceholder key={`loading-more-${index}`} />
            ))}
          </>
        )}        
  
      </div>

      <div ref={loadMoreRef} style={{ height: '1px' }} />  

      {/* {isFetchingNextPage && <p>Loading more...</p>} */}
    </>
  );
};