import { useState } from 'react';
import { Select, Button, DatePicker } from 'antd';
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { DEVICES, ACTIONS, STATUSES } from '../../data/historyData';
import './HistoryFilter.css';

const { Option } = Select;

const TIME_PRECISIONS = [
  { label: 'Second', value: 'second', format: 'DD/MM/YYYY HH:mm:ss', showTime: { format: 'HH:mm:ss' } },
  { label: 'Minute', value: 'minute', format: 'DD/MM/YYYY HH:mm',    showTime: { format: 'HH:mm' } },
  { label: 'Hour',   value: 'hour',   format: 'DD/MM/YYYY HH',       showTime: { format: 'HH' } },
  { label: 'Day',    value: 'day',    format: 'DD/MM/YYYY',           showTime: false },
];

export default function HistoryFilter({ onApply, onReset }) {
  const [device, setDevice]     = useState('All Devices');
  const [action, setAction]     = useState('All Actions');
  const [status, setStatus]     = useState('All Status');
  const [precision, setPrecision] = useState('minute');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate]     = useState(null);

  const currentPrecision = TIME_PRECISIONS.find((p) => p.value === precision);

  const handleApply = () => {
    onApply({
      device, action, status, precision,
      fromDate: fromDate ? fromDate.valueOf() : null,
      toDate:   toDate   ? toDate.valueOf()   : null,
    });
  };

  const handleReset = () => {
    setDevice('All Devices');
    setAction('All Actions');
    setStatus('All Status');
    setPrecision('minute');
    setFromDate(null);
    setToDate(null);
    onReset();
  };

  return (
    <div className="history-filter nexa-card">
      {/* Header */}
      <div className="hf-header">
        <FilterOutlined style={{ color: 'var(--color-primary)', fontSize: '1rem' }} />
        <h3 className="hf-title">Filter</h3>
      </div>

      {/* Row 1: Device | Action | Status | Time Precision */}
      <div className="hf-row hf-row-top">
        <div className="hf-field">
          <label className="hf-label">Device</label>
          <Select value={device} onChange={setDevice} style={{ width: '100%' }}>
            {DEVICES.map((d) => <Option key={d} value={d}>{d}</Option>)}
          </Select>
        </div>

        <div className="hf-field">
          <label className="hf-label">Action</label>
          <Select value={action} onChange={setAction} style={{ width: '100%' }}>
            {ACTIONS.map((a) => <Option key={a} value={a}>{a}</Option>)}
          </Select>
        </div>

        <div className="hf-field">
          <label className="hf-label">Status</label>
          <Select value={status} onChange={setStatus} style={{ width: '100%' }}>
            {STATUSES.map((s) => <Option key={s} value={s}>{s}</Option>)}
          </Select>
        </div>

        <div className="hf-field">
          <label className="hf-label">Time Precision</label>
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
      <div className="hf-row hf-row-bottom">
        <div className="hf-field">
          <label className="hf-label">From</label>
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

        <div className="hf-field">
          <label className="hf-label">To</label>
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

        <div className="hf-actions">
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
