"use client";

import PropTypes from "prop-types";
import classNames from "classnames";
import styles from "./Dropdown.module.css";

export const Dropdown = ({ children, className = "" }) => {
  return (
    <div className={classNames(styles.dropdown, className)}>
      {children}
    </div>
  );
};

Dropdown.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Dropdown.defaultProps = {
  className: "",
};

