import { useState } from 'react'
import { Card, DatePicker, Select, Button, Space, Row, Col } from 'antd'
import { DownloadOutlined, FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import StatCard from '@/components/common/StatCard'

const { RangePicker } = DatePicker
const { Option } = Select

const COLORS = ['#1677ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2']

const reportData = {
  byCategory: [
    { name: 'Office Supplies', amount: 45000, count: 32 },
    { name: 'Software', amount: 82000, count: 28 },
    { name: 'Marketing', amount: 65000, count: 18 },
    { name: 'Services', amount: 95000, count: 24 },
    { name: 'Travel', amount: 38000, count: 15 },
  ],
  byVendor: [
    { name: 'Office Depot', amount: 28000 },
    { name: 'Adobe', amount: 35000 },
    { name: 'Google', amount: 42000 },
    { name: 'AWS', amount: 65000 },
    { name: 'Others', amount: 48000 },
  ],
  monthly: [
    { month: 'Jan', income: 0, expense: 45000 },
    { month: 'Feb', income: 0, expense: 52000 },
    { month: 'Mar', income: 0, expense: 48000 },
    { month: 'Apr', income: 0, expense: 61000 },
    { month: 'May', income: 0, expense: 55000 },
    { month: 'Jun', income: 0, expense: 72000 },
  ],
}

export default function ReportsPage() {
  const [reportType, setReportType] = useState('summary')

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Reports</h1>
          <p className="text-gray-500 mt-1">Analytics and insights</p>
        </div>
        <Space className="flex flex-col sm:flex-row gap-2">
          <Button icon={<FileExcelOutlined />} className="w-full sm:w-auto">Export Excel</Button>
          <Button icon={<FilePdfOutlined />} className="w-full sm:w-auto">Export PDF</Button>
        </Space>
      </div>

      <Card>
        <Space size="large" wrap className="w-full">
          <Select
            value={reportType}
            onChange={setReportType}
            className="w-full sm:w-48"
          >
            <Option value="summary">Summary Report</Option>
            <Option value="category">By Category</Option>
            <Option value="vendor">By Vendor</Option>
            <Option value="client">By Client</Option>
          </Select>
          <RangePicker className="w-full sm:w-auto" />
          <Button type="primary" icon={<DownloadOutlined />} className="w-full sm:w-auto">
            Generate Report
          </Button>
        </Space>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Total Expenses" value={333000} prefix="$" color="#f5222d" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Invoices Processed" value={117} color="#1677ff" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Average Invoice" value={2846} prefix="$" color="#52c41a" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Top Category" value="Services" color="#722ed1" />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Monthly Expenses Trend" className="card-hover">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={reportData.monthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="expense" stroke="#f5222d" strokeWidth={2} name="Expenses" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Top Vendors" className="card-hover">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={reportData.byVendor}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `$${(entry.amount / 1000).toFixed(0)}k`}
                  outerRadius="40%"
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {reportData.byVendor.map((_entry, index) => (
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
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={reportData.byCategory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
            <YAxis yAxisId="left" orientation="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="amount" fill="#1677ff" name="Amount ($)" />
            <Bar yAxisId="right" dataKey="count" fill="#52c41a" name="Count" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
