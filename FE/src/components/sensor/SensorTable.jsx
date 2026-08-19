import { Table, Tag } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import './SensorTable.css';

const TYPE_COLORS = {
  Temperature: { bg: '#fee2e2', color: '#dc2626' },
  Humidity: { bg: '#dbeafe', color: '#1d4ed8' },
  Light: { bg: '#fef3c7', color: '#d97706' },
};

const columns = [
  {
    title: 'Sensor',
    dataIndex: 'sensor',
    key: 'sensor',
    render: (text) => <span className="table-sensor-name">{text}</span>,
    width: 180,
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    render: (type) => {
      const cfg = TYPE_COLORS[type] || {};
      return (
        <span
          className="badge"
          style={{ background: cfg.bg, color: cfg.color }}
        >
          {type}
        </span>
      );
    },
    width: 130,
  },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value',
    render: (val) => <strong>{val}</strong>,
    width: 90,
  },
  {
    title: 'Unit',
    dataIndex: 'unit',
    key: 'unit',
    width: 70,
  },
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
    width: 200,
    render: (t) => <span className="table-time">{t}</span>,
  },
];

export default function SensorTable({ data, loading, onReset }) {
  if (!loading && data.length === 0) {
    return (
      <div className="nexa-card">
        <div className="empty-state">
          <div className="empty-state-icon">📡</div>
          <h3>No sensor data found</h3>
          <p>Try adjusting your filter criteria or reset to view all data.</p>
          <button className="empty-reset-btn" onClick={onReset}>
            <ReloadOutlined style={{ marginRight: 6 }} />
            Reset Filter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="nexa-card sensor-table-card">
      <div className="table-responsive">
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 15,
            showSizeChanger: true,
            pageSizeOptions: ['10', '15', '25', '50'],
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} records`,
          }}
          size="middle"
          scroll={{ x: 640 }}
          className="sensor-table"
        />
      </div>
    </div>
  );
}
