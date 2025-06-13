"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import { useDeSoApi } from "@/api/useDeSoApi";
import { useToast } from "@/hooks/useToast";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/queries";
import { Button } from "@/components/Button";
import { Post } from "@/components/Post";

import { ImageUploadButton, ImagePreviews } from "./ImageUpload";
import { useImageUpload } from "./useImageUpload";

import { useMentions } from "@/hooks/useMentions";
import { MentionDropdown } from "@/components/MentionDropdown";

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

  const { submitPost } = useDeSoApi();
  const { showErrorToast, showSuccessToast } = useToast();
  const queryClient = useQueryClient();

  const [postText, setPostText] = useState('');
  const [loading, setLoading] = useState(false);

  // Textarea ref for mentions
  const textareaRef = useRef(null);
 
  // ✅ Use the image upload hook
  const {
    imageLoading,
    uploadedImages,
    successfulImageUrls,
    handleImageUpload,
    handlePaste,
    handleDrop,
    handleDragOver,
    handleRetryUpload,
    handleRemoveImage,
    loadExistingImages,
    clearImages,
  } = useImageUpload({
    userPublicKey: resolvedUserPublicKey,
    getJWT: auth.getIdentityJWT,
  });  

  // ✅ Use mentions hook
  const {
    mentionState,
    profiles,
    isLoading: mentionsLoading,
    selectedIndex,
    setSelectedIndex,
    handleTextChange: handleMentionTextChange,
    handleKeyDown: handleMentionKeyDown,
    insertMention,
    closeMentions,
    floatingStyles,
    refs,
  } = useMentions(textareaRef);


  useEffect(() => {
    if (mode === "quote" && quotedPost) {
      setPostText('');
      clearImages();
    } else if (mode === "edit" && editablePost) {
      setPostText(editablePost.Body || '');
      loadExistingImages(editablePost.ImageURLs);
    } else {
      setPostText('');
      clearImages();
    }
  }, [mode, quotedPost, editablePost]);  

  const handlePostChange = (e) => {
    const newText = e.target.value;
    const cursorPosition = e.target.selectionStart;
    
    setPostText(newText);
    
    // Handle mentions
    handleMentionTextChange(newText, cursorPosition);
  };  

  // Handle direct text updates (for mention insertions)
  const handleDirectTextUpdate = (newText) => {
    setPostText(newText);
  };

  const handleTextareaKeyDown = (e) => {
    // Handle mention navigation first
    const mentionHandled = handleMentionKeyDown(e, postText, handleDirectTextUpdate);
    if (mentionHandled) {
      return; // Mention system handled the key press
    }
    
    // Handle other keyboard shortcuts here if needed
  };
  
  const handleTextareaSelect = (e) => {
    // Update mention state when cursor position changes
    const cursorPosition = e.target.selectionStart;
    handleMentionTextChange(postText, cursorPosition);
  };
  
  const handleMentionSelect = (profile) => {
    insertMention(profile, postText, handleDirectTextUpdate);
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
        clearImages();
        closeMentions();

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

      <div className={styles.textareaContainer}>
        <textarea
          ref={textareaRef}
          name={isComment ? 'commentText' : 'postText'}
          disabled={loading || disabled || !resolvedUserPublicKey}
          value={postText}
          onChange={handlePostChange}
          onKeyDown={handleTextareaKeyDown}
          onSelect={handleTextareaSelect}
          onPaste={handlePaste}
          onDrop={handleDrop}
          onDragOver={handleDragOver}        
          placeholder={getPlaceholderText()}
        />
        
        {/* Mention Dropdown */}
        <MentionDropdown
          isOpen={mentionState.isOpen}
          profiles={profiles}
          isLoading={mentionsLoading}
          selectedIndex={selectedIndex}
          floatingStyles={floatingStyles}
          floatingRef={refs.setFloating}
          onSelect={handleMentionSelect}
          onHover={setSelectedIndex}
        />
      </div>      

      <div className={styles.postActions}>
        <div className={styles.uploadActions}>

          <ImageUploadButton
            onImageUpload={handleImageUpload}
            disabled={!resolvedUserPublicKey}
            size={isComment ? "small" : undefined}
          />          

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
              className={styles.commentBtn}
            >
                Cancel
            </Button>
            <Button 
                onClick={handleSubmitPost}
                isLoading={loading}
                disabled={
                  (!postText.trim() && uploadedImages.filter((img) => img.url).length === 0) ||
                  disabled ||
                  !resolvedUserPublicKey ||
                  imageLoading
                }                
                variant="primary"
                size="small"
                className={styles.commentBtn}
            >
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
                className={styles.postButton}
              >
                {getButtonText()}
              </Button>  
            </div>
          )
        }
      </div>

      <ImagePreviews
        uploadedImages={uploadedImages}
        onRetryUpload={handleRetryUpload}
        onRemoveImage={handleRemoveImage}
      />

      { quotedPost && (
        <Post
          post={quotedPost?.post}
          username={quotedPost?.username}
          userProfile={quotedPost?.ProfileEntryResponse}
          isQuote={true}
          isStatsDisabled={true}
        />
      )}

    </div>
  );
};