import { useState, useEffect } from 'react';
import { Form, Input, Button, Avatar, message, Divider, Card, Row, Col, Typography, Space, Tag, Flex, Upload } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  GithubOutlined,
  LockOutlined,
  EditOutlined,
  SaveOutlined,
  UploadOutlined,
  DeleteOutlined,
  CameraOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const MOCK_PROFILE = {
  fullName: 'Administrator',
  username: 'admin',
  email:    'admin@nexaiot.com',
  phone:    '+84 912 345 678',
  github:   'github.com/nexaiot',
  figma:    'figma.com/@nexaiot',
};

export default function ProfilePage() {
  const [profile, setProfile]             = useState(MOCK_PROFILE);
  const [avatarUrl, setAvatarUrl]         = useState(() => localStorage.getItem('nexa_avatar') || '');
  const [saving, setSaving]               = useState(false);
  const [changingPassword, setChanging]   = useState(false);
  const [messageApi, contextHolder]       = message.useMessage();
  const [form]   = Form.useForm();
  const [pwForm] = Form.useForm();

  const handleAvatarUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      messageApi.error('Vui lòng chỉ tải lên tệp hình ảnh (JPG, PNG, WEBP, v.v.)!');
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      messageApi.error('Kích thước hình ảnh phải nhỏ hơn 5MB!');
      return false;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setAvatarUrl(dataUrl);
      try {
        localStorage.setItem('nexa_avatar', dataUrl);
        window.dispatchEvent(new Event('nexa-avatar-change'));
      } catch (err) {
        // In case localStorage quota exceeded
        console.warn('Storage quota error', err);
      }
      messageApi.success('Cập nhật ảnh đại diện thành công!');
    };
    reader.readAsDataURL(file);
    return false; // Prevent automatic upload
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl('');
    localStorage.removeItem('nexa_avatar');
    window.dispatchEvent(new Event('nexa-avatar-change'));
    messageApi.info('Đã xóa ảnh đại diện');
  };

  const handleSave = (values) => {
    setSaving(true);
    setTimeout(() => {
      setProfile((prev) => ({ ...prev, ...values }));
      messageApi.success('Cập nhật hồ sơ thành công');
      setSaving(false);
    }, 800);
  };

  const handleChangePassword = () => {
    setChanging(true);
    setTimeout(() => {
      messageApi.success('Đổi mật khẩu thành công');
      pwForm.resetFields();
      setChanging(false);
    }, 800);
  };

  return (
    <>
      {contextHolder}
      <Row gutter={[16, 16]} align="stretch">

        {/* Left: Avatar card */}
        <Col xs={24} md={7}>
          <Card style={{ height: '100%' }}>
            <Flex vertical align="center" gap={8} style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  size={88}
                  src={avatarUrl || undefined}
                  style={{
                    backgroundColor: '#1677ff',
                    fontSize: 34,
                    boxShadow: '0 4px 14px rgba(22, 119, 255, 0.25)',
                    border: '3px solid #f0f2f5',
                  }}
                >
                  {!avatarUrl && profile.fullName.charAt(0)}
                </Avatar>
              </div>

              <div>
                <Title level={4} style={{ marginBottom: 2 }}>{profile.fullName}</Title>
                <Text type="secondary">@{profile.username}</Text>
              </div>
              <Tag color="blue">Super Admin</Tag>

              {/* Upload action */}
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: '100%' }}>
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={handleAvatarUpload}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />} size="small" type="dashed">
                    Tải ảnh lên
                  </Button>
                </Upload>
                {avatarUrl && (
                  <Button
                    type="link"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={handleRemoveAvatar}
                    style={{ fontSize: 12, padding: 0, height: 'auto' }}
                  >
                    Xóa ảnh đại diện
                  </Button>
                )}
                <Text type="secondary" style={{ fontSize: 11 }}>JPG, PNG, WEBP (tối đa 5MB)</Text>
              </div>
            </Flex>

            <Divider style={{ margin: '12px 0' }} />

            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <Space>
                <MailOutlined style={{ color: '#888' }} />
                <Text>{profile.email}</Text>
              </Space>
              <Space>
                <PhoneOutlined style={{ color: '#888' }} />
                <Text>{profile.phone}</Text>
              </Space>
              <Space>
                <GithubOutlined style={{ color: '#888' }} />
                <Text>{profile.github}</Text>
              </Space>
            </Space>
          </Card>
        </Col>

        {/* Right: Forms */}
        <Col xs={24} md={17}>
          <Space direction="vertical" size="middle" style={{ width: '100%', display: 'flex' }}>

            {/* Edit Profile */}
            <Card title={<Space><EditOutlined />Chỉnh sửa hồ sơ</Space>}>
              <Form form={form} layout="vertical" initialValues={profile} onFinish={handleSave}>
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
                      <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}>
                      <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}>
                      <Input prefix={<MailOutlined />} placeholder="Email" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="phone" label="Số điện thoại">
                      <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item name="github" label="GitHub">
                      <Input prefix={<GithubOutlined />} placeholder="GitHub URL" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="figma" label="Figma">
                      <Input placeholder="Figma URL" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item style={{ marginBottom: 0 }}>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving}>
                    Lưu thay đổi
                  </Button>
                </Form.Item>
              </Form>
            </Card>

            {/* Change Password */}
            <Card title={<Space><LockOutlined />Đổi mật khẩu</Space>}>
              <Form form={pwForm} layout="vertical" onFinish={handleChangePassword}>
                <Form.Item
                  name="currentPassword"
                  label="Mật khẩu hiện tại"
                  rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu hiện tại" />
                </Form.Item>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="newPassword"
                      label="Mật khẩu mới"
                      rules={[{ required: true, min: 6, message: 'Ít nhất 6 ký tự' }]}
                    >
                      <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu mới" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="confirmPassword"
                      label="Xác nhận mật khẩu mới"
                      dependencies={['newPassword']}
                      rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
                            return Promise.reject('Mật khẩu không khớp');
                          },
                        }),
                      ]}
                    >
                      <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu mới" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item style={{ marginBottom: 0 }}>
                  <Button type="primary" htmlType="submit" icon={<LockOutlined />} loading={changingPassword}>
                    Đổi mật khẩu
                  </Button>
                </Form.Item>
              </Form>
            </Card>

          </Space>
        </Col>
      </Row>
    </>
  );
}
