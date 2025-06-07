import styles from './Post.module.css';

export const ImageGallery = ({ ImageURLs = [], showRaw = false }) => {
  if (!ImageURLs || ImageURLs.length === 0) return null;

  return (
    <div className={styles.imageGallery}>
      {showRaw ? (
        <pre>
          {ImageURLs.map((url) => `${url}\n`).join('')}
        </pre>
      ) : (
        <>
          {ImageURLs.map((url, index) => (
            <img
              key={url || index}
              src={url}
              alt={`Post image ${index + 1}`}
              className={styles.postImage}
              loading="lazy"
            />
          ))}
        </>
      )}
    </div>
  );
};
