import { useMemo } from 'react';
import { Row, Col, Card, Table, Button, Space, Tag, Progress, Alert, Tooltip } from 'antd';
import {
  FileTextOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  EyeOutlined,
  UploadOutlined,
  RobotOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  BulbOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons';
import {
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import AnimatedMetricCard from '@/components/AnimatedMetricCard';
import { useDemoMode } from '@/contexts/DemoModeContext';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export default function EnhancedClientDashboard() {
  const navigate = useNavigate();
  const { isDemoMode, demoData } = useDemoMode();

  // Get invoices from demo mode
  const allInvoices = isDemoMode ? demoData.invoices : [];
  const recentInvoices = allInvoices.slice(0, 8);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = allInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const pending = allInvoices.filter(i => i.status === 'Pending').length;
    const processed = allInvoices.filter(i => i.status === 'Paid').length;
    const avgConfidence = allInvoices.reduce((sum, inv) => sum + inv.aiConfidence.overall, 0) / allInvoices.length || 0;

    // Calculate trends (mock for demo)
    const revenueGrowth = 12.5;
    const invoiceGrowth = 8.3;
    const processingSpeed = 45; // seconds average

    return {
      totalInvoices: allInvoices.length,
      pendingReview: pending,
      totalSpending: total,
      processedThisMonth: processed,
      avgConfidence,
      revenueGrowth,
      invoiceGrowth,
      processingSpeed,
    };
  }, [allInvoices]);

  // Monthly spending data
  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, i) => {
      const monthInvoices = allInvoices.filter(inv => {
        const invMonth = new Date(inv.issueDate).getMonth();
        return invMonth === i;
      });
      const total = monthInvoices.reduce((sum, inv) => sum + inv.total, 0);
      const count = monthInvoices.length;
      return {
        month,
        amount: total,
        count,
        avgAmount: count > 0 ? total / count : 0,
      };
    });
  }, [allInvoices]);

  // Category spending
  const categoryData = useMemo(() => {
    const categories: { [key: string]: number } = {};
    allInvoices.forEach(inv => {
      categories[inv.category] = (categories[inv.category] || 0) + inv.total;
    });
    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [allInvoices]);

  // Status distribution
  const statusData = useMemo(() => {
    const statuses: { [key: string]: number } = {};
    allInvoices.forEach(inv => {
      statuses[inv.status] = (statuses[inv.status] || 0) + 1;
    });
    return Object.entries(statuses).map(([name, value]) => ({ name, value }));
  }, [allInvoices]);

  // AI Performance Metrics
  const aiPerformanceData = [
    { metric: 'Accuracy', score: 98 },
    { metric: 'Speed', score: 95 },
    { metric: 'Data Quality', score: 92 },
    { metric: 'Automation', score: 88 },
    { metric: 'Reliability', score: 96 },
  ];

  // AI Insights
  const aiInsights = [
    {
      type: 'success',
      icon: <CheckCircleOutlined />,
      title: 'High Processing Accuracy',
      description: `${(stats.avgConfidence * 100).toFixed(1)}% average AI confidence across all invoices`,
    },
    {
      type: 'warning',
      icon: <WarningOutlined />,
      title: 'Duplicate Risk Detected',
      description: '3 potential duplicate invoices found - review recommended',
    },
    {
      type: 'info',
      icon: <BulbOutlined />,
      title: 'Smart Recommendation',
      description: 'Consider scheduling automatic payments for recurring vendors',
    },
  ];

  // Spending predictions (trend analysis)
  const predictions = useMemo(() => {
    if (monthlyData.length < 2) return null;
    const recent = monthlyData.slice(-3);
    const avgGrowth = recent.reduce((sum, m, i, arr) => {
      if (i === 0) return 0;
      return sum + ((m.amount - arr[i - 1].amount) / arr[i - 1].amount);
    }, 0) / (recent.length - 1);

    const lastMonth = monthlyData[monthlyData.length - 1].amount;
    return {
      nextMonth: lastMonth * (1 + avgGrowth),
      trend: avgGrowth > 0 ? 'up' : 'down',
      percentage: Math.abs(avgGrowth * 100),
    };
  }, [monthlyData]);

  const columns = [
    {
      title: 'Invoice #',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      render: (text: string) => (
        <span className="font-mono font-semibold text-purple-600">{text}</span>
      ),
    },
    {
      title: 'Vendor',
      dataIndex: 'vendorName',
      key: 'vendorName',
      ellipsis: true,
    },
    {
      title: 'Date',
      dataIndex: 'issueDate',
      key: 'issueDate',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Amount',
      dataIndex: 'total',
      key: 'total',
      render: (amount: number) => (
        <span className="font-semibold text-lg">
          ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: 'AI Confidence',
      dataIndex: ['aiConfidence', 'overall'],
      key: 'confidence',
      render: (confidence: number) => (
        <div className="flex items-center gap-2">
          <Progress
            percent={confidence * 100}
            size="small"
            strokeColor={confidence >= 0.95 ? '#10b981' : confidence >= 0.85 ? '#f59e0b' : '#ef4444'}
            showInfo={false}
            style={{ width: 60 }}
          />
          <span className="text-xs">{(confidence * 100).toFixed(0)}%</span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: { [key: string]: string } = {
          Paid: 'success',
          Pending: 'processing',
          Overdue: 'error',
          Draft: 'default',
        };
        return <Tag color={colors[status] || 'default'}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Button type="link" icon={<EyeOutlined />} onClick={() => navigate('/client/invoices')}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              Client Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              AI-powered invoice management and insights
            </p>
          </div>
          <Space wrap>
            <Button
              type="primary"
              size="large"
              icon={<UploadOutlined />}
              onClick={() => navigate('/client/upload/camera')}
            >
              Upload Invoice
            </Button>
          </Space>
        </div>
      </motion.div>

      {/* Demo Mode Alert */}
      {isDemoMode && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Alert
            message="Demo Mode Active"
            description={`Viewing ${allInvoices.length} sample invoices with AI-generated data`}
            type="info"
            icon={<RobotOutlined />}
            showIcon
            closable
            className="mb-6"
          />
        </motion.div>
      )}

      {/* Animated Stat Cards */}
      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="Total Invoices"
            value={stats.totalInvoices}
            icon={<FileTextOutlined />}
            trend={stats.invoiceGrowth}
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="Pending Review"
            value={stats.pendingReview}
            icon={<ClockCircleOutlined />}
            suffix=" items"
            gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="Total Spending"
            value={stats.totalSpending}
            prefix="$"
            icon={<DollarOutlined />}
            trend={stats.revenueGrowth}
            gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="AI Confidence"
            value={stats.avgConfidence * 100}
            suffix="%"
            icon={<RobotOutlined />}
            gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
          />
        </Col>
      </Row>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card
          title={
            <span>
              <ThunderboltOutlined className="mr-2 text-yellow-500" />
              AI-Powered Insights
            </span>
          }
          className="mb-6 shadow-lg rounded-xl"
        >
          <Row gutter={[16, 16]}>
            {aiInsights.map((insight, index) => (
              <Col xs={24} md={8} key={index}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`p-4 rounded-lg border-l-4 ${
                    insight.type === 'success'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : insight.type === 'warning'
                      ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                      : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`text-2xl ${
                      insight.type === 'success'
                        ? 'text-green-600'
                        : insight.type === 'warning'
                        ? 'text-yellow-600'
                        : 'text-blue-600'
                    }`}>
                      {insight.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{insight.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{insight.description}</p>
                    </div>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Card>
      </motion.div>

      {/* Charts Row 1 */}
      <Row gutter={[24, 24]} className="mb-6">
        {/* Monthly Spending Trend */}
        <Col xs={24} lg={16}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card
              title="Monthly Spending Analysis"
              extra={
                predictions && (
                  <Tooltip title={`Predicted ${predictions.trend === 'up' ? 'increase' : 'decrease'} of ${predictions.percentage.toFixed(1)}%`}>
                    <Tag color={predictions.trend === 'up' ? 'red' : 'green'} icon={predictions.trend === 'up' ? <RiseOutlined /> : <FallOutlined />}>
                      Next: ${predictions.nextMonth.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </Tag>
                  </Tooltip>
                )
              }
              className="shadow-lg rounded-xl"
            >
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis yAxisId="left" stroke="#6b7280" />
                  <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="amount"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorAmount)"
                    name="Total Amount ($)"
                  />
                  <Bar yAxisId="right" dataKey="count" fill="#3b82f6" name="Invoice Count" radius={[8, 8, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Col>

        {/* Status Distribution */}
        <Col xs={24} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card title="Invoice Status" className="shadow-lg rounded-xl">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {statusData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row gutter={[24, 24]} className="mb-6">
        {/* Category Spending */}
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card title="Spending by Category" className="shadow-lg rounded-xl">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#6b7280" />
                  <YAxis dataKey="name" type="category" width={120} stroke="#6b7280" />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[0, 8, 8, 0]}>
                    {categoryData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Col>

        {/* AI Performance Radar */}
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card
              title={
                <span>
                  <SafetyOutlined className="mr-2 text-green-500" />
                  AI Performance Metrics
                </span>
              }
              className="shadow-lg rounded-xl"
            >
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={aiPerformanceData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="metric" stroke="#6b7280" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#6b7280" />
                  <Radar
                    name="Performance"
                    dataKey="score"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                  />
                  <RechartsTooltip />
                </RadarChart>
              </ResponsiveContainer>
              <div className="mt-4 flex justify-center">
                <Tag color="purple" icon={<TrophyOutlined />} className="text-base px-4 py-1">
                  Overall Score: {(aiPerformanceData.reduce((sum, d) => sum + d.score, 0) / aiPerformanceData.length).toFixed(1)}%
                </Tag>
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Recent Invoices Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <Card
          title="Recent Invoices"
          extra={
            <Button type="link" onClick={() => navigate('/client/invoices')}>
              View All →
            </Button>
          }
          className="shadow-lg rounded-xl"
        >
          <Table
            columns={columns}
            dataSource={recentInvoices.slice(0, 5)}
            rowKey="id"
            pagination={false}
          />
        </Card>
      </motion.div>
    </div>
  );
}
