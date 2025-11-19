import { Card, Form, Input, Button, Avatar, Upload, message, Switch } from 'antd'
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, UploadOutlined } from '@ant-design/icons'
import { useAuthStore } from '@/store/authStore'

export default function ClientProfilePage() {
  const { user, updateUser } = useAuthStore()
  const [profileForm] = Form.useForm()

  const onFinishProfile = (values: any) => {
    updateUser(values)
    message.success('Profile updated successfully')
  }

  const onFinishPassword = () => {
    message.success('Password changed successfully')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-4xl font-black text-gray-900 mb-6">My Profile</h1>
      <Card title="Profile Information">
        <div className="flex items-center gap-6 mb-6">
          <Avatar size={100} src={user?.avatar} icon={<UserOutlined />} />
          <Upload
            beforeUpload={() => {
              message.success('Profile picture updated')
              return false
            }}
          >
            <Button icon={<UploadOutlined />}>Change Photo</Button>
          </Upload>
        </div>

        <Form
          form={profileForm}
          layout="vertical"
          onFinish={onFinishProfile}
          initialValues={{
            firstName: user?.firstName,
            lastName: user?.lastName,
            email: user?.email,
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true }]}
            >
              <Input prefix={<UserOutlined />} />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true }]}
            >
              <Input prefix={<UserOutlined />} />
            </Form.Item>
          </div>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
          >
            <Input prefix={<PhoneOutlined />} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Change Password">
        <Form
          layout="vertical"
          onFinish={onFinishPassword}
        >
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[{ required: true }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true },
              { min: 8, message: 'Password must be at least 8 characters' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Passwords do not match!'))
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Notification Preferences">
        <Form layout="vertical">
          <Form.Item label="Email Notifications" name="emailNotif" valuePropName="checked" initialValue={true}>
            <Switch />
            <p className="text-sm text-gray-500 mt-1">Receive email notifications for invoice updates</p>
          </Form.Item>

          <Form.Item label="Invoice Processing Alerts" name="processingAlerts" valuePropName="checked" initialValue={true}>
            <Switch />
            <p className="text-sm text-gray-500 mt-1">Get notified when invoices are processed</p>
          </Form.Item>

          <Form.Item label="Weekly Summary" name="weeklySummary" valuePropName="checked" initialValue={false}>
            <Switch />
            <p className="text-sm text-gray-500 mt-1">Receive weekly summary of your invoices</p>
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={() => message.success('Preferences saved')}>
              Save Preferences
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
