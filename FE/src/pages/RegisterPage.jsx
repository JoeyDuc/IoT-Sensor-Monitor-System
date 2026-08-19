import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Alert, Steps } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  ThunderboltOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
import './RegisterPage.css';

const STEPS = ['Account Info', 'Personal Info', 'Done'];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({});
  const [form] = Form.useForm();

  /* ── Step 0: Account credentials ── */
  const handleStep0 = (values) => {
    setError('');
    // Mock: check duplicate username
    if (values.username === 'admin') {
      setError('Username "admin" already exists. Please choose another.');
      return;
    }
    setFormData((prev) => ({ ...prev, ...values }));
    setCurrentStep(1);
  };

  /* ── Step 1: Personal info ── */
  const handleStep1 = (values) => {
    setLoading(true);
    setError('');
    const finalData = { ...formData, ...values };
    // Simulate register delay
    setTimeout(() => {
      // Store mock user in localStorage
      const users = JSON.parse(localStorage.getItem('nexa_users') || '[]');
      users.push({
        username: finalData.username,
        password: finalData.password,
        fullName: finalData.fullName,
        email: finalData.email,
        phone: finalData.phone || '',
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('nexa_users', JSON.stringify(users));
      setLoading(false);
      setCurrentStep(2);
    }, 1000);
  };

  const handleGoLogin = () => {
    navigate('/login');
  };

  return (
    <div className="register-page">
      {/* Left panel */}
      <div className="register-panel-left">
        <div className="register-brand">
          <div className="register-brand-icon">
            <ThunderboltOutlined />
          </div>
          <h2>NEXA IoT</h2>
        </div>
        <div className="register-panel-content">
          <h1>Join NEXA IoT</h1>
          <p>
            Create your account and start managing your IoT devices with a unified, real-time platform.
          </p>
          <div className="register-features">
            <div className="register-feature-item">
              <span className="register-feature-dot" />
              Free to get started
            </div>
            <div className="register-feature-item">
              <span className="register-feature-dot" />
              Real-time sensor monitoring
            </div>
            <div className="register-feature-item">
              <span className="register-feature-dot" />
              Secure device management
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="register-panel-right">
        <div className="register-form-wrapper">

          {/* Steps indicator */}
          <Steps
            current={currentStep}
            size="small"
            className="register-steps"
            items={STEPS.map((s, i) => ({ title: s }))}
          />

          {/* ── Step 0 ── */}
          {currentStep === 0 && (
            <>
              <div className="register-form-header">
                <h2>Create account</h2>
                <p>Set up your login credentials.</p>
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
                form={form}
                layout="vertical"
                onFinish={handleStep0}
                autoComplete="off"
                size="large"
              >
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[
                    { required: true, message: 'Please enter a username' },
                    { min: 3, message: 'At least 3 characters' },
                    { pattern: /^[a-zA-Z0-9_]+$/, message: 'Letters, numbers and underscore only' },
                  ]}
                >
                  <Input prefix={<UserOutlined style={{ color: '#a78bfa' }} />} placeholder="Choose a username" />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: 'Please enter a password' },
                    { min: 6, message: 'At least 6 characters' },
                  ]}
                >
                  <Input.Password prefix={<LockOutlined style={{ color: '#a78bfa' }} />} placeholder="Create password" />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="Confirm Password"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Please confirm your password' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject('Passwords do not match');
                      },
                    }),
                  ]}
                >
                  <Input.Password prefix={<LockOutlined style={{ color: '#a78bfa' }} />} placeholder="Confirm password" />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                  <Button type="primary" htmlType="submit" block className="register-btn">
                    Continue →
                  </Button>
                </Form.Item>
              </Form>
            </>
          )}

          {/* ── Step 1 ── */}
          {currentStep === 1 && (
            <>
              <div className="register-form-header">
                <h2>Personal info</h2>
                <p>Tell us a bit about yourself.</p>
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
                onFinish={handleStep1}
                autoComplete="off"
                size="large"
              >
                <Form.Item
                  name="fullName"
                  label="Full Name"
                  rules={[{ required: true, message: 'Please enter your full name' }]}
                >
                  <Input prefix={<UserOutlined style={{ color: '#a78bfa' }} />} placeholder="Your full name" />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Invalid email format' },
                  ]}
                >
                  <Input prefix={<MailOutlined style={{ color: '#a78bfa' }} />} placeholder="your@email.com" />
                </Form.Item>

                <Form.Item name="phone" label="Phone (optional)">
                  <Input prefix={<PhoneOutlined style={{ color: '#a78bfa' }} />} placeholder="+84 xxx xxx xxx" />
                </Form.Item>

                <div className="register-step1-actions">
                  <Button onClick={() => setCurrentStep(0)} className="register-back-btn">
                    ← Back
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="register-btn register-btn-flex"
                  >
                    Create Account
                  </Button>
                </div>
              </Form>
            </>
          )}

          {/* ── Step 2: Success ── */}
          {currentStep === 2 && (
            <div className="register-success">
              <CheckCircleFilled className="register-success-icon" />
              <h2>Account created!</h2>
              <p>
                Welcome, <strong>{formData.username}</strong>! Your account has been successfully created.
              </p>
              <Button type="primary" block className="register-btn" onClick={handleGoLogin}>
                Go to Login
              </Button>
            </div>
          )}

          {/* Footer link (only on steps 0 & 1) */}
          {currentStep < 2 && (
            <p className="register-login-link">
              Already have an account?{' '}
              <Link to="/login">Sign in</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
