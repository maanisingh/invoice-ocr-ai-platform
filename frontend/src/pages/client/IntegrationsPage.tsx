import { useState } from 'react'
import { Button, Switch, Tag } from 'antd'
import {
  CheckCircleOutlined,
  LinkOutlined,
  ApiOutlined,
  ThunderboltOutlined,
  SettingOutlined,
  CloudOutlined,
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import { cn, modernCard, gradients, hoverLift, hoverGlow } from '@/lib/utils'

interface Platform {
  id: string
  name: string
  description: string
  icon: any
  color: string
  type: 'accounting' | 'erp' | 'payment' | 'storage'
  status: 'connected' | 'disconnected'
  features: string[]
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
  const [connectedPlatforms, setConnectedPlatforms] = useState<Set<string>>(new Set())

  const toggleConnection = (platformId: string) => {
    const newSet = new Set(connectedPlatforms)
    if (newSet.has(platformId)) {
      newSet.delete(platformId)
    } else {
      newSet.add(platformId)
    }
    setConnectedPlatforms(newSet)
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

  return (
    <div className="h-full pb-20 lg:pb-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Mobile View */}
      <div className="lg:hidden min-h-screen">
        {/* Header */}
        <div className={cn("px-4 pt-8 pb-10", gradients.purple)}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white"
          >
            <h2 className="text-3xl font-black mb-2">Integrations</h2>
            <p className="text-white/80 text-sm font-medium">
              Connect with your favorite platforms
            </p>
          </motion.div>
        </div>

        {/* Platform Integrations */}
        <div className="px-4 -mt-6 pb-6">
          <div className="space-y-3">
            {platforms.map((platform, index) => (
              <motion.div
                key={platform.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className={cn(modernCard, "bg-white p-4", hoverLift, hoverGlow)}>
                  <div className="flex items-start gap-4">
                    {/* Logo */}
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center p-2 shadow-lg flex-shrink-0 bg-white"
                      style={{ border: `2px solid ${platform.color}20` }}
                    >
                      <img
                        src={platform.icon}
                        alt={platform.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <h3 className="font-black text-gray-900 text-base mb-1">
                            {platform.name}
                          </h3>
                          <p className="text-xs text-gray-500 font-medium">
                            {platform.description}
                          </p>
                        </div>
                        <Switch
                          checked={connectedPlatforms.has(platform.id)}
                          onChange={() => toggleConnection(platform.id)}
                          size="small"
                        />
                      </div>

                      {/* Type Badge */}
                      <Tag
                        icon={getTypeIcon(platform.type)}
                        color={getTypeColor(platform.type)}
                        className="text-xs font-semibold mb-3"
                      >
                        {platform.type.toUpperCase()}
                      </Tag>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1.5">
                        {platform.features.slice(0, 2).map((feature) => (
                          <span
                            key={feature}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-semibold"
                          >
                            {feature}
                          </span>
                        ))}
                        {platform.features.length > 2 && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-semibold">
                            +{platform.features.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Connected Status */}
                  {connectedPlatforms.has(platform.id) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 pt-3 border-t border-gray-100"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-green-600 font-bold">
                          <CheckCircleOutlined />
                          Connected
                        </div>
                        <Button
                          size="small"
                          icon={<SettingOutlined />}
                          className="text-xs font-semibold"
                        >
                          Configure
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block space-y-6 p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-black text-gray-900 mb-2">Platform Integrations</h1>
          <p className="text-gray-500 text-lg">
            Connect with accounting, ERP, payment, and storage platforms
          </p>
        </motion.div>

        {/* Platform Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(modernCard, "bg-white p-6", hoverLift, hoverGlow)}
            >
              <div className="flex items-start gap-6">
                {/* Logo */}
                <div
                  className="w-20 h-20 rounded-3xl flex items-center justify-center p-3 shadow-xl flex-shrink-0 bg-white"
                  style={{
                    border: `2px solid ${platform.color}30`,
                  }}
                >
                  <img
                    src={platform.icon}
                    alt={platform.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 mb-2">
                        {platform.name}
                      </h3>
                      <p className="text-sm text-gray-600 font-medium mb-3">
                        {platform.description}
                      </p>
                      <Tag
                        icon={getTypeIcon(platform.type)}
                        color={getTypeColor(platform.type)}
                        className="font-bold"
                      >
                        {platform.type.toUpperCase()}
                      </Tag>
                    </div>
                    <Switch
                      checked={connectedPlatforms.has(platform.id)}
                      onChange={() => toggleConnection(platform.id)}
                    />
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <div className="text-xs font-bold text-gray-500 mb-2">FEATURES</div>
                    <div className="flex flex-wrap gap-2">
                      {platform.features.map((feature) => (
                        <span
                          key={feature}
                          className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-bold"
                        >
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
                      <Button
                        icon={<SettingOutlined />}
                        className="font-bold"
                      >
                        Configure
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
    </div>
  )
}
