// components/Notification/types/NotificationTransfer.js
"use client";

import Link from 'next/link';
import { Avatar } from '@/components/Avatar';
import { isMaybePublicKey } from '@/utils/profileUtils';
import styles from '../Notification.module.css';

export const NotificationTransfer = ({ profile, publicKey, nanosAmount }) => {
    const username = profile?.Username || publicKey;

    const isPublicKey = isMaybePublicKey(username);
    const lookupKey = !isPublicKey ? `@${username}` : username;    

    const desoAmount = (nanosAmount / 1e9).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 8,
    })

    return (
        <div className={styles.notification}>
            <div role="img" aria-label="deso transfer" className={styles.transferIcon}>
                💸
            </div>

            <div className={styles.notificationContent}>
                <div className={styles.notificationHeader}>
                    <Link href={`/${username}`}>
                        <Avatar profile={profile} size={48} className={styles.avatar} />
                        <Avatar profile={profile} size={45} className={styles.avatarMobile} />
                    </Link>

                    <div className={styles.notificationSummary}>
                        <div><Link href={`/${username}`}>{lookupKey}</Link> sent you {desoAmount} <Link href="/deso">$DESO</Link>!</div>
                    </div>
                </div>
            </div>
        </div>
  );
};
