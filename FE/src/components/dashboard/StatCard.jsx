import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import './StatCard.css';

export default function StatCard({ icon, label, value, unit, trend, trendUp, color }) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon" style={{ background: color + '18', color }}>
        {icon}
      </div>
      <div className="stat-card-body">
        <p className="stat-card-label">{label}</p>
        <div className="stat-card-value-row">
          <span className="stat-card-value">{value}</span>
          <span className="stat-card-unit">{unit}</span>
        </div>
        {trend && (
          <div className={`stat-card-trend ${trendUp ? 'trend-up' : 'trend-down'}`}>
            {trendUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            <span>{trend}</span>
            <span className="trend-label">vs yesterday</span>
          </div>
        )}
      </div>
    </div>
  );
}
