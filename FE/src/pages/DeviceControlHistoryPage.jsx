import { useState, useMemo } from 'react';
import { Typography, message } from 'antd';
import HistoryFilter from '../components/history/HistoryFilter';
import HistoryTable from '../components/history/HistoryTable';
import { historyData } from '../data/historyData';

const { Text } = Typography;

const ACTION_LABEL = { TURN_ON: 'bật', TURN_OFF: 'tắt' };
const STATUS_LABEL = { SUCCESS: 'thành công', FAILED: 'thất bại' };

export default function DeviceControlHistoryPage() {
  const [filters, setFilters] = useState({
    keyword:  '',
    device:   'All Devices',
    action:   'All Actions',
    status:   'All Status',
    fromDate: null,
    toDate:   null,
  });
  const [loading, setLoading]   = useState(false);
  const [searched, setSearched] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();

  /* Lọc dữ liệu — CHỈ thực hiện dựa trên filters đã bấm Tìm kiếm */
  const displayData = useMemo(() => {
    let data = [...historyData];
    if (filters.fromDate) data = data.filter((r) => r.timestamp >= filters.fromDate);
    if (filters.toDate)   data = data.filter((r) => r.timestamp <= filters.toDate);
    if (filters.device !== 'All Devices') data = data.filter((r) => r.device === filters.device);
    if (filters.action !== 'All Actions') data = data.filter((r) => r.action === filters.action);
    if (filters.status !== 'All Status')  data = data.filter((r) => r.status === filters.status);

    if (filters.keyword && filters.keyword.trim()) {
      const q = filters.keyword.trim().toLowerCase();
      data = data.filter((r) => {
        const actionLbl = ACTION_LABEL[r.action] || r.action;
        const statusLbl = STATUS_LABEL[r.status] || r.status;
        return (
          r.user.toLowerCase().includes(q)   ||
          r.device.toLowerCase().includes(q) ||
          r.action.toLowerCase().includes(q) ||
          actionLbl.includes(q)              ||
          r.status.toLowerCase().includes(q) ||
          statusLbl.includes(q)              ||
          r.time.toLowerCase().includes(q)
        );
      });
    }
    return data;
  }, [filters]);

  const handleApply = (newFilters) => {
    setLoading(true);
    setTimeout(() => {
      setFilters(newFilters);
      const hasFilter =
        !!newFilters.keyword?.trim() ||
        newFilters.device !== 'All Devices' ||
        newFilters.action !== 'All Actions' ||
        newFilters.status !== 'All Status' ||
        newFilters.fromDate !== null ||
        newFilters.toDate !== null;
      setSearched(hasFilter);
      setLoading(false);
    }, 250);
  };

  const handleReset = () => {
    setLoading(true);
    setResetKey((k) => k + 1);
    setTimeout(() => {
      setFilters({
        keyword:  '',
        device:   'All Devices',
        action:   'All Actions',
        status:   'All Status',
        fromDate: null,
        toDate:   null,
      });
      setSearched(false);
      setLoading(false);
      messageApi.success('Đã làm mới lịch sử điều khiển');
    }, 250);
  };

  const isFiltering = searched;

  return (
    // flex column + flex:1 để kéo dài đến footer
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minHeight: 0 }}>
      {contextHolder}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <Text type="secondary">
          {isFiltering
            ? `Hiển thị ${displayData.length} / ${historyData.length} bản ghi`
            : `Tổng cộng ${historyData.length} bản ghi`}
        </Text>
      </div>

      {/* Filter — chiều cao cố định */}
      <div style={{ flexShrink: 0 }}>
        <HistoryFilter
          onApply={handleApply}
          onReset={handleReset}
          loading={loading}
          resetKey={resetKey}
        />
      </div>

      {/* Table card — flex: 1 → kéo dài đến footer */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <HistoryTable data={displayData} loading={loading} onReset={handleReset} />
      </div>
    </div>
  );
}
