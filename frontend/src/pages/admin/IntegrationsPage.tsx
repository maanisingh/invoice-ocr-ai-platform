import { Card, Tabs, Button, Space, List, Tag, Switch, Modal, Form, Input, Select, message } from 'antd'
import { PlusOutlined, CheckCircleOutlined, CloseCircleOutlined, SyncOutlined, MailOutlined, WhatsAppOutlined, ApiOutlined } from '@ant-design/icons'
import { QRCodeSVG } from 'qrcode.react'
import { mockEmailIntegrations, mockWhatsAppIntegration, mockAccountingIntegrations } from '@/utils/mockData'
import { useState } from 'react'

const { Option } = Select

export default function IntegrationsPage() {
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false)
  const [isAccountingModalVisible, setIsAccountingModalVisible] = useState(false)
  const [showQR, setShowQR] = useState(false)

  const EmailTab = (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <p className="text-gray-600 text-sm sm:text-base">Connect email accounts to automatically process invoices</p>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsEmailModalVisible(true)} className="w-full sm:w-auto">
          Add Email Account
        </Button>
      </div>

      <List
        dataSource={mockEmailIntegrations}
        renderItem={(item) => (
          <Card className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Space size="middle" className="flex-1">
                <MailOutlined className="text-xl sm:text-2xl" style={{ color: '#1677ff' }} />
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-base sm:text-lg truncate">{item.email}</h3>
                  <Space wrap className="mt-1">
                    <Tag color={item.status === 'connected' ? 'success' : 'error'}>
                      {item.status === 'connected' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                      {item.status}
                    </Tag>
                    <Tag>{item.provider.toUpperCase()}</Tag>
                  </Space>
                  {item.lastSync && (
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Last synced: {new Date(item.lastSync).toLocaleString()}
                    </p>
                  )}
                </div>
              </Space>
              <Space wrap className="justify-center sm:justify-end">
                <Button icon={<SyncOutlined />} onClick={() => message.success('Syncing...')} size="small" className="w-full sm:w-auto">
                  Sync Now
                </Button>
                <Button onClick={() => message.success('Testing connection...')} size="small" className="w-full sm:w-auto">
                  Test
                </Button>
                <Button danger onClick={() => message.success('Disconnected')} size="small" className="w-full sm:w-auto">
                  Disconnect
                </Button>
              </Space>
            </div>
          </Card>
        )}
      />
    </div>
  )

  const WhatsAppTab = (
    <div className="space-y-4 sm:space-y-6">
      <p className="text-gray-600 text-sm sm:text-base">Connect WhatsApp to receive and process invoices via messages</p>

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Space size="middle" className="flex-1">
            <WhatsAppOutlined className="text-xl sm:text-2xl" style={{ color: '#25D366' }} />
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-base sm:text-lg">WhatsApp Business</h3>
              <Space wrap className="mt-1">
                <Tag color={mockWhatsAppIntegration.status === 'connected' ? 'success' : 'warning'}>
                  {mockWhatsAppIntegration.status === 'connected' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                  {mockWhatsAppIntegration.status}
                </Tag>
                {mockWhatsAppIntegration.phoneNumber && (
                  <Tag>{mockWhatsAppIntegration.phoneNumber}</Tag>
                )}
              </Space>
            </div>
          </Space>
          <Space wrap className="justify-center sm:justify-end">
            {mockWhatsAppIntegration.status === 'connected' ? (
              <>
                <Button icon={<SyncOutlined />} onClick={() => message.success('Syncing...')} size="small" className="w-full sm:w-auto">
                  Sync Now
                </Button>
                <Button danger onClick={() => message.success('Disconnected')} size="small" className="w-full sm:w-auto">
                  Disconnect
                </Button>
              </>
            ) : (
              <Button type="primary" onClick={() => setShowQR(true)} className="w-full sm:w-auto">
                Connect WhatsApp
              </Button>
            )}
          </Space>
        </div>

        {showQR && (
          <div className="mt-4 sm:mt-6 text-center p-4 sm:p-6 bg-gray-50 rounded">
            <h4 className="text-base sm:text-lg font-medium mb-4">Scan QR Code with WhatsApp</h4>
            <QRCodeSVG value="https://wa.me/qr/DEMO" size={window.innerWidth < 640 ? 150 : 200} />
            <p className="text-xs sm:text-sm text-gray-500 mt-4">
              Open WhatsApp on your phone → Settings → Linked Devices → Link a Device
            </p>
          </div>
        )}
      </Card>
    </div>
  )

  const AccountingTab = (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <p className="text-gray-600 text-sm sm:text-base">Sync invoices with your accounting software</p>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAccountingModalVisible(true)} className="w-full sm:w-auto">
          Add Integration
        </Button>
      </div>

      <List
        dataSource={mockAccountingIntegrations}
        renderItem={(item) => (
          <Card className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Space size="middle" className="flex-1">
                <ApiOutlined className="text-xl sm:text-2xl" style={{ color: '#1677ff' }} />
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-base sm:text-lg capitalize">{item.provider}</h3>
                  <Space wrap className="mt-1">
                    <Tag color={item.status === 'connected' ? 'success' : 'error'}>
                      {item.status === 'connected' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                      {item.status}
                    </Tag>
                  </Space>
                  {item.lastSync && (
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Last synced: {new Date(item.lastSync).toLocaleString()}
                    </p>
                  )}
                </div>
              </Space>
              <Space wrap className="justify-center sm:justify-end">
                <Button icon={<SyncOutlined />} onClick={() => message.success('Syncing...')} size="small" className="w-full sm:w-auto">
                  Sync Now
                </Button>
                <Button onClick={() => setIsAccountingModalVisible(true)} size="small" className="w-full sm:w-auto">
                  Configure
                </Button>
                <Button danger onClick={() => message.success('Disconnected')} size="small" className="w-full sm:w-auto">
                  Disconnect
                </Button>
              </Space>
            </div>
          </Card>
        )}
      />

      <Card title="Available Integrations" className="mt-4 sm:mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {['QuickBooks', 'Xero', 'SAP', 'NetSuite', 'FreshBooks', 'Zoho Books'].map((name) => (
            <div key={name} className="p-3 sm:p-4 border rounded text-center hover:border-blue-500 cursor-pointer">
              <h4 className="font-medium text-sm sm:text-base">{name}</h4>
              <Button type="link" size="small" onClick={() => message.info(`Connecting to ${name}...`)} className="mt-2">
                Connect
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Integrations</h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">Connect with email, WhatsApp, and accounting systems</p>
      </div>

      <Tabs
        defaultActiveKey="email"
        items={[
          {
            key: 'email',
            label: (
              <span className="text-sm sm:text-base">
                <MailOutlined /> Email Integration
              </span>
            ),
            children: EmailTab,
          },
          {
            key: 'whatsapp',
            label: (
              <span className="text-sm sm:text-base">
                <WhatsAppOutlined /> WhatsApp
              </span>
            ),
            children: WhatsAppTab,
          },
          {
            key: 'accounting',
            label: (
              <span className="text-sm sm:text-base">
                <ApiOutlined /> Accounting Systems
              </span>
            ),
            children: AccountingTab,
          },
        ]}
      />

      <Modal
        title="Add Email Integration"
        open={isEmailModalVisible}
        onCancel={() => setIsEmailModalVisible(false)}
        onOk={() => {
          message.success('Email integration added successfully')
          setIsEmailModalVisible(false)
        }}
        width={window.innerWidth < 640 ? '90%' : 520}
        centered
      >
        <Form layout="vertical">
          <Form.Item label="Provider" name="provider" rules={[{ required: true }]}>
            <Select>
              <Option value="gmail">Gmail</Option>
              <Option value="outlook">Outlook</Option>
              <Option value="imap">IMAP (Generic)</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Email Address" name="email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Button type="primary" block>
            Connect with OAuth
          </Button>
        </Form>
      </Modal>

      <Modal
        title="Configure Accounting Integration"
        open={isAccountingModalVisible}
        onCancel={() => setIsAccountingModalVisible(false)}
        onOk={() => {
          message.success('Configuration saved')
          setIsAccountingModalVisible(false)
        }}
        width={window.innerWidth < 640 ? '95%' : window.innerWidth < 1024 ? '80%' : 700}
        centered
      >
        <Form layout="vertical">
          <Form.Item label="Auto-sync invoices" name="autoSync" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="Field Mapping">
            <Space direction="vertical" className="w-full">
              <Input addonBefore="Vendor Name" placeholder="vendor" />
              <Input addonBefore="Invoice Number" placeholder="docNumber" />
              <Input addonBefore="Total Amount" placeholder="totalAmt" />
              <Input addonBefore="Invoice Date" placeholder="txnDate" />
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
