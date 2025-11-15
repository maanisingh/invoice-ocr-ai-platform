import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Form, Input, Button, Card, Checkbox, message, Space, Divider, Typography } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, SafetyOutlined } from '@ant-design/icons'
import { useAuthStore } from '@/store/authStore'

const { Title, Text } = Typography

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true)
    try {
      await login(values.email, values.password)
      message.success('Welcome back! Login successful.')

      // Navigate based on role
      if (values.email.includes('admin')) {
        navigate('/admin/dashboard')
      } else {
        navigate('/client/dashboard')
      }
    } catch (error) {
      message.error('Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card
      className="glass-effect shadow-enterprise-lg p-4 md:p-6 lg:p-8"
      bordered={false}
      style={{
        borderRadius: '20px',
        overflow: 'hidden',
        maxWidth: '480px',
        width: '100%',
      }}
    >
      {/* Header Section */}
      <div className="text-center mb-6 md:mb-8">
        <div
          className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl mb-4"
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)'
          }}
        >
          <SafetyOutlined style={{ fontSize: '24px', color: 'white' }} className="md:text-3xl" />
        </div>
        <Title level={2} className="heading-enterprise mb-2 text-xl md:text-2xl lg:text-3xl" style={{ marginBottom: '8px' }}>
          Invoice OCR Platform
        </Title>
        <Text className="text-enterprise text-sm md:text-base">
          Sign in to access your intelligent invoice management system
        </Text>
      </div>

      {/* Login Form */}
      <Form
        name="login"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        size="large"
      >
        <Form.Item
          label={<span className="font-semibold text-gray-700">Email Address</span>}
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' },
          ]}
        >
          <Input
            prefix={<MailOutlined style={{ color: '#94a3b8' }} />}
            placeholder="you@company.com"
            style={{
              height: '48px',
              fontSize: '15px',
            }}
          />
        </Form.Item>

        <Form.Item
          label={<span className="font-semibold text-gray-700">Password</span>}
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
            placeholder="Enter your password"
            style={{
              height: '48px',
              fontSize: '15px',
            }}
          />
        </Form.Item>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox className="text-enterprise text-sm">Remember me</Checkbox>
          </Form.Item>
          <a
            href="#"
            className="font-medium text-sm"
            style={{ color: '#3b82f6' }}
          >
            Forgot password?
          </a>
        </div>

        <Form.Item className="mb-4">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            className="btn-enterprise"
            style={{
              height: '48px',
              fontSize: '16px',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              border: 'none',
              borderRadius: '10px',
            }}
          >
            Sign In
          </Button>
        </Form.Item>
      </Form>

      <Divider plain style={{ margin: '24px 0' }}>
        <Text type="secondary" style={{ fontSize: '13px' }}>
          Quick Demo Access
        </Text>
      </Divider>

      {/* Demo Credentials */}
      <Space direction="vertical" className="w-full" size="middle">
        <Button
          block
          size="large"
          onClick={() => onFinish({ email: 'admin@example.com', password: 'admin123' })}
          style={{
            height: '44px',
            borderRadius: '8px',
            borderColor: '#e2e8f0',
          }}
          className="hover:border-blue-400 hover:text-blue-600"
        >
          <UserOutlined /> Admin Dashboard
        </Button>
        <Button
          block
          size="large"
          onClick={() => onFinish({ email: 'client@example.com', password: 'client123' })}
          style={{
            height: '44px',
            borderRadius: '8px',
            borderColor: '#e2e8f0',
          }}
          className="hover:border-blue-400 hover:text-blue-600"
        >
          <UserOutlined /> Client Portal
        </Button>
      </Space>

      {/* Register Link */}
      <div className="text-center mt-6 md:mt-8 pt-4 md:pt-6" style={{ borderTop: '1px solid #e2e8f0' }}>
        <Text className="text-enterprise text-sm md:text-base">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold"
            style={{ color: '#3b82f6' }}
          >
            Create Account
          </Link>
        </Text>
      </div>

      {/* Security Badge */}
      <div className="text-center mt-3 md:mt-4">
        <Text type="secondary" style={{ fontSize: '11px' }} className="md:text-xs">
          <SafetyOutlined style={{ marginRight: '4px' }} />
          Enterprise-grade security & encryption
        </Text>
      </div>
    </Card>
  )
}
