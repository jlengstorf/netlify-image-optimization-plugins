import React from 'react';
import { Link } from 'gatsby';

import './layout.css';

export default ({ children }) => (
  <>
    <header>
      Image Optimization{' '}
      <nav>
        <Link to="/">In JSX</Link> <Link to="/about">In MDX</Link>
      </nav>
    </header>
    <main>{children}</main>
  </>
);
