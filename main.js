tsx
import React from 'react';
import { Link } from 'gatsby';
import { StyledHeader, StyledFooter } from '../styled';
import { Logo } from '../shared/logo';
import { Container } from '../styled';
import { AnchorToggle, Close } from './Icons';
import seed from '../assets/images/seed.png';

const Layout = ({ location, title, logo, toggle, isOpen }) => (
  <Container>
    <StyledHeader>
      <Link to="/" title="Screeps Dashboard">
        <Logo logo={logo} aria-hidden="true" />
      </Link>
      <Close onClick={toggle} aria-label="Close menu" />
      <nav>
        <ul>
          <li>
            <Link to="/" title="Dashboard">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/organizations" title="Organizations">
              Organizations
            </Link>
          </li>
        </ul>
      </nav>
      <AnchorToggle />
    </StyledHeader>
    <StyledFooter>
      <div>
        <Link to="https://github.com/tadanobutubutu/screeps" title="GitHub">
          <img src={seed} alt="GitHub" />
        </Link>
      </div>
    </StyledFooter>
  </Container>
);

Layout.defaultProps = {
  location: {
    pathname: '/'
  },
  title: 'Screeps Dashboard',
  logo: '',
  toggle: () => false,
  isOpen: false
};

export default Layout;