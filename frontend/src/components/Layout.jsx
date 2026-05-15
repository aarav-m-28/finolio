import React from 'react';
import Sidebar from './Sidebar';

function Layout({ children, onLogout }) {
  return (
    <div className="app-container">
      <Sidebar onLogout={onLogout} />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}

export default Layout;
