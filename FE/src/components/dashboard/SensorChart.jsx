import { Typography } from 'antd';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const { Text } = Typography;

function CustomTooltip({ active, payload, label, unit }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: '#fff', border: '1px solid #f0f0f0', padding: '6px 10px', borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <div><Text type="secondary" style={{ fontSize: 11 }}>{label}</Text></div>
      <div><Text strong style={{ color: payload[0]?.color, fontSize: 13 }}>{payload[0]?.value} {unit}</Text></div>
    </div>
  );
}

export default function SensorChart({ data, title, color, unit, dataKey = 'value' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, flexShrink: 0 }}>
        <Text strong style={{ fontSize: 13 }}>{title}</Text>
        <Text type="secondary" style={{ fontSize: 11 }}>Đơn vị: {unit}</Text>
      </div>
      <div style={{ flex: 1, minHeight: 120, width: '100%', position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 6, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: '#8c8c8c' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#8c8c8c' }}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: color }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
