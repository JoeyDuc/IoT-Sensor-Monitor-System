import { useState } from 'react';
import { Form, Input, Button, Avatar, message, Divider } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  GithubOutlined,
  LockOutlined,
  EditOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import './ProfilePage.css';

const MOCK_PROFILE = {
  fullName: 'Administrator',
  username: 'admin',
  email: 'admin@nexaiot.com',
  phone: '+84 912 345 678',
  github: 'github.com/nexaiot',
  figma: 'figma.com/@nexaiot',
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(MOCK_PROFILE);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [pwForm] = Form.useForm();

  const handleSave = (values) => {
    setSaving(true);
    setTimeout(() => {
      setProfile((prev) => ({ ...prev, ...values }));
      messageApi.success('Profile updated successfully');
      setSaving(false);
    }, 800);
  };

  const handleChangePassword = (values) => {
    setChangingPassword(true);
    setTimeout(() => {
      messageApi.success('Password changed successfully');
      pwForm.resetFields();
      setChangingPassword(false);
    }, 800);
  };

  return (
    <div className="profile-page page-enter">
      {contextHolder}

      <div className="profile-grid">
        {/* Left: Avatar card */}
        <div className="profile-avatar-card nexa-card">
          <div className="profile-avatar-section">
            <Avatar
              size={96}
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                fontSize: '2rem',
                fontWeight: 700,
              }}
            >
              {profile.fullName.charAt(0)}
            </Avatar>
            <h2 className="profile-name">{profile.fullName}</h2>
            <p className="profile-username">@{profile.username}</p>
            <span className="badge badge-purple">Super Admin</span>
          </div>

          <Divider style={{ margin: '20px 0' }} />

          <div className="profile-meta">
            <div className="profile-meta-item">
              <MailOutlined />
              <span>{profile.email}</span>
            </div>
            <div className="profile-meta-item">
              <PhoneOutlined />
              <span>{profile.phone}</span>
            </div>
            <div className="profile-meta-item">
              <GithubOutlined />
              <span>{profile.github}</span>
            </div>
          </div>
        </div>

        {/* Right: Edit form */}
        <div className="profile-form-col">
          {/* Edit Profile */}
          <div className="nexa-card profile-form-card">
            <div className="profile-form-header">
              <EditOutlined style={{ color: 'var(--color-primary)' }} />
              <h3>Edit Profile</h3>
            </div>

            <Form
              form={form}
              layout="vertical"
              initialValues={profile}
              onFinish={handleSave}
            >
              <div className="form-row-2">
                <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
                  <Input prefix={<UserOutlined />} placeholder="Full Name" />
                </Form.Item>
                <Form.Item name="username" label="Username" rules={[{ required: true }]}>
                  <Input prefix={<UserOutlined />} placeholder="Username" />
                </Form.Item>
              </div>

              <div className="form-row-2">
                <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                  <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>
                <Form.Item name="phone" label="Phone">
                  <Input prefix={<PhoneOutlined />} placeholder="Phone" />
                </Form.Item>
              </div>

              <div className="form-row-2">
                <Form.Item name="github" label="GitHub">
                  <Input prefix={<GithubOutlined />} placeholder="GitHub URL" />
                </Form.Item>
                <Form.Item name="figma" label="Figma">
                  <Input placeholder="Figma URL" />
                </Form.Item>
              </div>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={saving}
                >
                  Save Changes
                </Button>
              </Form.Item>
            </Form>
          </div>

          {/* Change Password */}
          <div className="nexa-card profile-form-card">
            <div className="profile-form-header">
              <LockOutlined style={{ color: 'var(--color-primary)' }} />
              <h3>Change Password</h3>
            </div>

            <Form
              form={pwForm}
              layout="vertical"
              onFinish={handleChangePassword}
            >
              <Form.Item
                name="currentPassword"
                label="Current Password"
                rules={[{ required: true }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Current password" />
              </Form.Item>
              <div className="form-row-2">
                <Form.Item
                  name="newPassword"
                  label="New Password"
                  rules={[{ required: true, min: 6 }]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="New password" />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  label="Confirm Password"
                  dependencies={['newPassword']}
                  rules={[
                    { required: true },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject('Passwords do not match');
                      },
                    }),
                  ]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Confirm password" />
                </Form.Item>
              </div>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<LockOutlined />}
                  loading={changingPassword}
                >
                  Change Password
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
