import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div>
      {/* Header Section */}
      <header>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>
      </header>

      {/* Main Content Area */}
      <main>
        {children}  {/* This will render the content passed as a child to the layout */}
      </main>

      {/* Footer Section */}
      <footer>
        <p>&copy; 2024 My Website</p>
      </footer>
    </div>
  );
};

export default Layout;
