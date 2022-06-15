import logo from '../images/logo.svg';
import HeaderNav from './HeaderNav';
import { Link } from 'react-router-dom';

export default function Header(props) {
  return (
    <header className="header">
      <Link to="/">
        <img src={logo} alt="text logo around the us" className="header__logo" />
      </Link>
      <HeaderNav {...props} />
    </header>
  );
}
