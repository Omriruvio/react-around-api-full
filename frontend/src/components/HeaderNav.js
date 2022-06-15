import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import hamburgerIcon from '../images/hamburger.svg';
import closeButton from '../images/add-close-button.svg';
import CurrentUserContext from '../contexts/CurrentUserContext';

const HeaderNav = (props) => {
  const { isLoggedIn, handleLogout, handleHamburgerClick, isDropDownOpen, isMobileSized } = props;
  const currentPath = useLocation().pathname;
  const linkTo = currentPath === '/signin' ? '/signup' : '/signin';
  const linkText = linkTo === '/signin' ? 'Log in' : 'Sign up';
  const currentUser = React.useContext(CurrentUserContext);

  return isMobileSized && isLoggedIn ? (
    <img
      style={{ cursor: 'pointer' }}
      onClick={handleHamburgerClick}
      className={isDropDownOpen ? 'header__nav-link header__nav-link_type_close' : 'header__nav-link'}
      src={isDropDownOpen ? closeButton : hamburgerIcon}
      alt={isDropDownOpen ? 'close icon' : 'hamburger style menu icon'}
    ></img>
  ) : isLoggedIn ? (
    <div className="header__nav-wrapper">
      <span className="header__user-email">{currentUser.email}</span>
      <div className="header__nav-link" onClick={handleLogout}>
        <Link to={'/signin'} style={{ color: '#A9A9A9', textDecoration: 'inherit' }}>
          {'Log out'}
        </Link>
      </div>
    </div>
  ) : (
    <span className="header__nav-link">
      <Link to={linkTo} style={{ color: 'inherit', textDecoration: 'inherit' }}>
        {linkText}
      </Link>
    </span>
  );
};

export default HeaderNav;
