import PropTypes from "prop-types";
import React from "react";

export const DefaultAvatar = ({ className, color, label }) => {
  const style = color !== "currentColor" ? { color } : undefined;

  return (
    <svg
      className={className}
      role="img"
      aria-label={label}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Head */}
      <circle fill="currentColor" cx="12" cy="8" r="5" />

      {/* Shoulders / body */}
      <path fill="currentColor" d="M4 20c0-3.5 4-5.5 8-5.5s8 2 8 5.5v1H4v-1z" />
    </svg>
  );
};

DefaultAvatar.propTypes = {
  color: PropTypes.string,
  label: PropTypes.string,
};

DefaultAvatar.defaultProps = {
  color: "currentColor",
};
