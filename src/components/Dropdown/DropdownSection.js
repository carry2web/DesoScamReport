"use client";

import PropTypes from "prop-types";
import classNames from "classnames";
import styles from "./Dropdown.module.css";

export const DropdownSection = ({ children, label, className = "" }) => {
  return (
    <div className={classNames(styles.section, className)}>
      {label && <div className={styles.sectionLabel}>{label}</div>}
      <div className={styles.sectionItems}>{children}</div>
    </div>
  );
};

DropdownSection.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
};
