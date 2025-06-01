"use client";

import PropTypes from 'prop-types';
import Link from 'next/link';
import styles from './Button.module.css';
import classNames from 'classnames';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  isLoading = false,
  icon = null,
  trailingIcon = null,
  href = null,
  as = null,
  onClick,
  ...props
}) => {
  const buttonClasses = classNames(
    styles.button,
    styles[variant],
    styles[size],
    { 
      [styles.loading]: isLoading,
      [styles.disabled]: disabled || isLoading // ✨ Add disabled class for visual styling
    }
  );

  const content = (
    <>
      {isLoading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        icon && <span className={styles.icon}>{icon}</span>
      )}
      <span className={styles.label}>{children}</span>
      {!isLoading && trailingIcon && (
        <span className={styles.icon}>{trailingIcon}</span>
      )}
    </>
  );

  // Render as Link if href is provided
  if (href) {
    const handleLinkClick = (e) => {
      // Prevent navigation if disabled or loading
      if (disabled || isLoading) {
        e.preventDefault();
        return;
      }
      
      // Call custom onClick if provided
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <Link 
        href={disabled || isLoading ? '#' : href} // ✨ Use '#' for disabled links
        className={buttonClasses}
        onClick={handleLinkClick}
        aria-disabled={disabled || isLoading} // ✨ Accessibility
        {...props}
      >
        {content}
      </Link>
    );
  }

  // Render as custom element if 'as' is provided
  if (as) {
    const Component = as;
    const handleCustomClick = (e) => {
      // Prevent action if disabled or loading
      if (disabled || isLoading) {
        e.preventDefault();
        return;
      }
      
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <Component 
        className={buttonClasses}
        onClick={handleCustomClick}
        aria-disabled={disabled || isLoading} // ✨ Accessibility
        role="button"
        tabIndex={disabled || isLoading ? -1 : 0} // ✨ Keyboard navigation
        {...props}
      >
        {content}
      </Component>
    );
  }

  // Default: render as button
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || isLoading} // ✨ Only buttons get the disabled attribute!
      onClick={onClick}
      {...props}
    >
      {content}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  icon: PropTypes.node,
  trailingIcon: PropTypes.node,
  href: PropTypes.string,    
  as: PropTypes.elementType,    
};

Button.defaultProps = {
  type: 'button',
  variant: 'primary',
  size: 'medium',
  disabled: false,
  isLoading: false,
  icon: null,
  trailingIcon: null,
  href: null,
  as: null,
};