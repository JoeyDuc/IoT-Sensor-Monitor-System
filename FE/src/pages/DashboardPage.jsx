import { useEffect, useState, useMemo } from 'react';
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
import { api } from '../services/api';

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
  const [sensorSummary, setSensorSummary] = useState(latestSensorSummary);
  const [remoteChartData, setRemoteChartData] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [filterMode, setFilterMode] = useState(FILTER_MODE.LAST_15);
  const [dateRange, setDateRange] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(() => dayjs().format('HH:mm:ss'));

  const loadData = async () => {
    try {
      const [devs, sum, charts] = await Promise.allSettled([
        api.getDevices(),
        api.getSensorSummary(),
        api.getSensorChart(filterMode, dateRange?.[0]?.valueOf(), dateRange?.[1]?.valueOf()),
      ]);
      if (devs.status === 'fulfilled' && devs.value?.length) {
        setDevices(devs.value);
      }
      if (sum.status === 'fulfilled' && sum.value?.temperature) {
        setSensorSummary(sum.value);
      }
      if (charts.status === 'fulfilled' && charts.value?.temperature) {
        setRemoteChartData(charts.value);
      }
      setLastUpdated(dayjs().format('HH:mm:ss'));
    } catch (err) {
      console.warn('Backend load error', err);
    }
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 3000);
    return () => clearInterval(timer);
  }, [filterMode, dateRange]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
    messageApi.success('Đã làm mới dữ liệu bảng điều khiển');
  };

  const handleToggle = async (deviceId) => {
    const target = devices.find((d) => d.id === deviceId);
    if (!target) return;
    const newStatus = target.status === 'ON' ? 'OFF' : 'ON';
    setDevices((prev) =>
      prev.map((d) => (d.id === deviceId ? { ...d, status: newStatus } : d))
    );
    try {
      await api.toggleDevice(deviceId);
      messageApi.success(`${target.name} đã ${newStatus === 'ON' ? 'bật' : 'tắt'}`);
    } catch (e) {
      // Revert nếu lỗi
      setDevices((prev) =>
        prev.map((d) => (d.id === deviceId ? { ...d, status: target.status } : d))
      );
      messageApi.error(`Không thể điều khiển ${target.name}`);
    }
  };

  const filteredChartData = useMemo(() => {
    if (remoteChartData && remoteChartData.temperature && remoteChartData.temperature.length > 0) {
      return remoteChartData;
    }
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
  }, [remoteChartData, filterMode, dateRange]);

  const chartSubtitle = useMemo(() => {
    if (filterMode === FILTER_MODE.LAST_15) return '15 lần đo gần nhất';
    if (dateRange && dateRange[0] && dateRange[1]) {
      return `${dateRange[0].format('DD/MM/YYYY')} → ${dateRange[1].format('DD/MM/YYYY')}`;
    }
    return 'Chọn khoảng thời gian';
  }, [filterMode, dateRange]);

  const controlDevices = devices.filter(d => !d.id.startsWith('sensor-'));
  const activeCount = controlDevices.filter((d) => d.status === 'ON').length;

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
                  {sensorSummary.temperature?.value ?? '--'} <span style={{ fontSize: 13, fontWeight: 'normal' }}>{sensorSummary.temperature?.unit ?? '°C'}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <ThunderboltOutlined style={{ fontSize: 24, color: CHART_COLORS.temperature }} />
                {sensorSummary.temperature?.trend && (
                  <div style={{ fontSize: 11, color: sensorSummary.temperature.trendUp ? '#52c41a' : '#ff4d4f', marginTop: 2 }}>
                    {sensorSummary.temperature.trendUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    {' '}{sensorSummary.temperature.trend} so với hôm qua
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
                  {sensorSummary.humidity?.value ?? '--'} <span style={{ fontSize: 13, fontWeight: 'normal' }}>{sensorSummary.humidity?.unit ?? '%'}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <DropboxOutlined style={{ fontSize: 24, color: CHART_COLORS.humidity }} />
                {sensorSummary.humidity?.trend && (
                  <div style={{ fontSize: 11, color: sensorSummary.humidity.trendUp ? '#52c41a' : '#ff4d4f', marginTop: 2 }}>
                    {sensorSummary.humidity.trendUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    {' '}{sensorSummary.humidity.trend} so với hôm qua
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
                  {sensorSummary.light?.value ?? '--'} <span style={{ fontSize: 13, fontWeight: 'normal' }}>{sensorSummary.light?.unit ?? 'lux'}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <BulbOutlined style={{ fontSize: 22, color: CHART_COLORS.light }} />
                {sensorSummary.light?.trend && (
                  <div style={{ fontSize: 11, color: sensorSummary.light.trendUp ? '#52c41a' : '#ff4d4f', marginTop: 2 }}>
                    {sensorSummary.light.trendUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    {' '}{sensorSummary.light.trend} so với hôm qua
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
            <Tag color="blue">{activeCount} / {controlDevices.length} đang hoạt động</Tag>
          </Space>
        }
      >
        <Row gutter={[12, 12]}>
          {controlDevices.map((device) => (
            <Col xs={24} sm={12} md={8} key={device.id}>
              <DeviceCard device={device} onToggle={handleToggle} />
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
}
