import { useState } from 'react';
import { Row, Col, Card, Table, Tag, Progress, Button, Space, Statistic } from 'antd';
import {
  DollarOutlined,
  WarningOutlined,
  CheckCircleOutlined,
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

// Mock budget data
const mockBudgets = [
  {
    id: '1',
    category: 'Marketing & Advertising',
    allocated: 50000,
    spent: 42500,
    period: 'Q4 2025',
    status: 'At Risk',
  },
  {
    id: '2',
    category: 'Office Supplies',
    allocated: 10000,
    spent: 6800,
    period: 'Q4 2025',
    status: 'On Track',
  },
  {
    id: '3',
    category: 'Travel & Entertainment',
    allocated: 30000,
    spent: 28200,
    period: 'Q4 2025',
    status: 'At Risk',
  },
  {
    id: '4',
    category: 'Software & Subscriptions',
    allocated: 25000,
    spent: 18750,
    period: 'Q4 2025',
    status: 'On Track',
  },
  {
    id: '5',
    category: 'Professional Services',
    allocated: 40000,
    spent: 22000,
    period: 'Q4 2025',
    status: 'On Track',
  },
];

export default function BudgetTrackingPage() {
  const [budgets] = useState(mockBudgets);

  // Calculate stats
  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalAllocated - totalSpent;
  const utilizationRate = (totalSpent / totalAllocated) * 100;

  const onTrack = budgets.filter(b => b.status === 'On Track').length;
  const atRisk = budgets.filter(b => b.status === 'At Risk').length;

  // Chart data
  const chartData = budgets.map(budget => ({
    category: budget.category.substring(0, 20),
    allocated: budget.allocated,
    spent: budget.spent,
    remaining: budget.allocated - budget.spent,
    percentage: (budget.spent / budget.allocated) * 100,
  })).sort((a, b) => b.percentage - a.percentage);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'On Track': 'success',
      'At Risk': 'warning',
      'Over Budget': 'error',
    };
    return colors[status] || 'default';
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
      title: 'Period',
      dataIndex: 'period',
      key: 'period',
    },
    {
      title: 'Allocated',
      dataIndex: 'allocated',
      key: 'allocated',
      render: (amount: number) => `$${amount.toLocaleString()}`,
      sorter: (a: any, b: any) => a.allocated - b.allocated,
    },
    {
      title: 'Spent',
      dataIndex: 'spent',
      key: 'spent',
      render: (amount: number) => `$${amount.toLocaleString()}`,
      sorter: (a: any, b: any) => a.spent - b.spent,
    },
    {
      title: 'Remaining',
      key: 'remaining',
      render: (_: any, record: any) => {
        const remaining = record.allocated - record.spent;
        return (
          <span className={remaining < 0 ? 'text-red-600 font-semibold' : ''}>
            ${remaining.toLocaleString()}
          </span>
        );
      },
      sorter: (a: any, b: any) => (a.allocated - a.spent) - (b.allocated - b.spent),
    },
    {
      title: 'Utilization',
      key: 'utilization',
      render: (_: any, record: any) => {
        const percentage = (record.spent / record.allocated) * 100;
        return (
          <Progress
            percent={Number(percentage.toFixed(1))}
            size="small"
            strokeColor={getBudgetColor(percentage)}
            status={percentage > 100 ? 'exception' : 'normal'}
          />
        );
      },
      sorter: (a: any, b: any) => (a.spent / a.allocated) - (b.spent / b.allocated),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)} icon={status === 'On Track' ? <CheckCircleOutlined /> : <WarningOutlined />}>
          {status}
        </Tag>
      ),
      filters: [
        { text: 'On Track', value: 'On Track' },
        { text: 'At Risk', value: 'At Risk' },
        { text: 'Over Budget', value: 'Over Budget' },
      ],
      onFilter: (value: any, record: any) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space size="small">
          <Button type="link" icon={<EditOutlined />} size="small">
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="h-full pb-20 lg:pb-0">
      {/* Mobile View */}
      <div className="lg:hidden">
        {/* Mobile Stats Bar */}
        <div className="grid grid-cols-2 gap-2 p-4 bg-gradient-to-br from-purple-600 to-purple-700 text-white">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="text-2xl font-bold">${(totalAllocated / 1000).toFixed(0)}k</div>
            <div className="text-xs opacity-90 mt-1">Allocated</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <div className="text-2xl font-bold">${(totalSpent / 1000).toFixed(0)}k</div>
            <div className="text-xs opacity-90 mt-1">Spent</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="text-2xl font-bold">${(totalRemaining / 1000).toFixed(0)}k</div>
            <div className="text-xs opacity-90 mt-1">Remaining</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="text-2xl font-bold">{utilizationRate.toFixed(0)}%</div>
            <div className="text-xs opacity-90 mt-1">Used</div>
          </motion.div>
        </div>

        {/* Mobile Budget Cards */}
        <div className="py-4 space-y-3">
          {budgets.map((budget, index) => {
            const percentage = (budget.spent / budget.allocated) * 100;
            const remaining = budget.allocated - budget.spent;

            return (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="shadow-sm" bodyStyle={{ padding: '14px' }}>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-gray-900">{budget.category}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{budget.period}</div>
                      </div>
                      <Tag
                        color={getStatusColor(budget.status)}
                        className="text-xs"
                      >
                        {budget.status}
                      </Tag>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center py-2 bg-gray-50 rounded">
                      <div>
                        <div className="text-xs text-gray-500">Allocated</div>
                        <div className="font-semibold text-sm">${(budget.allocated / 1000).toFixed(0)}k</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Spent</div>
                        <div className="font-semibold text-sm">${(budget.spent / 1000).toFixed(0)}k</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Left</div>
                        <div className={`font-semibold text-sm ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          ${Math.abs(remaining / 1000).toFixed(0)}k
                        </div>
                      </div>
                    </div>

                    <Progress
                      percent={Number(percentage.toFixed(1))}
                      strokeColor={getBudgetColor(percentage)}
                      status={percentage > 100 ? 'exception' : 'normal'}
                      size="small"
                    />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-black text-gray-900">Budget Management</h1>
          <Button type="primary" icon={<PlusOutlined />} size="large">
            Create Budget
          </Button>
        </div>

        {/* Stats Cards */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Allocated"
                value={totalAllocated}
                prefix="$"
                precision={0}
                valueStyle={{ color: '#1677ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Spent"
                value={totalSpent}
                prefix="$"
                precision={0}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Remaining"
                value={totalRemaining}
                prefix="$"
                precision={0}
                valueStyle={{ color: totalRemaining < 0 ? '#ff4d4f' : '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Utilization Rate"
                value={utilizationRate}
                suffix="%"
                precision={1}
                valueStyle={{ color: utilizationRate > 85 ? '#fa8c16' : '#10b981' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Status Overview */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Card>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">{onTrack}</div>
                <div className="text-gray-600 mt-2">
                  <CheckCircleOutlined className="mr-2" />
                  On Track
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600">{atRisk}</div>
                <div className="text-gray-600 mt-2">
                  <WarningOutlined className="mr-2" />
                  At Risk
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">{budgets.length}</div>
                <div className="text-gray-600 mt-2">
                  <DollarOutlined className="mr-2" />
                  Total Budgets
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Budget vs Spent Chart */}
        <Card title="Budget Utilization by Category">
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <RechartsTooltip
                formatter={(value: any) => `$${value.toLocaleString()}`}
              />
              <Legend />
              <Bar dataKey="allocated" fill="#8884d8" name="Allocated" />
              <Bar dataKey="spent" fill="#82ca9d" name="Spent" />
              <Line type="monotone" dataKey="percentage" stroke="#ff7300" name="Utilization %" />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        {/* Budget Table */}
        <Card title="Budget Details">
          <Table
            columns={columns}
            dataSource={budgets}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </div>
    </div>
  );
}
