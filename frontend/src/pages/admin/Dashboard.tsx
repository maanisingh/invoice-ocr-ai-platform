import { Row, Col, Card, Table, Button, Space, Dropdown, message, Tabs } from 'antd'
import {
  FileTextOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  TeamOutlined,
  EyeOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CheckOutlined,
  CloseOutlined,
  MoreOutlined,
  RobotOutlined,
  BarChartOutlined,
} from '@ant-design/icons'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import StatusBadge from '@/components/common/StatusBadge'
import ConfidenceBadge from '@/components/common/ConfidenceBadge'
import AIInsights from '@/components/ai/AIInsights'
import { useInvoiceStore } from '@/store/invoiceStore'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { Invoice } from '@/types'
import { useState, useEffect } from 'react'
import { getChartHeight, getBreakpoint, getTablePageSize } from '@/utils/responsive'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

const monthlyData = [
  { month: 'Jan', amount: 45000, invoices: 32 },
  { month: 'Feb', amount: 52000, invoices: 38 },
  { month: 'Mar', amount: 48000, invoices: 35 },
  { month: 'Apr', amount: 61000, invoices: 42 },
  { month: 'May', amount: 55000, invoices: 39 },
  { month: 'Jun', amount: 72000, invoices: 48 },
]

const categoryData = [
  { name: 'Office Supplies', value: 45000 },
  { name: 'Software', value: 82000 },
  { name: 'Marketing', value: 65000 },
  { name: 'Professional Services', value: 95000 },
  { name: 'Travel', value: 38000 },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { getInvoices, approveInvoice, rejectInvoice } = useInvoiceStore()
  const invoices = getInvoices()

  // Responsive state
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [chartHeight, setChartHeight] = useState(getChartHeight(window.innerWidth))
  const [tablePageSize, setTablePageSize] = useState(getTablePageSize(window.innerWidth))
  const currentBreakpoint = getBreakpoint(windowWidth)

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth
      setWindowWidth(newWidth)
      setChartHeight(getChartHeight(newWidth))
      setTablePageSize(getTablePageSize(newWidth))
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleApprove = (id: string) => {
    approveInvoice(id)
    message.success('Invoice approved successfully')
  }

  const handleReject = (id: string) => {
    rejectInvoice(id)
    message.success('Invoice rejected')
  }

  const columns = [
    {
      title: 'Invoice #',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      render: (text: string) => (
        <span className="font-semibold text-slate-900">{text}</span>
      ),
    },
    {
      title: 'Vendor',
      dataIndex: 'vendorName',
      key: 'vendorName',
      render: (text: string) => (
        <span className="text-slate-700">{text}</span>
      ),
    },
    {
      title: 'Client',
      dataIndex: 'clientName',
      key: 'clientName',
      render: (text: string) => (
        <span className="text-slate-700">{text}</span>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      render: (date: string) => (
        <span className="text-slate-600">{dayjs(date).format('MMM DD, YYYY')}</span>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number, record: any) => (
        <span className="font-semibold text-emerald-600">
          {record.currency} ${amount.toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: any) => <StatusBadge status={status} />,
    },
    {
      title: 'Confidence',
      dataIndex: 'ocrConfidence',
      key: 'ocrConfidence',
      render: (confidence: number) => <ConfidenceBadge confidence={confidence} />,
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: Invoice) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'view',
                icon: <EyeOutlined />,
                label: 'View',
                onClick: () => navigate('/admin/invoices'),
              },
              {
                key: 'approve',
                icon: <CheckOutlined />,
                label: 'Approve',
                onClick: () => handleApprove(record.id),
                disabled: record.status === 'approved',
              },
              {
                key: 'reject',
                icon: <CloseOutlined />,
                label: 'Reject',
                onClick: () => handleReject(record.id),
                disabled: record.status === 'rejected',
              },
            ],
          }}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ]

  return (
    <div className="enterprise-page-content">
      {/* Page Header */}
      <div className="enterprise-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ minWidth: '200px' }}>
          <h1 className="enterprise-page-title">Admin Dashboard</h1>
          <p className="enterprise-page-subtitle">
            System overview and analytics
          </p>
        </div>
        <Space wrap style={{ flexShrink: 0 }}>
          <Button
            type="primary"
            onClick={() => navigate('/admin/invoices/camera')}
            className="enterprise-btn-primary"
            size="large"
          >
            Upload Invoice
          </Button>
        </Space>
      </div>

      {/* Tabs for Dashboard Views */}
      <Tabs
        defaultActiveKey="overview"
        items={[
          {
            key: 'overview',
            label: (
              <span>
                <BarChartOutlined />
                Overview
              </span>
            ),
            children: (
              <>
                {/* Stat Cards */}
                <Row gutter={[24, 24]} className="enterprise-grid mb-8">
        <Col xs={24} sm={12} lg={6}>
          <Card className="enterprise-stat-card" bordered={false}>
            <div className="stat-card-icon icon-blue">
              <FileTextOutlined />
            </div>
            <div className="stat-card-value">156</div>
            <div className="stat-card-title">Total Invoices</div>
            <div className="trend-indicator trend-up mt-3">
              <ArrowUpOutlined />
              12.9% vs last month
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="enterprise-stat-card" bordered={false}>
            <div className="stat-card-icon icon-orange">
              <ClockCircleOutlined />
            </div>
            <div className="stat-card-value">23</div>
            <div className="stat-card-title">Pending Review</div>
            <div className="trend-indicator trend-down mt-3">
              <ArrowDownOutlined />
              5.2% vs last month
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="enterprise-stat-card" bordered={false}>
            <div className="stat-card-icon icon-green">
              <DollarOutlined />
            </div>
            <div className="stat-card-value">$487,650</div>
            <div className="stat-card-title">Total Amount</div>
            <div className="trend-indicator trend-up mt-3">
              <ArrowUpOutlined />
              23.1% vs last month
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="enterprise-stat-card" bordered={false}>
            <div className="stat-card-icon icon-purple">
              <TeamOutlined />
            </div>
            <div className="stat-card-value">42</div>
            <div className="stat-card-title">Active Clients</div>
            <div className="trend-indicator trend-up mt-3">
              <ArrowUpOutlined />
              6.3% vs last month
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[24, 24]} className="enterprise-grid mb-8">
        <Col xs={24} lg={16}>
          <Card
            title="Invoice Trends"
            className="enterprise-chart-card"
            bordered={false}
          >
            <ResponsiveContainer width="100%" height={chartHeight}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  style={{ fontSize: currentBreakpoint === 'xs' ? '10px' : '12px', fontWeight: 500 }}
                  interval={currentBreakpoint === 'xs' ? 1 : 0}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#64748b"
                  style={{ fontSize: currentBreakpoint === 'xs' ? '10px' : '12px', fontWeight: 500 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#64748b"
                  style={{ fontSize: currentBreakpoint === 'xs' ? '10px' : '12px', fontWeight: 500 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    fontSize: currentBreakpoint === 'xs' ? '12px' : '14px'
                  }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: '20px',
                    fontSize: currentBreakpoint === 'xs' ? '12px' : '14px',
                    fontWeight: 500
                  }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="amount"
                  stroke="#3b82f6"
                  strokeWidth={currentBreakpoint === 'xs' ? 2 : 3}
                  name="Amount ($)"
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: currentBreakpoint === 'xs' ? 3 : 4 }}
                  activeDot={{ r: currentBreakpoint === 'xs' ? 5 : 6 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="invoices"
                  stroke="#10b981"
                  strokeWidth={currentBreakpoint === 'xs' ? 2 : 3}
                  name="Invoice Count"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: currentBreakpoint === 'xs' ? 3 : 4 }}
                  activeDot={{ r: currentBreakpoint === 'xs' ? 5 : 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title="Category Breakdown"
            className="enterprise-chart-card"
            bordered={false}
          >
            <ResponsiveContainer width="100%" height={chartHeight}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={currentBreakpoint === 'xs' ? false : (entry: { value: number }) => `$${(entry.value / 1000).toFixed(0)}k`}
                  outerRadius={currentBreakpoint === 'xs' ? 70 : 90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    fontSize: currentBreakpoint === 'xs' ? '12px' : '14px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categoryData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-slate-700">{item.name}</span>
                  </div>
                  <span className="font-semibold text-slate-900">
                    ${(item.value / 1000).toFixed(0)}k
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Bar Chart */}
      <Row gutter={[24, 24]} className="enterprise-grid mb-8">
        <Col xs={24}>
          <Card
            title="Monthly Spending by Category"
            className="enterprise-chart-card"
            bordered={false}
          >
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  style={{ fontSize: currentBreakpoint === 'xs' ? '10px' : '12px', fontWeight: 500 }}
                  interval={currentBreakpoint === 'xs' ? 1 : 0}
                />
                <YAxis
                  stroke="#64748b"
                  style={{ fontSize: currentBreakpoint === 'xs' ? '10px' : '12px', fontWeight: 500 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    fontSize: currentBreakpoint === 'xs' ? '12px' : '14px'
                  }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: '20px',
                    fontSize: currentBreakpoint === 'xs' ? '12px' : '14px',
                    fontWeight: 500
                  }}
                />
                <Bar dataKey="value" fill="#3b82f6" name="Amount ($)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Recent Invoices Table */}
      <Card
        title="Recent Invoices"
        className="enterprise-table-card"
        bordered={false}
        extra={
          <Button
            type="link"
            onClick={() => navigate('/admin/invoices')}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            View All →
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={invoices.slice(0, tablePageSize)}
          rowKey="id"
          pagination={false}
          className="enterprise-table"
          size={currentBreakpoint === 'xs' ? 'small' : 'middle'}
          scroll={{ x: currentBreakpoint === 'xs' ? 800 : undefined }}
        />
      </Card>
              </>
            ),
          },
          {
            key: 'ai-insights',
            label: (
              <span>
                <RobotOutlined />
                AI Insights
              </span>
            ),
            children: <AIInsights invoices={invoices} />,
          },
        ]}
      />
    </div>
  )
}
