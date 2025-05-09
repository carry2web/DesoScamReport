"use client";

import { avatarUrl } from "@/utils/profileUtils";
import { DefaultAvatar } from "@/assets/icons";
import styles from "./Avatar.module.css";

export const Avatar = ({ profile, size = "medium", className = "" }) => {
  const avatar = avatarUrl(profile);

  const sizePx =
    typeof size === "number"
      ? size
      : size === "small"
      ? 30
      : size === "large"
      ? 64
      : 40; // default: medium (40px)

  return (
    <div
      className={`${styles.avatarFrame} ${className}`}
      style={{ width: sizePx, height: sizePx }}
    >
      {avatar ? (
        <img
          src={avatar}
          alt="User avatar"
          className={styles.avatarImage}
          width={sizePx}
          height={sizePx}
        />
      ) : (
        <div className={styles.fallbackAvatar}>
          <DefaultAvatar />
        </div>
      )}
    </div>
  );
};
