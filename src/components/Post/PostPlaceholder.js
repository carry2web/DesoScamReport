"use client";

import { Placeholder } from "@/components/Placeholder";
import styles from "./Post.module.css";

export const PostPlaceholder = () => {
  return (
    <div className={styles.post}>
      <div className={styles.avatarContainer}>
        <Placeholder width="48px" height="48px" />
      </div>

      <div className={styles.postContentContainer}>
        <div className={styles.header}>
          <div className={styles.mobileAvatarContainer}>
            <Placeholder width="45px" height="45px" />
          </div>

          <div className={styles.postSummary}>
            <div className={styles.postLinks}>
              <div className={styles.userLinksWrapper}>
                <Placeholder width="80px" height="var(--font-size-base)" />
              </div>
              <div className={styles.postLinkWrapper}>
                <Placeholder width="160px" height="var(--font-size-xs)" />              
              </div>
            </div>
          </div>
        </div>

        <div className={styles.postBody}>
          <Placeholder width="100%" height="60px" />
        </div>
      </div>
    </div>
  );
};
