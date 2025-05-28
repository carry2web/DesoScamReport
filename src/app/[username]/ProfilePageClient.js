'use client';

import { useParams } from 'next/navigation';
import { useDeSoApi } from '@/api/useDeSoApi';
import { isMaybePublicKey } from '@/utils/profileUtils';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

import { Profile } from '@/components/Profile';

import { queryKeys } from '@/queries';

export const ProfilePageClient = () => {
  const rawParam = decodeURIComponent(useParams().username);
  const isPublicKey = isMaybePublicKey(rawParam);
  const lookupKey = !isPublicKey && rawParam.startsWith('@') ? rawParam.slice(1) : rawParam;

  const { getSingleProfile } = useDeSoApi();

    // ℹ️ We're using useQuery here even though profile data is already prefetched and hydrated from the server.
    //
    // Why?
    // - This sets up the query cache properly so that if profile editing is introduced later,
    //   we can call queryClient.invalidateQueries(queryKey) to re-fetch the updated profile.
    // - It also ensures that this component stays reactive to changes in the cache (e.g. edits from other tabs).
    // - During client-side navigation (e.g. from a list of users), this also provides fallback loading/error states.
    //
    // Note: The query is prefilled from server-side hydration (via prefetchQuery + dehydrate),
    // so on initial load there's no additional network request unless the cache is invalidated or missing.

  const { data, isLoading, isError, error } = useQuery({
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

  return (
    <>
      <p style={{ marginBottom: '1rem', marginTop: '0' }}>
        <Link href={`/${rawParam}/posts`}>View Posts</Link> | <Link href={`/${rawParam}/feed`}>Follow Feed</Link> | <Link href={`/${rawParam}/notifications`}>Notifications Feed</Link>
      </p>

      <Profile
        profile={data}
        rawParam={rawParam}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />

    </>
  );
};