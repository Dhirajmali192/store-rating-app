import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = {
  admin: [
    { to: '/admin', label: 'Dashboard', icon: '▦', end: true },
    { to: '/admin/users', label: 'Users', icon: '◎' },
    { to: '/admin/stores', label: 'Stores', icon: '◈' },
    { to: '/admin/change-password', label: 'Security', icon: '⬡' },
  ],
  user: [
    { to: '/stores', label: 'Browse Stores', icon: '◈', end: true },
    { to: '/stores/change-password', label: 'Security', icon: '⬡' },
  ],
  store_owner: [
    { to: '/owner', label: 'Dashboard', icon: '▦', end: true },
    { to: '/owner/change-password', label: 'Security', icon: '⬡' },
  ],
};

const roleConfig = {
  admin: { label: 'Administrator', color: '#ff8a8a', bg: 'rgba(255,90,90,0.1)' },
  user: { label: 'User', color: '#8aabff', bg: 'rgba(79,124,255,0.1)' },
  store_owner: { label: 'Store Owner', color: '#22d67a', bg: 'rgba(34,214,122,0.1)' },
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = navItems[user?.role] || [];
  const role = roleConfig[user?.role] || roleConfig.user;

  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = user?.name
    ? user.name.trim().split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
    : '?';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            zIndex: 99, display: 'none'
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: 'var(--bg2)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 100,
        overflowY: 'auto',
      }}>
        {/* Brand */}
        <div style={{
          padding: '20px 20px 18px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <div style={{
            width: 34, height: 34,
            background: 'linear-gradient(135deg, #4f7cff 0%, #7c5cff 100%)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, flexShrink: 0,
          }}>★</div>
          <div>
            <div style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontWeight: 800, fontSize: 16, color: 'var(--text)',
              lineHeight: 1.2
            }}>RateStore</div>
            <div style={{ fontSize: 10, color: 'var(--text2)', fontWeight: 600, letterSpacing: '0.05em' }}>
              PLATFORM
            </div>
          </div>
        </div>

        {/* User profile */}
        <div style={{ padding: '16px 16px 14px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'linear-gradient(135deg, #4f7cff, #7c5cff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, flexShrink: 0, color: '#fff',
            }}>
              {initials}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name}
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
                background: role.bg, color: role.color,
                padding: '2px 7px', borderRadius: 20, marginTop: 2,
              }}>
                {role.label}
              </div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.email}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.08em', padding: '6px 10px 10px', textTransform: 'uppercase' }}>
            Navigation
          </div>
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                borderRadius: 8,
                textDecoration: 'none',
                fontSize: 13.5,
                fontWeight: isActive ? 600 : 500,
                marginBottom: 2,
                color: isActive ? '#fff' : 'var(--text2)',
                background: isActive ? 'var(--accent)' : 'transparent',
                transition: 'all 0.15s',
                boxShadow: isActive ? '0 2px 12px rgba(79,124,255,0.3)' : 'none',
              })}
            >
              <span style={{ fontSize: 15, opacity: 0.8 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '10px 10px 16px' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px',
              borderRadius: 8,
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text2)',
              fontSize: 13.5, fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.target.style.borderColor = 'var(--red)'; e.target.style.color = 'var(--red)'; }}
            onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text2)'; }}
          >
            <span style={{ fontSize: 15 }}>⎋</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{
        marginLeft: 240, flex: 1,
        padding: '36px 40px',
        minHeight: '100vh',
        background: 'var(--bg)',
      }}>
        <Outlet />
      </main>
    </div>
  );
}
