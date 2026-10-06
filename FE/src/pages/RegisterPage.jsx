import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Alert, Steps, Card, Typography, Space, Result } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const STEPS = [
  { title: 'Tài khoản' },
  { title: 'Cá nhân' },
  { title: 'Hoàn thành' },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [formData, setFormData]       = useState({});
  const [form] = Form.useForm();

  const handleStep0 = (values) => {
    setError('');
    if (values.username === 'admin') {
      setError('Tên đăng nhập "admin" đã tồn tại. Vui lòng chọn tên khác.');
      return;
    }
    setFormData((prev) => ({ ...prev, ...values }));
    setCurrentStep(1);
  };

  const handleStep1 = (values) => {
    setLoading(true);
    setError('');
    const finalData = { ...formData, ...values };
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('nexa_users') || '[]');
      users.push({
        username:  finalData.username,
        password:  finalData.password,
        fullName:  finalData.fullName,
        email:     finalData.email,
        phone:     finalData.phone || '',
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('nexa_users', JSON.stringify(users));
      setLoading(false);
      setCurrentStep(2);
    }, 1000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f5f5',
      padding: 24,
    }}>
      <Card style={{ width: 480 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Title level={3} style={{ marginBottom: 4 }}>Đăng ký tài khoản</Title>
            <Text type="secondary">Tạo tài khoản để sử dụng hệ thống IoT</Text>
          </div>

          <Steps current={currentStep} items={STEPS} size="small" />

          {/* Bước 0: Tài khoản */}
          {currentStep === 0 && (
            <>
              {error && <Alert message={error} type="error" showIcon />}
              <Form form={form} layout="vertical" onFinish={handleStep0} autoComplete="off">
                <Form.Item
                  name="username"
                  label="Tên đăng nhập"
                  rules={[
                    { required: true, message: 'Vui lòng nhập tên đăng nhập' },
                    { min: 3, message: 'Ít nhất 3 ký tự' },
                    { pattern: /^[a-zA-Z0-9_]+$/, message: 'Chỉ dùng chữ, số và dấu gạch dưới' },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Nhập tên đăng nhập" />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Mật khẩu"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu' },
                    { min: 6, message: 'Ít nhất 6 ký tự' },
                  ]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Tạo mật khẩu" />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="Xác nhận mật khẩu"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) return Promise.resolve();
                        return Promise.reject('Mật khẩu không khớp');
                      },
                    }),
                  ]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                  <Button type="primary" htmlType="submit" block>Tiếp theo →</Button>
                </Form.Item>
              </Form>
            </>
          )}

          {/* Bước 1: Thông tin cá nhân */}
          {currentStep === 1 && (
            <>
              {error && <Alert message={error} type="error" showIcon />}
              <Form layout="vertical" onFinish={handleStep1} autoComplete="off">
                <Form.Item
                  name="fullName"
                  label="Họ và tên"
                  rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Họ và tên của bạn" />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email' },
                    { type: 'email', message: 'Email không hợp lệ' },
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="email@example.com" />
                </Form.Item>

                <Form.Item name="phone" label="Số điện thoại (tuỳ chọn)">
                  <Input prefix={<PhoneOutlined />} placeholder="+84 xxx xxx xxx" />
                </Form.Item>

                <Space>
                  <Button onClick={() => setCurrentStep(0)}>← Quay lại</Button>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Tạo tài khoản
                  </Button>
                </Space>
              </Form>
            </>
          )}

          {/* Bước 2: Thành công */}
          {currentStep === 2 && (
            <Result
              status="success"
              title="Tạo tài khoản thành công!"
              subTitle={`Chào mừng, ${formData.username}! Tài khoản đã được tạo thành công.`}
              extra={[
                <Button type="primary" key="login" onClick={() => navigate('/login')}>
                  Đến trang đăng nhập
                </Button>,
              ]}
            />
          )}

          {currentStep < 2 && (
            <Text>
              Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
            </Text>
          )}
        </Space>
      </Card>
    </div>
  );
}
