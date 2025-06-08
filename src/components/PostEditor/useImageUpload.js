import { useState } from 'react';
import { useDeSoApi } from "@/api/useDeSoApi";
import { useToast } from "@/hooks/useToast";

export const useImageUpload = ({ userPublicKey, getJWT }) => {
  const [imageLoading, setImageLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  
  const { uploadImage } = useDeSoApi();
  const { showErrorToast } = useToast();

  // Get successfully uploaded image URLs
  const successfulImageUrls = uploadedImages
    .filter((img) => img.status === "success")
    .map((img) => img.url);

  // Load existing images (for edit mode)
  const loadExistingImages = (imageUrls) => {
    if (!imageUrls?.length) {
      setUploadedImages([]);
      return;
    }
    
    const existingImages = imageUrls.map((url) => ({
      id: crypto.randomUUID(),
      file: null,
      url: url,
      status: "success",
      errorMessage: null
    }));
    setUploadedImages(existingImages);
  };

  // Clear all images
  const clearImages = () => {
    setUploadedImages([]);
  };

  // Upload files helper
  const uploadFiles = async (files) => {
    if (!files.length) return;

    const newItems = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      url: null,
      status: "uploading",
      errorMessage: null
    }));

    setUploadedImages((prev) => [...prev, ...newItems]);

    const jwt = await getJWT();
    
    if (!jwt || !userPublicKey) {
      showErrorToast("Missing auth data. Please login again.");
      return;
    }

    setImageLoading(true);

    const results = await Promise.allSettled(
      newItems.map(async (item) => {
        try {
          const result = await uploadImage({
            imageFile: item.file,
            userPublicKey,
            jwt,
          });

          setUploadedImages((prev) =>
            prev.map((img) =>
              img.id === item.id
                ? result.success
                  ? { ...img, url: result.data.ImageURL, status: "success" }
                  : { ...img, status: "error", errorMessage: result.error || "Upload failed" }
                : img
            )
          );

          return { success: result.success, fileName: item.file.name, error: result.error };
        } catch (err) {
          const errorMessage = err?.message || "Upload failed";
          
          setUploadedImages((prev) =>
            prev.map((img) =>
              img.id === item.id ? { ...img, status: "error", errorMessage } : img
            )
          );

          return { success: false, fileName: item.file.name, error: errorMessage };
        }
      })
    );

    setImageLoading(false);

    // Show toast for failed uploads
    const failedUploads = results
      .map(result => result.value)
      .filter(result => result && !result.success);

    if (failedUploads.length > 0) {
      if (failedUploads.length === 1) {
        const failed = failedUploads[0];
        showErrorToast(`Failed to upload "${failed.fileName}": ${failed.error}`);
      } else {
        showErrorToast(`Failed to upload ${failedUploads.length} image${failedUploads.length > 1 ? 's' : ''}`);
      }
    }
  };

  // Handle file input uploads
  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    await uploadFiles(files);
  };

  // Handle paste uploads (including GIF URLs)
  const handlePaste = async (event) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    // Check for image files first (direct paste)
    const imageItems = Array.from(items).filter(
      (item) => item.kind === "file" && item.type.startsWith("image/")
    );

    if (imageItems.length > 0) {
      const files = imageItems.map((item) => item.getAsFile()).filter(Boolean);
      await uploadFiles(files);
      return;
    }

    // Check for text that might contain GIF URLs
    const textItems = Array.from(items).filter(
      (item) => item.kind === "string" && item.type === "text/plain"
    );

    if (textItems.length > 0) {
      textItems[0].getAsString(async (text) => {
        await handlePastedText(text);
      });
    }
  };

  // Handle pasted text (look for GIF URLs)
  const handlePastedText = async (text) => {
    const trimmedText = text.trim();
    
    // Check if it's a GIF URL
    const isGifUrl = /^https?:\/\/.*\.(gif|webp)(\?.*)?$/i.test(trimmedText) ||
                     /tenor\.com|giphy\.com|media\.discordapp\.net/i.test(trimmedText);
    
    if (!isGifUrl) return;

    try {
      // Download the GIF as a blob
      const response = await fetch(trimmedText);
      if (!response.ok) {
        showErrorToast("Failed to download GIF");
        return;
      }

      const blob = await response.blob();
      
      // Check if it's actually an image
      if (!blob.type.startsWith('image/')) {
        showErrorToast("URL does not contain a valid image");
        return;
      }

      // Create a File object from the blob
      const fileName = `gif-${Date.now()}.${blob.type.split('/')[1] || 'gif'}`;
      const file = new File([blob], fileName, { type: blob.type });

      // Upload using existing logic
      await uploadFiles([file]);
      
    } catch (error) {
      console.error('Error downloading GIF:', error);
      showErrorToast("Failed to download GIF from URL");
    }
  };

  // Retry failed upload
  const handleRetryUpload = async (item) => {
    setUploadedImages((prev) =>
      prev.map((img) =>
        img.id === item.id ? { ...img, status: "uploading" } : img
      )
    );

    const jwt = await getJWT();

    try {
      const result = await uploadImage({
        imageFile: item.file,
        userPublicKey,
        jwt,
      });

      if (result.success) {
        setUploadedImages((prev) =>
          prev.map((img) =>
            img.id === item.id
              ? { ...img, url: result.data.ImageURL, status: "success", errorMessage: null }
              : img
          )
        );
      } else {
        const errorMessage = result.error || "Retry failed";
        setUploadedImages((prev) =>
          prev.map((img) =>
            img.id === item.id ? { ...img, status: "error", errorMessage } : img
          )
        );
        showErrorToast(`Retry failed for "${item.file.name}": ${errorMessage}`);
      }
    } catch (error) {
      const errorMessage = error?.message || "Retry failed";
      setUploadedImages((prev) =>
        prev.map((img) =>
          img.id === item.id ? { ...img, status: "error", errorMessage } : img
        )
      );
      showErrorToast(`Retry failed for "${item.file.name}": ${errorMessage}`);
    }
  };

  // Remove image by ID
  const handleRemoveImage = (id) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };

  // Handle drag and drop (including GIF URLs)
  const handleDrop = async (event) => {
    event.preventDefault();
    
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      // Handle dropped files
      await uploadFiles(files);
      return;
    }

    // Handle dropped URLs
    const text = event.dataTransfer.getData('text/plain');
    if (text) {
      await handlePastedText(text);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return {
    // State
    imageLoading,
    uploadedImages,
    successfulImageUrls,
    
    // Actions
    handleImageUpload,
    handlePaste,
    handlePastedText,
    handleDrop,
    handleDragOver,
    handleRetryUpload,
    handleRemoveImage,
    loadExistingImages,
    clearImages,
  };
};