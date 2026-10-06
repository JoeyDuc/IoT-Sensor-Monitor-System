import { useState, useMemo } from 'react';
import { message, DatePicker, Radio, Space, Card, Row, Col, Typography, Tag, Statistic, Button, Flex } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ThunderboltOutlined,
  DropboxOutlined,
  BulbOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import SensorChart from '../components/dashboard/SensorChart';
import DeviceCard from '../components/dashboard/DeviceCard';
import { latestSensorSummary, dashboardChartDataFull } from '../data/sensorData';
import { initialDevices } from '../data/deviceData';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const CHART_COLORS = {
  temperature: '#ef4444',
  humidity: '#3b82f6',
  light: '#f59e0b',
};

const FILTER_MODE = { LAST_15: 'last15', DATE_RANGE: 'dateRange' };

export default function DashboardPage() {
  const [devices, setDevices] = useState(initialDevices);
  const [messageApi, contextHolder] = message.useMessage();
  const [filterMode, setFilterMode] = useState(FILTER_MODE.LAST_15);
  const [dateRange, setDateRange] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(() => dayjs().format('HH:mm:ss'));

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setLastUpdated(dayjs().format('HH:mm:ss'));
      setRefreshing(false);
      messageApi.success('Đã làm mới dữ liệu bảng điều khiển');
    }, 400);
  };

  const handleToggle = (deviceId) => {
    const target = devices.find((d) => d.id === deviceId);
    if (!target) return;
    const newStatus = target.status === 'ON' ? 'OFF' : 'ON';
    messageApi.success(`${target.name} đã ${newStatus === 'ON' ? 'bật' : 'tắt'}`);
    setDevices((prev) =>
      prev.map((d) => (d.id === deviceId ? { ...d, status: newStatus } : d))
    );
  };

  const filteredChartData = useMemo(() => {
    const sensors = ['temperature', 'humidity', 'light'];
    const result = {};
    sensors.forEach((key) => {
      const all = dashboardChartDataFull[key];
      if (filterMode === FILTER_MODE.LAST_15) {
        result[key] = all.slice(-15).map((r) => ({
          ...r,
          time: r.fullTime ? r.fullTime.substring(0, 16) : r.time,
        }));
      } else {
        if (!dateRange || !dateRange[0] || !dateRange[1]) {
          result[key] = all.slice(-24).map((r) => ({
            ...r,
            time: r.fullTime ? r.fullTime.substring(0, 16) : r.time,
          }));
        } else {
          const from = dateRange[0].startOf('day').valueOf();
          const to = dateRange[1].endOf('day').valueOf();
          result[key] = all
            .filter((r) => r.timestamp >= from && r.timestamp <= to)
            .map((r) => ({
              ...r,
              time: r.fullTime ? r.fullTime.substring(0, 16) : r.time,
            }));
        }
      }
    });
    return result;
  }, [filterMode, dateRange]);

  const chartSubtitle = useMemo(() => {
    if (filterMode === FILTER_MODE.LAST_15) return '15 lần đo gần nhất';
    if (dateRange && dateRange[0] && dateRange[1]) {
      return `${dateRange[0].format('DD/MM/YYYY')} → ${dateRange[1].format('DD/MM/YYYY')}`;
    }
    return 'Chọn khoảng thời gian';
  }, [filterMode, dateRange]);

  const activeCount = devices.filter((d) => d.status === 'ON').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, gap: 10, flex: 1 }}>
      {contextHolder}

      {/* Top action bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <Text type="secondary" style={{ fontSize: 13 }}>
          Cập nhật lần cuối: <Text strong>{lastUpdated}</Text>
        </Text>
        <Button
          icon={<ReloadOutlined spin={refreshing} />}
          onClick={handleRefresh}
          loading={refreshing}
          size="small"
        >
          Làm mới
        </Button>
      </div>

      {/* Stat Cards - Compact */}
      <Row gutter={[10, 10]} style={{ flexShrink: 0 }}>
        <Col xs={24} sm={24} md={8}>
          <Card size="small" style={{ borderRadius: 8 }}>
            <Flex justify="space-between" align="center">
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>Nhiệt độ</Text>
                <div style={{ fontSize: 24, fontWeight: 700, color: CHART_COLORS.temperature, lineHeight: '30px' }}>
                  {latestSensorSummary.temperature.value} <span style={{ fontSize: 13, fontWeight: 'normal' }}>{latestSensorSummary.temperature.unit}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <ThunderboltOutlined style={{ fontSize: 24, color: CHART_COLORS.temperature }} />
                {latestSensorSummary.temperature.trend && (
                  <div style={{ fontSize: 11, color: latestSensorSummary.temperature.trendUp ? '#52c41a' : '#ff4d4f', marginTop: 2 }}>
                    {latestSensorSummary.temperature.trendUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    {' '}{latestSensorSummary.temperature.trend} so với hôm qua
                  </div>
                )}
              </div>
            </Flex>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={8}>
          <Card size="small" style={{ borderRadius: 8 }}>
            <Flex justify="space-between" align="center">
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>Độ ẩm</Text>
                <div style={{ fontSize: 24, fontWeight: 700, color: CHART_COLORS.humidity, lineHeight: '30px' }}>
                  {latestSensorSummary.humidity.value} <span style={{ fontSize: 13, fontWeight: 'normal' }}>{latestSensorSummary.humidity.unit}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <DropboxOutlined style={{ fontSize: 24, color: CHART_COLORS.humidity }} />
                {latestSensorSummary.humidity.trend && (
                  <div style={{ fontSize: 11, color: latestSensorSummary.humidity.trendUp ? '#52c41a' : '#ff4d4f', marginTop: 2 }}>
                    {latestSensorSummary.humidity.trendUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    {' '}{latestSensorSummary.humidity.trend} so với hôm qua
                  </div>
                )}
              </div>
            </Flex>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={8}>
          <Card size="small" style={{ borderRadius: 8 }}>
            <Flex justify="space-between" align="center">
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>Ánh sáng</Text>
                <div style={{ fontSize: 24, fontWeight: 700, color: CHART_COLORS.light, lineHeight: '30px' }}>
                  {latestSensorSummary.light.value} <span style={{ fontSize: 13, fontWeight: 'normal' }}>{latestSensorSummary.light.unit}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <BulbOutlined style={{ fontSize: 22, color: CHART_COLORS.light }} />
                {latestSensorSummary.light.trend && (
                  <div style={{ fontSize: 11, color: latestSensorSummary.light.trendUp ? '#52c41a' : '#ff4d4f', marginTop: 2 }}>
                    {latestSensorSummary.light.trendUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    {' '}{latestSensorSummary.light.trend} so với hôm qua
                  </div>
                )}
              </div>
            </Flex>
          </Card>
        </Col>
      </Row>

      {/* Charts Card - Takes remaining vertical space */}
      <Card
        size="small"
        style={{
          borderRadius: 8,
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
        styles={{
          body: {
            flex: 1,
            minHeight: 0,
            padding: '10px 14px 8px',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
        title={
          <Space size={6}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Dữ liệu cảm biến</span>
            <Text type="secondary" style={{ fontWeight: 'normal', fontSize: 12 }}>({chartSubtitle})</Text>
          </Space>
        }
        extra={
          <Space wrap size={6}>
            <Radio.Group
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              optionType="button"
              buttonStyle="solid"
              size="small"
            >
              <Radio.Button value={FILTER_MODE.LAST_15}>
                <Space size={4}><ClockCircleOutlined />15 lần đo</Space>
              </Radio.Button>
              <Radio.Button value={FILTER_MODE.DATE_RANGE}>
                <Space size={4}><CalendarOutlined />Theo ngày</Space>
              </Radio.Button>
            </Radio.Group>
            {filterMode === FILTER_MODE.DATE_RANGE && (
              <RangePicker
                size="small"
                format="DD/MM/YYYY"
                value={dateRange}
                onChange={(dates) => setDateRange(dates)}
                disabledDate={(d) => d && d.isAfter(dayjs(), 'day')}
                placeholder={['Từ ngày', 'Đến ngày']}
                allowClear
                style={{ width: 210 }}
              />
            )}
          </Space>
        }
      >
        <Row gutter={[16, 12]} style={{ flex: 1, minHeight: 0, height: '100%' }}>
          <Col xs={24} md={8} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <SensorChart data={filteredChartData.temperature} title="Nhiệt độ" color={CHART_COLORS.temperature} unit="°C" />
          </Col>
          <Col xs={24} md={8} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <SensorChart data={filteredChartData.humidity} title="Độ ẩm" color={CHART_COLORS.humidity} unit="%" />
          </Col>
          <Col xs={24} md={8} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <SensorChart data={filteredChartData.light} title="Ánh sáng" color={CHART_COLORS.light} unit="lux" />
          </Col>
        </Row>
      </Card>

      {/* Device Control Card */}
      <Card
        size="small"
        style={{ borderRadius: 8, flexShrink: 0 }}
        styles={{ body: { padding: '10px 14px' } }}
        title={
          <Space size={6}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Điều khiển thiết bị</span>
            <Tag color="blue">{activeCount} / {devices.length} đang hoạt động</Tag>
          </Space>
        }
      >
        <Row gutter={[12, 12]}>
          {devices.map((device) => (
            <Col xs={24} sm={12} md={8} key={device.id}>
              <DeviceCard device={device} onToggle={handleToggle} />
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
}
