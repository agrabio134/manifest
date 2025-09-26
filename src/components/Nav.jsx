  import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
  import { ConnectButton } from '@suiet/wallet-kit';

  const Nav = ({ toggleCart, isNavOpen, toggleNav }) => {
    return (
      <nav>
        
        <div
          className="hamburger"
          onClick={toggleNav}
          aria-label={isNavOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isNavOpen}
        >
          {isNavOpen ? <FaTimes /> : <FaBars />}
        </div>
        <ul className={`nav-menu ${isNavOpen ? 'active' : ''}`}>
          <li><a href="#home" onClick={toggleNav}>Home</a></li>
          <li><a href="#dreams" onClick={toggleNav}>Dreams</a></li>
          <li><a href="#about" onClick={toggleNav}>About</a></li>
          <li><a href="#insights" onClick={toggleNav}>insights</a></li>
          <li>
            <FaShoppingCart className="nav-cart" onClick={toggleCart} aria-label="Open cart" />
          </li>
          <li>
            <ConnectButton className="connect-btn" />
          </li>
        </ul>
      </nav>
    );
  };

  export default Nav;