import React, { useState } from 'react';
import { Row, Col, Card, Select, DatePicker, Space, Tag } from 'antd';
import {
  DollarOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  ThunderboltOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import {
  Line,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
} from 'recharts';
import AnimatedMetricCard from './AnimatedMetricCard';
import { useDemoMode } from '../contexts/DemoModeContext';

const { RangePicker } = DatePicker;

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#8b5cf6'];

const EnhancedDashboard: React.FC = () => {
  const { isDemoMode, demoStats, demoTimeSeriesData, demoCategoryData } = useDemoMode();
  const [timeRange, setTimeRange] = useState('12months');

  // Use demo data if in demo mode, otherwise would use real API data
  const stats = isDemoMode ? demoStats : demoStats; // Replace with real API when not in demo
  const timeSeriesData = isDemoMode ? demoTimeSeriesData : demoTimeSeriesData;
  const categoryData = isDemoMode ? demoCategoryData : demoCategoryData;

  // Calculate additional metrics
  const paymentSuccessRate = stats.paidInvoices / stats.totalInvoices * 100;

  // Vendor performance data
  const vendorPerformanceData = [
    { subject: 'Quality', A: 95, fullMark: 100 },
    { subject: 'Timeliness', A: 88, fullMark: 100 },
    { subject: 'Compliance', A: 92, fullMark: 100 },
    { subject: 'Cost', A: 85, fullMark: 100 },
    { subject: 'Support', A: 90, fullMark: 100 },
    { subject: 'Innovation', A: 78, fullMark: 100 },
  ];

  // Status distribution for pie chart
  const statusData = [
    { name: 'Paid', value: stats.paidInvoices },
    { name: 'Pending', value: stats.pendingInvoices },
    { name: 'Overdue', value: stats.overdueInvoices },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Monitor your invoice operations and key metrics
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <Select
              defaultValue={timeRange}
              onChange={setTimeRange}
              className="w-48"
              size="large"
              options={[
                { label: 'Last 7 Days', value: '7days' },
                { label: 'Last 30 Days', value: '30days' },
                { label: 'Last 3 Months', value: '3months' },
                { label: 'Last 6 Months', value: '6months' },
                { label: 'Last 12 Months', value: '12months' },
                { label: 'All Time', value: 'all' },
              ]}
            />
            <RangePicker size="large" />
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <Row gutter={[24, 24]} className="mb-8">
        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="Total Revenue"
            value={stats.totalRevenue}
            prefix="$"
            icon={<DollarOutlined />}
            trend={stats.revenueGrowth}
            trendLabel="vs last month"
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            delay={0}
            precision={2}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="Total Invoices"
            value={stats.totalInvoices}
            icon={<FileTextOutlined />}
            trend={15.3}
            trendLabel="vs last month"
            gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            delay={0.1}
            progress={Math.min((stats.thisMonthInvoices / 100) * 100, 100)}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="Paid Invoices"
            value={stats.paidInvoices}
            icon={<CheckCircleOutlined />}
            trend={8.7}
            trendLabel="vs last month"
            gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
            delay={0.2}
            description={`${paymentSuccessRate.toFixed(1)}% success rate`}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="Pending Amount"
            value={stats.totalPendingAmount}
            prefix="$"
            icon={<ClockCircleOutlined />}
            trend={-5.2}
            trendLabel="vs last month"
            gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
            delay={0.3}
            precision={2}
          />
        </Col>
      </Row>

      {/* Secondary Metrics */}
      <Row gutter={[24, 24]} className="mb-8">
        <Col xs={24} sm={12} lg={8}>
          <AnimatedMetricCard
            title="Avg Invoice Value"
            value={stats.avgInvoiceValue}
            prefix="$"
            icon={<RiseOutlined />}
            color="#10b981"
            delay={0.4}
            precision={2}
          />
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <AnimatedMetricCard
            title="Avg Processing Time"
            value={stats.avgProcessingTime}
            suffix=" sec"
            icon={<ThunderboltOutlined />}
            color="#f59e0b"
            delay={0.5}
            precision={1}
            description="AI-powered extraction"
          />
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <AnimatedMetricCard
            title="AI Confidence Score"
            value={stats.avgAiConfidence * 100}
            suffix="%"
            icon={<RobotOutlined />}
            color="#8b5cf6"
            delay={0.6}
            precision={1}
            progress={stats.avgAiConfidence * 100}
          />
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[24, 24]}>
        {/* Revenue Trend */}
        <Col xs={24} lg={16}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card
              title={
                <span className="text-lg font-semibold">
                  Revenue Trend
                </span>
              }
              extra={
                <Space>
                  <Tag color="purple">Last 12 Months</Tag>
                </Space>
              }
              className="shadow-lg rounded-xl"
            >
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={timeSeriesData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8b5cf6"
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                  />
                  <Bar dataKey="invoices" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  <Line
                    type="monotone"
                    dataKey="paid"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Col>

        {/* Status Distribution */}
        <Col xs={24} lg={8}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card
              title={<span className="text-lg font-semibold">Invoice Status</span>}
              className="shadow-lg rounded-xl"
            >
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Col>

        {/* Category Breakdown */}
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Card
              title={<span className="text-lg font-semibold">Category Breakdown</span>}
              className="shadow-lg rounded-xl"
            >
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={categoryData.slice(0, 8)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" stroke="#666" />
                  <YAxis dataKey="name" type="category" width={150} stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[0, 8, 8, 0]}>
                    {categoryData.slice(0, 8).map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Col>

        {/* Vendor Performance Radar */}
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Card
              title={<span className="text-lg font-semibold">Vendor Performance</span>}
              className="shadow-lg rounded-xl"
            >
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={vendorPerformanceData}>
                  <PolarGrid stroke="#e0e0e0" />
                  <PolarAngleAxis dataKey="subject" stroke="#666" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#666" />
                  <Radar
                    name="Performance"
                    dataKey="A"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

export default EnhancedDashboard;
