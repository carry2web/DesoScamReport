import React from "react";
import styles from "./Post.module.css"; // Or pass className if you want

// --- Provider Detection/Parsing ---
const parseYoutube = url => {
  const match = url.match(/^.*(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([A-Za-z0-9_-]{11}).*/);
  return match ? match[1] : null;
};

const parseVimeo = url => {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
};

const parseGiphy = url => {
  const match = url.match(/giphy\.com\/(?:gifs|media|embed|clips)\/([A-Za-z0-9]+)/);
  return match ? match[1] : null;
};

const parseSpotify = url => {
  const match = url.match(/open\.spotify\.com\/(track|artist|playlist|album|episode|show)\/([A-Za-z0-9]+)/);
  if (!match) return null;
  // Podcasts use 'embed-podcast', others use 'embed'
  const type = ["episode", "show"].includes(match[1]) ? "embed-podcast" : "embed";
  return `${type}/${match[1]}/${match[2]}`;
};

const parseSoundcloud = url => {
  // SoundCloud embeds just use the original URL as a param
  return url.includes("soundcloud.com/") ? url : null;
};

const parseTwitch = url => {
  // Twitch supports several URL forms, only supporting main channel/clip/video here for simplicity
  // Channel: twitch.tv/CHANNEL
  let match = url.match(/twitch\.tv\/([A-Za-z0-9_]+)/);
  if (match) return { type: "channel", value: match[1] };
  // Video: twitch.tv/videos/123456789
  match = url.match(/twitch\.tv\/videos\/(\d+)/);
  if (match) return { type: "video", value: match[1] };
  // Clip: clips.twitch.tv/CLIPID
  match = url.match(/clips\.twitch\.tv\/([A-Za-z0-9_-]+)/);
  if (match) return { type: "clip", value: match[1] };
  return null;
};

const parseTikTok = url => {
  // Matches /video/1234567890 or /embed/v2/1234567890
  const match = url.match(/tiktok\.com\/(?:@[\w.-]+\/video\/|embed\/v2\/)(\d+)/);
  return match ? match[1] : null;
};

const parseMousai = url => {
  // Mousai supports: mousai.stream/album/ID, mousai.stream/track/ID, etc.
  const match = url.match(/mousai\.stream\/((album|track|playlist)\/[0-9]+(?:\/[a-z0-9-_,#%]+)*)/);
  return match ? match[1] : null;
};

const parseLivepeerTv = url => {
  try {
    const u = new URL(url);
    return u.hostname === "lvpr.tv" && u.searchParams.has("v");
  } catch {
    return false;
  }
};

const parseCloudflare = url => url.includes("iframe.videodelivery.net/");

// --- Main Component ---
export const EmbedMedia = ({ url, className, style }) => {
  if (!url) return null;

  // --- YouTube ---
  const ytId = parseYoutube(url);
  if (ytId) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${ytId}`}
        className={className || styles.postVideoIframe}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        title="YouTube Video"
        style={{ width: "100%", aspectRatio: "16/9", border: 0, ...style }}
      />
    );
  }

  // --- Vimeo ---
  const vimeoId = parseVimeo(url);
  if (vimeoId) {
    return (
      <iframe
        src={`https://player.vimeo.com/video/${vimeoId}`}
        className={className || styles.postVideoIframe}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        loading="lazy"
        title="Vimeo Video"
        style={{ width: "100%", aspectRatio: "16/9", border: 0, ...style }}
      />
    );
  }

  // --- Giphy ---
  const giphyId = parseGiphy(url);
  if (giphyId) {
    return (
      <iframe
        src={`https://giphy.com/embed/${giphyId}`}
        className={className || styles.postVideoIframe}
        allowFullScreen
        loading="lazy"
        title="Giphy"
        style={{ width: "100%", aspectRatio: "16/9", border: 0, ...style }}
      />
    );
  }

// --- Spotify ---
let spotifyEmbedSrc = null;
const spotifyPath = parseSpotify(url);
if (spotifyPath) {
  spotifyEmbedSrc = `https://open.spotify.com/${spotifyPath}`;
} else if (url.match(/^https:\/\/open\.spotify\.com\/embed\//)) {
  spotifyEmbedSrc = url;
}

// Height logic per Spotify docs (track/playlist/album/podcast)
function getSpotifyHeight(embedSrc) {
  if (!embedSrc) return 80;
  if (embedSrc.includes("embed-podcast")) return 232;
  if (embedSrc.includes("playlist") || embedSrc.includes("album")) return 352;
  if (embedSrc.includes("track")) return 152; // Or 80 for extra compact
  return 80;
}

if (spotifyEmbedSrc) {
  return (
    <iframe
      src={spotifyEmbedSrc}
      width="100%"
      height={getSpotifyHeight(spotifyEmbedSrc)}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      title="Spotify"
      className={className}
      style={{
        border: 0,
        borderRadius: 12,
        overflow: "hidden",
        ...style,
      }}
    />
  );
}



  // --- SoundCloud ---
  const soundcloudUrl = parseSoundcloud(url);
  if (soundcloudUrl) {
    return (
      <iframe
        width="100%"
        height="166"
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
          soundcloudUrl
        )}&color=%2300aabb&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=false`}
        style={style}
        className={className}
        loading="lazy"
        title="SoundCloud"
      />
    );
  }

  // --- Twitch ---
  const twitch = parseTwitch(url);
  if (twitch) {
    let embedSrc = "";
    const parent =
      typeof window !== "undefined"
        ? window.location.hostname
        : "localhost";
    if (twitch.type === "channel") {
      embedSrc = `https://player.twitch.tv/?channel=${twitch.value}&parent=${parent}`;
    } else if (twitch.type === "video") {
      embedSrc = `https://player.twitch.tv/?video=${twitch.value}&parent=${parent}`;
    } else if (twitch.type === "clip") {
      embedSrc = `https://clips.twitch.tv/embed?clip=${twitch.value}&parent=${parent}`;
    }
    return (
      <iframe
        src={embedSrc}
        height={twitch.type === "clip" ? 360 : 378}
        width="100%"
        frameBorder="0"
        allowFullScreen
        scrolling="no"
        className={className}
        loading="lazy"
        title="Twitch"
        style={style}
      />
    );
  }

  // --- TikTok ---
  const tikTokId = parseTikTok(url);
  if (tikTokId) {
    return (
      <iframe
        src={`https://www.tiktok.com/embed/v2/${tikTokId}`}
        width="325"
        height="700"
        allowFullScreen
        loading="lazy"
        title="TikTok"
        className={className}
        style={style}
      />
    );
  }

  // --- Mousai ---
  const mousaiPath = parseMousai(url);
  if (mousaiPath) {
    return (
      <iframe
        src={`https://mousai.stream/${mousaiPath}/embed`}
        width="100%"
        height="165"
        frameBorder="0"
        allow="autoplay"
        style={style}
        className={className}
        loading="lazy"
        title="Mousai"
      />
    );
  }

  // --- Livepeer.tv ---
  if (parseLivepeerTv(url)) {
    return (
      <iframe
        src={url}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        loading="lazy"
        title="Livepeer.tv"
        className={className || styles.postVideoIframe}
        style={{ width: "100%", aspectRatio: "16/9", border: 0, ...style }}
      />
    );
  }

  // --- Cloudflare Iframe ---
  if (parseCloudflare(url)) {
    return (
      <iframe
        src={url}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        loading="lazy"
        title="Cloudflare Stream"
        className={className || styles.postVideoIframe}
        style={{ width: "100%", aspectRatio: "16/9", border: 0, ...style }}
      />
    );
  }

  // --- Unknown/fallback ---
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
      {url}
    </a>
  );
};
