'use client';

import { useParams } from 'next/navigation';
import { useDeSoApi } from '@/api/useDeSoApi';
import { isMaybePublicKey } from '@/utils/profileUtils';
import { useQuery } from '@tanstack/react-query';

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
    </div>
  );
};

export default ProfilePage;




// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import { useDeSoApi } from '@/api/useDeSoApi';
// import { isMaybePublicKey } from '@/utils/profileUtils';

// const ProfilePage = () => {
//   const rawParam = decodeURIComponent(useParams().username);

//   const isPublicKey = isMaybePublicKey(rawParam);
//   const username = !isPublicKey && rawParam.startsWith('@') ? rawParam.slice(1) : rawParam;

//   const { getSingleProfile } = useDeSoApi();
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const result = isPublicKey
//           ? await getSingleProfile({ PublicKeyBase58Check: rawParam })
//           : await getSingleProfile({ Username: username });

//         if (result.success && result.data?.Profile) {
//           setProfile(result.data.Profile);
//         } else if (!result.success) {
//           setError(result.error || 'Failed to fetch profile.');
//         } else {
//           setError('Profile not found.');
//         }
//       } catch (err) {
//         setError('Unexpected error occurred.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [rawParam, username, isPublicKey, getSingleProfile]);

//   if (loading) return <p>Loading profile...</p>;
//   if (error) return <p style={{ color: 'red' }}>{error}</p>;

//   return (
//     <div>
//       <h1>@{profile.Username}</h1>
//       <p>Public Key: {profile.PublicKeyBase58Check}</p>
//       <p>{profile.Description || 'No bio available.'}</p>
//     </div>
//   );
// };

// export default ProfilePage;

