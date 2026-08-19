import { useState } from 'react';
import { message } from 'antd';
import {
  ThunderboltOutlined,
  DropboxOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import StatCard from '../components/dashboard/StatCard';
import SensorChart from '../components/dashboard/SensorChart';
import DeviceCard from '../components/dashboard/DeviceCard';
import { latestSensorSummary, dashboardChartData } from '../data/sensorData';
import { initialDevices } from '../data/deviceData';
import './DashboardPage.css';

const CHART_COLORS = {
  temperature: '#ef4444',
  humidity: '#3b82f6',
  light: '#f59e0b',
};

export default function DashboardPage() {
  const [devices, setDevices] = useState(initialDevices);
  const [messageApi, contextHolder] = message.useMessage();

  const handleToggle = (deviceId) => {
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id !== deviceId) return d;
        const newStatus = d.status === 'ON' ? 'OFF' : 'ON';
        messageApi.success(`${d.name} turned ${newStatus}`);
        return { ...d, status: newStatus };
      })
    );
  };

  return (
    <div className="dashboard-page page-enter">
      {contextHolder}

      {/* Summary Cards */}
      <section className="dashboard-section">
        <div className="stat-cards-grid">
          <StatCard
            icon={<ThunderboltOutlined />}
            label="Temperature"
            value={latestSensorSummary.temperature.value}
            unit={latestSensorSummary.temperature.unit}
            trend={latestSensorSummary.temperature.trend}
            trendUp={latestSensorSummary.temperature.trendUp}
            color={CHART_COLORS.temperature}
          />
          <StatCard
            icon={<DropboxOutlined />}
            label="Humidity"
            value={latestSensorSummary.humidity.value}
            unit={latestSensorSummary.humidity.unit}
            trend={latestSensorSummary.humidity.trend}
            trendUp={latestSensorSummary.humidity.trendUp}
            color={CHART_COLORS.humidity}
          />
          <StatCard
            icon={<BulbOutlined />}
            label="Light"
            value={latestSensorSummary.light.value}
            unit={latestSensorSummary.light.unit}
            trend={latestSensorSummary.light.trend}
            trendUp={latestSensorSummary.light.trendUp}
            color={CHART_COLORS.light}
          />
        </div>
      </section>

      {/* Charts */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Sensor Readings</h2>
          <span className="section-subtitle">Last 24 hours</span>
        </div>
        <div className="charts-grid">
          <SensorChart
            data={dashboardChartData.temperature}
            title="Temperature"
            color={CHART_COLORS.temperature}
            unit="°C"
          />
          <SensorChart
            data={dashboardChartData.humidity}
            title="Humidity"
            color={CHART_COLORS.humidity}
            unit="%"
          />
          <SensorChart
            data={dashboardChartData.light}
            title="Light Intensity"
            color={CHART_COLORS.light}
            unit="lux"
          />
        </div>
      </section>

      {/* Sensor Control */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Sensor Control</h2>
          <span className="section-subtitle">
            {devices.filter((d) => d.status === 'ON').length} of {devices.length} active
          </span>
        </div>
        <div className="devices-grid">
          {devices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
