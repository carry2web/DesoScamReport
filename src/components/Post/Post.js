"use client";

import { useDeSoApi } from '@/api/useDeSoApi';
import { useState } from 'react';
import { useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import Link from 'next/link';

import styles from './Post.module.css';

const COMMENT_LIMIT = 10;

export const Post = ({ post, username, isQuote, isComment }) => {
  if (!post) return null;

  const {
    PostHashHex,
    Body,
    //LikeCount,
    CommentCount,
    RepostedPostEntryResponse,
    PosterPublicKeyBase58Check,
    ProfileEntryResponse,
  } = post;

  const displayName =
    username || ProfileEntryResponse?.Username || PosterPublicKeyBase58Check || 'Unknown';

  const { getSinglePost } = useDeSoApi();
  const queryClient = useQueryClient();

  const [showReplies, setShowReplies] = useState(() => {
    return queryClient.getQueryData(['comments-visible', PostHashHex]) ?? false;
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['comments', PostHashHex],
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
    queryClient.setQueryData(['comments-visible', PostHashHex], (prev) => !prev);
    setShowReplies((prev) => !prev);
  };

  return (
    <div className={`${styles.post} ${isQuote ? styles.quote : ''} ${isComment ? styles.comment : ''}`}>
      <div className={styles.header}>
        <Link href={`/${displayName}`} className={styles.username} prefetch={false}>{displayName}</Link>       
        <div>
          <Link href={`/${displayName}/posts/${PostHashHex}`} className={styles.postLink} prefetch={false}>{PostHashHex}</Link>   
        </div> 
      </div>

      {Body && <div>{Body}</div>}

      {RepostedPostEntryResponse && (
        <div className={styles.repost}>
          <p className={styles.repostLabel}>🔁 Repost:</p>
          <Post post={RepostedPostEntryResponse} isQuote />
        </div>
      )}

      <div className={styles.footer}>
        {/* <span>❤️ {LikeCount}</span> */}
        <span>💬 {CommentCount}</span>
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
        <div className={styles.replies}>
          {comments.map((comment) => (
            <Post key={comment.PostHashHex} post={comment} isComment />
          ))}
          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className={styles.loadMoreButton}
            >
              {isFetchingNextPage ? 'Loading more...' : 'Load more replies...'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};