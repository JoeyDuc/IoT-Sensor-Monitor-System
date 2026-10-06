import { useRef, useState, useEffect, useMemo } from 'react';
import { Table, Card, Tag, Button, Empty } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const ACTION_COLOR = { TURN_ON: 'blue',    TURN_OFF: 'default' };
const ACTION_LABEL = { TURN_ON: 'Bật',     TURN_OFF: 'Tắt' };
const STATUS_COLOR = { SUCCESS: 'success', FAILED: 'error' };
const STATUS_LABEL = { SUCCESS: 'Thành công', FAILED: 'Thất bại' };

const TABLE_HEADER_H  = 47;
const PAGINATION_H    = 57;

export default function HistoryTable({ data, loading, onReset }) {
  const wrapperRef  = useRef(null);
  const [scrollY, setScrollY] = useState(300);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  // Reset về trang 1 khi data thay đổi
  useEffect(() => { setPagination((p) => ({ ...p, current: 1 })); }, [data]);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const obs = new ResizeObserver(([entry]) => {
      const h = entry.contentRect.height;
      setScrollY(Math.max(100, h - TABLE_HEADER_H - PAGINATION_H));
    });
    obs.observe(wrapperRef.current);
    return () => obs.disconnect();
  }, []);

  const columns = useMemo(() => [
    {
      title: 'STT',
      key: 'stt',
      width: 70,
      align: 'center',
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: 'Người thực hiện',
      dataIndex: 'user',
      key: 'user',
      width: 140,
    },
    {
      title: 'Thiết bị',
      dataIndex: 'device',
      key: 'device',
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      width: 110,
      render: (a) => <Tag color={ACTION_COLOR[a]}>{ACTION_LABEL[a] || a}</Tag>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (s) => <Tag color={STATUS_COLOR[s]}>{STATUS_LABEL[s] || s}</Tag>,
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
      width: 190,
    },
  ], [pagination.current, pagination.pageSize]);

  if (!loading && data.length === 0) {
    return (
      <Card>
        <Empty description="Không tìm thấy lịch sử điều khiển">
          <Button icon={<ReloadOutlined />} onClick={onReset}>Đặt lại bộ lọc</Button>
        </Empty>
      </Card>
    );
  }

  return (
    <Card
      ref={wrapperRef}
      style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}
      styles={{
        body: { flex: 1, minHeight: 0, padding: 0, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} bản ghi`,
          style: { padding: '12px 16px', margin: 0 },
          onChange: (page, size) => setPagination({ current: page, pageSize: size }),
          onShowSizeChange: (_, size) => setPagination({ current: 1, pageSize: size }),
        }}
        scroll={{ y: scrollY, x: 'max-content' }}
        size="middle"
        style={{ flex: 1 }}
      />
    </Card>
  );
}
