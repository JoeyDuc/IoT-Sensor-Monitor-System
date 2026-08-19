import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './AppLayout.css';

const pageMeta = {
  '/dashboard': {
    title: 'Dashboard',
    subtitle: 'Monitor your IoT system in real time.',
  },
  '/sensors': {
    title: 'Sensors',
    subtitle: 'Monitor sensor readings and environmental conditions.',
  },
  '/device-control-history': {
    title: 'Device Control History',
    subtitle: 'Track all device control activities.',
  },
  '/profile': {
    title: 'Profile',
    subtitle: 'Manage your account and preferences.',
  },
};

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const meta = pageMeta[location.pathname] || { title: 'NEXA IoT', subtitle: '' };

  return (
    <div className="app-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-main">
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="app-content">
          <div className="page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
