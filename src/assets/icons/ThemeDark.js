import PropTypes from "prop-types";
import React from "react";

export const ThemeDark = ({ className, color, label }) => {

  // Apply inline style only if color prop is not currentColor
  const style = color !== "currentColor" ? { color } : undefined;

  return (
    <svg 
      className={className} 
      role="img"
      aria-label={label}
      style={style}   
      xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512" fill="none"
    >
      <path d="M195 125c0-26.3 5.3-51.3 14.9-74.1C118.7 73 51 155.1 51 253c0 114.8 93.2 208 208 208 97.9 0 180-67.7 202.1-158.9-22.8 9.6-47.9 14.9-74.1 14.9-106 0-192-86-192-192z" fill="currentColor"/>
    </svg>    
  );
};

ThemeDark.propTypes = {
  color: PropTypes.string,
  label: PropTypes.string,
};

ThemeDark.defaultProps = {
  color: 'currentColor'
};