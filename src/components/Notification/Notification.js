import { renderNotificationComponent } from './renderNotificationComponent';
import styles from './Notification.module.css';

export const Notification = ({ notification, postsByHash, profilesByPublicKey }) => {
  const { Metadata, Index } = notification;

  if (Metadata?.TxnType === 'ATOMIC_TXNS_WRAPPER') {
    const innerTxns = Metadata?.AtomicTxnsWrapperTxindexMetadata?.InnerTxnsTransactionMetadata;
    if (!innerTxns?.length) return renderNotificationComponent({ notification, postsByHash, profilesByPublicKey, parentIndex: Index });

    return (
      <div className={styles.atomicTransWrapper}>
        {innerTxns.map((tx, index) =>
          renderNotificationComponent({
            notification: { Metadata: tx },
            postsByHash,
            profilesByPublicKey,
            key: index,
            parentIndex: Index,
          })
        )}
      </div>
    );
  }

  return renderNotificationComponent({ notification, postsByHash, profilesByPublicKey });
};