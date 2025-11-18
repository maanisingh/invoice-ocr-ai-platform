import { useMemo, useState } from 'react';
import { Row, Col, Card, Table, Tag, Progress, Button, Tooltip } from 'antd';
import {
  StarOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined,
  MinusOutlined,
  ThunderboltOutlined,
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
} from 'recharts';
import { motion } from 'framer-motion';
import AnimatedMetricCard from './AnimatedMetricCard';
import { useDemoMode } from '@/contexts/DemoModeContext';

export default function VendorPerformance() {
  const { isDemoMode, demoVendorPerformance } = useDemoMode();
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);

  const performanceData = useMemo(() => {
    if (!isDemoMode) return { vendors: [], topVendors: [], avgMetrics: { overallRating: 0, qualityScore: 0, onTimeRate: 0, complianceScore: 0 }, selectedVendorData: null };

    const vendors = demoVendorPerformance;

    // Top 10 vendors by overall rating
    const topVendors = [...vendors]
      .sort((a, b) => b.overallRating - a.overallRating)
      .slice(0, 10);

    // Average metrics across all vendors
    const avgMetrics = {
      overallRating: vendors.reduce((sum, v) => sum + v.overallRating, 0) / vendors.length,
      qualityScore: vendors.reduce((sum, v) => sum + v.qualityScore, 0) / vendors.length,
      onTimeRate: vendors.reduce((sum, v) => sum + v.onTimeDeliveryRate, 0) / vendors.length,
      complianceScore: vendors.reduce((sum, v) => sum + v.complianceScore, 0) / vendors.length,
    };

    // Selected vendor detail
    const selectedVendorData = selectedVendor
      ? vendors.find(v => v.vendorId === selectedVendor)
      : null;

    return {
      vendors,
      topVendors,
      avgMetrics,
      selectedVendorData,
    };
  }, [isDemoMode, demoVendorPerformance, selectedVendor]);

  const getTrendIcon = (trend: string) => {
    if (trend === 'improving') return <RiseOutlined className="text-green-500" />;
    if (trend === 'declining') return <FallOutlined className="text-red-500" />;
    return <MinusOutlined className="text-gray-500" />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'improving') return 'success';
    if (trend === 'declining') return 'error';
    return 'default';
  };

  const columns = [
    {
      title: 'Rank',
      key: 'rank',
      width: 70,
      render: (_: any, __: any, index: number) => (
        <div className="flex items-center gap-2">
          {index < 3 && <TrophyOutlined className={index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-orange-600'} />}
          <span className="font-semibold">{index + 1}</span>
        </div>
      ),
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName',
      render: (text: string) => <span className="font-semibold">{text}</span>,
    },
    {
      title: 'Overall Rating',
      dataIndex: 'overallRating',
      key: 'overallRating',
      sorter: (a: any, b: any) => b.overallRating - a.overallRating,
      render: (rating: number) => (
        <div className="flex items-center gap-2">
          <Progress
            type="circle"
            percent={(rating / 5) * 100}
            size={50}
            strokeColor="#8b5cf6"
            format={() => rating.toFixed(1)}
          />
          <StarOutlined className="text-yellow-500" />
        </div>
      ),
    },
    {
      title: 'Quality Score',
      dataIndex: 'qualityScore',
      key: 'qualityScore',
      render: (score: number) => (
        <Tooltip title={`${score.toFixed(1)} out of 5.0`}>
          <Progress
            percent={(score / 5) * 100}
            size="small"
            strokeColor="#10b981"
            format={(percent) => `${((percent || 0) / 20).toFixed(1)}`}
          />
        </Tooltip>
      ),
    },
    {
      title: 'On-Time Rate',
      dataIndex: 'onTimeDeliveryRate',
      key: 'onTimeDeliveryRate',
      render: (rate: number) => (
        <Tag color={rate >= 0.9 ? 'green' : rate >= 0.75 ? 'orange' : 'red'}>
          {(rate * 100).toFixed(0)}%
        </Tag>
      ),
    },
    {
      title: 'Compliance',
      dataIndex: 'complianceScore',
      key: 'complianceScore',
      render: (score: number) => (
        <Progress
          percent={score * 100}
          size="small"
          strokeColor={score >= 0.95 ? '#10b981' : score >= 0.85 ? '#f59e0b' : '#ef4444'}
        />
      ),
    },
    {
      title: 'Trend',
      dataIndex: 'trend',
      key: 'trend',
      render: (trend: string) => (
        <Tag color={getTrendColor(trend)} icon={getTrendIcon(trend)}>
          {trend.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Total Invoices',
      dataIndex: 'totalInvoices',
      key: 'totalInvoices',
      render: (count: number) => count.toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button type="link" size="small" onClick={() => setSelectedVendor(record.vendorId)}>
          View Details
        </Button>
      ),
    },
  ];

  if (!isDemoMode) {
    return null;
  }

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          Vendor Performance Analytics
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Comprehensive vendor scoring and performance tracking
        </p>
      </motion.div>

      {/* Metrics */}
      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="Avg Overall Rating"
            value={performanceData.avgMetrics?.overallRating || 0}
            suffix=" / 5"
            icon={<StarOutlined />}
            gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="Avg Quality Score"
            value={performanceData.avgMetrics?.qualityScore || 0}
            suffix=" / 5"
            icon={<TrophyOutlined />}
            gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="On-Time Delivery"
            value={(performanceData.avgMetrics?.onTimeRate || 0) * 100}
            suffix="%"
            icon={<ThunderboltOutlined />}
            gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="Compliance Rate"
            value={(performanceData.avgMetrics?.complianceScore || 0) * 100}
            suffix="%"
            icon={<StarOutlined />}
            gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
          />
        </Col>
      </Row>

      {/* Selected Vendor Detail */}
      {performanceData.selectedVendorData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card
            title={`Performance Detail: ${performanceData.selectedVendorData.vendorName}`}
            extra={<Button onClick={() => setSelectedVendor(null)}>Close</Button>}
            className="shadow-lg rounded-xl"
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={[
                    { metric: 'Quality', score: performanceData.selectedVendorData.qualityScore * 20 },
                    { metric: 'On-Time', score: performanceData.selectedVendorData.onTimeDeliveryRate * 100 },
                    { metric: 'Compliance', score: performanceData.selectedVendorData.complianceScore * 100 },
                    { metric: 'Innovation', score: performanceData.selectedVendorData.innovationScore * 20 },
                    { metric: 'Cost', score: performanceData.selectedVendorData.costCompetitiveness * 20 },
                    { metric: 'Response', score: 100 - (performanceData.selectedVendorData.responseTime / 48 * 100) },
                  ]}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="metric" stroke="#6b7280" />
                    <PolarRadiusAxis domain={[0, 100]} stroke="#6b7280" />
                    <Radar
                      name="Performance"
                      dataKey="score"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </Col>
              <Col xs={24} lg={12}>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Key Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Total Invoices:</span>
                        <span className="font-semibold">{performanceData.selectedVendorData.totalInvoices}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Total Amount:</span>
                        <span className="font-semibold text-purple-600">
                          ${performanceData.selectedVendorData.totalAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Avg Invoice:</span>
                        <span className="font-semibold">
                          ${performanceData.selectedVendorData.avgInvoiceAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Response Time:</span>
                        <span className="font-semibold">{performanceData.selectedVendorData.responseTime.toFixed(1)}h</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Dispute Rate:</span>
                        <span className="font-semibold">{(performanceData.selectedVendorData.disputeRate * 100).toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Trend:</span>
                        <Tag color={getTrendColor(performanceData.selectedVendorData.trend)} icon={getTrendIcon(performanceData.selectedVendorData.trend)}>
                          {performanceData.selectedVendorData.trend.toUpperCase()}
                        </Tag>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </motion.div>
      )}

      {/* Top Performers Chart */}
      <Row gutter={[24, 24]} className="mb-6">
        <Col span={24}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card title="Top 10 Vendors by Rating" className="shadow-lg rounded-xl">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData.topVendors.map(v => ({
                  name: v.vendorName.substring(0, 20),
                  rating: v.overallRating,
                  quality: v.qualityScore,
                  onTime: v.onTimeDeliveryRate * 5,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" angle={-15} textAnchor="end" height={100} />
                  <YAxis stroke="#6b7280" domain={[0, 5]} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="rating" fill="#8b5cf6" name="Overall Rating" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="quality" fill="#3b82f6" name="Quality Score" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* All Vendors Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card title="All Vendors" className="shadow-lg rounded-xl">
          <Table
            columns={columns}
            dataSource={performanceData.vendors}
            rowKey="vendorId"
            pagination={{ pageSize: 15 }}
            scroll={{ x: 1400 }}
          />
        </Card>
      </motion.div>
    </div>
  );
}
