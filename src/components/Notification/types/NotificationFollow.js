// components/Notification/types/NotificationFollow.js
"use client";

import Link from 'next/link';
import { Avatar } from '@/components/Avatar';
import styles from '../Notification.module.css';

export const NotificationFollow = ({ profile, publicKey, isUnfollow }) => {
  const username = profile?.Username || publicKey;

  return (
    <div className={styles.notification}>

      <div role="img" aria-label="follow" className={styles.followIcon}>
        <div>🤵</div>
        <div className={styles.plusIcon}>➕</div>
      </div>

      <div className={styles.notificationContent}>

          <div className={styles.notificationHeader}>
              <Link href={`/${username}`}>
                  <Avatar profile={profile} size={48} className={styles.avatar}/>
                  <Avatar profile={profile} size={45} className={styles.avatarMobile}/>
              </Link>

              <div className={styles.notificationSummary}>
                  <div><Link href={`/${username}`}>{username}</Link> {isUnfollow ? ' unfollowed you' : ' started following you'}</div>                       
              </div>
          </div>

      </div>

    </div>
  );
};
