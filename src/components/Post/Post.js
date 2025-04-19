"use client";

import styles from './Post.module.css';

export const Post = ({ post, username, isQuote, isComment }) => {
  if (!post) return null;

  const {
    PostHashHex,
    Body,
    LikeCount,
    CommentCount,
    RepostedPostEntryResponse,
    PosterPublicKeyBase58Check,
    ProfileEntryResponse
  } = post;

  const displayName = username || ProfileEntryResponse.Username || PosterPublicKeyBase58Check || "Unknown";

  return (
    <div className={`${styles.post} ${isQuote ? styles.quote : ''} ${isComment ? styles.comment : ''}`}>
      <div className={styles.header}>
        <span className={styles.username}>@{displayName}</span>
      </div>

      { Body &&
        <div>{Body}</div>
      }    

      {RepostedPostEntryResponse && (
        <div className={styles.repost}>
          <p className={styles.repostLabel}>🔁 Repost:</p>
          <Post post={RepostedPostEntryResponse} isQuote={true}/>
        </div>
      )}

      <div className={styles.footer}>
        <span>❤️ {LikeCount}</span>
        <span>💬 {CommentCount}</span>
      </div>
    </div>
  );
}
