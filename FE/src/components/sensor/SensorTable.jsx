import { useRef, useState, useEffect, useMemo } from 'react';
import { Table, Card, Tag, Button, Empty } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const TYPE_COLOR = { Temperature: 'red', Humidity: 'blue', Light: 'orange' };
const TYPE_LABEL = { Temperature: 'Nhiệt độ', Humidity: 'Độ ẩm', Light: 'Ánh sáng' };

const TABLE_HEADER_H = 47;
const PAGINATION_H   = 57;

export default function SensorTable({ data, loading, onReset }) {
  const wrapperRef = useRef(null);
  const [scrollY, setScrollY] = useState(300);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 15 });

  // Reset về trang 1 khi data thay đổi
  useEffect(() => {
    setPagination((p) => ({ ...p, current: 1 }));
  }, [data]);

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
      title: 'Cảm biến',
      dataIndex: 'sensor',
      key: 'sensor',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      width: 130,
      render: (type) => <Tag color={TYPE_COLOR[type]}>{TYPE_LABEL[type] || type}</Tag>,
    },
    {
      title: 'Giá trị',
      dataIndex: 'value',
      key: 'value',
      width: 90,
      align: 'right',
      render: (val) => <strong>{val}</strong>,
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
      key: 'unit',
      width: 80,
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
        <Empty description="Không tìm thấy dữ liệu cảm biến">
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
          pageSizeOptions: ['10', '15', '25', '50'],
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
