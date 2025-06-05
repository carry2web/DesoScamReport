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
import { Images as ImagesIcon } from '@/assets/icons';
import classNames from 'classnames';
import styles from "./PostEditor.module.css";

export const PostEditor = ({
  mode = "create",
  post = null,
  disabled = false,
  userPublicKey = null,
  userProfile = null,

  // For comments
  ParentStakeID = null,
  isComment = false,
  onReply,
  onClose,
}) => {
  const auth = useAuth();
  const user = useUser();

  const resolvedUserPublicKey = userPublicKey || auth.userPublicKey;
  const resolvedUserProfile = userProfile || user.userProfile;
  const signAndSubmitTransaction = auth.signAndSubmitTransaction;

  const { submitPost, uploadImage } = useDeSoApi();
  const { showErrorToast, showSuccessToast } = useToast();
  const queryClient = useQueryClient();

  const [postText, setPostText] = useState('');
  const [loading, setLoading] = useState(false);

  const [imageLoading, setImageLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]); // ✅ track uploaded image URLs
  // Each item: { file, url, status: 'pending' | 'uploading' | 'success' | 'error' }  

  const successfulImageUrls = uploadedImages
  .filter((img) => img.status === "success")
  .map((img) => img.url);

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
        ...(isComment && ParentStakeID) && {ParentStakeID: ParentStakeID },
        BodyObj: { 
          Body: postText,
          ...(successfulImageUrls.length > 0 && { ImageURLs: successfulImageUrls }), // ✅ include uploaded images 
        },
        MinFeeRateNanosPerKB: 1500,
      };

      const result = await submitPost(settings);

      if (result.error) {
        showErrorToast(`Failed to submit post: ${result.error}`);
        return;
      }

      if (result.success && result.data?.TransactionHex) {
        const username = resolvedUserProfile?.Username || resolvedUserPublicKey;
        // await signAndSubmitTransaction(result.data.TransactionHex);
        const tx = await signAndSubmitTransaction(result.data.TransactionHex);

        if(!isComment) {
          await queryClient.invalidateQueries({
            queryKey: queryKeys.userPosts(username),
          });
        }

        if(!isComment){
          showSuccessToast(
            <div>
              Post published successfully 🎉 
              <br />
              <Link href={`/${username}/posts/`}>View in Posts</Link>
            </div>,
            { autoClose: 7000 }
          );
        }

        setPostText('');

        // ✅ Comment-specific callback (e.g. in PostStats)
        if (onReply) {
          onReply(tx?.PostEntryResponse);
        }

        // ✅ Close editor if applicable
        if (onClose) {
          onClose();
        }        
      }
    } catch (error) {
      const msg = error?.message || 'Error submitting post';
      showErrorToast(`Failed to submit post: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  // support tracking individual image upload status
  // const handleImageUpload = async (event) => {
  //   const files = Array.from(event.target.files || []);
  //   event.target.value = "";
  //   if (files.length === 0) return;

  //   const newItems = files.map((file) => ({
  //     id: URL.createObjectURL(file), // temporary unique ID for rendering
  //     file,
  //     url: null,
  //     status: "uploading",
  //   }));

  //   setUploadedImages((prev) => [...prev, ...newItems]);

  //   const jwt = await auth.getIdentityJWT();
  //   const publicKey = resolvedUserPublicKey;

  //   if (!jwt || !publicKey) {
  //     showErrorToast("Missing auth data. Please login again.");
  //     return;
  //   }

  //   newItems.forEach(async (item) => {
  //     try {
  //       const result = await uploadImage({
  //         imageFile: item.file,
  //         userPublicKey: publicKey,
  //         jwt,
  //       });

  //       setUploadedImages((prev) =>
  //         prev.map((img) =>
  //           img.id === item.id
  //             ? result.success
  //               ? { ...img, url: result.data.ImageURL, status: "success" }
  //               : { ...img, status: "error" }
  //             : img
  //         )
  //       );
  //     } catch (err) {
  //       setUploadedImages((prev) =>
  //         prev.map((img) =>
  //           img.id === item.id ? { ...img, status: "error" } : img
  //         )
  //       );
  //     }
  //   });
  // };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (files.length === 0) return;

    const newItems = files.map((file) => ({
      //id: URL.createObjectURL(file), // temporary unique ID for rendering
      id: crypto.randomUUID(), // Use a more reliable unique ID
      file,
      url: null,
      status: "uploading",
    }));

    setUploadedImages((prev) => [...prev, ...newItems]);

    const jwt = await auth.getIdentityJWT();
    const publicKey = resolvedUserPublicKey;

    if (!jwt || !publicKey) {
      showErrorToast("Missing auth data. Please login again.");
      return;
    }

    setImageLoading(true); // ✅ Start tracking

    await Promise.all(
      newItems.map(async (item) => {
        try {
          const result = await uploadImage({
            imageFile: item.file,
            userPublicKey: publicKey,
            jwt,
          });

          setUploadedImages((prev) =>
            prev.map((img) =>
              img.id === item.id
                ? result.success
                  ? { ...img, url: result.data.ImageURL, status: "success" }
                  : { ...img, status: "error" }
                : img
            )
          );
        } catch (err) {
          setUploadedImages((prev) =>
            prev.map((img) =>
              img.id === item.id ? { ...img, status: "error" } : img
            )
          );
        }
      })
    )

    setImageLoading(false); // ✅ End tracking when all are done
  };  

  // handle paste events to extract images
  // const handlePaste = async (event) => {
  //   const items = event.clipboardData?.items;
  //   if (!items) return;

  //   const imageItems = Array.from(items).filter(
  //     (item) => item.kind === "file" && item.type.startsWith("image/")
  //   );

  //   if (imageItems.length === 0) return;

  //   const files = imageItems.map((item) => item.getAsFile()).filter(Boolean);
  //   if (files.length === 0) return;

  //   const newItems = files.map((file) => ({
  //     id: URL.createObjectURL(file), // temporary unique ID for rendering
  //     file,
  //     url: null,
  //     status: "uploading",
  //   }));

  //   setUploadedImages((prev) => [...prev, ...newItems]);

  //   const jwt = await auth.getIdentityJWT();
  //   const publicKey = resolvedUserPublicKey;

  //   if (!jwt || !publicKey) {
  //     showErrorToast("Login to upload pasted images.");
  //     return;
  //   }

  //   newItems.forEach(async (item) => {
  //     try {
  //       const result = await uploadImage({
  //         imageFile: item.file,
  //         userPublicKey: publicKey,
  //         jwt,
  //       });

  //       setUploadedImages((prev) =>
  //         prev.map((img) =>
  //           img.id === item.id
  //             ? result.success
  //               ? { ...img, url: result.data.ImageURL, status: "success" }
  //               : { ...img, status: "error" }
  //             : img
  //         )
  //       );
  //     } catch (err) {
  //       setUploadedImages((prev) =>
  //         prev.map((img) =>
  //           img.id === item.id ? { ...img, status: "error" } : img
  //         )
  //       );
  //     }
  //   });
  // };

  const handlePaste = async (event) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    const imageItems = Array.from(items).filter(
      (item) => item.kind === "file" && item.type.startsWith("image/")
    );

    if (imageItems.length === 0) return;

    const files = imageItems.map((item) => item.getAsFile()).filter(Boolean);
    if (files.length === 0) return;

    const newItems = files.map((file) => ({
      //id: URL.createObjectURL(file), // temporary unique ID for rendering
      id: crypto.randomUUID(), // Use a more reliable unique ID
      file,
      url: null,
      status: "uploading",
    }));

    setUploadedImages((prev) => [...prev, ...newItems]);

    const jwt = await auth.getIdentityJWT();
    const publicKey = resolvedUserPublicKey;

    if (!jwt || !publicKey) {
      showErrorToast("Login to upload pasted images.");
      return;
    }

    setImageLoading(true); // ✅ Start tracking

    await Promise.all(
      newItems.map(async (item) => {
        try {
          const result = await uploadImage({
            imageFile: item.file,
            userPublicKey: publicKey,
            jwt,
          });

          setUploadedImages((prev) =>
            prev.map((img) =>
              img.id === item.id
                ? result.success
                  ? { ...img, url: result.data.ImageURL, status: "success" }
                  : { ...img, status: "error" }
                : img
            )
          );
        } catch (err) {
          setUploadedImages((prev) =>
            prev.map((img) =>
              img.id === item.id ? { ...img, status: "error" } : img
            )
          );
        }
      })
    );

    setImageLoading(false); // ✅ End tracking when all are done
  };  

  // retry failed uploads
  const handleRetryUpload = async (item) => {
    setUploadedImages((prev) =>
      prev.map((img) =>
        img.id === item.id ? { ...img, status: "uploading" } : img
      )
    );

    const jwt = await auth.getIdentityJWT();
    const publicKey = resolvedUserPublicKey;

    try {
      const result = await uploadImage({
        imageFile: item.file,
        userPublicKey: publicKey,
        jwt,
      });

      setUploadedImages((prev) =>
        prev.map((img) =>
          img.id === item.id
            ? result.success
              ? { ...img, url: result.data.ImageURL, status: "success" }
              : { ...img, status: "error" }
            : img
        )
      );
    } catch (error) {
      setUploadedImages((prev) =>
        prev.map((img) =>
          img.id === item.id ? { ...img, status: "error" } : img
        )
      );
    }
  };

  // remove by ID
  const handleRemoveImage = (id) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };  

  return (
      <div
        className={classNames(styles.postContainer, {
          [styles.commentContainer]: isComment,
        })}
      >
      <textarea
        name={isComment ? 'commentText' : 'postText'}
        disabled={loading || disabled || !resolvedUserPublicKey}
        value={postText}
        onChange={handlePostChange}
        onPaste={handlePaste}
        placeholder={
          resolvedUserPublicKey 
            ? `${isComment ? 'Reply as' : 'Write a post as'} ${resolvedUserProfile?.Username || resolvedUserPublicKey}...`
            : "Login to start posting..."
        }
      />

      <div className={styles.postActions}>
        <div className={styles.uploadActions}>
          <div className={styles.uploadContainer}>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={!resolvedUserPublicKey}
              className={styles.hiddenFileInput}
            />
            <label
              htmlFor="imageUpload"
              className={classNames(styles.uploadIconButton, {
                [styles.disabledUploadIconButton]: !resolvedUserPublicKey,
              })}
            >
              <ImagesIcon className={styles.uploadIcon} />
            </label>
          </div>
        </div>
        {
          isComment 
          ? (
          <div className={styles.actionButtons}>
            <Button
              onClick={onClose}
              disabled={loading}
              variant="secondary"
              size="small"
            >
                Cancel
            </Button>
            <Button 
                onClick={handleSubmitPost}
                isLoading={loading}
                // disabled={!postText.trim() || disabled || !resolvedUserPublicKey || imageLoading}
                disabled={
                  (!postText.trim() && uploadedImages.filter((img) => img.url).length === 0) ||
                  disabled ||
                  !resolvedUserPublicKey ||
                  imageLoading
                }                
                variant="primary"
                size="small"
            >
              {loading ? "Posting..." : "Reply"}    
            </Button>
          </div>
          )
          : (
            <div className={styles.actionButtons}>
              <Button
                // disabled={!postText.trim() || disabled || !resolvedUserPublicKey || imageLoading}
                disabled={
                  (!postText.trim() && uploadedImages.filter((img) => img.url).length === 0) ||
                  disabled ||
                  !resolvedUserPublicKey ||
                  imageLoading
                }                
                isLoading={loading}
                onClick={handleSubmitPost}
              >
                {resolvedUserPublicKey ? 'Post to DeSo' : 'Login to Post'}
              </Button>  
            </div>
          )
        }
        {/* <Button
          disabled={!postText.trim() || disabled || !resolvedUserPublicKey || imageLoading}
          isLoading={loading}
          onClick={handleSubmitPost}
        >
          {resolvedUserPublicKey ? 'Post to DeSo' : 'Login to Post'}
        </Button>         */}
      </div>


      {uploadedImages.length > 0 && (
        <div className={styles.attachedImagesContainer}>
          {uploadedImages.map((img) => (
            <div key={img.id} className={styles.previewImageContainer}>
              {/* Thumbnail */}
              {img.status === "success" && img.url && (
                <img src={img.url} alt={`Uploaded image ${img.id}`} className={styles.previewImage} />
              )}

              {img.status === "uploading" && (
                <div className={styles.previewImagePlaceholder}>
                  <div className={styles.spinner} />
                </div>
              )}

              {img.status === "error" && (
                <div className={styles.previewImagePlaceholder}>
                  <button
                    className={styles.retryButton}
                    onClick={() => handleRetryUpload(img)}
                    title="Retry"
                  >
                    🔁
                  </button>
                </div>
              )}

              {/* Remove Button */}
              <button
                onClick={() => handleRemoveImage(img.id)}
                className={styles.removeImageButton}
                title="Remove image"
                disabled={img.status === "uploading"}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}


    </div>
  );
};