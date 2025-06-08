import { Images as ImagesIcon } from '@/assets/icons';
import classNames from 'classnames';
import styles from "./ImageUpload.module.css";

// Upload Button Component
export const ImageUploadButton = ({
  onImageUpload,
  disabled = false,
  size = undefined,
}) => {
  return (
    <div className={styles.uploadContainer}>
        <label className={classNames(styles.uploadIconButton, {
            [styles.disabledUploadIconButton]: disabled,
            [styles.smallUploadIconButton]: size === "small",
        })}>
            <input
                type="file"
                accept="image/*"
                multiple
                onChange={onImageUpload}
                disabled={disabled}
                className={styles.hiddenFileInput}
            />
            <ImagesIcon className={styles.uploadIcon} />
        </label>
    </div>
  );
};

// Image Previews Component
export const ImagePreviews = ({
  uploadedImages,
  onRetryUpload,
  onRemoveImage,
}) => {
  if (uploadedImages.length === 0) return null;

  return (
    <div className={styles.attachedImagesContainer}>
      {uploadedImages.map((img) => (
        <div key={img.id} className={styles.previewImageContainer}>
          {/* Thumbnail */}
          {img.status === "success" && img.url && (
            <img 
              src={img.url} 
              alt={`Uploaded image ${img.id}`} 
              className={styles.previewImage} 
            />
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
                onClick={() => onRetryUpload(img)}
                title={img.errorMessage ? `Error: ${img.errorMessage}\nClick to retry` : "Click to retry"}
              >
                🔁
              </button>
            </div>
          )}

          {/* Remove Button */}
          <button
            onClick={() => onRemoveImage(img.id)}
            className={styles.removeImageButton}
            title="Remove image"
            disabled={img.status === "uploading"}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};