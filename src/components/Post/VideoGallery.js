import styles from './Post.module.css';

export const VideoGallery = ({ Body, VideoURLs, showRaw }) => {

  const isCloudflareIframe = (url) => url.includes("iframe.videodelivery.net/");

  // Helper for extracting YouTube IDs
  const getYouTubeId = (url) => {
    if (!url) return null;
    // Covers watch?v=, youtu.be/, shorts/
    const regExp = /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]{11,})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  }

  const extractYouTubeIdsFromText = (text) => {
    if (!text) return [];
    // Match all forms of YouTube URLs (watch, shorts, youtu.be)
    // const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]{11,})/g;
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]{11})/g;
    const ids = [];
    let match;
    while ((match = regex.exec(text))) {
      ids.push(match[1]);
    }
    return ids;
  }

  const extractYouTubeIdsFromUrls = (urls) => {
    if (!Array.isArray(urls)) return [];
    return urls.map(getYouTubeId).filter(Boolean);
  }  

  // Helper
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };  

  const bodyYouTubeIds = extractYouTubeIdsFromText(Body);
  const videoYouTubeIds = extractYouTubeIdsFromUrls(VideoURLs);
  const allYouTubeIds = Array.from(new Set([...bodyYouTubeIds, ...videoYouTubeIds]));

  // Only non-YouTube video URLs (for <video> or iframe if Cloudflare) and valid URLs
  const videoUrlsToRender = Array.isArray(VideoURLs)
    ? VideoURLs.filter(url => isValidUrl(url) && !getYouTubeId(url))
    : [];      

  return (
    <>
        {!showRaw && 
          <>
            {allYouTubeIds.length > 0 && (
              <div className={styles.videoGallery}>
                {allYouTubeIds.map((ytId, idx) => (
                  <iframe
                    key={ytId}
                    src={`https://www.youtube.com/embed/${ytId}`}
                    className={styles.postVideoIframe}
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen
                    loading="lazy"
                    title={`YouTube Video ${idx + 1}`}
                    style={{ width: "100%", aspectRatio: "16/9", border: 0 }}
                  />
                ))}
              </div>
            )}     
          </>      
        }

        {showRaw && (VideoURLs && VideoURLs.length > 0) && (
            <div className={styles.videoGallery}>
            <pre>
                {VideoURLs.map((url) => `${url}\n`).join("")}
            </pre>
            </div>
        )}

        {!showRaw && (
            <>
            {videoUrlsToRender && videoUrlsToRender.length > 0 && (
                <div className={styles.videoGallery}>
                    {videoUrlsToRender.map((url, index) =>
                    isCloudflareIframe(url) ? (
                        <iframe
                        key={index}
                        src={url}
                        className={styles.postVideoIframe}
                        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                        allowFullScreen
                        loading="lazy"
                        title={`Video ${index + 1}`}
                        style={{ width: "100%", aspectRatio: "16/9", border: 0 }}
                        />
                    ) : (
                        <video
                        key={index}
                        src={url}
                        controls
                        className={styles.postVideo}
                        preload="metadata"
                        >
                        Your browser does not support the video tag.
                        </video>
                    )
                    )}
                </div>
            )}   
            </>          
        )}

    </>
  );
};
