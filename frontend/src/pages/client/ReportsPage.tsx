import { Card, DatePicker, Button, Space, Row, Col } from 'antd'
import { DownloadOutlined, FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import StatCard from '@/components/common/StatCard'
import { motion } from 'framer-motion'

const { RangePicker } = DatePicker

const COLORS = ['#1677ff', '#52c41a', '#faad14', '#f5222d', '#722ed1']

const categoryData = [
  { name: 'Office Supplies', amount: 12000 },
  { name: 'Software', amount: 18000 },
  { name: 'Marketing', amount: 8500 },
  { name: 'Travel', amount: 15000 },
  { name: 'Utilities', amount: 6500 },
]

const monthlyData = [
  { month: 'Jan', amount: 8500 },
  { month: 'Feb', amount: 12000 },
  { month: 'Mar', amount: 9800 },
  { month: 'Apr', amount: 15000 },
  { month: 'May', amount: 11200 },
  { month: 'Jun', amount: 17500 },
]

export default function ClientReportsPage() {
  return (
    <div className="h-full pb-20 lg:pb-0">
      {/* Mobile View */}
      <div className="lg:hidden">
        {/* Mobile Stats Grid */}
        <div className="grid grid-cols-2 gap-2 p-4 bg-gradient-to-br from-green-600 to-green-700 text-white">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="text-2xl font-bold">$74k</div>
            <div className="text-xs opacity-90 mt-1">Total</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <div className="text-2xl font-bold">$17.5k</div>
            <div className="text-xs opacity-90 mt-1">This Month</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="text-2xl font-bold">$12.3k</div>
            <div className="text-xs opacity-90 mt-1">Average</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="text-2xl font-bold">48</div>
            <div className="text-xs opacity-90 mt-1">Invoices</div>
          </motion.div>
        </div>

        {/* Mobile Chart - Compact */}
        <div className="px-4 pt-4 space-y-3">
          <Card className="shadow-sm" bodyStyle={{ padding: '12px' }}>
            <div className="text-xs font-semibold text-gray-600 mb-2">Monthly Trend</div>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="amount" stroke="#1677ff" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Category List - Mobile Friendly */}
          <Card className="shadow-sm" bodyStyle={{ padding: '14px' }}>
            <div className="text-xs font-semibold text-gray-600 mb-3">Categories</div>
            <div className="space-y-2">
              {categoryData.map((cat, index) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-gray-700">{cat.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    ${(cat.amount / 1000).toFixed(1)}k
                  </span>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Reports</h1>
            <p className="text-gray-500 mt-1">Personal expense reports and insights</p>
          </div>
          <Space>
            <Button icon={<FileExcelOutlined />}>Export Excel</Button>
            <Button icon={<FilePdfOutlined />}>Export PDF</Button>
          </Space>
        </div>

        <Card>
          <Space size="large" wrap>
            <RangePicker />
            <Button type="primary" icon={<DownloadOutlined />}>
              Generate Report
            </Button>
          </Space>
        </Card>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <StatCard title="Total Expenses" value={74000} prefix="$" color="#f5222d" />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard title="This Month" value={17500} prefix="$" color="#1677ff" />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard title="Average" value={12333} prefix="$" color="#52c41a" />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard title="Invoices" value={48} color="#722ed1" />
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card title="Monthly Expenses" className="card-hover">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#1677ff"
                    strokeWidth={2}
                    name="Amount ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="Category Breakdown" className="card-hover">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `$${(entry.amount / 1000).toFixed(1)}k`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {categoryData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        <Card title="Expenses by Category" className="card-hover">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#1677ff" name="Amount ($)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}
