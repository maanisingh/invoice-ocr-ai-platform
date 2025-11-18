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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Budget Tracking</h1>
          <p className="text-gray-500 mt-1">Monitor spending across categories and departments</p>
        </div>
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
  );
}
