"use client";

import { useDeSoApi } from '@/api/useDeSoApi';
import { useState } from 'react';
import { useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import Link from 'next/link';

import { MarkdownText } from '@/components/MarkdownText';
import { Avatar } from '@/components/Avatar';
import { isMaybePublicKey } from '@/utils/profileUtils';

import { queryKeys, uiKeys } from '@/queries';

import styles from './Post.module.css';

const COMMENT_LIMIT = 10;

export const Post = ({ post, username, userProfile, isQuote, isComment }) => {
  if (!post) return null;

  const {
    PostHashHex,
    Body,
    CommentCount,
    LikeCount,
    DiamondCount,
    RepostedPostEntryResponse,
    PosterPublicKeyBase58Check,
    ProfileEntryResponse,
  } = post;

  const [showRaw, setShowRaw] = useState(false);

  const rawUsername =
    username || ProfileEntryResponse?.Username || PosterPublicKeyBase58Check || 'Unknown';

  const isPublicKey = isMaybePublicKey(rawUsername);
  const lookupKey = !isPublicKey && rawUsername.startsWith('@') ? rawUsername.slice(1) : rawUsername;
  const displayName = ProfileEntryResponse?.ExtraData?.DisplayName || userProfile?.ExtraData?.DisplayName;

  const { getSinglePost } = useDeSoApi();
  const queryClient = useQueryClient();

  const [showReplies, setShowReplies] = useState(() => {
    return queryClient.getQueryData(uiKeys.commentsVisible(PostHashHex)) ?? false;
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: queryKeys.postComments(PostHashHex),
    queryFn: async ({ pageParam = 0 }) => {
      const response = await getSinglePost({
        PostHashHex,
        FetchParents: false,
        CommentOffset: pageParam,
        CommentLimit: COMMENT_LIMIT,
      });

      if (!response.success) throw new Error(response.error || 'Failed to fetch comments');
      return {
        comments: response.data?.PostFound?.Comments || [],
        nextOffset: pageParam + COMMENT_LIMIT,
        hasMore: (response.data?.PostFound?.Comments?.length || 0) === COMMENT_LIMIT,
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextOffset : undefined,
      enabled: showReplies,
      staleTime: 1000 * 30,           // 30 seconds: data is considered fresh and won't be refetched
      cacheTime: 1000 * 60 * 5,       // 5 minutes: keep inactive data in cache before garbage collecting
      retry: false,
      refetchOnWindowFocus: false,
  });

  const comments = data?.pages.flatMap((page) => page.comments) || [];

  const toggleReplies = () => {
    queryClient.setQueryData(uiKeys.commentsVisible(PostHashHex), (prev) => !prev);
    setShowReplies((prev) => !prev);
  };

  return (
    <div className={`${styles.post} ${isQuote ? styles.quote : ''} ${isComment ? styles.comment : ''}`}>

      {
        !isComment && 
        <div className={styles.avatarContainer}>
          <Avatar profile={ProfileEntryResponse || userProfile} size={48} />
        </div>
      }

      <div className={styles.postContentContainer}>
        <div className={styles.header}>
          {isComment && <Avatar profile={ProfileEntryResponse || userProfile} size={40} />}
          <div className={styles.postSummary}>

            <div className={styles.postLinks}>
              <div className={styles.userLinksWrapper}>
                {displayName && 
                  <Link href={`/${lookupKey}`} className={styles.displayName} prefetch={false}>{displayName}</Link>                  
                }
                {isPublicKey ? (
                  <Link
                    href={`/${lookupKey}`}
                    className={styles.publicKey}
                    prefetch={false}
                  >
                    {lookupKey}
                  </Link>
                ) : (
                  <Link
                    href={`/${lookupKey}`}
                    className={styles.username}
                    prefetch={false}
                  >
                    @{lookupKey}
                  </Link>
                )}
              </div>    
              <div className={styles.postLinkWrapper}>
                  <Link href={`/${lookupKey}/posts/${PostHashHex}`} className={styles.postLink} prefetch={false}>{PostHashHex}</Link>  
              </div>   
            </div>

            <div className={styles.postControls}>
              {Body &&
                <button
                  onClick={() => setShowRaw((prev) => !prev)}
                  className={styles.toggleRawButton}
                >
                  {showRaw ? 'Show Rendered 📄' : 'Show Raw 📝'}
                </button>
              }
            </div>
          </div>
        </div>

        {Body && (
          <div className={styles.postBody}>
            {showRaw ? (
              <pre>{Body.replace(/\\/g, '\\\\')}</pre>
            ) : (
              <MarkdownText text={Body} />
            )}
          </div>
        )}        

        {RepostedPostEntryResponse && (
          <div className={styles.repost}>
            <Post post={RepostedPostEntryResponse} isQuote />
          </div>
        )}

        <div className={styles.footer}>
          <span>💬 {CommentCount}</span>
          <span>❤️ {LikeCount}</span>
          <span>💎 {DiamondCount}</span>
        </div>

        {CommentCount > 0 && (
          <button onClick={toggleReplies} className={styles.repliesButton}>
            {isLoading
              ? 'Loading replies...'
              : showReplies
              ? 'Hide replies'
              : `See replies...`}
          </button>
        )}

        {showReplies && (
          <div className={styles.repliesContainer}>
            <div className={styles.replies}>
              {comments.map((comment) => (
                <Post key={comment.PostHashHex} post={comment} isComment />
              ))}
            </div>
            {hasNextPage && (
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className={styles.loadMoreButton}
              >
                {isFetchingNextPage ? 'Loading more...' : 'Load more replies'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};