// components/Notification/types/NotificationUserAssociation.js
"use client";

import Link from 'next/link';
import { Avatar } from '@/components/Avatar';
import { isMaybePublicKey } from '@/utils/profileUtils';
import styles from '../Notification.module.css';

export const NotificationUserAssociation = ({ profile, publicKey, associationType, associationValue }) => {
  const username = profile?.Username || publicKey;
  const isPublicKey = isMaybePublicKey(username);
  const lookupKey = !isPublicKey ? `@${username}` : username;

  return (
    <div className={styles.notification}>
      <div role="img" aria-label="user-association" className={styles.associationIcon}>
        🧩
      </div>

      <div className={styles.notificationContent}>
        <div className={styles.notificationHeader}>
          <Link href={`/${username}`}>
            <Avatar profile={profile} size={48} className={styles.avatar} />
            <Avatar profile={profile} size={45} className={styles.avatarMobile} />
          </Link>

          <div className={styles.notificationSummary}>
              <div><Link href={`/${username}`}>{lookupKey}</Link> created a user association type <strong>{associationType}</strong> </div>              
              { associationValue && <div className={styles.associationValue}>{associationValue}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};
