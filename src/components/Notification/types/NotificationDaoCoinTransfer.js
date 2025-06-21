"use client";

import BigNumber from 'bignumber.js';
import Link from 'next/link';
import { Avatar } from '@/components/Avatar';
import { isMaybePublicKey } from '@/utils/profileUtils';
import styles from '../Notification.module.css';

export const NotificationDaoCoinTransfer = ({
  profile,           // Sender profile
  publicKey,         // Current user public key (not used for summary wording)
  creatorUsername,   // DAO coin symbol
  daoAmountHex,      // amount in hex
  notification,      // full notification object (to get AffectedPublicKeys)
  profilesByPublicKey
}) => {
  // Find the receiver in AffectedPublicKeys
  const receiverPubKey = notification?.Metadata?.AffectedPublicKeys?.find(
    (k) => k.Metadata === "ReceiverPublicKey"
  )?.PublicKeyBase58Check;

  const senderPubKey = notification?.Metadata?.TransactorPublicKeyBase58Check;
  const receiverProfile = profilesByPublicKey?.[receiverPubKey];
  const senderProfile = profilesByPublicKey?.[senderPubKey];

  // Format coin amount
  const amount = new BigNumber(daoAmountHex || 0, 16).dividedBy('1e18').toFixed();

  // Coin symbol
  const coinSymbol = creatorUsername ? `$${creatorUsername}` : "";

  // Sender and receiver usernames or short public keys
  const senderUsername = senderProfile?.Username || senderPubKey;
  const senderLookup = isMaybePublicKey(senderUsername) ? senderUsername : `@${senderUsername}`;
  const receiverUsername = receiverProfile?.Username || receiverPubKey;
  const receiverLookup = isMaybePublicKey(receiverUsername) ? receiverUsername : `@${receiverUsername}`;

  // Always display sender → receiver
  const summary = (
    <div>
      <Link href={`/${senderUsername}`}>{senderLookup}</Link> sent {amount} <Link href={`/${creatorUsername}`}>{coinSymbol}</Link> to <Link href={`/${receiverUsername}`}>{receiverLookup}</Link>
    </div>
  );

  return (
    <div className={styles.notification}>
      <div role="img" aria-label="dao transfer" className={styles.transferIcon}>
        🪙
      </div>
      <div className={styles.notificationContent}>
        <div className={styles.notificationHeader}>
          <Link href={`/${senderLookup}`}>
            <Avatar profile={senderProfile} size={48} className={styles.avatar} />
            <Avatar profile={senderProfile} size={45} className={styles.avatarMobile} />
          </Link>
          <div className={styles.notificationSummary}>
            {summary}
          </div>
        </div>
      </div>
    </div>
  );
};