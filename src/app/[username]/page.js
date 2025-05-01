'use client';

import { useParams } from 'next/navigation';
import { useDeSoApi } from '@/api/useDeSoApi';
import { isMaybePublicKey } from '@/utils/profileUtils';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

const ProfilePage = () => {
  const rawParam = decodeURIComponent(useParams().username);
  const isPublicKey = isMaybePublicKey(rawParam);
  const lookupKey = !isPublicKey && rawParam.startsWith('@') ? rawParam.slice(1) : rawParam;

  const { getSingleProfile } = useDeSoApi();

  const queryKey = isPublicKey ? ['profile', rawParam] : ['profile-by-username', lookupKey];

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const response = isPublicKey
        ? await getSingleProfile({ PublicKeyBase58Check: rawParam })
        : await getSingleProfile({ Username: lookupKey });

      if (!response.success || !response.data?.Profile) return null;

      return response.data.Profile;
    },
    staleTime: 1000 * 30,
    cacheTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <p>Loading profile...</p>;
  }

  const displayKey = data?.Username || data?.PublicKeyBase58Check || rawParam;

  return (
    <div>
      <h1>
        {data?.Username ? `@${data.Username}` : 'Profile not found'}
      </h1>

      {data ? (
        <>
          <p>Public Key: {data.PublicKeyBase58Check}</p>
          <p>{data.Description || 'No bio available.'}</p>
        </>
      ) : (
        <>
          <p style={{ color: 'gray' }}>No profile found for <strong>{rawParam}</strong>.</p>
        </>
      )}

      <p style={{ marginTop: '1rem' }}>
        <Link href={`/${displayKey}/posts`}>→ View Posts</Link>
      </p>
    </div>
  );
};

export default ProfilePage;