import { useMemo } from 'react';
import { Row, Col, Card, Table, Tag, Progress, Alert, Button } from 'antd';
import {
  DollarOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  LineChartOutlined,
  PlusOutlined,
  EditOutlined,
} from '@ant-design/icons';
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line,
} from 'recharts';
import { motion } from 'framer-motion';
import AnimatedMetricCard from './AnimatedMetricCard';
import { useDemoMode } from '@/contexts/DemoModeContext';

export default function BudgetTracking() {
  const { isDemoMode, demoBudgets, demoAlerts } = useDemoMode();

  const budgetData = useMemo(() => {
    if (!isDemoMode) return { budgets: [], stats: { totalAllocated: 0, totalSpent: 0, totalRemaining: 0, utilizationRate: 0, onTrack: 0, atRisk: 0, overBudget: 0 }, alerts: [], chartData: [] };

    const budgets = demoBudgets;
    const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const utilizationRate = (totalSpent / totalAllocated) * 100;

    const onTrack = budgets.filter(b => b.status === 'On Track').length;
    const atRisk = budgets.filter(b => b.status === 'At Risk').length;
    const overBudget = budgets.filter(b => b.status === 'Over Budget').length;

    // Budget alerts
    const budgetAlerts = demoAlerts.filter(alert => alert.type === 'budget');

    // Chart data showing allocated vs spent
    const chartData = budgets.map(budget => ({
      category: budget.category.replace(' & ', '\n'),
      allocated: budget.allocated,
      spent: budget.spent,
      remaining: budget.allocated - budget.spent,
      percentage: (budget.spent / budget.allocated) * 100,
    })).sort((a, b) => b.percentage - a.percentage);

    return {
      budgets,
      stats: {
        totalAllocated,
        totalSpent,
        totalRemaining: totalAllocated - totalSpent,
        utilizationRate,
        onTrack,
        atRisk,
        overBudget,
      },
      alerts: budgetAlerts,
      chartData,
    };
  }, [isDemoMode, demoBudgets, demoAlerts]);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'On Track': 'success',
      'At Risk': 'warning',
      'Over Budget': 'error',
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: any } = {
      'On Track': <CheckCircleOutlined />,
      'At Risk': <WarningOutlined />,
      'Over Budget': <ExclamationCircleOutlined />,
    };
    return icons[status];
  };

  const getBudgetColor = (percentage: number) => {
    if (percentage > 100) return '#ef4444';
    if (percentage > 85) return '#f59e0b';
    return '#10b981';
  };

  const columns = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (text: string) => <span className="font-semibold">{text}</span>,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (dept: string) => <Tag color="blue">{dept}</Tag>,
    },
    {
      title: 'Budget Owner',
      dataIndex: 'owner',
      key: 'owner',
    },
    {
      title: 'Allocated',
      dataIndex: 'allocated',
      key: 'allocated',
      render: (amount: number) => (
        <span className="font-semibold">${amount.toLocaleString()}</span>
      ),
    },
    {
      title: 'Spent',
      dataIndex: 'spent',
      key: 'spent',
      render: (amount: number) => (
        <span className="text-purple-600 font-semibold">${amount.toLocaleString()}</span>
      ),
    },
    {
      title: 'Remaining',
      key: 'remaining',
      render: (_: any, record: any) => {
        const remaining = record.allocated - record.spent;
        return (
          <span className={remaining >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
            ${Math.abs(remaining).toLocaleString()}
          </span>
        );
      },
    },
    {
      title: 'Utilization',
      key: 'utilization',
      render: (_: any, record: any) => {
        const percentage = (record.spent / record.allocated) * 100;
        return (
          <div className="w-32">
            <Progress
              percent={percentage}
              size="small"
              strokeColor={getBudgetColor(percentage)}
              format={(percent) => `${percent?.toFixed(0)}%`}
            />
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Button type="link" icon={<EditOutlined />} size="small">
          Edit
        </Button>
      ),
    },
  ];

  if (!isDemoMode) {
    return (
      <Alert
        message="Demo Mode Required"
        description="Please enable Demo Mode to view budget tracking features."
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
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              Budget Tracking & Management
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Monitor spending against allocated budgets in real-time
            </p>
          </div>
          <Button type="primary" size="large" icon={<PlusOutlined />}>
            Create Budget
          </Button>
        </div>
      </motion.div>

      {/* Demo Mode Alert */}
      {!isDemoMode && (
        <Alert
          message="Demo Mode Required"
          description="Budget tracking data is only available in demo mode. Please enable demo mode from the toggle in the header to view budget data."
          type="info"
          showIcon
          className="mb-6"
        />
      )}

      {/* Metric Cards */}
      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="Total Allocated"
            value={budgetData.stats.totalAllocated || 0}
            prefix="$"
            icon={<DollarOutlined />}
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="Total Spent"
            value={budgetData.stats.totalSpent || 0}
            prefix="$"
            icon={<LineChartOutlined />}
            gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="Remaining"
            value={budgetData.stats.totalRemaining || 0}
            prefix="$"
            icon={<CheckCircleOutlined />}
            gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="Utilization Rate"
            value={budgetData.stats.utilizationRate || 0}
            suffix="%"
            icon={<WarningOutlined />}
            gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
          />
        </Col>
      </Row>

      {/* Budget Alerts */}
      {budgetData.alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card title="Budget Alerts" className="shadow-lg rounded-xl">
            <div className="space-y-3">
              {budgetData.alerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 border-l-4 rounded ${
                    alert.severity === 'high'
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                      : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {alert.severity === 'high' ? (
                          <ExclamationCircleOutlined className="text-red-600" />
                        ) : (
                          <WarningOutlined className="text-yellow-600" />
                        )}
                        <span className="font-semibold">{alert.title}</span>
                        <Tag color={alert.severity === 'high' ? 'red' : 'orange'} className="text-xs">
                          {alert.severity.toUpperCase()}
                        </Tag>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 ml-6">
                        {alert.message}
                      </p>
                    </div>
                    <Button size="small" type="primary">
                      Adjust Budget
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Budget Status Overview */}
      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} lg={16}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card title="Budget vs Actual Spending" className="shadow-lg rounded-xl">
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={budgetData.chartData} margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="category" stroke="#6b7280" angle={-15} textAnchor="end" height={100} />
                  <YAxis stroke="#6b7280" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                    formatter={(value: any) => `$${value.toLocaleString()}`}
                  />
                  <Legend />
                  <Bar dataKey="allocated" fill="#8b5cf6" name="Allocated Budget" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="spent" fill="#ec4899" name="Spent" radius={[8, 8, 0, 0]} />
                  <Line
                    type="monotone"
                    dataKey="percentage"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Utilization %"
                    yAxisId="right"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card title="Status Distribution" className="shadow-lg rounded-xl">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="flex items-center gap-2">
                      <CheckCircleOutlined className="text-green-500" />
                      On Track
                    </span>
                    <span className="font-semibold">{budgetData.stats.onTrack}</span>
                  </div>
                  <Progress
                    percent={((budgetData.stats.onTrack || 0) / budgetData.budgets.length) * 100}
                    strokeColor="#10b981"
                    showInfo={false}
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="flex items-center gap-2">
                      <WarningOutlined className="text-yellow-500" />
                      At Risk
                    </span>
                    <span className="font-semibold">{budgetData.stats.atRisk}</span>
                  </div>
                  <Progress
                    percent={((budgetData.stats.atRisk || 0) / budgetData.budgets.length) * 100}
                    strokeColor="#f59e0b"
                    showInfo={false}
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="flex items-center gap-2">
                      <ExclamationCircleOutlined className="text-red-500" />
                      Over Budget
                    </span>
                    <span className="font-semibold">{budgetData.stats.overBudget}</span>
                  </div>
                  <Progress
                    percent={((budgetData.stats.overBudget || 0) / budgetData.budgets.length) * 100}
                    strokeColor="#ef4444"
                    showInfo={false}
                  />
                </div>

                <div className="pt-4 border-t mt-6">
                  <h4 className="font-semibold mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button block>Generate Report</Button>
                    <Button block>Export to Excel</Button>
                    <Button block type="primary">Review All Budgets</Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Budget Details Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card title="Budget Details" className="shadow-lg rounded-xl">
          <Table
            columns={columns}
            dataSource={budgetData.budgets}
            rowKey="id"
            pagination={{ pageSize: 12 }}
            scroll={{ x: 1200 }}
          />
        </Card>
      </motion.div>
    </div>
  );
}
