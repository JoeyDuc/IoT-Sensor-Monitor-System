import { useState, useMemo } from 'react';
import HistoryFilter from '../components/history/HistoryFilter';
import HistoryTable from '../components/history/HistoryTable';
import { historyData } from '../data/historyData';
import './DeviceControlHistoryPage.css';

function truncateTimestamp(ts, precision) {
  const d = new Date(ts);
  switch (precision) {
    case 'day':
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    case 'hour':
      return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours()).getTime();
    case 'minute':
      return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()).getTime();
    default:
      return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()).getTime();
  }
}

export default function DeviceControlHistoryPage() {
  const [filters, setFilters] = useState({
    device: 'All Devices',
    action: 'All Actions',
    status: 'All Status',
    precision: 'minute',
    fromDate: null,
    toDate: null,
  });
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  const filteredData = useMemo(() => {
    let data = [...historyData];

    if (filters.device !== 'All Devices') {
      data = data.filter((r) => r.device === filters.device);
    }
    if (filters.action !== 'All Actions') {
      data = data.filter((r) => r.action === filters.action);
    }
    if (filters.status !== 'All Status') {
      data = data.filter((r) => r.status === filters.status);
    }
    if (filters.fromDate) {
      const from = truncateTimestamp(filters.fromDate, filters.precision);
      data = data.filter((r) => truncateTimestamp(r.timestamp, filters.precision) >= from);
    }
    if (filters.toDate) {
      const to = truncateTimestamp(filters.toDate, filters.precision);
      data = data.filter((r) => truncateTimestamp(r.timestamp, filters.precision) <= to);
    }

    return data;
  }, [filters]);

  const handleApply = (newFilters) => {
    setLoading(true);
    setTimeout(() => {
      setFilters(newFilters);
      setApplied(true);
      setLoading(false);
    }, 300);
  };

  const handleReset = () => {
    setFilters({
      device: 'All Devices',
      action: 'All Actions',
      status: 'All Status',
      precision: 'minute',
      fromDate: null,
      toDate: null,
    });
    setApplied(false);
  };

  return (
    <div className="history-page page-enter">
      <div className="sensor-results-label">
        {applied
          ? `Showing ${filteredData.length} records`
          : `Total ${historyData.length} records`}
      </div>

      <HistoryFilter onApply={handleApply} onReset={handleReset} />
      <HistoryTable data={filteredData} loading={loading} onReset={handleReset} />
    </div>
  );
}
