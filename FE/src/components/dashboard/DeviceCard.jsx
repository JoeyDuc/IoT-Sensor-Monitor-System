import { Switch } from 'antd';
import {
  ThunderboltFilled, ThunderboltOutlined,
  DropboxOutlined,
  BulbFilled, BulbOutlined,
} from '@ant-design/icons';
import './DeviceCard.css';

const ICON_MAP = {
  temperature: {
    on: <ThunderboltFilled />,
    off: <ThunderboltOutlined />,
    color: '#ef4444',
  },
  humidity: {
    on: <DropboxOutlined />,
    off: <DropboxOutlined />,
    color: '#3b82f6',
  },
  light: {
    on: <BulbFilled />,
    off: <BulbOutlined />,
    color: '#f59e0b',
  },
};

export default function DeviceCard({ device, onToggle }) {
  const isOn = device.status === 'ON';
  const iconCfg = ICON_MAP[device.iconType] || ICON_MAP.light;

  return (
    <div className={`device-card ${isOn ? 'device-card--on' : ''}`}>
      <div className="device-card-top">
        <div
          className={`device-icon ${isOn ? 'device-icon--on' : ''}`}
          style={isOn ? { background: iconCfg.color + '18', color: iconCfg.color } : {}}
        >
          {isOn ? iconCfg.on : iconCfg.off}
        </div>
        <Switch
          checked={isOn}
          onChange={() => onToggle(device.id)}
          size="default"
        />
      </div>

      <div className="device-card-info">
        <h4 className="device-name">{device.name}</h4>
        <p className="device-type">{device.type} Sensor</p>
        <p className="device-location">
          {device.location} · <span className="device-unit">{device.unit}</span>
        </p>
      </div>

      <div className="device-status">
        <span className={`status-dot ${isOn ? 'status-dot-green' : 'status-dot-gray'}`} />
        <span className={`device-status-text ${isOn ? 'status-text-on' : 'status-text-off'}`}>
          {isOn ? 'Active' : 'Inactive'}
        </span>
      </div>
    </div>
  );
}
