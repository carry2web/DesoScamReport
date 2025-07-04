export const runtime = 'edge';

// this is added for Suspense
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/components/ErrorFallback';
import { PostPlaceholder } from '@/components/Post';
import { getPostsForPublicKey } from '@/api/server/getPostsForPublicKey';
import styles from './page.module.css';

import { Page } from '@/components/Page';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { PostsPageClient } from './PostsPageClient';
import { isMaybePublicKey, avatarUrl } from '@/utils/profileUtils';
import { getSingleProfile } from '@/api/server/getSingleProfile';
import { queryKeys, createServerQueryClient } from '@/queries';

const POSTS_PER_PAGE = 10;

export async function generateMetadata({ params }) {
  const { username } = await params;
  const rawParam = decodeURIComponent(username);
  const isPublicKey = isMaybePublicKey(rawParam);
  const lookupKey = !isPublicKey && rawParam.startsWith('@') ? rawParam.slice(1) : rawParam;

  const response = isPublicKey
    ? await getSingleProfile({ PublicKeyBase58Check: rawParam })
    : await getSingleProfile({ Username: lookupKey });

  if (!response.success || !response.data?.Profile) {
    return {
      title: `Posts by ${lookupKey}`,
      description: `Posts made by ${lookupKey} on DeSo blockchain`,
      openGraph: {
        title: `Posts by ${lookupKey}`,
        description: `Posts made by ${lookupKey} on DeSo blockchain`,
      },
    };
  }

  const profile = response.data.Profile;
  const displayName = profile?.ExtraData?.DisplayName || profile?.Username || lookupKey;
  const avatar = avatarUrl(profile);
  const description = `Posts made by ${displayName} on DeSo blockchain`;

  return {
    title: `Posts by ${displayName}`,
    description,
    openGraph: {
      title: `Posts by ${displayName}`,
      description,
      images: avatar ? [{ url: avatar, width: 600, height: 600 }] : undefined,
    },
    twitter: {
      title: `Posts by ${displayName}`,
      description,
      images: avatar ? [avatar] : undefined,
    },
  };
}

export default async function PostsPage({ params }) {
  const { username } = await params;
  const rawParam = decodeURIComponent(username);
  const isPublicKey = isMaybePublicKey(rawParam);
  const lookupKey = !isPublicKey && rawParam.startsWith('@') ? rawParam.slice(1) : rawParam;

  const queryClient = createServerQueryClient();

  const queryKey = isPublicKey
    ? queryKeys.profileByPublicKey(rawParam)
    : queryKeys.profileByUsername(lookupKey);

  await queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      const result = isPublicKey
        ? await getSingleProfile({ PublicKeyBase58Check: rawParam })
        : await getSingleProfile({ Username: lookupKey });

      return result?.success && result.data?.Profile ? result.data.Profile : null;
    },
  });

  await queryClient.prefetchInfiniteQuery({
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
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Page>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={
            <div className={styles.postsContainer}>
              {Array.from({ length: POSTS_PER_PAGE }).map((_, i) => (
                <PostPlaceholder key={i} />
              ))}
            </div>
          }>
            <PostsPageClient rawParam={rawParam} POSTS_PER_PAGE={POSTS_PER_PAGE} />
          </Suspense>
        </ErrorBoundary>        
        {/* <PostsPageClient rawParam={rawParam} /> */}
      </Page>
    </HydrationBoundary>
  );
}