import { useMemo } from 'react';
import { Row, Col, Card, Table, Tag, Progress, Alert, Button, Badge } from 'antd';
import {
  WarningOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Line,
  Area,
  AreaChart,
  Cell,
} from 'recharts';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import AnimatedMetricCard from './AnimatedMetricCard';
import { useDemoMode } from '@/contexts/DemoModeContext';

export default function FraudDetectionDashboard() {
  const { isDemoMode, demoData, demoAlerts } = useDemoMode();

  // Get fraud-related data
  const fraudData = useMemo(() => {
    if (!isDemoMode) return { invoices: [], alerts: [], stats: {} };

    const invoices = demoData.invoices;
    const highRisk = invoices.filter(inv => inv.fraudScore > 0.1);
    const mediumRisk = invoices.filter(inv => inv.fraudScore > 0.05 && inv.fraudScore <= 0.1);
    const lowRisk = invoices.filter(inv => inv.fraudScore <= 0.05);

    const avgFraudScore = invoices.reduce((sum, inv) => sum + inv.fraudScore, 0) / invoices.length;

    // Fraud alerts from demo data
    const fraudAlerts = demoAlerts.filter(alert => alert.type === 'fraud');

    // Risk trend over time (last 7 days)
    const riskTrend = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dayInvoices = invoices.filter(inv => {
        const invDate = new Date(inv.createdAt);
        return invDate.toDateString() === date.toDateString();
      });

      const avgRisk = dayInvoices.length > 0
        ? dayInvoices.reduce((sum, inv) => sum + inv.fraudScore, 0) / dayInvoices.length
        : 0;

      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        riskScore: avgRisk * 100,
        detected: dayInvoices.filter(inv => inv.fraudScore > 0.1).length,
      };
    });

    // Fraud patterns analysis
    const fraudPatterns = [
      {
        pattern: 'Duplicate Detection',
        score: 92,
        detected: invoices.filter(inv => inv.duplicateRisk > 0.15).length,
      },
      {
        pattern: 'Amount Anomaly',
        score: 88,
        detected: Math.floor(Math.random() * 5) + 2,
      },
      {
        pattern: 'Vendor Mismatch',
        score: 85,
        detected: Math.floor(Math.random() * 3) + 1,
      },
      {
        pattern: 'Timing Irregularity',
        score: 78,
        detected: Math.floor(Math.random() * 4) + 1,
      },
      {
        pattern: 'Payment Terms Violation',
        score: 95,
        detected: Math.floor(Math.random() * 2),
      },
    ];

    return {
      invoices: highRisk.slice(0, 10),
      alerts: fraudAlerts,
      stats: {
        highRisk: highRisk.length,
        mediumRisk: mediumRisk.length,
        lowRisk: lowRisk.length,
        total: invoices.length,
        avgFraudScore: avgFraudScore * 100,
        totalAtRisk: highRisk.reduce((sum, inv) => sum + inv.total, 0),
        detectionRate: ((highRisk.length + mediumRisk.length) / invoices.length) * 100,
      },
      riskTrend,
      fraudPatterns,
    };
  }, [isDemoMode, demoData, demoAlerts]);

  const getFraudScoreColor = (score: number) => {
    if (score > 0.1) return '#ef4444';
    if (score > 0.05) return '#f59e0b';
    return '#10b981';
  };

  const getFraudScoreLabel = (score: number) => {
    if (score > 0.1) return 'High Risk';
    if (score > 0.05) return 'Medium Risk';
    return 'Low Risk';
  };

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
      title: 'Amount',
      dataIndex: 'total',
      key: 'total',
      render: (amount: number) => (
        <span className="font-semibold">${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
      ),
    },
    {
      title: 'Fraud Risk',
      dataIndex: 'fraudScore',
      key: 'fraudScore',
      sorter: (a: any, b: any) => b.fraudScore - a.fraudScore,
      render: (score: number) => (
        <div className="flex items-center gap-2">
          <Progress
            percent={score * 100}
            size="small"
            strokeColor={getFraudScoreColor(score)}
            showInfo={false}
            style={{ width: 80 }}
          />
          <Tag color={getFraudScoreColor(score)}>
            {(score * 100).toFixed(1)}%
          </Tag>
        </div>
      ),
    },
    {
      title: 'Risk Level',
      dataIndex: 'fraudScore',
      key: 'riskLevel',
      render: (score: number) => {
        const label = getFraudScoreLabel(score);
        const color = getFraudScoreColor(score);
        return (
          <Tag color={color} icon={<WarningOutlined />}>
            {label}
          </Tag>
        );
      },
    },
    {
      title: 'Date',
      dataIndex: 'issueDate',
      key: 'issueDate',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Button type="link" icon={<EyeOutlined />} size="small">
          Investigate
        </Button>
      ),
    },
  ];

  if (!isDemoMode) {
    return (
      <Alert
        message="Demo Mode Required"
        description="Please enable Demo Mode to view fraud detection features."
        type="info"
        showIcon
      />
    );
  }

  return (
    <div>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          Fraud Detection & Prevention
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          AI-powered fraud detection and risk assessment
        </p>
      </motion.div>

      {/* Metric Cards */}
      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="High Risk Invoices"
            value={fraudData.stats.highRisk || 0}
            icon={<ExclamationCircleOutlined />}
            gradient="linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="Medium Risk"
            value={fraudData.stats.mediumRisk || 0}
            icon={<WarningOutlined />}
            gradient="linear-gradient(135deg, #ffa502 0%, #ff7f00 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="Total at Risk"
            value={fraudData.stats.totalAtRisk || 0}
            prefix="$"
            icon={<ThunderboltOutlined />}
            gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="Detection Rate"
            value={fraudData.stats.detectionRate || 0}
            suffix="%"
            icon={<SafetyOutlined />}
            gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
          />
        </Col>
      </Row>

      {/* Active Alerts */}
      {fraudData.alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card
            title={
              <span>
                <Badge count={fraudData.alerts.length} offset={[10, 0]}>
                  <ThunderboltOutlined className="mr-2 text-red-500" />
                  Active Fraud Alerts
                </Badge>
              </span>
            }
            className="shadow-lg rounded-xl"
          >
            <div className="space-y-3">
              {fraudData.alerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <WarningOutlined className="text-red-600" />
                        <span className="font-semibold text-red-900 dark:text-red-100">
                          {alert.title}
                        </span>
                        <Tag color="red" className="text-xs">
                          {alert.severity.toUpperCase()}
                        </Tag>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 ml-6">
                        {alert.message}
                      </p>
                      <span className="text-xs text-gray-500 ml-6">
                        {dayjs(alert.createdAt).fromNow()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="small" type="primary" danger>
                        Investigate
                      </Button>
                      <Button size="small">Dismiss</Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Charts Row */}
      <Row gutter={[24, 24]} className="mb-6">
        {/* Fraud Risk Trend */}
        <Col xs={24} lg={16}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card
              title="Fraud Risk Trend (Last 7 Days)"
              className="shadow-lg rounded-xl"
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={fraudData.riskTrend}>
                  <defs>
                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" label={{ value: 'Risk Score (%)', angle: -90, position: 'insideLeft' }} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="riskScore"
                    stroke="#ef4444"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRisk)"
                    name="Avg Risk Score"
                  />
                  <Line
                    type="monotone"
                    dataKey="detected"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="Detected Cases"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Col>

        {/* Fraud Pattern Analysis */}
        <Col xs={24} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card title="Fraud Patterns" className="shadow-lg rounded-xl">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={fraudData.fraudPatterns}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="pattern" stroke="#6b7280" style={{ fontSize: '11px' }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#6b7280" />
                  <Radar
                    name="Detection Score"
                    dataKey="score"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                  />
                  <RechartsTooltip />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Risk Distribution */}
      <Row gutter={[24, 24]} className="mb-6">
        <Col span={24}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card title="Risk Distribution" className="shadow-lg rounded-xl">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={[
                    { level: 'Low Risk', count: fraudData.stats.lowRisk, color: '#10b981' },
                    { level: 'Medium Risk', count: fraudData.stats.mediumRisk, color: '#f59e0b' },
                    { level: 'High Risk', count: fraudData.stats.highRisk, color: '#ef4444' },
                  ]}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#6b7280" />
                  <YAxis dataKey="level" type="category" width={120} stroke="#6b7280" />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[0, 8, 8, 0]}>
                    {[
                      { level: 'Low Risk', count: fraudData.stats.lowRisk, color: '#10b981' },
                      { level: 'Medium Risk', count: fraudData.stats.mediumRisk, color: '#f59e0b' },
                      { level: 'High Risk', count: fraudData.stats.highRisk, color: '#ef4444' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* High Risk Invoices Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Card
          title={
            <span>
              <WarningOutlined className="mr-2 text-red-500" />
              High Risk Invoices
            </span>
          }
          extra={
            <Tag color="red">
              {fraudData.invoices.length} invoices requiring review
            </Tag>
          }
          className="shadow-lg rounded-xl"
        >
          <Table
            columns={columns}
            dataSource={fraudData.invoices}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </motion.div>
    </div>
  );
}
