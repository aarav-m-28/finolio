import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PiggyBank, Users, CalendarClock, LogOut, Wallet } from 'lucide-react';

function Sidebar({ onLogout }) {
  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Savings Goals', path: '/savings', icon: <PiggyBank size={20} /> },
    { name: 'Split Bills', path: '/splits', icon: <Users size={20} /> },
    { name: 'Recurring', path: '/recurring', icon: <CalendarClock size={20} /> },
  ];

  return (
    <div className="sidebar">
      <div className="brand">
        <Wallet color="#38bdf8" size={32} />
        WealthPro
      </div>
      
      <div className="nav-links" style={{ flex: 1, marginTop: '2rem' }}>
        {links.map((link) => (
          <NavLink 
            key={link.name} 
            to={link.path}
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          >
            {link.icon}
            {link.name}
          </NavLink>
        ))}
      </div>

      <div 
        className="nav-item" 
        style={{ cursor: 'pointer', color: '#f87171' }}
        onClick={onLogout}
      >
        <LogOut size={20} />
        Sign Out
      </div>
    </div>
  );
}

export default Sidebar;
