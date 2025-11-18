import { useMemo } from 'react'
import { Card, Button } from 'antd'
import {
  FileTextOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  UploadOutlined,
  ArrowUpOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons'
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useInvoiceStore } from '@/store/invoiceStore'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { motion } from 'framer-motion'

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

  // Calculate stats with useMemo
  const stats = useMemo(() => {
    const total = allInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
    const pending = allInvoices.filter(inv => inv.status === 'pending').length
    const approved = allInvoices.filter(inv => inv.status === 'approved').length
    const thisMonth = allInvoices.filter(inv =>
      dayjs(inv.invoiceDate).isAfter(dayjs().subtract(30, 'days'))
    )
    const lastMonth = allInvoices.filter(inv => {
      const date = dayjs(inv.invoiceDate)
      return date.isAfter(dayjs().subtract(60, 'days')) && date.isBefore(dayjs().subtract(30, 'days'))
    })
    const growth = lastMonth.length ? ((thisMonth.length - lastMonth.length) / lastMonth.length * 100) : 0

    return { total, pending, approved, count: allInvoices.length, growth }
  }, [allInvoices])

  const recentInvoices = useMemo(() => allInvoices.slice(0, 5), [allInvoices])

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      approved: '#52c41a',
      pending: '#faad14',
      processing: '#1677ff',
      rejected: '#ff4d4f',
    }
    return colors[status] || '#d9d9d9'
  }

  return (
    <div className="h-full pb-20 lg:pb-0">
      {/* Mobile View */}
      <div className="lg:hidden min-h-screen bg-gray-50">
        {/* Hero Stats - Mobile */}
        <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 pt-6 pb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white mb-6"
          >
            <div className="text-sm opacity-90">Total Value</div>
            <div className="text-4xl font-bold mt-1">${(stats.total / 1000).toFixed(1)}k</div>
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"
            >
              <div className="text-white/80 text-xs mb-1">Invoices</div>
              <div className="text-white text-2xl font-bold">{stats.count}</div>
              <div className="text-white/60 text-xs mt-1">+{stats.growth.toFixed(0)}% growth</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"
            >
              <div className="text-white/80 text-xs mb-1">Pending</div>
              <div className="text-white text-2xl font-bold">{stats.pending}</div>
              <div className="text-white/60 text-xs mt-1">Need review</div>
            </motion.div>
          </div>
        </div>

        {/* Quick Actions - Floating */}
        <div className="-mt-4 mb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              type="primary"
              size="large"
              icon={<UploadOutlined />}
              onClick={() => navigate('/client/upload/camera')}
              block
              className="rounded-2xl h-14 text-base font-semibold shadow-lg"
            >
              Upload New Invoice
            </Button>
          </motion.div>
        </div>

        {/* Mini Insights - Mobile */}
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-4 shadow-sm"
            >
              <div className="text-xs text-gray-500 mb-1">This Month</div>
              <div className="text-2xl font-bold text-gray-900">
                ${(monthlyData[monthlyData.length - 1]?.amount / 1000).toFixed(1)}k
              </div>
              <div className="text-xs text-green-600 mt-1">↑ 12%</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-4 shadow-sm"
            >
              <div className="text-xs text-gray-500 mb-1">Avg Amount</div>
              <div className="text-2xl font-bold text-gray-900">
                ${stats.count > 0 ? ((stats.total / stats.count) / 1000).toFixed(1) : '0'}k
              </div>
              <div className="text-xs text-gray-400 mt-1">Per invoice</div>
            </motion.div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-gray-900">Recent Activity</h3>
            <Button
              type="text"
              size="small"
              icon={<ArrowRightOutlined />}
              onClick={() => navigate('/client/invoices')}
              className="text-blue-600 text-xs"
            >
              View All
            </Button>
          </div>

          <div className="space-y-2">
            {recentInvoices.slice(0, 4).map((invoice, index) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
              >
                <div
                  className="bg-white rounded-xl p-3 shadow-sm active:scale-98 transition-transform cursor-pointer"
                  onClick={() => navigate(`/client/invoices/${invoice.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 mr-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-gray-900 truncate">
                          {invoice.vendorName}
                        </span>
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: getStatusColor(invoice.status) }}
                        />
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {dayjs(invoice.invoiceDate).format('MMM D, YYYY')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-bold text-gray-900">
                        ${invoice.totalAmount.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-gray-400 capitalize">
                        {invoice.status}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block space-y-6">
        {/* Desktop Header with Action */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <Button
            type="primary"
            size="large"
            icon={<UploadOutlined />}
            onClick={() => navigate('/client/upload/camera')}
          >
            Upload Invoice
          </Button>
        </div>

        {/* Desktop Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">Total Invoices</div>
                <div className="text-4xl font-bold text-gray-900">{stats.count}</div>
                <div className="flex items-center gap-1 text-xs text-green-600 mt-2">
                  <ArrowUpOutlined />
                  <span>{stats.growth.toFixed(1)}% vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FileTextOutlined className="text-2xl text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">Pending Review</div>
                <div className="text-4xl font-bold text-gray-900">{stats.pending}</div>
                <div className="text-xs text-gray-400 mt-2">Awaiting approval</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <ClockCircleOutlined className="text-2xl text-orange-600" />
              </div>
            </div>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">Total Amount</div>
                <div className="text-4xl font-bold text-gray-900">
                  ${(stats.total / 1000).toFixed(1)}k
                </div>
                <div className="flex items-center gap-1 text-xs text-green-600 mt-2">
                  <ArrowUpOutlined />
                  <span>12.3% vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarOutlined className="text-2xl text-green-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Desktop Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="shadow-sm xl:col-span-2">
            <div className="text-lg font-bold mb-4">Monthly Spending</div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="shadow-sm">
            <div className="text-lg font-bold mb-4">By Category</div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `$${(entry.value / 1000).toFixed(1)}k`}
                  outerRadius={70}
                  dataKey="value"
                >
                  {categoryData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
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
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ${(item.value / 1000).toFixed(1)}k
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Desktop Recent Invoices */}
        <Card className="shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-bold">Recent Invoices</div>
            <Button
              type="link"
              icon={<ArrowRightOutlined />}
              onClick={() => navigate('/client/invoices')}
            >
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {recentInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => navigate(`/client/invoices/${invoice.id}`)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{invoice.vendorName}</div>
                    <div className="text-sm text-gray-500">
                      {invoice.invoiceNumber} • {dayjs(invoice.invoiceDate).format('MMM DD, YYYY')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">
                      ${invoice.totalAmount.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 justify-end mt-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getStatusColor(invoice.status) }}
                      />
                      <span className="text-xs capitalize text-gray-600">{invoice.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
