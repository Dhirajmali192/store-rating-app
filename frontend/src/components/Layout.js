import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = {
  admin: [
    { to: '/admin', label: '⊞ Dashboard', end: true },
    { to: '/admin/users', label: '👥 Users' },
    { to: '/admin/stores', label: '🏪 Stores' },
    { to: '/admin/change-password', label: '🔑 Change Password' },
  ],
  user: [
    { to: '/stores', label: '🏪 Stores', end: true },
    { to: '/stores/change-password', label: '🔑 Change Password' },
  ],
  store_owner: [
    { to: '/owner', label: '📊 Dashboard', end: true },
    { to: '/owner/change-password', label: '🔑 Change Password' },
  ],
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = navItems[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabel = { admin: 'Administrator', user: 'User', store_owner: 'Store Owner' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: 'var(--bg2)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ padding: '0 20px 28px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--accent2)' }}>
            ★ RateStore
          </div>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>
            {roleLabel[user?.role]}
          </div>
        </div>

        {/* User info */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ 
            width: 40, height: 40, borderRadius: '50%', 
            background: 'var(--accent)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 16, marginBottom: 8
          }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text2)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.email}</div>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                display: 'block',
                padding: '10px 12px',
                borderRadius: 8,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 500,
                marginBottom: 4,
                color: isActive ? '#fff' : 'var(--text2)',
                background: isActive ? 'var(--accent)' : 'transparent',
                transition: 'all 0.15s',
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '0 12px' }}>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: 240, flex: 1, padding: '32px', minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  );
}
