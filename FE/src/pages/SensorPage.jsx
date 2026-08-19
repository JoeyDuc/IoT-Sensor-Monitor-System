import { useState, useMemo } from 'react';
import SensorFilter from '../components/sensor/SensorFilter';
import SensorTable from '../components/sensor/SensorTable';
import { allSensorData } from '../data/sensorData';
import './SensorPage.css';

/**
 * Truncate timestamp to given precision for comparison
 */
function truncateTimestamp(ts, precision) {
  const d = new Date(ts);
  switch (precision) {
    case 'day':
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    case 'hour':
      return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours()).getTime();
    case 'minute':
      return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()).getTime();
    case 'second':
    default:
      return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()).getTime();
  }
}

export default function SensorPage() {
  const [filters, setFilters] = useState({
    sensorType: 'All',
    precision: 'second',
    fromDate: null,
    toDate: null,
  });
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  const filteredData = useMemo(() => {
    let data = [...allSensorData];

    // Filter by type
    if (filters.sensorType !== 'All') {
      data = data.filter((r) => r.type === filters.sensorType);
    }

    // Filter by date range
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
    setFilters({ sensorType: 'All', precision: 'second', fromDate: null, toDate: null });
    setApplied(false);
  };

  return (
    <div className="sensor-page page-enter">
      <div className="sensor-results-label">
        {applied
          ? `Showing ${filteredData.length} records`
          : `Total ${allSensorData.length} records`}
      </div>

      <SensorFilter onApply={handleApply} onReset={handleReset} />
      <SensorTable data={filteredData} loading={loading} onReset={handleReset} />
    </div>
  );
}
