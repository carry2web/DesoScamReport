"use client";

import classNames from "classnames";
import styles from "./Placeholder.module.css";

export const Placeholder = ({
  width,
  height,
  borderRadius,
  style,
  className,
}) => {
  const customStyle = {
    width: width || "100%",
    height: height || "100%",
    borderRadius: borderRadius || "var(--radius-md)",
    ...style,
  };

  return (
    <div
      className={classNames(styles.placeholder, className)}
      style={customStyle}
    />
  );
};
