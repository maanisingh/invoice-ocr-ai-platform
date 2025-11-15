import { useState } from 'react'
import { Card, Button, Table, Space, Typography, message, Modal, Input, Tag, Tooltip, Alert } from 'antd'
import { PlusOutlined, KeyOutlined, CopyOutlined, DeleteOutlined, EyeOutlined, EyeInvisibleOutlined, ApiOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Title, Text, Paragraph } = Typography

interface APIKey {
  id: string
  name: string
  key: string
  createdAt: string
  lastUsed: string | null
  status: 'active' | 'revoked'
}

export default function APIKeysPage() {
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [newKeyVisible, setNewKeyVisible] = useState(false)
  const [newKeyValue, setNewKeyValue] = useState('')
  const [keyName, setKeyName] = useState('')
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set())

  // Mock data
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Production API',
      key: 'isk_live_1234567890abcdefghijklmnopqrstuvwxyz',
      createdAt: '2025-01-15',
      lastUsed: '2025-11-13',
      status: 'active',
    },
    {
      id: '2',
      name: 'Development API',
      key: 'isk_test_abcdefghijklmnopqrstuvwxyz1234567890',
      createdAt: '2025-01-10',
      lastUsed: '2025-11-12',
      status: 'active',
    },
  ])

  const maskKey = (key: string) => {
    if (key.length < 20) return key
    return `${key.substring(0, 12)}...${key.substring(key.length - 4)}`
  }

  const toggleKeyVisibility = (keyId: string) => {
    const newRevealed = new Set(revealedKeys)
    if (newRevealed.has(keyId)) {
      newRevealed.delete(keyId)
    } else {
      newRevealed.add(keyId)
    }
    setRevealedKeys(newRevealed)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    message.success('API key copied to clipboard!')
  }

  const handleCreateKey = () => {
    if (!keyName.trim()) {
      message.error('Please enter a key name')
      return
    }

    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      const newKey = `isk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
      const newApiKey: APIKey = {
        id: Date.now().toString(),
        name: keyName,
        key: newKey,
        createdAt: new Date().toISOString().split('T')[0],
        lastUsed: null,
        status: 'active',
      }

      setApiKeys([newApiKey, ...apiKeys])
      setNewKeyValue(newKey)
      setNewKeyVisible(true)
      setModalVisible(false)
      setKeyName('')
      setLoading(false)
      message.success('API key created successfully!')
    }, 1000)
  }

  const handleRevokeKey = (keyId: string) => {
    Modal.confirm({
      title: 'Revoke API Key',
      content: 'Are you sure you want to revoke this API key? This action cannot be undone and will immediately stop all requests using this key.',
      okText: 'Revoke',
      okType: 'danger',
      onOk: () => {
        setApiKeys(apiKeys.map(key =>
          key.id === keyId ? { ...key, status: 'revoked' as const } : key
        ))
        message.success('API key revoked successfully')
      },
    })
  }

  const columns: ColumnsType<APIKey> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: APIKey) => (
        <Space>
          <KeyOutlined style={{ color: record.status === 'active' ? '#3b82f6' : '#94a3b8' }} />
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    {
      title: 'API Key',
      dataIndex: 'key',
      key: 'key',
      render: (key: string, record: APIKey) => (
        <Space>
          <code style={{
            backgroundColor: '#f1f5f9',
            padding: '4px 8px',
            borderRadius: '4px',
            fontFamily: 'monospace'
          }}>
            {revealedKeys.has(record.id) ? key : maskKey(key)}
          </code>
          <Tooltip title={revealedKeys.has(record.id) ? 'Hide' : 'Reveal'}>
            <Button
              type="text"
              size="small"
              icon={revealedKeys.has(record.id) ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              onClick={() => toggleKeyVisibility(record.id)}
            />
          </Tooltip>
          <Tooltip title="Copy to clipboard">
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(key)}
            />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Last Used',
      dataIndex: 'lastUsed',
      key: 'lastUsed',
      render: (date: string | null) => date ? new Date(date).toLocaleDateString() : 'Never',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: APIKey) => (
        record.status === 'active' ? (
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleRevokeKey(record.id)}
          >
            Revoke
          </Button>
        ) : (
          <Text type="secondary">Revoked</Text>
        )
      ),
    },
  ]

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-4 md:mb-6">
        <Title level={2} className="heading-enterprise mb-2 text-xl md:text-2xl lg:text-3xl">
          <ApiOutlined className="mr-2" />
          API Keys
        </Title>
        <Text className="text-enterprise text-sm md:text-base">
          Manage your API keys to integrate invoice data into your applications
        </Text>
      </div>

      {/* Info Alert */}
      <Alert
        message="Secure Your API Keys"
        description="Never share your API keys publicly or commit them to version control. Treat them like passwords and store them securely in environment variables."
        type="info"
        showIcon
        closable
        className="mb-4 md:mb-6"
        style={{ borderRadius: '8px' }}
      />

      {/* API Keys Card */}
      <Card
        className="enterprise-card"
        title={
          <Space>
            <KeyOutlined />
            <Text strong>Your API Keys</Text>
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
            className="btn-enterprise"
          >
            Create New Key
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={apiKeys}
            rowKey="id"
            pagination={false}
            locale={{
              emptyText: 'No API keys yet. Create your first one to get started!',
            }}
          />
        </div>
      </Card>

      {/* Documentation Card */}
      <Card className="enterprise-card mt-4 md:mt-6" title="API Documentation">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text strong className="text-base">Base URL</Text>
            <Paragraph copyable={{ text: 'https://invoices-api.alexandratechlab.com' }}>
              <code style={{
                backgroundColor: '#f1f5f9',
                padding: '8px 12px',
                borderRadius: '6px',
                display: 'block',
                marginTop: '8px'
              }}>
                https://invoices-api.alexandratechlab.com
              </code>
            </Paragraph>
          </div>

          <div>
            <Text strong className="text-base">Authentication</Text>
            <Paragraph>
              Include your API key in the request header:
            </Paragraph>
            <code style={{
              backgroundColor: '#f1f5f9',
              padding: '12px',
              borderRadius: '6px',
              display: 'block',
              fontFamily: 'monospace',
              fontSize: '13px'
            }}>
              Authorization: Bearer YOUR_API_KEY
            </code>
          </div>

          <div>
            <Text strong className="text-base">Example Request</Text>
            <pre style={{
              backgroundColor: '#f1f5f9',
              padding: '16px',
              borderRadius: '6px',
              overflow: 'auto',
              fontSize: '13px'
            }}>
{`curl https://invoices-api.alexandratechlab.com/api/v1/invoices \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
            </pre>
          </div>

          <Button type="link" href="https://invoices-api.alexandratechlab.com/docs" target="_blank">
            View Full API Documentation →
          </Button>
        </Space>
      </Card>

      {/* Create Key Modal */}
      <Modal
        title="Create New API Key"
        open={modalVisible}
        onOk={handleCreateKey}
        onCancel={() => {
          setModalVisible(false)
          setKeyName('')
        }}
        confirmLoading={loading}
        okText="Create Key"
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Text strong>Key Name</Text>
            <Input
              placeholder="e.g., Production API, Development, Mobile App"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              size="large"
              style={{ marginTop: '8px' }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Choose a descriptive name to help you identify this key later
            </Text>
          </div>
        </Space>
      </Modal>

      {/* New Key Display Modal */}
      <Modal
        title="API Key Created Successfully!"
        open={newKeyVisible}
        onOk={() => setNewKeyVisible(false)}
        onCancel={() => setNewKeyVisible(false)}
        footer={[
          <Button key="done" type="primary" onClick={() => setNewKeyVisible(false)}>
            Done
          </Button>
        ]}
      >
        <Alert
          message="Important: Save your API key now"
          description="For security reasons, you won't be able to see this key again. Make sure to copy it and store it securely."
          type="warning"
          showIcon
          className="mb-4"
        />
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text strong>Your new API key:</Text>
          <Input.TextArea
            value={newKeyValue}
            readOnly
            autoSize
            style={{ fontFamily: 'monospace', fontSize: '13px' }}
          />
          <Button
            icon={<CopyOutlined />}
            onClick={() => copyToClipboard(newKeyValue)}
            block
          >
            Copy to Clipboard
          </Button>
        </Space>
      </Modal>
    </div>
  )
}
