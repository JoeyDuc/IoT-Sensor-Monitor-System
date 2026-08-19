import { useState } from 'react';
import { Select, Button, DatePicker } from 'antd';
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import './SensorFilter.css';

const { Option } = Select;

const SENSOR_TYPES = ['All', 'Temperature', 'Humidity', 'Light'];

const TIME_PRECISIONS = [
  { label: 'Second', value: 'second', format: 'DD/MM/YYYY HH:mm:ss', showTime: { format: 'HH:mm:ss' } },
  { label: 'Minute', value: 'minute', format: 'DD/MM/YYYY HH:mm',    showTime: { format: 'HH:mm' } },
  { label: 'Hour',   value: 'hour',   format: 'DD/MM/YYYY HH',       showTime: { format: 'HH' } },
  { label: 'Day',    value: 'day',    format: 'DD/MM/YYYY',           showTime: false },
];

export default function SensorFilter({ onApply, onReset }) {
  const [sensorType, setSensorType] = useState('All');
  const [precision, setPrecision]   = useState('second');
  const [fromDate, setFromDate]     = useState(null);
  const [toDate, setToDate]         = useState(null);

  const currentPrecision = TIME_PRECISIONS.find((p) => p.value === precision);

  const handleApply = () => {
    onApply({
      sensorType,
      precision,
      fromDate: fromDate ? fromDate.valueOf() : null,
      toDate:   toDate   ? toDate.valueOf()   : null,
    });
  };

  const handleReset = () => {
    setSensorType('All');
    setPrecision('second');
    setFromDate(null);
    setToDate(null);
    onReset();
  };

  return (
    <div className="sensor-filter nexa-card">
      {/* Header */}
      <div className="sf-header">
        <FilterOutlined style={{ color: 'var(--color-primary)', fontSize: '1rem' }} />
        <h3 className="sf-title">Filter</h3>
      </div>

      {/* Row 1: Sensor Type | Time Precision */}
      <div className="sf-row sf-row-top">
        <div className="sf-field">
          <label className="sf-label">Sensor Type</label>
          <Select value={sensorType} onChange={setSensorType} style={{ width: '100%' }}>
            {SENSOR_TYPES.map((t) => (
              <Option key={t} value={t}>{t === 'All' ? 'All Sensors' : t}</Option>
            ))}
          </Select>
        </div>

        <div className="sf-field">
          <label className="sf-label">Time Precision</label>
          <Select
            value={precision}
            onChange={(val) => { setPrecision(val); setFromDate(null); setToDate(null); }}
            style={{ width: '100%' }}
          >
            {TIME_PRECISIONS.map((p) => (
              <Option key={p.value} value={p.value}>{p.label}</Option>
            ))}
          </Select>
        </div>
      </div>

      {/* Row 2: From | To | Buttons */}
      <div className="sf-row sf-row-bottom">
        <div className="sf-field">
          <label className="sf-label">From</label>
          <DatePicker
            value={fromDate}
            onChange={setFromDate}
            showTime={currentPrecision.showTime || false}
            format={currentPrecision.format}
            placeholder={`From (${currentPrecision.format})`}
            style={{ width: '100%' }}
            allowClear
          />
        </div>

        <div className="sf-field">
          <label className="sf-label">To</label>
          <DatePicker
            value={toDate}
            onChange={setToDate}
            showTime={currentPrecision.showTime || false}
            format={currentPrecision.format}
            placeholder={`To (${currentPrecision.format})`}
            style={{ width: '100%' }}
            disabledDate={(d) => fromDate && d.isBefore(fromDate, 'day')}
            allowClear
          />
        </div>

        <div className="sf-actions">
          <Button type="primary" icon={<FilterOutlined />} onClick={handleApply}>
            Apply Filter
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
