"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styles from "./PublicKeyDisplay.module.css";

export const PublicKeyDisplay = ({ value, label, charsStart = 6, charsEnd = 6, className = "", align = "start" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const displayText = label || `${value.slice(0, charsStart)}...${value.slice(-charsEnd)}`;

  return (
    <span className={classNames(styles.wrapper, styles[align], className)}>
      <span className={styles.text}>{displayText}</span>
      <button
        onClick={handleCopy}
        className={styles.copyButton}
        title="Copy public key"
      >
        {copied ? <span className={styles.icon}>✅</span> : <span className={styles.icon}>⧉</span>}
      </button>
    </span>
  );
};

PublicKeyDisplay.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string,
  charsStart: PropTypes.number,
  charsEnd: PropTypes.number,
  className: PropTypes.string,
  align: PropTypes.oneOf(["start", "center", "end"]),
};
