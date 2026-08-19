import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Alert } from 'antd';
import { UserOutlined, LockOutlined, ThunderboltOutlined } from '@ant-design/icons';
import './LoginPage.css';

const MOCK_CREDENTIALS = { username: 'admin', password: '123456' };

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (values) => {
    setLoading(true);
    setError('');

    // Simulate async login
    setTimeout(() => {
      if (
        values.username === MOCK_CREDENTIALS.username &&
        values.password === MOCK_CREDENTIALS.password
      ) {
        localStorage.setItem('nexa_auth', 'true');
        navigate('/dashboard', { replace: true });
      } else {
        setError('Invalid username or password. Try admin / 123456');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="login-page">
      {/* Left decorative panel */}
      <div className="login-panel-left">
        <div className="login-brand">
          <div className="login-brand-icon">
            <ThunderboltOutlined />
          </div>
          <h2>NEXA IoT</h2>
        </div>
        <div className="login-panel-content">
          <h1>Smart IoT Management</h1>
          <p>Monitor, control, and analyze your IoT devices from a single unified platform.</p>
          <div className="login-features">
            <div className="login-feature-item">
              <span className="login-feature-dot" />
              Real-time sensor monitoring
            </div>
            <div className="login-feature-item">
              <span className="login-feature-dot" />
              Device control & automation
            </div>
            <div className="login-feature-item">
              <span className="login-feature-dot" />
              Historical data & analytics
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="login-panel-right">
        <div className="login-form-wrapper">
          <div className="login-form-header">
            <h2>Welcome back</h2>
            <p>Sign in to manage your IoT system.</p>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{ marginBottom: 20, borderRadius: 10 }}
            />
          )}

          <Form
            layout="vertical"
            onFinish={handleLogin}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: 'Please enter your username' }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#a78bfa' }} />}
                placeholder="Enter username"
                className="login-input"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#a78bfa' }} />}
                placeholder="Enter password"
                className="login-input"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="login-btn"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <p className="login-hint">
            Demo: <strong>admin</strong> / <strong>123456</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
