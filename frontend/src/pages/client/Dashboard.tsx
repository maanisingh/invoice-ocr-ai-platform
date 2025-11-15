import { Row, Col, Card, Table, Button, Space } from 'antd'
import {
  FileTextOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  EyeOutlined,
  UploadOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons'
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import StatusBadge from '@/components/common/StatusBadge'
import { useInvoiceStore } from '@/store/invoiceStore'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
import { getChartHeight, getTablePageSize, formatDateResponsive } from '@/utils/responsive'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

const categoryData = [
  { name: 'Office Supplies', value: 12000 },
  { name: 'Software', value: 18000 },
  { name: 'Marketing', value: 8500 },
  { name: 'Travel', value: 15000 },
]

const monthlyData = [
  { month: 'Jan', amount: 8500 },
  { month: 'Feb', amount: 13500 },
  { month: 'Mar', amount: 9800 },
  { month: 'Apr', amount: 15000 },
  { month: 'May', amount: 13200 },
  { month: 'Jun', amount: 17500 },
]

export default function ClientDashboard() {
  const navigate = useNavigate()
  const { getInvoices } = useInvoiceStore()
  const allInvoices = getInvoices()
  const clientInvoices = allInvoices.slice(0, 8)

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const chartHeight = getChartHeight(windowWidth)
  const tablePageSize = getTablePageSize(windowWidth)

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
      title: 'Date',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      render: (date: string) => (
        <span className="text-slate-600">{formatDateResponsive(date, windowWidth)}</span>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => (
        <span className="font-semibold text-emerald-600">
          ${amount.toLocaleString()}
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
      title: 'Action',
      key: 'action',
      render: () => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => navigate('/client/invoices')}
          className="text-blue-600 hover:text-blue-700"
        >
          View
        </Button>
      ),
    },
  ]

  return (
    <div className="enterprise-page-content">
      {/* Page Header */}
      <div className="enterprise-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ minWidth: windowWidth < 640 ? '150px' : '200px' }}>
          <h1 className="enterprise-page-title" style={{ fontSize: windowWidth < 640 ? '20px' : windowWidth < 768 ? '24px' : '32px' }}>Dashboard</h1>
          <p className="enterprise-page-subtitle">
            Welcome back! Here's your overview
          </p>
        </div>
        <Space wrap style={{ flexShrink: 0 }}>
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={() => navigate('/client/upload/camera')}
            className="enterprise-btn-primary"
            size={windowWidth < 640 ? 'small' : 'large'}
          >
            {windowWidth < 640 ? 'Upload' : 'Upload Invoice'}
          </Button>
        </Space>
      </div>

      {/* Stat Cards */}
      <Row gutter={[windowWidth < 640 ? 16 : 24, windowWidth < 640 ? 16 : 24]} className="enterprise-grid mb-8">
        <Col xs={24} sm={12} lg={8}>
          <Card className="enterprise-stat-card" bordered={false}>
            <div className="stat-card-icon icon-blue">
              <FileTextOutlined />
            </div>
            <div className="stat-card-value" style={{ fontSize: windowWidth < 640 ? '24px' : '32px' }}>
              {clientInvoices.length}
            </div>
            <div className="stat-card-title">My Invoices</div>
            <div className="trend-indicator trend-up mt-3">
              <ArrowUpOutlined />
              8.5% vs last month
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="enterprise-stat-card" bordered={false}>
            <div className="stat-card-icon icon-orange">
              <ClockCircleOutlined />
            </div>
            <div className="stat-card-value" style={{ fontSize: windowWidth < 640 ? '24px' : '32px' }}>
              {clientInvoices.filter(i => i.status === 'pending').length}
            </div>
            <div className="stat-card-title">Pending Review</div>
            <div className="text-sm text-slate-500 mt-3">
              Awaiting approval
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="enterprise-stat-card" bordered={false}>
            <div className="stat-card-icon icon-green">
              <DollarOutlined />
            </div>
            <div className="stat-card-value" style={{ fontSize: windowWidth < 640 ? '24px' : '32px' }}>
              $74,000
            </div>
            <div className="stat-card-title">Total Spending</div>
            <div className="trend-indicator trend-up mt-3">
              <ArrowUpOutlined />
              12.3% vs last month
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[windowWidth < 640 ? 16 : 24, windowWidth < 640 ? 16 : 24]} className="enterprise-grid mb-8">
        <Col xs={24} lg={16}>
          <Card
            title="Monthly Spending"
            className="enterprise-chart-card"
            bordered={false}
          >
            <ResponsiveContainer width="100%" height={chartHeight}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  style={{ fontSize: windowWidth < 640 ? '10px' : '12px', fontWeight: 500 }}
                />
                <YAxis
                  stroke="#64748b"
                  style={{ fontSize: windowWidth < 640 ? '10px' : '12px', fontWeight: 500 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    fontSize: windowWidth < 640 ? '12px' : '14px'
                  }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: '20px',
                    fontSize: windowWidth < 640 ? '12px' : '14px',
                    fontWeight: 500
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="Amount ($)"
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title="Spending by Category"
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
                  label={(entry) => `$${(entry.value / 1000).toFixed(1)}k`}
                  outerRadius={windowWidth < 640 ? 70 : 90}
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
                    fontSize: windowWidth < 640 ? '12px' : '14px'
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
                    ${(item.value / 1000).toFixed(1)}k
                  </span>
                </div>
              ))}
            </div>
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
            onClick={() => navigate('/client/invoices')}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            View All →
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={clientInvoices.slice(0, tablePageSize)}
          rowKey="id"
          pagination={false}
          className="enterprise-table"
        />
      </Card>
    </div>
  )
}
