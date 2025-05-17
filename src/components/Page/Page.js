import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './Page.module.css';

export const Page = ({ children, className = '', noPadding = false }) => {
  return (
    <div
      className={classNames(styles.page, { [styles.noPadding]: noPadding }, className)}
    >
      {children}
    </div>
  );
};

Page.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  noPadding: PropTypes.bool,
};
