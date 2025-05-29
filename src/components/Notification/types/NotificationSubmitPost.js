"use client";

import { useState } from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import { useQueryClient } from '@tanstack/react-query';
import { uiKeys } from '@/queries';
import { Post } from '@/components/Post';
import styles from '../Notification.module.css';

export const NotificationSubmitPost = ({ profile, publicKey, submittedPost, submittedPostHex, parentPost }) => {
//   const [showParent, setShowParent] = useState(false);

//   const toggleParent = () => setShowParent((prev) => !prev);

  const queryClient = useQueryClient();
  const postHash = submittedPost?.PostHashHex;

  const [showParent, setShowParent] = useState(() => {
    return queryClient.getQueryData(uiKeys.parentPostVisible(postHash)) ?? false;
  });

  const toggleParent = () => {
    const next = !showParent;
    queryClient.setQueryData(uiKeys.parentPostVisible(postHash), next);
    setShowParent(next);
  };

  const containerClass = classNames(styles.notificationWithThread, {
    [styles.open]: showParent,
  });

  // there is a bug, if poster has no profile and no username - post is null
  // need to reportt to DeSo team
  if (!submittedPost) {
    return (
      <div className={styles.notification}>
        <div className={styles.notificationContent}>
          <div className={styles.notificationHeader}>
            <span className={styles.error}>Post by{' '} 
              <Link
                href={`/${publicKey}`}
                prefetch={false}
              >
                {publicKey}
              </Link>              
              {' '}not found. Check it at{' '}
              <Link
                href={`/${publicKey}/posts/${submittedPostHex}`}
                className={styles.postLink}
                prefetch={false}
              >
                {submittedPostHex}
              </Link>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      {parentPost && (
        <button className={styles.toggleButton} onClick={toggleParent}>
          {showParent ? 'Hide' : 'Replied to...'}
        </button>
      )}

      {parentPost && showParent && (
        <div className={styles.parentPostContainer}>
          <Post post={parentPost} />
        </div>
      )}  

      <div className={styles.submittedPostContainer}>
        <Post post={submittedPost} />
      </div>
    </div>
  );
};