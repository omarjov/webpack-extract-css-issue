import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import styles from './Card.module.scss';

const defaultProps = {
  variant: '',
};

const Card = ({ children, variant, className, ...otherProps }) => {
  let classes = classNames(className, styles.card);

  if (variant === 'rounded') {
    classes = classNames(className, styles.rounded);
  }

  return (
    <div className={classes} {...otherProps}>
      {children}
    </div>
  );
};

Card.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  variant: PropTypes.string
};

Card.defaultProps = defaultProps;

export default Card;
