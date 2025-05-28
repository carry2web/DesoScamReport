'use client';

import { useDeSoApi } from '@/api/useDeSoApi';
import { isMaybePublicKey } from '@/utils/profileUtils';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useRef, useEffect } from 'react';
import { Notification } from '@/components/Notification';
import { queryKeys } from '@/queries';
import styles from './page.module.css';

const NOTIFICATIONS_PER_PAGE = 50;

export const NotificationsPageClient = ({ rawParam }) => {
  const isPublicKey = isMaybePublicKey(rawParam);
  const lookupKey = isPublicKey
    ? rawParam
    : rawParam.startsWith('@')
    ? rawParam.slice(1)
    : rawParam;

  const { getSingleProfile, getNotifications } = useDeSoApi();

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
    queryKey: queryKeys.notifications(isPublicKey ? lookupKey : userProfile?.PublicKeyBase58Check),
    queryFn: async ({ pageParam = -1 }) => {
      const response = await getNotifications({
        FetchStartIndex: pageParam,
        NumToFetch: NOTIFICATIONS_PER_PAGE,
        PublicKeyBase58Check: isPublicKey ? lookupKey : userProfile?.PublicKeyBase58Check,
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch notifications');
      }

      return response.data;
    },
    getNextPageParam: (lastPage) => {
      const notifications = lastPage?.Notifications || [];
      if (notifications.length < NOTIFICATIONS_PER_PAGE) {
        return undefined; // No more pages
      }
      
      // Get the Index from the last notification and subtract 1
      const lastNotification = notifications.at(-1);
      return lastNotification?.Index ? lastNotification.Index - 1 : undefined;
    },
    staleTime: 1000 * 30,
    cacheTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!(isPublicKey ? lookupKey : userProfile?.PublicKeyBase58Check), // Only run when we have the public key
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

  if (isProfileLoading) return <p>Loading profile...</p>;
  if (isProfileError) return <p style={{ color: 'red' }}>{profileError.message}</p>;
  if (isLoading) return <p>Loading notifications...</p>;
  if (error) return <p style={{ color: 'red' }}>{error.message}</p>;

  const notifications = data?.pages.flatMap((page) => page.Notifications || []) || [];

  // Merge additional data from all pages
  const postsByHash = {};
  const profilesByPublicKey = {};
  
  data?.pages.forEach(page => {
    if (page.PostsByHash) {
      Object.assign(postsByHash, page.PostsByHash);
    }
    if (page.ProfilesByPublicKey) {
      Object.assign(profilesByPublicKey, page.ProfilesByPublicKey);
    }
  });

  return (
    <>
      {notifications.length === 0 && <p>No notifications found.</p>}

      <div className={styles.notificationsContainer}>
        {notifications.map((notification) => (
          <div key={`${notification.Index}`}>
            <Notification
              notification={notification}
              postsByHash={postsByHash}
              profilesByPublicKey={profilesByPublicKey}
            />
          </div>
        ))}
      </div>

      <div ref={loadMoreRef} style={{ height: '1px' }} />
      {isFetchingNextPage && <p>Loading more notifications...</p>}
    </>
  );
};