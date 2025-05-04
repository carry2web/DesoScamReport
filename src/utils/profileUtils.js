import { DESO_API_BASE } from "@/config/desoConfig";

export const avatarUrl = (Profile) => {
  if (!Profile?.PublicKeyBase58Check) return null;

  if (Profile.ExtraData?.LargeProfilePicURL) {
    return Profile.ExtraData.LargeProfilePicURL;
  }

  if (Profile.ExtraData?.NFTProfilePictureUrl) {
    return Profile.ExtraData.NFTProfilePictureUrl;
  }

  return `${DESO_API_BASE}/get-single-profile-picture/${Profile.PublicKeyBase58Check}`;
};
  
export function isMaybePublicKey(pk) {
  return pk.startsWith('BC') && pk.length === 55;
}