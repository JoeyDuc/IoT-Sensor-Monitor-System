import { Avatar, Badge } from 'antd';
import { MenuOutlined, BellOutlined, UserOutlined } from '@ant-design/icons';
import './Header.css';

export default function Header({ title, subtitle, onMenuClick }) {
  return (
    <header className="app-header">
      <div className="header-left">
        <button className="header-menu-btn" onClick={onMenuClick} aria-label="Open menu">
          <MenuOutlined />
        </button>
        <div className="header-title-group">
          <h1 className="header-title">{title}</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
      </div>
      <div className="header-right">
        <Badge count={3} size="small" color="var(--color-primary)">
          <button className="header-icon-btn" aria-label="Notifications">
            <BellOutlined />
          </button>
        </Badge>
        <div className="header-user">
          <Avatar
            size={34}
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', color: '#fff', fontSize: '0.875rem', fontWeight: 600 }}
          >
            A
          </Avatar>
          <div className="header-user-info">
            <span className="header-user-name">Admin</span>
            <span className="header-user-role">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
