import { Table } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import './HistoryTable.css';

const ACTION_CONFIG = {
  TURN_ON:  { label: 'TURN ON',  cls: 'badge badge-purple' },
  TURN_OFF: { label: 'TURN OFF', cls: 'badge badge-gray' },
};

const STATUS_CONFIG = {
  SUCCESS: { label: 'SUCCESS', cls: 'badge badge-green' },
  FAILED:  { label: 'FAILED',  cls: 'badge badge-red' },
};

const columns = [
  {
    title: 'User',
    dataIndex: 'user',
    key: 'user',
    render: (u) => <span className="history-user">{u}</span>,
    width: 100,
  },
  {
    title: 'Device',
    dataIndex: 'device',
    key: 'device',
    render: (d) => <span className="history-device">{d}</span>,
    width: 160,
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    render: (a) => {
      const cfg = ACTION_CONFIG[a] || {};
      return <span className={cfg.cls}>{cfg.label}</span>;
    },
    width: 120,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (s) => {
      const cfg = STATUS_CONFIG[s] || {};
      return <span className={cfg.cls}>{cfg.label}</span>;
    },
    width: 110,
  },
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
    render: (t) => <span className="table-time">{t}</span>,
    width: 200,
  },
];

export default function HistoryTable({ data, loading, onReset }) {
  if (!loading && data.length === 0) {
    return (
      <div className="nexa-card">
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>No history records found</h3>
          <p>Try adjusting your filter or reset to view all records.</p>
          <button className="empty-reset-btn" onClick={onReset}>
            <ReloadOutlined style={{ marginRight: 6 }} />
            Reset Filter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="nexa-card history-table-card">
      <div className="table-responsive">
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} records`,
          }}
          size="middle"
          scroll={{ x: 640 }}
          className="history-table"
        />
      </div>
    </div>
  );
}
