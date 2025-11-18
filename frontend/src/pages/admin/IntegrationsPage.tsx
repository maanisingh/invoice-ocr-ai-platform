import { useState } from 'react'
import { Card, Tabs, Button, Space, List, Tag, Switch, Modal, Form, Input, Select, message } from 'antd'
import {
  PlusOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  MailOutlined,
  WhatsAppOutlined,
  ApiOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  CloudOutlined,
  LinkOutlined,
} from '@ant-design/icons'
import { QRCodeSVG } from 'qrcode.react'
import { mockEmailIntegrations, mockWhatsAppIntegration } from '@/utils/mockData'
import { motion } from 'framer-motion'
import { cn, modernCard, hoverLift, hoverGlow } from '@/lib/utils'

const { Option } = Select

interface Platform {
  id: string
  name: string
  description: string
  icon: string
  color: string
  type: 'accounting' | 'erp' | 'payment' | 'storage'
  status: 'connected' | 'disconnected'
  features: string[]
  apiKey?: string
  webhookUrl?: string
}

const platforms: Platform[] = [
  {
    id: 'quickbooks',
    name: 'QuickBooks Online',
    description: 'Sync invoices and vendors automatically',
    icon: 'https://cdn.worldvectorlogo.com/logos/quickbooks-1.svg',
    color: '#2CA01C',
    type: 'accounting',
    status: 'disconnected',
    features: ['Invoice Sync', 'Vendor Sync', 'Auto Categorize'],
  },
  {
    id: 'xero',
    name: 'Xero',
    description: 'Complete accounting integration',
    icon: 'https://logo.clearbit.com/xero.com',
    color: '#13B5EA',
    type: 'accounting',
    status: 'disconnected',
    features: ['Invoice Sync', 'Multi-Currency', 'Bank Reconciliation'],
  },
  {
    id: 'sap',
    name: 'SAP Business One',
    description: 'Enterprise resource planning integration',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg',
    color: '#0FAAFF',
    type: 'erp',
    status: 'disconnected',
    features: ['Purchase Orders', 'Approval Workflow', 'Invoice Sync'],
  },
  {
    id: 'netsuite',
    name: 'NetSuite',
    description: 'Cloud ERP and financial management',
    icon: 'https://cdn.worldvectorlogo.com/logos/netsuite-1.svg',
    color: '#FF6700',
    type: 'erp',
    status: 'disconnected',
    features: ['Invoice Sync', 'Expense Management', 'Financial Reporting'],
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Payment processing and invoicing',
    icon: 'https://cdn.worldvectorlogo.com/logos/stripe-4.svg',
    color: '#635BFF',
    type: 'payment',
    status: 'disconnected',
    features: ['Payment Tracking', 'Invoice Matching', 'Revenue Recognition'],
  },
  {
    id: 'googledrive',
    name: 'Google Drive',
    description: 'Auto-save invoices to Google Drive',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg',
    color: '#4285F4',
    type: 'storage',
    status: 'disconnected',
    features: ['Auto Backup', 'Folder Organization', 'OCR Results Storage'],
  },
  {
    id: 'dropbox',
    name: 'Dropbox Business',
    description: 'Secure cloud storage for invoices',
    icon: 'https://cdn.worldvectorlogo.com/logos/dropbox-1.svg',
    color: '#0061FF',
    type: 'storage',
    status: 'disconnected',
    features: ['Auto Backup', 'Version History', 'Team Access'],
  },
]

export default function IntegrationsPage() {
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [connectedPlatforms, setConnectedPlatforms] = useState<Set<string>>(new Set())
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null)
  const [isConfigModalVisible, setIsConfigModalVisible] = useState(false)

  const toggleConnection = (platformId: string) => {
    const newSet = new Set(connectedPlatforms)
    if (newSet.has(platformId)) {
      newSet.delete(platformId)
      message.success('Platform disconnected')
    } else {
      newSet.add(platformId)
      message.success('Platform connected successfully')
    }
    setConnectedPlatforms(newSet)
  }

  const handleConfigure = (platform: Platform) => {
    setSelectedPlatform(platform)
    setIsConfigModalVisible(true)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'accounting':
        return <ApiOutlined />
      case 'erp':
        return <ThunderboltOutlined />
      case 'payment':
        return <CheckCircleOutlined />
      case 'storage':
        return <CloudOutlined />
      default:
        return <ApiOutlined />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'accounting':
        return 'blue'
      case 'erp':
        return 'purple'
      case 'payment':
        return 'green'
      case 'storage':
        return 'orange'
      default:
        return 'default'
    }
  }

  const EmailTab = (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600">Connect email accounts to automatically process invoices</p>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsEmailModalVisible(true)}>
          Add Email Account
        </Button>
      </div>

      <List
        dataSource={mockEmailIntegrations}
        renderItem={(item) => (
          <Card className="mb-4">
            <div className="flex items-center justify-between">
              <Space size="large">
                <MailOutlined style={{ fontSize: 32, color: '#1677ff' }} />
                <div>
                  <h3 className="font-medium text-lg">{item.email}</h3>
                  <Space>
                    <Tag color={item.status === 'connected' ? 'success' : 'error'}>
                      {item.status === 'connected' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                      {item.status}
                    </Tag>
                    <Tag>{item.provider.toUpperCase()}</Tag>
                  </Space>
                  {item.lastSync && (
                    <p className="text-sm text-gray-500 mt-1">
                      Last synced: {new Date(item.lastSync).toLocaleString()}
                    </p>
                  )}
                </div>
              </Space>
              <Space>
                <Button icon={<SyncOutlined />} onClick={() => message.success('Syncing...')}>
                  Sync Now
                </Button>
                <Button onClick={() => message.success('Testing connection...')}>Test</Button>
                <Button danger onClick={() => message.success('Disconnected')}>
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
    <div className="space-y-6">
      <p className="text-gray-600">Connect WhatsApp to receive and process invoices via messages</p>

      <Card>
        <div className="flex items-center justify-between">
          <Space size="large">
            <WhatsAppOutlined style={{ fontSize: 32, color: '#25D366' }} />
            <div>
              <h3 className="font-medium text-lg">WhatsApp Business</h3>
              <Space>
                <Tag color={mockWhatsAppIntegration.status === 'connected' ? 'success' : 'warning'}>
                  {mockWhatsAppIntegration.status === 'connected' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                  {mockWhatsAppIntegration.status}
                </Tag>
                {mockWhatsAppIntegration.phoneNumber && <Tag>{mockWhatsAppIntegration.phoneNumber}</Tag>}
              </Space>
            </div>
          </Space>
          <Space>
            {mockWhatsAppIntegration.status === 'connected' ? (
              <>
                <Button icon={<SyncOutlined />} onClick={() => message.success('Syncing...')}>
                  Sync Now
                </Button>
                <Button danger onClick={() => message.success('Disconnected')}>
                  Disconnect
                </Button>
              </>
            ) : (
              <Button type="primary" onClick={() => setShowQR(true)}>
                Connect WhatsApp
              </Button>
            )}
          </Space>
        </div>

        {showQR && (
          <div className="mt-6 text-center p-6 bg-gray-50 rounded">
            <h4 className="text-lg font-medium mb-4">Scan QR Code with WhatsApp</h4>
            <QRCodeSVG value="https://wa.me/qr/DEMO" size={200} />
            <p className="text-sm text-gray-500 mt-4">
              Open WhatsApp on your phone → Settings → Linked Devices → Link a Device
            </p>
          </div>
        )}
      </Card>
    </div>
  )

  const PlatformIntegrationsTab = (
    <div className="space-y-6">
      <p className="text-gray-600 mb-6">Connect with accounting, ERP, payment, and storage platforms</p>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {platforms.map((platform, index) => (
          <motion.div
            key={platform.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(modernCard, 'bg-white p-6', hoverLift, hoverGlow)}
          >
            <div className="flex items-start gap-6">
              {/* Logo */}
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center p-3 shadow-xl flex-shrink-0 bg-white"
                style={{
                  border: `2px solid ${platform.color}30`,
                }}
              >
                <img src={platform.icon} alt={platform.name} className="w-full h-full object-contain" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">{platform.name}</h3>
                    <p className="text-sm text-gray-600 font-medium mb-3">{platform.description}</p>
                    <Tag icon={getTypeIcon(platform.type)} color={getTypeColor(platform.type)} className="font-bold">
                      {platform.type.toUpperCase()}
                    </Tag>
                  </div>
                  <Switch checked={connectedPlatforms.has(platform.id)} onChange={() => toggleConnection(platform.id)} />
                </div>

                {/* Features */}
                <div className="mb-4">
                  <div className="text-xs font-bold text-gray-500 mb-2">FEATURES</div>
                  <div className="flex flex-wrap gap-2">
                    {platform.features.map((feature) => (
                      <span key={feature} className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-bold">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                {connectedPlatforms.has(platform.id) ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-green-600 font-bold">
                      <CheckCircleOutlined />
                      Connected
                    </div>
                    <Button icon={<SettingOutlined />} onClick={() => handleConfigure(platform)} className="font-bold">
                      Configure
                    </Button>
                    <Button icon={<SyncOutlined />} onClick={() => message.success('Syncing...')} className="font-bold">
                      Sync
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="primary"
                    icon={<LinkOutlined />}
                    onClick={() => toggleConnection(platform.id)}
                    className="font-bold"
                  >
                    Connect to {platform.name}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Platform Integrations</h1>
        <p className="text-gray-500 mt-1">Connect with email, WhatsApp, accounting, and business platforms</p>
      </div>

      <Tabs
        defaultActiveKey="platforms"
        items={[
          {
            key: 'platforms',
            label: (
              <span>
                <ApiOutlined /> Business Platforms
              </span>
            ),
            children: PlatformIntegrationsTab,
          },
          {
            key: 'email',
            label: (
              <span>
                <MailOutlined /> Email Integration
              </span>
            ),
            children: EmailTab,
          },
          {
            key: 'whatsapp',
            label: (
              <span>
                <WhatsAppOutlined /> WhatsApp
              </span>
            ),
            children: WhatsAppTab,
          },
        ]}
      />

      {/* Email Modal */}
      <Modal
        title="Add Email Integration"
        open={isEmailModalVisible}
        onCancel={() => setIsEmailModalVisible(false)}
        onOk={() => {
          message.success('Email integration added successfully')
          setIsEmailModalVisible(false)
        }}
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

      {/* Platform Configuration Modal */}
      <Modal
        title={`Configure ${selectedPlatform?.name || 'Platform'}`}
        open={isConfigModalVisible}
        onCancel={() => setIsConfigModalVisible(false)}
        onOk={() => {
          message.success('Configuration saved successfully')
          setIsConfigModalVisible(false)
        }}
        width={700}
      >
        <Form layout="vertical">
          <Form.Item label="API Key" name="apiKey">
            <Input.Password placeholder="Enter your API key" />
          </Form.Item>
          <Form.Item label="Webhook URL" name="webhookUrl">
            <Input placeholder="https://your-domain.com/webhook" />
          </Form.Item>
          <Form.Item label="Auto-sync invoices" name="autoSync" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="Sync Frequency" name="syncFrequency">
            <Select defaultValue="hourly">
              <Option value="realtime">Real-time</Option>
              <Option value="hourly">Hourly</Option>
              <Option value="daily">Daily</Option>
              <Option value="manual">Manual only</Option>
            </Select>
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
