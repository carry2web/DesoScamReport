"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import { useDeSoApi } from "@/api/useDeSoApi";
import { useToast } from "@/hooks/useToast";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/queries";
import { Button } from "@/components/Button";
import styles from "./PostEditor.module.css";

export const PostEditor = ({
  mode = "create",
  post = null,
  disabled = false,
  onClose,
  userPublicKey = null,
  userProfile = null,
}) => {
  const auth = useAuth();
  const user = useUser();

  const resolvedUserPublicKey = userPublicKey || auth.userPublicKey;
  const resolvedUserProfile = userProfile || user.userProfile;
  const signAndSubmitTransaction = auth.signAndSubmitTransaction;

  const { submitPost } = useDeSoApi();
  const { showErrorToast, showSuccessToast } = useToast();
  const queryClient = useQueryClient();

  const [postText, setPostText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "quote") {
      console.log("Quote mode - TODO: prefill quoted text from post");
    } else if (mode === "edit") {
      console.log("Edit mode - TODO: load post.Body into editor");
    }
  }, [mode, post]);

  const handlePostChange = (e) => {
    setPostText(e.target.value);
  };

  const handleSubmitPost = async () => {
    setLoading(true);
    try {
      const settings = {
        UpdaterPublicKeyBase58Check: resolvedUserPublicKey,
        BodyObj: { Body: postText },
        MinFeeRateNanosPerKB: 1500,
      };

      const result = await submitPost(settings);

      if (result.error) {
        showErrorToast(`Failed to publish post: ${result.error}`);
        return setLoading(false);
      }

      if (result.success && result.data?.TransactionHex) {
        const tx = await signAndSubmitTransaction(result.data.TransactionHex);
        const username = resolvedUserProfile?.Username || resolvedUserPublicKey;

        await queryClient.invalidateQueries({
          queryKey: queryKeys.userPosts(username),
        });

        showSuccessToast(
          <div>
            Post published successfully 🎉 <Link href={`/${username}/posts/${tx.TxnHashHex}`}>View</Link>
          </div>,
          { autoClose: 7000 }
        );

        setPostText('');
        
        if (onClose) {
          onClose();
        }        
      }

      setLoading(false);
    } catch (error) {
      const msg = error?.message || 'Error submitting post';
      showErrorToast(`Failed to publish post: ${msg}`);
      setLoading(false);
    }
  };

  return (
    <div className={styles.postContainer}>
      <textarea
        disabled={loading || disabled || !resolvedUserPublicKey}
        value={postText}
        onChange={handlePostChange}
        placeholder={`Write a post as ${resolvedUserProfile?.Username || resolvedUserPublicKey}`}
      />
      <Button
        disabled={!postText.trim() || disabled || !resolvedUserPublicKey}
        isLoading={loading}
        onClick={handleSubmitPost}
      >
        Post to DeSo
      </Button>
    </div>
  );
};