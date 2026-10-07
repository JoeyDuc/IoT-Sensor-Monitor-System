import { useState } from 'react';
import { Card, Switch, Space, Tag, Typography, Flex } from 'antd';
import {
  ThunderboltFilled, ThunderboltOutlined,
  DropboxOutlined,
  BulbFilled, BulbOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

const ICON_MAP = {
  temperature: { on: <ThunderboltFilled />, off: <ThunderboltOutlined />, color: '#ef4444' },
  humidity:    { on: <DropboxOutlined />,   off: <DropboxOutlined />,     color: '#3b82f6' },
  light:       { on: <BulbFilled />,        off: <BulbOutlined />,        color: '#f59e0b' },
};

const TYPE_LABEL = {
  temperature: 'Nhiệt độ',
  humidity:    'Độ ẩm',
  light:       'Ánh sáng',
};

export default function DeviceCard({ device, onToggle }) {
  const [toggling, setToggling] = useState(false);
  const isOn   = device.status === 'ON';
  const iconCfg = ICON_MAP[device.iconType] || ICON_MAP.light;

  const handleSwitch = async () => {
    setToggling(true);
    try {
      await onToggle(device.id);
    } finally {
      setToggling(false);
    }
  };

  return (
    <Card
      size="small"
      style={{
        borderRadius: 8,
        background: isOn ? 'rgba(82, 196, 26, 0.05)' : '#fafafa',
        borderColor: isOn ? '#b7eb8f' : '#f0f0f0',
        transition: 'all 0.2s',
      }}
      styles={{ body: { padding: '10px 14px' } }}
    >
      <Flex justify="space-between" align="center">
        <Space size={12}>
          <div style={{ fontSize: 26, color: isOn ? iconCfg.color : '#bfbfbf', display: 'flex', alignItems: 'center' }}>
            {isOn ? iconCfg.on : iconCfg.off}
          </div>
          <div>
            <Text strong style={{ fontSize: 14, display: 'block', lineHeight: '20px' }}>{device.name}</Text>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', lineHeight: '18px' }}>
              {TYPE_LABEL[device.iconType] || device.type} · {device.location} ({device.unit})
            </Text>
          </div>
        </Space>
        <Space direction="vertical" align="end" size={4}>
          <Switch
            size="small"
            checked={isOn}
            loading={toggling}
            disabled={toggling}
            onChange={handleSwitch}
          />
          <Tag
            color={isOn ? 'success' : 'default'}
            style={{ margin: 0, fontSize: 11, lineHeight: '18px', padding: '0 6px' }}
          >
            {isOn ? 'Bật' : 'Tắt'}
          </Tag>
        </Space>
      </Flex>
    </Card>
  );
}
