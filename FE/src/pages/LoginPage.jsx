import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Alert, Card, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const MOCK_CREDENTIALS = { username: 'admin', password: '123456' };

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleLogin = (values) => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (
        values.username === MOCK_CREDENTIALS.username &&
        values.password === MOCK_CREDENTIALS.password
      ) {
        localStorage.setItem('nexa_auth', 'true');
        navigate('/dashboard', { replace: true });
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không đúng. Thử: admin / 123456');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f5f5',
    }}>
      <Card style={{ width: 400 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Title level={3} style={{ marginBottom: 4 }}>Đăng nhập</Title>
            <Text type="secondary">Đăng nhập để quản lý hệ thống IoT</Text>
          </div>

          {error && <Alert message={error} type="error" showIcon />}

          <Form layout="vertical" onFinish={handleLogin} autoComplete="off">
            <Form.Item
              name="username"
              label="Tên đăng nhập"
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Nhập tên đăng nhập" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
            </Form.Item>

            <Form.Item style={{ marginBottom: 8 }}>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>

          <Text type="secondary" style={{ fontSize: 12 }}>
            Demo: <strong>admin</strong> / <strong>123456</strong>
          </Text>

          <Text>
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </Text>
        </Space>
      </Card>
    </div>
  );
}
