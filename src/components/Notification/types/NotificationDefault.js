// components/Notification/types/NotificationDefault.js

import styles from '../Notification.module.css';

export const NotificationDefault = ({ notification, parentIndex }) => {
  const indexToShow = notification?.Index ?? parentIndex;
  return (
    <div className={styles.notification}>
      {indexToShow && <span>{indexToShow}</span>} |{' '}
      {notification?.Metadata?.TxnType && <span>{notification.Metadata.TxnType}</span>}
    </div>
  );
};