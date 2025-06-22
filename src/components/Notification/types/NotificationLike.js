// components/Notification/types/NotificationLike.js
"use client";

import Link from 'next/link';
import { Avatar } from '@/components/Avatar';
import { isMaybePublicKey } from '@/utils/profileUtils';
import styles from '../Notification.module.css';

// IsUnlike is always false since IsUnlike: true is not added to notifications
export const NotificationLike = ({ profile, publicKey, post }) => {
    const username = profile?.Username || publicKey;

    const isPublicKey = isMaybePublicKey(username);
    const lookupKey = !isPublicKey ? `@${username}` : username;       

    const postUsername = post?.ProfileEntryResponse?.Username;
    const postPublicKey = post?.PosterPublicKeyBase58Check;
    const postHash = post?.PostHashHex;
    const hasPostLink = (postHash && (postUsername || postPublicKey));

    return (
        <div className={styles.notification}>

            <div role="img" aria-label="like" className={styles.likeIcon}>❤️</div>

            <div className={styles.notificationContent}>

                <div className={styles.notificationHeader}>
                    <Link href={`/${username}`}>
                        <Avatar profile={profile} size={48} className={styles.avatar}/>
                        <Avatar profile={profile} size={45} className={styles.avatarMobile}/>
                    </Link>

                    <div className={styles.notificationSummary}>

                        <div><Link href={`/${username}`}>{lookupKey}</Link> liked your post</div>                    

                        {hasPostLink && (
                            <div className={styles.postLinkWrapper}>
                                <Link
                                    href={`/${postUsername || postPublicKey}/posts/${postHash}`}
                                    className={styles.postLink}
                                    prefetch={false}
                                >
                                  {postHash}
                                </Link>
                            </div>
                        )}

                    </div>
                </div>

                {post?.Body && (
                    <div className={styles.postSnippet}>
                        {post.Body}
                    </div>
                )}
            </div>
        </div>
    );
};

