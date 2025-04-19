'use client';

import { useParams } from 'next/navigation';
import { useDeSoApi } from '@/api/useDeSoApi';
import { isMaybePublicKey } from '@/utils/profileUtils';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

const ProfilePage = () => {
  const rawParam = decodeURIComponent(useParams().username);
  const isPublicKey = isMaybePublicKey(rawParam);
  const username = !isPublicKey && rawParam.startsWith('@') ? rawParam.slice(1) : rawParam;
  const { getSingleProfile } = useDeSoApi();

  const queryKey = isPublicKey ? ['profile', rawParam] : ['profile-by-username', username];

  const { data, error, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const response = isPublicKey
        ? await getSingleProfile({ PublicKeyBase58Check: rawParam })
        : await getSingleProfile({ Username: username });

      if (!response.success || !response.data?.Profile) {
        throw new Error(response.error || 'Profile not found');
      }

      return response.data.Profile;
    },
    staleTime: 1000 * 30,            // keep result fresh for 30 seconds
    cacheTime: 1000 * 60 * 5,        // cache for 5 minutes if user returns
    retry: false,                    // disable retries for not-found profiles
    refetchOnWindowFocus: false,     // prevent refetch on tab switch
  });

  if (isLoading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: 'red' }}>{error.message}</p>;

  return (
    <div>
      <h1>@{data.Username}</h1>
      <p>Public Key: {data.PublicKeyBase58Check}</p>
      <p>{data.Description || 'No bio available.'}</p>

      <p style={{ marginTop: '1rem' }}>
        <Link href={`/${data.Username || data.PublicKeyBase58Check}/posts`}>
          → View Posts
        </Link>
      </p>

    </div>
  );
};

export default ProfilePage;