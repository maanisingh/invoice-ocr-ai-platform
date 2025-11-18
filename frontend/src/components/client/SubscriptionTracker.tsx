import { useMemo } from 'react';
import { Row, Col, Card, Table, Tag, Button, Statistic, Alert, Timeline } from 'antd';
import {
  BellOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CalendarOutlined,
  ThunderboltOutlined,
  StopOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { ResponsiveLine } from '@nivo/line';
import { motion } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import AnimatedMetricCard from '../AnimatedMetricCard';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface Subscription {
  id: string;
  name: string;
  provider: string;
  category: string;
  amount: number;
  billingCycle: 'Monthly' | 'Quarterly' | 'Yearly';
  startDate: string;
  nextBilling: string;
  status: 'Active' | 'Expiring Soon' | 'Expired' | 'Paused';
  autoRenew: boolean;
  lastPayment: string;
  paymentMethod: string;
  features: string[];
}

// Generate mock subscriptions
const generateSubscriptions = (): Subscription[] => {
  const subscriptions: Subscription[] = [
    {
      id: 'sub-001',
      name: 'Adobe Creative Cloud',
      provider: 'Adobe',
      category: 'Software',
      amount: 54.99,
      billingCycle: 'Monthly',
      startDate: '2024-01-15',
      nextBilling: dayjs().add(5, 'days').toISOString(),
      status: 'Expiring Soon',
      autoRenew: true,
      lastPayment: '2024-10-15',
      paymentMethod: 'Visa •••• 4242',
      features: ['Photoshop', 'Illustrator', '100GB Cloud Storage']
    },
    {
      id: 'sub-002',
      name: 'Microsoft 365 Business',
      provider: 'Microsoft',
      category: 'Productivity',
      amount: 299.99,
      billingCycle: 'Yearly',
      startDate: '2023-03-01',
      nextBilling: dayjs().add(45, 'days').toISOString(),
      status: 'Active',
      autoRenew: true,
      lastPayment: '2024-03-01',
      paymentMethod: 'MasterCard •••• 8888',
      features: ['Office Apps', 'Teams', '1TB OneDrive']
    },
    {
      id: 'sub-003',
      name: 'Salesforce CRM',
      provider: 'Salesforce',
      category: 'CRM',
      amount: 150.00,
      billingCycle: 'Monthly',
      startDate: '2023-06-10',
      nextBilling: dayjs().add(12, 'days').toISOString(),
      status: 'Active',
      autoRenew: true,
      lastPayment: '2024-10-10',
      paymentMethod: 'Amex •••• 1005',
      features: ['Sales Cloud', 'Service Cloud', 'Analytics']
    },
    {
      id: 'sub-004',
      name: 'Slack Business+',
      provider: 'Slack',
      category: 'Communication',
      amount: 12.50,
      billingCycle: 'Monthly',
      startDate: '2024-02-01',
      nextBilling: dayjs().add(18, 'days').toISOString(),
      status: 'Active',
      autoRenew: true,
      lastPayment: '2024-10-01',
      paymentMethod: 'Visa •••• 4242',
      features: ['Unlimited messages', 'Screen sharing', 'App integrations']
    },
    {
      id: 'sub-005',
      name: 'Dropbox Business',
      provider: 'Dropbox',
      category: 'Storage',
      amount: 20.00,
      billingCycle: 'Monthly',
      startDate: '2023-08-15',
      nextBilling: dayjs().add(3, 'days').toISOString(),
      status: 'Expiring Soon',
      autoRenew: false,
      lastPayment: '2024-09-15',
      paymentMethod: 'Visa •••• 4242',
      features: ['3TB Storage', 'Advanced sharing', 'Version history']
    },
    {
      id: 'sub-006',
      name: 'GitHub Enterprise',
      provider: 'GitHub',
      category: 'Development',
      amount: 21.00,
      billingCycle: 'Monthly',
      startDate: '2023-11-01',
      nextBilling: dayjs().add(25, 'days').toISOString(),
      status: 'Active',
      autoRenew: true,
      lastPayment: '2024-10-01',
      paymentMethod: 'MasterCard •••• 8888',
      features: ['Advanced security', 'CI/CD', 'Unlimited repos']
    },
    {
      id: 'sub-007',
      name: 'Zoom Business',
      provider: 'Zoom',
      category: 'Communication',
      amount: 199.90,
      billingCycle: 'Yearly',
      startDate: '2024-01-10',
      nextBilling: dayjs().add(95, 'days').toISOString(),
      status: 'Active',
      autoRenew: true,
      lastPayment: '2024-01-10',
      paymentMethod: 'Amex •••• 1005',
      features: ['Unlimited meetings', 'Cloud recording', 'Analytics']
    },
    {
      id: 'sub-008',
      name: 'AWS Cloud Services',
      provider: 'Amazon',
      category: 'Infrastructure',
      amount: 450.00,
      billingCycle: 'Monthly',
      startDate: '2023-05-01',
      nextBilling: dayjs().add(8, 'days').toISOString(),
      status: 'Active',
      autoRenew: true,
      lastPayment: '2024-10-01',
      paymentMethod: 'Visa •••• 4242',
      features: ['EC2', 'S3', 'RDS', 'Lambda']
    }
  ];

  return subscriptions;
};

export default function SubscriptionTracker() {
  const subscriptions = useMemo(() => generateSubscriptions(), []);

  const stats = useMemo(() => {
    const active = subscriptions.filter(s => s.status === 'Active').length;
    const expiring = subscriptions.filter(s => s.status === 'Expiring Soon').length;

    // Calculate monthly cost (convert yearly to monthly)
    const monthlyTotal = subscriptions.reduce((sum, s) => {
      if (s.status === 'Expired') return sum;
      const monthly = s.billingCycle === 'Yearly' ? s.amount / 12 :
                      s.billingCycle === 'Quarterly' ? s.amount / 3 : s.amount;
      return sum + monthly;
    }, 0);

    const yearlyProjection = monthlyTotal * 12;

    // Cost by category
    const byCategory = subscriptions.reduce((acc, s) => {
      if (s.status === 'Expired') return acc;
      const monthly = s.billingCycle === 'Yearly' ? s.amount / 12 :
                      s.billingCycle === 'Quarterly' ? s.amount / 3 : s.amount;
      acc[s.category] = (acc[s.category] || 0) + monthly;
      return acc;
    }, {} as Record<string, number>);

    // Upcoming renewals
    const upcoming = subscriptions
      .filter(s => s.status !== 'Expired')
      .sort((a, b) => new Date(a.nextBilling).getTime() - new Date(b.nextBilling).getTime())
      .slice(0, 5);

    return {
      total: subscriptions.length,
      active,
      expiring,
      monthlyTotal,
      yearlyProjection,
      byCategory,
      upcoming
    };
  }, [subscriptions]);

  // Spending trend data (last 6 months)
  const trendData = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => dayjs().subtract(5 - i, 'month').format('MMM'));
    return [{
      id: 'Subscription Costs',
      data: months.map((month) => ({
        x: month,
        y: stats.monthlyTotal * (0.85 + Math.random() * 0.3) // Simulate variation
      }))
    }];
  }, [stats.monthlyTotal]);

  const columns = [
    {
      title: 'Service',
      key: 'service',
      render: (_: any, record: Subscription) => (
        <div>
          <div className="font-semibold">{record.name}</div>
          <div className="text-xs text-gray-500">{record.provider}</div>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: 'Amount',
      key: 'amount',
      render: (_: any, record: Subscription) => (
        <div>
          <div className="font-semibold">${record.amount}</div>
          <div className="text-xs text-gray-500">{record.billingCycle}</div>
        </div>
      ),
    },
    {
      title: 'Next Billing',
      dataIndex: 'nextBilling',
      key: 'nextBilling',
      render: (date: string) => {
        const daysUntil = dayjs(date).diff(dayjs(), 'days');
        return (
          <div>
            <div>{dayjs(date).format('MMM DD, YYYY')}</div>
            <div className={`text-xs ${daysUntil <= 7 ? 'text-red-500' : 'text-gray-500'}`}>
              {dayjs(date).fromNow()}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: Subscription) => {
        const colors: Record<string, string> = {
          'Active': 'success',
          'Expiring Soon': 'warning',
          'Expired': 'error',
          'Paused': 'default'
        };
        return (
          <div>
            <Tag color={colors[status]}>{status}</Tag>
            {!record.autoRenew && <Tag>Manual Renewal</Tag>}
          </div>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Subscription) => (
        <div className="flex gap-2">
          <Button size="small" type="link">Details</Button>
          {record.status === 'Active' && (
            <Button size="small" danger icon={<StopOutlined />}>Pause</Button>
          )}
          {record.status === 'Paused' && (
            <Button size="small" type="primary" icon={<PlayCircleOutlined />}>Resume</Button>
          )}
        </div>
      ),
    },
  ];

  const springProps = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 500 }
  });

  return (
    <animated.div style={springProps}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          Subscription Management
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Track and manage all your subscriptions in one place
        </p>
      </motion.div>

      {/* Alerts */}
      {stats.expiring > 0 && (
        <Alert
          message={`${stats.expiring} subscription${stats.expiring > 1 ? 's' : ''} expiring soon!`}
          description="Review upcoming renewals to avoid service interruptions."
          type="warning"
          showIcon
          icon={<BellOutlined />}
          className="mb-6"
          action={
            <Button size="small" type="primary">
              Review Now
            </Button>
          }
        />
      )}

      {/* Metrics */}
      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="Active Subscriptions"
            value={stats.active}
            icon={<CheckCircleOutlined />}
            gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="Monthly Cost"
            value={stats.monthlyTotal}
            prefix="$"
            icon={<DollarOutlined />}
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="Yearly Projection"
            value={stats.yearlyProjection}
            prefix="$"
            icon={<ThunderboltOutlined />}
            gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="Expiring Soon"
            value={stats.expiring}
            icon={<WarningOutlined />}
            gradient="linear-gradient(135deg, #ffa502 0%, #ff7f00 100%)"
          />
        </Col>
      </Row>

      {/* Visualizations */}
      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} lg={16}>
          <Card title="Subscription Cost Trend" className="shadow-lg">
            <div style={{ height: 300 }}>
              <ResponsiveLine
                data={trendData}
                margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                curve="cardinal"
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  format: (value) => `$${value}`
                }}
                enablePoints={true}
                pointSize={10}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                enableArea={true}
                areaOpacity={0.15}
                colors={['#667eea']}
                theme={{
                  axis: {
                    ticks: {
                      text: { fontSize: 12 }
                    }
                  }
                }}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title={<span><CalendarOutlined className="mr-2" />Upcoming Renewals</span>} className="shadow-lg">
            <Timeline
              items={stats.upcoming.map(sub => {
                const daysUntil = dayjs(sub.nextBilling).diff(dayjs(), 'days');
                return {
                  color: daysUntil <= 7 ? 'red' : daysUntil <= 14 ? 'orange' : 'blue',
                  children: (
                    <div>
                      <div className="font-semibold">{sub.name}</div>
                      <div className="text-sm text-gray-600">
                        ${sub.amount} • {dayjs(sub.nextBilling).format('MMM DD')}
                      </div>
                      <Tag color={daysUntil <= 7 ? 'red' : 'blue'}>
                        {daysUntil} days
                      </Tag>
                    </div>
                  )
                };
              })}
            />
          </Card>
        </Col>
      </Row>

      {/* Cost by Category */}
      <Row gutter={[24, 24]} className="mb-6">
        <Col span={24}>
          <Card title="Cost by Category" className="shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.byCategory).map(([category, amount]) => (
                <motion.div
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg"
                >
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300">{category}</h4>
                  <Statistic
                    value={amount}
                    prefix="$"
                    precision={2}
                    valueStyle={{ fontSize: '24px', color: '#667eea' }}
                  />
                  <p className="text-xs text-gray-500 mt-1">per month</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Subscriptions Table */}
      <Card title="All Subscriptions" className="shadow-lg">
        <Table
          columns={columns}
          dataSource={subscriptions}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </animated.div>
  );
}
