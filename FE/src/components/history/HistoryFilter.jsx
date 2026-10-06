import { useState, useEffect } from 'react';
import { Card, Select, Button, DatePicker, Space, Row, Col, Typography, Input } from 'antd';
import { SearchOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons';
import { DEVICES, ACTIONS, STATUSES } from '../../data/historyData';

const { Option } = Select;
const { Text } = Typography;

const DT_FORMAT   = 'DD/MM/YYYY HH:mm:ss';
const DT_SHOWTIME = { format: 'HH:mm:ss' };

const DEVICE_LABEL = {
  'All Devices':        'Tất cả thiết bị',
  'Temperature Sensor': 'Cảm biến nhiệt độ',
  'Humidity Sensor':    'Cảm biến độ ẩm',
  'Light Sensor':       'Cảm biến ánh sáng',
};
const ACTION_LABEL = {
  'All Actions': 'Tất cả hành động',
  'TURN_ON':     'Bật',
  'TURN_OFF':    'Tắt',
};
const STATUS_LABEL = {
  'All Status': 'Tất cả trạng thái',
  'SUCCESS':    'Thành công',
  'FAILED':     'Thất bại',
};

export default function HistoryFilter({ onApply, onReset, loading, resetKey }) {
  const [keyword,  setKeyword]  = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate,   setToDate]   = useState(null);
  const [device,   setDevice]   = useState('All Devices');
  const [action,   setAction]   = useState('All Actions');
  const [status,   setStatus]   = useState('All Status');

  // Đồng bộ khi reset từ bên ngoài
  useEffect(() => {
    if (resetKey !== undefined) {
      setKeyword('');
      setFromDate(null);
      setToDate(null);
      setDevice('All Devices');
      setAction('All Actions');
      setStatus('All Status');
    }
  }, [resetKey]);

  const handleSearch = () => {
    onApply({
      keyword,
      device,
      action,
      status,
      fromDate: fromDate ? fromDate.valueOf() : null,
      toDate:   toDate   ? toDate.valueOf()   : null,
    });
  };

  const handleReset = () => {
    setKeyword('');
    setFromDate(null);
    setToDate(null);
    setDevice('All Devices');
    setAction('All Actions');
    setStatus('All Status');
    onReset();
  };

  return (
    <Space direction="vertical" size={12} style={{ width: '100%', display: 'flex' }}>

      {/* ── Thanh tìm kiếm tổng quát (ấn Tìm kiếm hoặc Enter mới lọc) ── */}
      <Input
        size="large"
        allowClear
        prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
        placeholder="Tìm kiếm..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onPressEnter={handleSearch}
        style={{ borderRadius: 8 }}
      />

      {/* ── Bộ lọc nâng cao ── */}
      <Card
        size="small"
        title={
          <Space size={6}>
            <FilterOutlined />
            <span>Bộ lọc nâng cao</span>
          </Space>
        }
        style={{ borderRadius: 10 }}
      >
        <Row gutter={[12, 12]}>
          {/* Thiết bị */}
          <Col xs={24} sm={12} md={6}>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Thiết bị</Text>
            <Select value={device} onChange={(v) => setDevice(v)} style={{ width: '100%' }}>
              {DEVICES.map((d) => (
                <Option key={d} value={d}>{DEVICE_LABEL[d] || d}</Option>
              ))}
            </Select>
          </Col>

          {/* Hành động */}
          <Col xs={12} sm={6} md={4}>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Hành động</Text>
            <Select value={action} onChange={(v) => setAction(v)} style={{ width: '100%' }}>
              {ACTIONS.map((a) => (
                <Option key={a} value={a}>{ACTION_LABEL[a] || a}</Option>
              ))}
            </Select>
          </Col>

          {/* Trạng thái */}
          <Col xs={12} sm={6} md={4}>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Trạng thái</Text>
            <Select value={status} onChange={(v) => setStatus(v)} style={{ width: '100%' }}>
              {STATUSES.map((s) => (
                <Option key={s} value={s}>{STATUS_LABEL[s] || s}</Option>
              ))}
            </Select>
          </Col>

          {/* Từ ngày */}
          <Col xs={24} sm={12} md={5}>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Từ ngày</Text>
            <DatePicker
              value={fromDate}
              onChange={setFromDate}
              showTime={DT_SHOWTIME}
              format={DT_FORMAT}
              placeholder="DD/MM/YYYY HH:mm:ss"
              style={{ width: '100%' }}
              allowClear
            />
          </Col>

          {/* Đến ngày */}
          <Col xs={24} sm={12} md={5}>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Đến ngày</Text>
            <DatePicker
              value={toDate}
              onChange={setToDate}
              showTime={DT_SHOWTIME}
              format={DT_FORMAT}
              placeholder="DD/MM/YYYY HH:mm:ss"
              style={{ width: '100%' }}
              disabledDate={(d) => fromDate && d.isBefore(fromDate, 'day')}
              allowClear
            />
          </Col>

          {/* Nút hành động — hàng riêng, căn phải */}
          <Col xs={24} style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
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

    </Space>
  );
}
