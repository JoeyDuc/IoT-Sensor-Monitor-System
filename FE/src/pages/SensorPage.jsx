import { useState, useMemo, useEffect, useCallback } from 'react';
import { Typography, message } from 'antd';
import SensorFilter from '../components/sensor/SensorFilter';
import SensorTable from '../components/sensor/SensorTable';
import { allSensorData } from '../data/sensorData';
import { api } from '../services/api';

const { Text } = Typography;

const TYPE_LABEL = { Temperature: 'nhiệt độ', Humidity: 'độ ẩm', Light: 'ánh sáng' };

export default function SensorPage() {
  const [filters, setFilters]   = useState({ sensorType: 'All', quickSearch: '' });
  const [backendData, setBackendData] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [searched, setSearched] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchData = useCallback(async (currentFilters) => {
    setLoading(true);
    try {
      const res = await api.getSensorData({
        sensorType: currentFilters.sensorType,
        quickSearch: currentFilters.quickSearch,
        page: 1,
        size: 500,
      });
      if (res && Array.isArray(res.content)) {
        setBackendData(res.content);
      }
    } catch (err) {
      console.warn('Backend fetch failed, using local mock data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(filters);
  }, [fetchData]);

  const filteredData = useMemo(() => {
    if (backendData !== null) {
      return backendData;
    }
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
  }, [filters, backendData]);

  const handleApply = (newFilters) => {
    setFilters(newFilters);
    setSearched(newFilters.sensorType !== 'All' || !!newFilters.quickSearch?.trim());
    fetchData(newFilters);
  };

  const handleReset = () => {
    const emptyFilters = { sensorType: 'All', quickSearch: '' };
    setResetKey((k) => k + 1);
    setFilters(emptyFilters);
    setSearched(false);
    fetchData(emptyFilters);
    messageApi.success('Đã làm mới dữ liệu cảm biến');
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
