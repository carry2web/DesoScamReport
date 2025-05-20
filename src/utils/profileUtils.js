import { DESO_API_BASE, DESO_WEB_BASE } from "@/config/desoConfig";

const DEFAULT_AVATAR_FALLBACK = `${DESO_WEB_BASE}/assets/img/default_profile_pic.png`

export const avatarUrl = (Profile) => {
  if (!Profile?.PublicKeyBase58Check) return null;

  if (Profile.ExtraData?.LargeProfilePicURL) {
    return Profile.ExtraData.LargeProfilePicURL;
  }

  if (Profile.ExtraData?.NFTProfilePictureUrl) {
    return Profile.ExtraData.NFTProfilePictureUrl;
  }

  // include fallback url for profile image
  return `${DESO_API_BASE}/get-single-profile-picture/${Profile.PublicKeyBase58Check}?fallback=${DEFAULT_AVATAR_FALLBACK}`;
};
  
export function isMaybePublicKey(pk) {
  if (typeof pk !== 'string') return false;
  return pk.startsWith('BC') && pk.length === 55;
}