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
import { Post } from "@/components/Post";
import { Images as ImagesIcon } from '@/assets/icons';
import classNames from 'classnames';
import styles from "./PostEditor.module.css";

export const PostEditor = ({
  mode = "create",
  quotedPost = null, // ✅ for quoted post
  editablePost = null, // ✅ for editable post  
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

  const successfulImageUrls = uploadedImages
  .filter((img) => img.status === "success")
  .map((img) => img.url);


  useEffect(() => {
    if (mode === "quote" && quotedPost) {
      // For quotes, start with empty text (user adds their commentary)
      setPostText('');
    } else if (mode === "edit" && editablePost) {
      // For edits, pre-populate with existing post content
      setPostText(editablePost.Body || '');
      // TODO: Also load existing images if any
      if (editablePost.ImageURLs?.length > 0) {
        const existingImages = editablePost.ImageURLs.map((url) => ({
          id: crypto.randomUUID(), // Use a more reliable unique ID
          file: null,
          url: url,
          status: "success"
        }));
        setUploadedImages(existingImages);
      } else {
        // Create mode - start fresh
        setPostText('');
        setUploadedImages([]);
      }
    }
  }, [mode, quotedPost, editablePost]);  

  const handlePostChange = (e) => {
    setPostText(e.target.value);
  };

  const handleSubmitPost = async () => {
    setLoading(true);
    try {
      const settings = {
        UpdaterPublicKeyBase58Check: resolvedUserPublicKey,
        ...(isComment && ParentStakeID) && {ParentStakeID: ParentStakeID },
        ...(mode === "quote" && quotedPost) && { RepostedPostHashHex: quotedPost?.post?.PostHashHex }, // ✅ Add quoted post reference
        ...(mode === "edit" && editablePost) && { PostHashHexToModify: editablePost.PostHashHex }, // ✅ For editing existing posts        
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
        const tx = await signAndSubmitTransaction(result.data.TransactionHex);

        if(!isComment) {
          await queryClient.invalidateQueries({
            queryKey: queryKeys.userPosts(username),
          });
        }

        if(!isComment){
          const getSuccessMessage = () => {
            switch(mode) {
              case "quote":
                return "Quote posted successfully 🎉";
              case "edit":
                return "Post updated successfully ✨";
              default:
                return "Post published successfully 🎉";
            }
          };

          showSuccessToast(
            <div>
              {getSuccessMessage()}
              <br />
              <Link href={`/${username}/posts/`}>View in Posts</Link>
            </div>,
            { autoClose: 7000 }
          );
        }

        // Reset form
        setPostText('');
        setUploadedImages([]); // Clear uploaded images after successful post

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
  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (files.length === 0) return;

    const newItems = files.map((file) => ({
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

  // ✅ Get placeholder text based on mode
  const getPlaceholderText = () => {
    if (!resolvedUserPublicKey) return "Login to start posting...";
    
    const username = resolvedUserProfile?.Username || resolvedUserPublicKey;
    
    if (isComment) return `Reply as ${username}...`;
    if (mode === "quote") return `Add your thoughts about this post as ${username}...`;
    if (mode === "edit") return `Edit your post as ${username}...`;
    return `Write a post as ${username}...`;
  };  

  // ✅ Get button text based on mode
  const getButtonText = () => {
    if (!resolvedUserPublicKey) return 'Login to Post';
    if (loading) {
      if (isComment) return "Posting...";
      if (mode === "quote") return "Quoting...";
      if (mode === "edit") return "Updating...";
      return "Posting...";
    }
    if (isComment) return "Reply";
    if (mode === "quote") return "Quote Post";
    if (mode === "edit") return "Update Post";
    return "Post to DeSo";
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
        placeholder={getPlaceholderText()}
      />

      <div className={styles.postActions}>
        <div className={styles.uploadActions}>

          {/* <div className={styles.uploadContainer}>
            <input
              id={inputId.current}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={!resolvedUserPublicKey}
              className={styles.hiddenFileInput}
            />
            <label
              htmlFor={inputId.current}
              className={classNames(styles.uploadIconButton, {
                [styles.disabledUploadIconButton]: !resolvedUserPublicKey,
              })}
            >
              <ImagesIcon className={styles.uploadIcon} />
            </label>
          </div> */}

          <div className={styles.uploadContainer}>
            <label className={classNames(styles.uploadIconButton, {
              [styles.disabledUploadIconButton]: !resolvedUserPublicKey,
            })}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={!resolvedUserPublicKey}
                className={styles.hiddenFileInput}
              />
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
              {/* {loading ? "Posting..." : "Reply"}     */}
              {getButtonText()}
            </Button>
          </div>
          )
          : (
            <div className={styles.actionButtons}>
              <Button
                disabled={
                  (!postText.trim() && uploadedImages.filter((img) => img.url).length === 0) ||
                  disabled ||
                  !resolvedUserPublicKey ||
                  imageLoading
                }                
                isLoading={loading}
                onClick={handleSubmitPost}
              >
                {/* {resolvedUserPublicKey ? 'Post to DeSo' : 'Login to Post'} */}
                {getButtonText()}
              </Button>  
            </div>
          )
        }
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

      { quotedPost && (
        <Post
          post={quotedPost?.post}
          username={quotedPost?.username}
          userProfile={quotedPost?.ProfileEntryResponse}
          isQuote={true}
          hideStats={true}
          isStatsDisabled={true}
        />
      )}

    </div>
  );
};