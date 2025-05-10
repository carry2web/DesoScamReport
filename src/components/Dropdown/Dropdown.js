// "use client";

import PropTypes from "prop-types";
import classNames from "classnames";
import styles from "./Dropdown.module.css";

export const Dropdown = ({ children, className = "", style = {}, maxHeight }) => {
  const combinedStyle = {
    ...style,
    ...(maxHeight ? { maxHeight, overflowY: "auto" } : {}),
  };

  return (
    <div className={classNames(styles.dropdown, className)} style={combinedStyle}>
      {children}
    </div>
  );
};

Dropdown.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Dropdown.defaultProps = {
  className: "",
  style: {},
  maxHeight: undefined,
};


// // "use client";

// import PropTypes from "prop-types";
// import classNames from "classnames";
// import styles from "./Dropdown.module.css";

// export const Dropdown = ({ children, className = "" }) => {
//   return (
//     <div className={classNames(styles.dropdown, className)}>
//       {children}
//     </div>
//   );
// };

// Dropdown.propTypes = {
//   children: PropTypes.node.isRequired,
//   className: PropTypes.string,
// };

// Dropdown.defaultProps = {
//   className: "",
// };

