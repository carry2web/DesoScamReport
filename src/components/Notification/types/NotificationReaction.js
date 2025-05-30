"use client";

import Link from 'next/link';
import classNames from 'classnames';
import { Avatar } from '@/components/Avatar';
import { isMaybePublicKey } from '@/utils/profileUtils';
import styles from '../Notification.module.css';

const reactionMap = {
  LIKE: '👍',
  LOVE: '❤️',
  LAUGH: '😂',
  ASTONISHED: '😲',
  SAD: '😢',
  ANGRY: '😠',
  DISLIKE: '👎',
};

export const NotificationReaction = ({ profile, publicKey, post, reaction }) => {
  const username = profile?.Username || publicKey;

  const isPublicKey = isMaybePublicKey(username);
  const lookupKey = !isPublicKey ? `@${username}` : username;    

  const animationClass = styles[reaction?.toLowerCase()] || '';

  return (
    <div className={styles.notification}>
      <div role="img" aria-label="reaction" className={styles.reactionIcon}>
        <div>✨</div>
      </div>

      <div className={styles.notificationContent}>
        <div className={styles.notificationHeader}>
          <Link href={`/${username}`}>
            <Avatar profile={profile} size={48} className={styles.avatar} />
            <Avatar profile={profile} size={45} className={styles.avatarMobile} />
          </Link>

          <div className={styles.notificationSummary}>
            <div>
              <Link href={`/${username}`}>{lookupKey}</Link> reacted{' '}
              <span className={classNames(styles.reactionEmoji, animationClass)}>
                {reactionMap[reaction] || '❓'}
              </span>{' '}
              at your post
            </div>
            <div className={styles.postLinkWrapper}>
              <Link
                href={`/${username}/posts/${post.PostHashHex}`}
                className={styles.postLink}
                prefetch={false}
              >
                {post.PostHashHex}
              </Link>
            </div>
          </div>
        </div>

        {post?.Body && (
          <div className={styles.postSnippet}>
            {post.Body}
          </div>
        )}
      </div>
    </div>
  );
};