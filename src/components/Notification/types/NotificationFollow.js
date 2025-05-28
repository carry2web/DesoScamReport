// components/Notification/types/NotificationFollow.js
"use client";

import Link from 'next/link';
import { Avatar } from '@/components/Avatar';
import styles from '../Notification.module.css';

export const NotificationFollow = ({ profile, publicKey, isUnfollow }) => {
  const username = profile?.Username || publicKey;

  return (
    <div className={styles.notification}>
      <Link href={`/${username}`}><Avatar profile={profile} size={48} /></Link>
      <div className={styles.notificationContent}>
        <div className={styles.notificationHeader}>
          <div className={styles.notificationSummary}>
            <div>
              <Link href={`/${username}`}><strong>{username}</strong></Link>
              {isUnfollow ? ' unfollowed you' : ' started following you'}              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
