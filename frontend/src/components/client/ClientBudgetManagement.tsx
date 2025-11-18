import { useMemo, useState } from 'react';
import { Row, Col, Card, Table, Tag, Progress, Button, Select, Statistic, Alert } from 'antd';
import {
  DollarOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
  BulbOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { motion } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import AnimatedMetricCard from '../AnimatedMetricCard';
import { useDemoMode } from '@/contexts/DemoModeContext';
import dayjs from 'dayjs';


export default function ClientBudgetManagement() {
  const { isDemoMode, demoBudgets, demoData } = useDemoMode();
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  // AI-powered budget insights
  const budgetInsights = useMemo(() => {
    if (!isDemoMode) return { predictions: [], recommendations: [], anomalies: [] };

    const budgets = demoBudgets;
    const invoices = demoData.invoices.filter(inv => inv.status === 'Paid');

    // Calculate spending trends
    const monthlySpending = invoices.reduce((acc, inv) => {
      const month = dayjs(inv.issueDate).format('MMM');
      acc[month] = (acc[month] || 0) + inv.total;
      return acc;
    }, {} as Record<string, number>);

    // AI Predictions for next 3 months
    const months = Object.keys(monthlySpending);
    const avgSpending = Object.values(monthlySpending).reduce((a, b) => a + b, 0) / months.length;
    const trend = months.length > 1 ?
      ((monthlySpending[months[months.length - 1]] - monthlySpending[months[0]]) / monthlySpending[months[0]]) : 0;

    const predictions = [
      {
        month: dayjs().add(1, 'month').format('MMM'),
        predicted: avgSpending * (1 + trend),
        confidence: 0.87,
        range: { min: avgSpending * (1 + trend) * 0.85, max: avgSpending * (1 + trend) * 1.15 }
      },
      {
        month: dayjs().add(2, 'month').format('MMM'),
        predicted: avgSpending * (1 + trend * 1.5),
        confidence: 0.76,
        range: { min: avgSpending * (1 + trend * 1.5) * 0.8, max: avgSpending * (1 + trend * 1.5) * 1.2 }
      },
      {
        month: dayjs().add(3, 'month').format('MMM'),
        predicted: avgSpending * (1 + trend * 2),
        confidence: 0.64,
        range: { min: avgSpending * (1 + trend * 2) * 0.75, max: avgSpending * (1 + trend * 2) * 1.25 }
      }
    ];

    // AI Recommendations
    const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const utilizationRate = (totalSpent / totalAllocated) * 100;

    const recommendations = [];
    if (utilizationRate > 85) {
      recommendations.push({
        type: 'warning',
        title: 'High Budget Utilization',
        message: `You've used ${utilizationRate.toFixed(0)}% of your total budget. Consider requesting additional allocation for next period.`,
        impact: 'high',
        savings: 0
      });
    }

    // Find overspending categories
    const overSpendingCategories = budgets.filter(b => b.spent > b.allocated);
    if (overSpendingCategories.length > 0) {
      recommendations.push({
        type: 'danger',
        title: 'Over Budget Categories',
        message: `${overSpendingCategories.length} categories are over budget. Review and reallocate funds.`,
        impact: 'high',
        savings: overSpendingCategories.reduce((sum, b) => sum + (b.spent - b.allocated), 0)
      });
    }

    // Find underutilized categories
    const underutilized = budgets.filter(b => (b.spent / b.allocated) < 0.5);
    if (underutilized.length > 0) {
      const potential = underutilized.reduce((sum, b) => sum + (b.allocated - b.spent), 0);
      recommendations.push({
        type: 'success',
        title: 'Optimization Opportunity',
        message: `${underutilized.length} categories are underutilized. You could reallocate $${potential.toLocaleString()} to high-priority areas.`,
        impact: 'medium',
        savings: potential
      });
    }

    // Anomaly Detection
    const anomalies = budgets.filter(b => {
      const utilizationRate = (b.spent / b.allocated) * 100;
      return utilizationRate > 120 || (utilizationRate < 30 && b.allocated > 1000);
    }).map(b => ({
      category: b.category,
      type: (b.spent / b.allocated) > 1.2 ? 'overspending' : 'underutilized',
      severity: (b.spent / b.allocated) > 1.5 ? 'high' : 'medium',
      amount: Math.abs(b.spent - b.allocated),
      utilizationRate: (b.spent / b.allocated) * 100
    }));

    return { predictions, recommendations, anomalies };
  }, [isDemoMode, demoBudgets, demoData]);

  // Budget data processing
  const budgetData = useMemo(() => {
    if (!isDemoMode) return {
      budgets: [],
      totalAllocated: 0,
      totalSpent: 0,
      remaining: 0,
      utilizationRate: 0,
      categoryBreakdown: [],
      trendData: []
    };

    const budgets = demoBudgets;
    const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const remaining = totalAllocated - totalSpent;
    const utilizationRate = (totalSpent / totalAllocated) * 100;

    // Category breakdown for pie chart
    const categoryBreakdown = budgets.map(b => ({
      id: b.category,
      label: b.category,
      value: b.spent,
      percentage: (b.spent / totalSpent) * 100
    })).sort((a, b) => b.value - a.value).slice(0, 8);

    // Trend data for line chart
    const trendData = [
      {
        id: 'Allocated',
        data: budgets.map((b) => ({ x: b.category.substring(0, 10), y: b.allocated }))
      },
      {
        id: 'Spent',
        data: budgets.map((b) => ({ x: b.category.substring(0, 10), y: b.spent }))
      }
    ];

    return {
      budgets,
      totalAllocated,
      totalSpent,
      remaining,
      utilizationRate,
      categoryBreakdown,
      trendData
    };
  }, [isDemoMode, demoBudgets]);

  // Animation springs
  const springProps = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 280, friction: 60 }
  });

  const columns = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (text: string) => <span className="font-semibold">{text}</span>,
    },
    {
      title: 'Allocated',
      dataIndex: 'allocated',
      key: 'allocated',
      render: (amount: number) => `$${amount.toLocaleString()}`,
    },
    {
      title: 'Spent',
      dataIndex: 'spent',
      key: 'spent',
      render: (amount: number, record: any) => (
        <span className={record.spent > record.allocated ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
          ${amount.toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Remaining',
      key: 'remaining',
      render: (_: any, record: any) => {
        const remaining = record.allocated - record.spent;
        return (
          <span className={remaining < 0 ? 'text-red-600' : 'text-gray-600'}>
            ${Math.abs(remaining).toLocaleString()}
          </span>
        );
      },
    },
    {
      title: 'Utilization',
      key: 'utilization',
      render: (_: any, record: any) => {
        const percent = (record.spent / record.allocated) * 100;
        return (
          <Progress
            percent={percent}
            size="small"
            strokeColor={percent > 100 ? '#ef4444' : percent > 85 ? '#f59e0b' : '#10b981'}
            format={(p) => `${p?.toFixed(0)}%`}
          />
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          'On Track': 'success',
          'At Risk': 'warning',
          'Over Budget': 'error'
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      },
    },
  ];

  if (!isDemoMode) {
    return (
      <Alert
        message="Demo Mode Required"
        description="Enable Demo Mode to view budget management features."
        type="info"
        showIcon
      />
    );
  }

  return (
    <animated.div style={springProps}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              Budget Management
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              AI-powered budget tracking and predictions
            </p>
          </div>
          <div className="flex gap-3">
            <Select
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              style={{ width: 150 }}
              options={[
                { label: 'Monthly', value: 'monthly' },
                { label: 'Quarterly', value: 'quarterly' },
                { label: 'Yearly', value: 'yearly' }
              ]}
            />
            <Button type="primary" icon={<PlusOutlined />}>
              Set Budget
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Metrics */}
      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="Total Allocated"
            value={budgetData.totalAllocated}
            prefix="$"
            icon={<DollarOutlined />}
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="Total Spent"
            value={budgetData.totalSpent}
            prefix="$"
            icon={<BarChartOutlined />}
            gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="Remaining"
            value={budgetData.remaining}
            prefix="$"
            icon={<CheckCircleOutlined />}
            gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="Utilization"
            value={budgetData.utilizationRate}
            suffix="%"
            icon={<ThunderboltOutlined />}
            gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
          />
        </Col>
      </Row>

      {/* AI Insights & Predictions */}
      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} lg={16}>
          <Card title={<span><BulbOutlined className="mr-2" />AI Predictions (Next 3 Months)</span>} className="shadow-lg">
            <div className="space-y-4">
              {budgetInsights.predictions.map((pred, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg"
                >
                  <div>
                    <h4 className="font-semibold text-lg">{pred.month}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Range: ${pred.range.min.toLocaleString()} - ${pred.range.max.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Statistic
                      value={pred.predicted}
                      prefix="$"
                      precision={0}
                      valueStyle={{ color: '#3f8600', fontSize: '24px' }}
                    />
                    <Tag color="blue">{(pred.confidence * 100).toFixed(0)}% Confidence</Tag>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title={<span><TrophyOutlined className="mr-2" />AI Recommendations</span>} className="shadow-lg">
            <div className="space-y-3">
              {budgetInsights.recommendations.map((rec, idx) => {
                const icons: Record<string, any> = {
                  warning: <WarningOutlined className="text-orange-500" />,
                  danger: <WarningOutlined className="text-red-500" />,
                  success: <CheckCircleOutlined className="text-green-500" />
                };
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.15 }}
                    className="p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded"
                  >
                    <div className="flex items-start gap-2">
                      {icons[rec.type]}
                      <div className="flex-1">
                        <h5 className="font-semibold text-sm">{rec.title}</h5>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{rec.message}</p>
                        {rec.savings > 0 && (
                          <Tag color="green" className="mt-2">Potential: ${rec.savings.toLocaleString()}</Tag>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Visualizations */}
      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} lg={16}>
          <Card title="Budget Allocation vs Spending" className="shadow-lg">
            <div style={{ height: 400 }}>
              <ResponsiveBar
                data={budgetData.budgets.map(b => ({
                  category: b.category.substring(0, 15),
                  Allocated: b.allocated,
                  Spent: b.spent,
                  Remaining: Math.max(0, b.allocated - b.spent)
                }))}
                keys={['Allocated', 'Spent']}
                indexBy="category"
                margin={{ top: 50, right: 130, bottom: 100, left: 80 }}
                padding={0.3}
                valueScale={{ type: 'linear' }}
                colors={['#667eea', '#f093fb']}
                borderRadius={8}
                axisBottom={{
                  tickRotation: -45,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  format: (value) => `$${(value / 1000).toFixed(0)}k`
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                legends={[
                  {
                    dataFrom: 'keys',
                    anchor: 'bottom-right',
                    direction: 'column',
                    translateX: 120,
                    itemWidth: 100,
                    itemHeight: 20,
                  }
                ]}
                theme={{
                  axis: {
                    ticks: {
                      text: { fontSize: 11 }
                    }
                  }
                }}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Spending Distribution" className="shadow-lg">
            <div style={{ height: 400 }}>
              <ResponsivePie
                data={budgetData.categoryBreakdown}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                colors={{ scheme: 'nivo' }}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLabelsTextColor="#ffffff"
                arcLabel={(d) => `${d.value.toLocaleString()}`}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Budget Details Table */}
      <Card title="Budget Details" className="shadow-lg">
        <Table
          columns={columns}
          dataSource={budgetData.budgets}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </animated.div>
  );
}
