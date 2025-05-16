'use client';

import { useParams } from 'next/navigation';
import { useDeSoApi } from '@/api/useDeSoApi';
import { isMaybePublicKey } from '@/utils/profileUtils';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

import { Profile } from '@/components/Profile';

import { queryKeys } from '@/queries';

const ProfilePage = () => {
  const rawParam = decodeURIComponent(useParams().username);
  const isPublicKey = isMaybePublicKey(rawParam);
  const lookupKey = !isPublicKey && rawParam.startsWith('@') ? rawParam.slice(1) : rawParam;

  const { getSingleProfile } = useDeSoApi();

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
    refetchOnWindowFocus: false,
  });

  return (
    <div>

      <Profile
        profile={data}
        rawParam={rawParam}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />

      <p style={{ marginTop: '1rem' }}>
        <Link href={`/${rawParam}/posts`}>→ View Posts</Link>
      </p>

    </div>
  );
};

export default ProfilePage;