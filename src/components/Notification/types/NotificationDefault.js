// components/Notification/types/NotificationDefault.js
"use client";

import styles from '../Notification.module.css';

export const NotificationDefault = ({ notification }) => {
  return (
    <div className={styles.notification}>
      {notification?.Index && <span>{notification.Index}</span>} |{' '}
      {notification?.Metadata?.TxnType && <span>{notification.Metadata.TxnType}</span>}
    </div>
  );
};
