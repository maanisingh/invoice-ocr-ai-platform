import { useState, useMemo } from 'react'
import { Card, Input, Empty, Row, Col, Table, Tag } from 'antd'
import { SearchOutlined, DollarOutlined, FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import { useInvoiceStore } from '@/store/invoiceStore'
import { formatCurrency } from '@/types'
import dayjs from 'dayjs'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, modernCard, gradients, hoverLift, hoverGlow } from '@/lib/utils'

export default function ClientInvoicesPage() {
  const navigate = useNavigate()
  const { getInvoices } = useInvoiceStore()
  const invoices = getInvoices()
  const [searchText, setSearchText] = useState('')

  const filteredInvoices = useMemo(() =>
    invoices.filter((invoice) =>
      invoice.invoiceNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      invoice.vendorName.toLowerCase().includes(searchText.toLowerCase())
    ),
    [invoices, searchText]
  )

  // Calculate stats
  const stats = useMemo(() => {
    const total = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
    const pending = invoices.filter(inv => inv.status === 'pending').length
    const approved = invoices.filter(inv => inv.status === 'approved').length
    return { total, pending, approved, count: invoices.length }
  }, [invoices])

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      approved: '#52c41a',
      pending: '#faad14',
      processing: '#1677ff',
      rejected: '#ff4d4f',
    }
    return colors[status] || '#d9d9d9'
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { color: string; text: string } } = {
      approved: { color: 'success', text: 'Approved' },
      pending: { color: 'warning', text: 'Pending' },
      processing: { color: 'processing', text: 'Processing' },
      rejected: { color: 'error', text: 'Rejected' },
    }
    const config = statusConfig[status] || { color: 'default', text: status }
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const columns: ColumnsType<any> = [
    {
      title: 'Invoice Number',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      render: (text: string, record: any) => (
        <div>
          <div className="font-semibold text-gray-900">{text}</div>
          <div className="text-xs text-gray-500">{dayjs(record.invoiceDate).format('MMM DD, YYYY')}</div>
        </div>
      ),
      sorter: (a, b) => a.invoiceNumber.localeCompare(b.invoiceNumber),
    },
    {
      title: 'Vendor',
      dataIndex: 'vendorName',
      key: 'vendorName',
      render: (text: string) => <span className="font-medium">{text}</span>,
      sorter: (a, b) => a.vendorName.localeCompare(b.vendorName),
    },
    {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
      render: (text: string) => <span className="text-sm text-gray-600">{text || '-'}</span>,
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number, record: any) => (
        <div>
          <div className="font-bold text-lg text-green-600">
            {formatCurrency(amount, record.currency || 'USD')}
          </div>
          {record.ocrConfidence && (
            <div className="text-xs text-gray-400">
              {Math.round(record.ocrConfidence * 100)}% confidence
            </div>
          )}
        </div>
      ),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusBadge(status),
      filters: [
        { text: 'Approved', value: 'approved' },
        { text: 'Pending', value: 'pending' },
        { text: 'Processing', value: 'processing' },
        { text: 'Rejected', value: 'rejected' },
      ],
      onFilter: (value, record) => record.status === value,
    },
  ]

  return (
    <div className="h-full pb-20 lg:pb-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Modern Stats Bar - Mobile */}
      <div className="lg:hidden">
        <div className={cn("grid grid-cols-3 gap-2 px-4 py-4", gradients.ocean)}>
          <div className="text-center text-white">
            <div className="text-xs opacity-90 font-semibold mb-1">Total</div>
            <div className="text-2xl font-black">{stats.count}</div>
          </div>
          <div className="text-center text-white border-l border-r border-white/20">
            <div className="text-xs opacity-90 font-semibold mb-1">Pending</div>
            <div className="text-2xl font-black">{stats.pending}</div>
          </div>
          <div className="text-center text-white">
            <div className="text-xs opacity-90 font-semibold mb-1">Amount</div>
            <div className="text-2xl font-black">${(stats.total / 1000).toFixed(1)}k</div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="p-4 bg-transparent">
          <Input
            placeholder="Search by vendor or number..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            size="large"
            className="rounded-2xl shadow-lg border-2 border-white"
          />
        </div>

        {/* Mobile Invoice Cards */}
        <div className="px-4 pt-2 space-y-3">
          <AnimatePresence>
            {filteredInvoices.length === 0 ? (
              <Empty description="No invoices found" className="mt-8" />
            ) : (
              filteredInvoices.map((invoice, index) => (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={cn(modernCard, "cursor-pointer bg-white", hoverLift, hoverGlow)}
                    bodyStyle={{ padding: '16px 18px' }}
                    onClick={() => navigate(`/client/invoices/${invoice.id}`)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-black text-base truncate text-gray-900">
                            {invoice.vendorName}
                          </span>
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-md"
                            style={{ backgroundColor: getStatusColor(invoice.status) }}
                          />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 font-semibold">
                          <span className="font-mono">{invoice.invoiceNumber}</span>
                          <span>•</span>
                          <span>{dayjs(invoice.invoiceDate).format('MMM D')}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-gray-900">
                            {formatCurrency(invoice.totalAmount, invoice.currency || 'USD')}
                          </span>
                          {invoice.ocrConfidence && (
                            <span className="text-xs text-gray-400 font-bold">
                              {Math.round(invoice.ocrConfidence * 100)}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <div className="text-xs px-2 py-1 rounded-full capitalize" style={{
                          backgroundColor: `${getStatusColor(invoice.status)}20`,
                          color: getStatusColor(invoice.status),
                          fontWeight: 500
                        }}>
                          {invoice.status}
                        </div>
                        {invoice.categoryName && (
                          <div className="text-xs text-gray-400 truncate max-w-[80px]">
                            {invoice.categoryName}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block space-y-6 p-8">
        {/* Desktop Stats */}
        <Row gutter={24}>
          <Col span={6}>
            <div className={cn(modernCard, "bg-white p-6", hoverLift, hoverGlow)}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-gray-500 mb-2 font-semibold">Total Invoices</div>
                  <div className="text-4xl font-black text-gray-900">{stats.count}</div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl flex items-center justify-center">
                  <FileTextOutlined className="text-2xl text-white" />
                </div>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className={cn(modernCard, "bg-white p-6", hoverLift, hoverGlow)}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-gray-500 mb-2 font-semibold">Pending Review</div>
                  <div className="text-4xl font-black text-gray-900">{stats.pending}</div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-xl flex items-center justify-center">
                  <ClockCircleOutlined className="text-2xl text-white" />
                </div>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className={cn(modernCard, "bg-white p-6", hoverLift, hoverGlow)}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-gray-500 mb-2 font-semibold">Approved</div>
                  <div className="text-4xl font-black text-gray-900">{stats.approved}</div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-xl flex items-center justify-center">
                  <CheckCircleOutlined className="text-2xl text-white" />
                </div>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className={cn(modernCard, "bg-white p-6", hoverLift, hoverGlow)}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-gray-500 mb-2 font-semibold">Total Amount</div>
                  <div className="text-4xl font-black text-gray-900">${(stats.total / 1000).toFixed(1)}k</div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-xl flex items-center justify-center">
                  <DollarOutlined className="text-2xl text-white" />
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Desktop Search */}
        <div className={cn(modernCard, "bg-white p-6", hoverGlow)}>
          <Input
            placeholder="Search invoices by vendor name or number..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            size="large"
            className="rounded-2xl border-2"
          />
        </div>

        {/* Desktop Invoice Table */}
        <div className={cn(modernCard, "bg-white p-6", hoverGlow)}>
          <div className="text-2xl font-black text-gray-900 mb-6">All Invoices</div>
          <Table
            columns={columns}
            dataSource={filteredInvoices}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} invoices`,
            }}
            onRow={(record) => ({
              onClick: () => navigate(`/client/invoices/${record.id}`),
              className: 'cursor-pointer hover:bg-blue-50/50 transition-colors',
            })}
            locale={{
              emptyText: <Empty description="No invoices found" />,
            }}
            className="modern-table"
          />
        </div>
      </div>
    </div>
  )
}
