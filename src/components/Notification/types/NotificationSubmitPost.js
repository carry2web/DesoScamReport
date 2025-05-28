"use client";

import { useState } from 'react';
import { Post } from '@/components/Post';
import styles from '../Notification.module.css';

export const NotificationSubmitPost = ({ profile, publicKey, submittedPost, parentPost }) => {
  const [showParent, setShowParent] = useState(false);

  const toggleParent = () => setShowParent((prev) => !prev);

  return (
    <div className={styles.notificationWithThread}>

        {showParent && showParent && (
            <div className={styles.parentPostContainer}>
                <button className={styles.toggleButton} onClick={toggleParent}>
                    Hide
                </button>                
                <Post post={parentPost} />
            </div>
        )}

        <div className={styles.submittedPostContainer}>
            {parentPost && !showParent &&
                <button className={styles.toggleButton} onClick={toggleParent}>
                    Replied to...
                </button>                
            }           
            <Post post={submittedPost} />
        </div>
    </div>
  );
};
