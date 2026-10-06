import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Layout,
  Menu,
  Avatar,
  Badge,
  Typography,
  Button,
  Drawer,
  theme,
  Divider,
  Space,
} from 'antd';
import {
  DashboardOutlined,
  ApiOutlined,
  HistoryOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';

const { Sider, Header, Content, Footer } = Layout;
const { Text } = Typography;

const pageMeta = {
  '/dashboard':              { title: 'Dashboard',           subtitle: 'Theo dõi hệ thống IoT theo thời gian thực.' },
  '/sensors':                { title: 'Cảm biến',             subtitle: 'Xem dữ liệu đo lường từ các cảm biến.' },
  '/device-control-history': { title: 'Lịch sử điều khiển',  subtitle: 'Theo dõi toàn bộ hoạt động điều khiển thiết bị.' },
  '/profile':                { title: 'Hồ sơ cá nhân',        subtitle: 'Quản lý tài khoản và cài đặt của bạn.' },
};

const navItems = [
  { key: '/dashboard',              label: 'Dashboard',          icon: <DashboardOutlined /> },
  { key: '/sensors',                label: 'Cảm biến',            icon: <ApiOutlined /> },
  { key: '/device-control-history', label: 'Lịch sử điều khiển', icon: <HistoryOutlined /> },
  { key: '/profile',                label: 'Hồ sơ',               icon: <UserOutlined /> },
];

export default function AppLayout() {
  const [collapsed, setCollapsed]   = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [headerAvatar, setHeaderAvatar] = useState(() => localStorage.getItem('nexa_avatar') || '');
  const location  = useLocation();
  const navigate  = useNavigate();
  const { token } = theme.useToken();

  useEffect(() => {
    const handleAvatarChange = () => {
      setHeaderAvatar(localStorage.getItem('nexa_avatar') || '');
    };
    window.addEventListener('nexa-avatar-change', handleAvatarChange);
    return () => window.removeEventListener('nexa-avatar-change', handleAvatarChange);
  }, []);

  const meta = pageMeta[location.pathname] || { title: 'NEXA IoT', subtitle: '' };

  const handleLogout = () => {
    localStorage.removeItem('nexa_auth');
    navigate('/login');
  };

  const menuItems = [
    ...navItems.map((item) => ({
      key:   item.key,
      icon:  item.icon,
      label: item.label,
      onClick: () => { navigate(item.key); setDrawerOpen(false); },
    })),
    { type: 'divider' },
    {
      key:     'logout',
      icon:    <LogoutOutlined />,
      label:   'Đăng xuất',
      danger:  true,
      onClick: handleLogout,
    },
  ];

  /* ── Sidebar nội dung ── */
  const SiderContent = () => (
    <>
      {/* Logo */}
      <div style={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        padding: collapsed ? 0 : '0 20px',
        gap: 10,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        overflow: 'hidden',
        transition: 'all 0.2s',
      }}>
        <ThunderboltOutlined style={{ fontSize: 18, color: token.colorPrimary, flexShrink: 0 }} />
        {!collapsed && (
          <Text strong style={{ fontSize: 14, whiteSpace: 'nowrap' }}>MAI ANH DUC</Text>
        )}
      </div>

      {/* Menu */}
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        inlineCollapsed={collapsed}
        style={{ flex: 1, border: 'none', paddingTop: 8 }}
        items={menuItems}
      />
    </>
  );

  return (
    <Layout style={{ minHeight: '100vh', height: '100vh', overflow: 'hidden' }}>

      {/* ── Desktop Sider ── */}
      <Sider
        collapsed={collapsed}
        collapsedWidth={64}
        width={220}
        theme="light"
        style={{
          borderRight: `1px solid ${token.colorBorderSecondary}`,
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        className="desktop-sider"
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <SiderContent />
        </div>
      </Sider>

      <Layout style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        {/* ── Header ── */}
        <Header style={{
          background: token.colorBgContainer,
          padding: '0 16px',
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          height: 56,
          lineHeight: 'normal',
        }}>
          {/* Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Toggle collapse – desktop */}
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="desktop-toggle"
              style={{ fontSize: 16 }}
            />
            {/* Open drawer – mobile */}
            <Button
              type="text"
              icon={<MenuUnfoldOutlined />}
              onClick={() => setDrawerOpen(true)}
              className="mobile-toggle"
              style={{ fontSize: 16, display: 'none' }}
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, lineHeight: '22px' }}>{meta.title}</div>
              {meta.subtitle && (
                <div style={{ fontSize: 11, color: token.colorTextSecondary, lineHeight: '16px' }}>
                  {meta.subtitle}
                </div>
              )}
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Badge count={3} size="small">
              <Button type="text" shape="circle" icon={<BellOutlined />} />
            </Badge>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar
                src={headerAvatar || undefined}
                style={{ backgroundColor: token.colorPrimary }}
              >
                {!headerAvatar && 'A'}
              </Avatar>
              <div className="header-user-info">
                <div style={{ fontWeight: 600, fontSize: 13, lineHeight: '18px' }}>Admin</div>
                <div style={{ fontSize: 11, color: token.colorTextSecondary, lineHeight: '16px' }}>Super Admin</div>
              </div>
            </div>
          </div>
        </Header>

        {/* ── Content ── */}
        <Content style={{
          flex: 1,
          padding: 16,
          background: token.colorBgLayout,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          minHeight: 0,
        }}>
          <Outlet />
        </Content>

        {/* ── Footer ── */}
        <Footer style={{
          background: token.colorBgContainer,
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          padding: '12px 24px',
          textAlign: 'center',
        }}>
          <Space split={<Divider type="vertical" />} wrap>
            <Text type="secondary" style={{ fontSize: 12 }}>
              © {new Date().getFullYear()} <Text strong style={{ fontSize: 12 }}>NEXA IoT</Text> — Mai Anh Đức
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>Phiên bản 1.0.0</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>Hệ thống quản lý IoT</Text>
          </Space>
        </Footer>
      </Layout>

      {/* ── Mobile Drawer ── */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement="left"
        width={220}
        styles={{ body: { padding: 0 }, header: { display: 'none' } }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <SiderContent />
        </div>
      </Drawer>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sider   { display: none !important; }
          .desktop-toggle  { display: none !important; }
          .mobile-toggle   { display: inline-flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-toggle   { display: none !important; }
          .header-user-info { display: block; }
        }
        @media (max-width: 480px) {
          .header-user-info { display: none; }
        }
      `}</style>
    </Layout>
  );
}
