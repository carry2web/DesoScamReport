// components/Notification/types/NotificationDaoCoinTransfer.js
"use client";

import BigNumber from 'bignumber.js';

import Link from 'next/link';
import { Avatar } from '@/components/Avatar';
import { isMaybePublicKey } from '@/utils/profileUtils';
import styles from '../Notification.module.css';

export const NotificationDaoCoinTransfer = ({ profile, publicKey, creatorUsername, daoAmountHex }) => {
  const username = profile?.Username || publicKey;
  const isPublicKey = isMaybePublicKey(username);
  const lookupKey = !isPublicKey ? `@${username}` : username;

  // Convert from hex to BigNumber
  const amount = new BigNumber(daoAmountHex || 0, 16).dividedBy('1e18').toFixed();

  return (
    <div className={styles.notification}>
      <div role="img" aria-label="dao transfer" className={styles.transferIcon}>
        🪙
      </div>

      <div className={styles.notificationContent}>
        <div className={styles.notificationHeader}>
          <Link href={`/${username}`}>
            <Avatar profile={profile} size={48} className={styles.avatar} />
            <Avatar profile={profile} size={45} className={styles.avatarMobile} />
          </Link>

          <div className={styles.notificationSummary}>
            <div>
              <Link href={`/${username}`}>{lookupKey}</Link> sent you {amount}{' '}
              <Link href={`/dao/${creatorUsername}`}>${creatorUsername}</Link>!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
