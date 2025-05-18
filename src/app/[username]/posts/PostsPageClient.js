'use client';

import { useDeSoApi } from '@/api/useDeSoApi';
import { isMaybePublicKey } from '@/utils/profileUtils';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useRef, useEffect } from 'react';
import { Post } from '@/components/Post';
import { queryKeys } from '@/queries';
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
    staleTime: 1000 * 30,
    cacheTime: 1000 * 60 * 5,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: queryKeys.userPosts(lookupKey),
    queryFn: async ({ pageParam = '' }) => {
      const response = await getPostsForPublicKey({
        PublicKeyBase58Check: isPublicKey ? lookupKey : undefined,
        Username: isPublicKey ? undefined : lookupKey,
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
      return posts.length < POSTS_PER_PAGE ? undefined : posts.at(-1)?.PostHashHex;
    },
    staleTime: 1000 * 30,
    cacheTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
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

  if (isLoading) return <p>Loading posts...</p>;
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

      {posts.length === 0 && <p>No posts found.</p>}

      <div className={styles.postsContainer}>
        {posts.map((post) => (
          <div key={post.PostHashHex}>
            <Post
              post={post}
              username={!isPublicKey ? lookupKey : undefined}
              userProfile={userProfile}
            />
          </div>
        ))}
      </div>

      <div ref={loadMoreRef} style={{ height: '1px' }} />
      {isFetchingNextPage && <p>Loading more...</p>}
    </>
  );
};



// 'use client';

// import { useDeSoApi } from '@/api/useDeSoApi';
// import { isMaybePublicKey } from '@/utils/profileUtils';
// import { useInfiniteQuery } from '@tanstack/react-query';
// import { useRef, useEffect } from 'react';
// import { Post } from '@/components/Post';
// import { queryKeys } from '@/queries';
// import styles from './page.module.css';

// const POSTS_PER_PAGE = 10;

// export const PostsPageClient = ({ rawParam }) => {
//   const isPublicKey = isMaybePublicKey(rawParam);
//   const lookupKey = isPublicKey
//     ? rawParam
//     : rawParam.startsWith('@')
//     ? rawParam.slice(1)
//     : rawParam;

//   const { getPostsForPublicKey } = useDeSoApi();

//   const {
//     data,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     isLoading,
//     error,
//   } = useInfiniteQuery({
//     queryKey: queryKeys.userPosts(lookupKey),
//     queryFn: async ({ pageParam = '' }) => {
//       const response = await getPostsForPublicKey({
//         PublicKeyBase58Check: isPublicKey ? lookupKey : undefined,
//         Username: isPublicKey ? undefined : lookupKey,
//         LastPostHashHex: pageParam,
//         NumToFetch: POSTS_PER_PAGE,
//       });

//       if (!response.success) {
//         throw new Error(response.error || 'Failed to fetch posts');
//       }

//       return response.data;
//     },
//     getNextPageParam: (lastPage) => {
//       const posts = lastPage?.Posts || [];
//       return posts.length < POSTS_PER_PAGE ? undefined : posts.at(-1)?.PostHashHex;
//     },
//     staleTime: 1000 * 30,
//     cacheTime: 1000 * 60 * 5,
//     retry: false,
//     refetchOnWindowFocus: false,
//   });

//   const loadMoreRef = useRef(null);

//   useEffect(() => {
//     if (!hasNextPage || isFetchingNextPage) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting) {
//           fetchNextPage();
//         }
//       },
//       { rootMargin: '200px 0px', threshold: 0 }
//     );

//     const el = loadMoreRef.current;
//     if (el) observer.observe(el);

//     return () => {
//       if (el) observer.unobserve(el);
//     };
//   }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

//   if (isLoading) return <p>Loading posts...</p>;
//   if (error) return <p style={{ color: 'red' }}>{error.message}</p>;

//   const posts = data?.pages.flatMap((page) => page.Posts || []) || [];

//   return (
//     <>
//       {posts.length === 0 && <p>No posts found.</p>}

//       <div className={styles.postsContainer}>
//         {posts.map((post) => (
//           <div key={post.PostHashHex}>
//             <Post
//               post={post}
//               username={!isPublicKey ? lookupKey : undefined}
//             />
//           </div>
//         ))}
//       </div>

//       <div ref={loadMoreRef} style={{ height: '1px' }} />
//       {isFetchingNextPage && <p>Loading more...</p>}
//     </>
//   );
// };
