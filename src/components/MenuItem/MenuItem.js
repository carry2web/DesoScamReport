"use client";

import PropTypes from "prop-types";
import classNames from "classnames";
import styles from "./MenuItem.module.css";

export const MenuItem = ({
  children,
  size = "medium",
  icon = null,
  trailingIcon = null,
  checked = false,
  disabled = false,
  variant = "default",
  onClick
}) => {
  return (
    <div
      className={classNames(
        styles.menuItem,
        styles[size],
        styles[variant],
        {
          [styles.disabled]: disabled,
          [styles.checked]: checked,
        }
      )}
      onClick={disabled ? undefined : onClick}
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.label}>{children}</span>
      {trailingIcon && <span className={styles.trailingIcon}>{trailingIcon}</span>}
    </div>
  );
};

MenuItem.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  icon: PropTypes.node,
  trailingIcon: PropTypes.node,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'danger']),
  onClick: PropTypes.func,
};

MenuItem.defaultProps = {
  size: "medium",
  icon: null,
  trailingIcon: null,
  checked: false,
  disabled: false,
  variant: "default",
  onClick: undefined,
};
