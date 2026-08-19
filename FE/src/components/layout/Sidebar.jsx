import { NavLink, useNavigate } from 'react-router-dom';
import { Drawer } from 'antd';
import {
  DashboardOutlined,
  ApiOutlined,
  HistoryOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
  { path: '/sensors', label: 'Sensors', icon: <ApiOutlined /> },
  { path: '/device-control-history', label: 'Control History', icon: <HistoryOutlined /> },
  { path: '/profile', label: 'Profile', icon: <UserOutlined /> },
];

function SidebarContent({ onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('nexa_auth');
    navigate('/login');
    if (onClose) onClose();
  };

  return (
    <div className="sidebar-inner">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <ThunderboltOutlined />
        </div>
        <span className="sidebar-logo-text">MAI ANH DUC</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <p className="sidebar-section-label">Main Menu</p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'sidebar-nav-item--active' : ''}`
            }
            onClick={onClose}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span className="sidebar-nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="sidebar-bottom">
        <div className="sidebar-divider" />
        <button className="sidebar-action-btn">
          <span className="sidebar-nav-icon"><SettingOutlined /></span>
          <span className="sidebar-nav-label">Settings</span>
        </button>
        <button className="sidebar-action-btn sidebar-action-btn--logout" onClick={handleLogout}>
          <span className="sidebar-nav-icon"><LogoutOutlined /></span>
          <span className="sidebar-nav-label">Logout</span>
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sidebar-desktop">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <Drawer
        open={open}
        onClose={onClose}
        placement="left"
        width={248}
        styles={{ body: { padding: 0, background: '#fff' }, header: { display: 'none' } }}
        className="sidebar-drawer"
      >
        <SidebarContent onClose={onClose} />
      </Drawer>
    </>
  );
}
