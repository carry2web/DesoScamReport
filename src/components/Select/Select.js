"use client";

import PropTypes from "prop-types";
import classNames from "classnames";
import styles from "./Select.module.css";

export const Select = ({
  value,
  onChange,
  options,
  placeholder,
  size = "medium",
  error = false,
  disabled = false,
  name,
  ...props
}) => {
  return (
    <div
      className={classNames(
        styles.container,
        styles[size],
        { [styles.error]: error, [styles.disabled]: disabled }
      )}
    >
      <select
        className={styles.select}
        value={value}
        onChange={onChange}
        disabled={disabled}
        name={name}
        {...props}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

Select.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  placeholder: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  name: PropTypes.string,
};

Select.defaultProps = {
  placeholder: "",
  size: "medium",
  error: false,
  disabled: false,
  name: undefined,
};

