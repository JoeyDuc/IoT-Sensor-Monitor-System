import { useState, useEffect } from 'react';
import { Card, Select, Input, Button, Row, Col, Typography } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

const SENSOR_TYPES = [
  { value: 'All',         label: 'Tất cả cảm biến' },
  { value: 'Temperature', label: 'Cảm biến nhiệt độ' },
  { value: 'Humidity',    label: 'Cảm biến độ ẩm' },
  { value: 'Light',       label: 'Cảm biến ánh sáng' },
];

export default function SensorFilter({ onApply, onReset, loading, resetKey }) {
  const [sensorType, setSensorType] = useState('All');
  const [quickSearch, setQuickSearch] = useState('');

  // Đồng bộ reset từ bên ngoài nếu có
  useEffect(() => {
    if (resetKey !== undefined) {
      setSensorType('All');
      setQuickSearch('');
    }
  }, [resetKey]);

  const handleSearch = () => {
    onApply({ sensorType, quickSearch });
  };

  const handleReset = () => {
    setSensorType('All');
    setQuickSearch('');
    onReset();
  };

  return (
    <Card size="small" style={{ borderRadius: 10 }}>
      <Row gutter={[12, 12]} align="bottom">
        <Col xs={24} sm={8} md={6}>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
            Loại cảm biến
          </Text>
          <Select
            value={sensorType}
            onChange={(val) => setSensorType(val)}
            style={{ width: '100%' }}
          >
            {SENSOR_TYPES.map((t) => (
              <Option key={t.value} value={t.value}>{t.label}</Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} sm={16} md={11}>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
            Tìm kiếm
          </Text>
          <Input
            prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
            placeholder="Tìm kiếm..."
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
            onPressEnter={handleSearch}
            allowClear
          />
        </Col>

        <Col xs={24} sm={24} md={7} style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            loading={loading}
          >
            Tìm kiếm
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleReset}
          >
            Làm mới
          </Button>
        </Col>
      </Row>
    </Card>
  );
}
