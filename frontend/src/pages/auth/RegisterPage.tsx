import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Form, Input, Button, Card, message, Select } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons'

const { Option } = Select

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onFinish = async () => {
    setLoading(true)
    try {
      // Mock registration - in production, this would call the API
      await new Promise((resolve) => setTimeout(resolve, 1500))
      message.success('Registration successful! Please login.')
      navigate('/login')
    } catch (error) {
      message.error('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-0">
      <Card
        className="shadow-2xl p-4 md:p-6 lg:p-8"
        style={{ borderRadius: 16 }}
      >
        <div className="text-center mb-6 md:mb-8">
          <div className="text-3xl md:text-4xl mb-2">📄</div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-500 text-sm md:text-base">Join Invoice OCR Platform</p>
        </div>

        <Form
          name="register"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: 'Please input your first name!' }]}
            >
              <Input
                size="large"
                prefix={<UserOutlined />}
                placeholder="John"
              />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: 'Please input your last name!' }]}
            >
              <Input
                size="large"
                prefix={<UserOutlined />}
                placeholder="Doe"
              />
            </Form.Item>
          </div>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input
              size="large"
              prefix={<MailOutlined />}
              placeholder="john.doe@example.com"
            />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 8, message: 'Password must be at least 8 characters!' },
              ]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="********"
              />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('Passwords do not match!'))
                  },
                }),
              ]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="********"
              />
            </Form.Item>
          </div>

          <Form.Item
            label="Organization Name"
            name="organizationName"
            rules={[{ required: true, message: 'Please input your organization name!' }]}
          >
            <Input
              size="large"
              prefix={<HomeOutlined />}
              placeholder="Acme Corporation"
            />
          </Form.Item>

          <Form.Item
            label="Phone Number (Optional)"
            name="phone"
          >
            <Input
              size="large"
              prefix={<PhoneOutlined />}
              placeholder="+1-555-0100"
            />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please select your role!' }]}
            initialValue="client"
          >
            <Select size="large" placeholder="Select your role">
              <Option value="admin">Administrator</Option>
              <Option value="client">Client</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
            >
              Create Account
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4 md:mt-6">
          <span className="text-gray-500 text-sm md:text-base">Already have an account? </span>
          <Link to="/login" className="text-blue-500 font-medium text-sm md:text-base">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  )
}
