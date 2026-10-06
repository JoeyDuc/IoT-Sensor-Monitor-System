import { useState, useMemo } from 'react';
import { Typography, message } from 'antd';
import SensorFilter from '../components/sensor/SensorFilter';
import SensorTable from '../components/sensor/SensorTable';
import { allSensorData } from '../data/sensorData';

const { Text } = Typography;

const TYPE_LABEL = { Temperature: 'nhiệt độ', Humidity: 'độ ẩm', Light: 'ánh sáng' };

export default function SensorPage() {
  const [filters, setFilters]   = useState({ sensorType: 'All', quickSearch: '' });
  const [loading, setLoading]   = useState(false);
  const [searched, setSearched] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();

  const filteredData = useMemo(() => {
    let data = [...allSensorData];
    if (filters.sensorType !== 'All') {
      data = data.filter((r) => r.type === filters.sensorType);
    }
    if (filters.quickSearch && filters.quickSearch.trim()) {
      const q = filters.quickSearch.trim().toLowerCase();
      data = data.filter(
        (r) =>
          String(r.value).toLowerCase().includes(q) ||
          String(r.sensor).toLowerCase().includes(q) ||
          String(r.unit).toLowerCase().includes(q) ||
          String(r.type).toLowerCase().includes(q) ||
          (TYPE_LABEL[r.type] && TYPE_LABEL[r.type].includes(q)) ||
          String(r.id).toLowerCase().includes(q) ||
          String(r.time).toLowerCase().includes(q)
      );
    }
    return data;
  }, [filters]);

  const handleApply = (newFilters) => {
    setLoading(true);
    setTimeout(() => {
      setFilters(newFilters);
      setSearched(newFilters.sensorType !== 'All' || !!newFilters.quickSearch?.trim());
      setLoading(false);
    }, 250);
  };

  const handleReset = () => {
    setLoading(true);
    setResetKey((k) => k + 1);
    setTimeout(() => {
      setFilters({ sensorType: 'All', quickSearch: '' });
      setSearched(false);
      setLoading(false);
      messageApi.success('Đã làm mới dữ liệu cảm biến');
    }, 250);
  };

  const isFiltering = searched || filters.sensorType !== 'All' || !!filters.quickSearch.trim();

  return (
    // flex column + flex:1 để kéo dài đến footer
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minHeight: 0 }}>
      {contextHolder}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <Text type="secondary">
          {isFiltering
            ? `Hiển thị ${filteredData.length} / ${allSensorData.length} bản ghi`
            : `Tổng cộng ${allSensorData.length} bản ghi`}
        </Text>
      </div>

      {/* Filter — chiều cao cố định */}
      <div style={{ flexShrink: 0 }}>
        <SensorFilter
          onApply={handleApply}
          onReset={handleReset}
          loading={loading}
          resetKey={resetKey}
        />
      </div>

      {/* Table card — flex: 1 → kéo dài đến footer */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <SensorTable data={filteredData} loading={loading} onReset={handleReset} />
      </div>
    </div>
  );
}
