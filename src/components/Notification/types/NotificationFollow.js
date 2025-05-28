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
      <div>
        <Link href={`/${username}`}><strong>{username}</strong></Link>
        {isUnfollow ? ' unfollowed you' : ' started following you'}
      </div>
    </div>
  );
};
