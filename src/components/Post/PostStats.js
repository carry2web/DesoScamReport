"use client";

import { useState } from "react";
import { useDeSoApi } from "@/api/useDeSoApi";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/useToast";
import styles from "./Post.module.css";

import { Button } from "@/components/Button";

// PostStats component handles the stats (💬 🔁 ❤️ 💎) display
// and manages the inline reply UI and submission logic.
export const PostStats = ({ post, onReply }) => {
  const {
    PostHashHex,
    CommentCount,
    LikeCount,
    DiamondCount,
    RepostCount,
    QuoteRepostCount,
  } = post;

  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  
  // ✅ Local state to track comment count for optimistic updates
  const [localCommentCount, setLocalCommentCount] = useState(CommentCount);

  const { submitPost } = useDeSoApi();
  const { signAndSubmitTransaction, userPublicKey } = useAuth();
  const { showErrorToast } = useToast();

  const handleReply = async () => {
    setLoading(true);
    try {
      const settings = {
        UpdaterPublicKeyBase58Check: userPublicKey,
        ParentStakeID: PostHashHex,
        BodyObj: { Body: replyText },
        MinFeeRateNanosPerKB: 1500,
      };

      const result = await submitPost(settings);
      if (result.error) throw new Error(result.error);

      const tx = await signAndSubmitTransaction(result.data.TransactionHex);

      // ✅ Increment local comment count optimistically
      setLocalCommentCount(prev => prev + 1);

      // ✅ Calls parent handler to inject fresh reply
      if (onReply) onReply(tx?.PostEntryResponse);

      // ✅ Reset UI state after success
      setReplyText("");
      setShowReplyBox(false);
    } catch (err) {
      showErrorToast(`Reply failed: ${err.message}`);
      // Note: We don't decrement on error since the increment only happens on success
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.stats}>
        {/* 💬 icon triggers reply box - uses local count */}
        <span onClick={() => setShowReplyBox((prev) => !prev)} style={{ cursor: "pointer" }}>
          💬 {localCommentCount}
        </span>
        <span>🔁 {RepostCount + QuoteRepostCount}</span>
        <span>❤️ {LikeCount}</span>
        <span>💎 {DiamondCount}</span>
      </div>

      {/* Inline reply UI */}
      {showReplyBox && (
        <div className={styles.replyBox}>
          <textarea
            rows={3}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your comment..."
            disabled={loading}
          />
          <div className={styles.replyActions}>
            <Button
              onClick={() => setShowReplyBox(false)}
              disabled={loading}
              variant="secondary"
              size="small"
            >
                Cancel</Button>
            <Button 
                onClick={handleReply}
                isLoading={loading}
                disabled={!replyText}
                variant="primary"
                size="small"
            >
              {loading ? "Posting..." : "Reply"}    
            </Button>
          </div>
        </div>
      )}
    </>
  );
};