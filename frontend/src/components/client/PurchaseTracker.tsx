import { useMemo, useState } from 'react';
import { Row, Col, Card, Table, Tag, Input, Select, Statistic, Badge } from 'antd';
import {
  ShoppingCartOutlined,
  SearchOutlined,
  DollarOutlined,
  TrophyOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveTreeMap } from '@nivo/treemap';
import { motion } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import AnimatedMetricCard from '../AnimatedMetricCard';
import { useDemoMode } from '@/contexts/DemoModeContext';
import dayjs from 'dayjs';

const { Search } = Input;

interface PurchaseItem {
  id: string;
  name: string;
  category: string;
  vendor: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  purchaseDate: string;
  invoiceNumber: string;
  frequency: number; // How many times purchased
  lastPurchased: string;
}

export default function PurchaseTracker() {
  const { isDemoMode, demoData } = useDemoMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVendor, setSelectedVendor] = useState<string>('all');

  const purchaseData = useMemo(() => {
    if (!isDemoMode) return {
      items: [],
      totalSpent: 0,
      totalItems: 0,
      topCategories: [],
      topVendors: [],
      monthlyTrend: [],
      frequentPurchases: []
    };

    // Extract items from invoices
    const items: PurchaseItem[] = [];
    let idCounter = 1;

    demoData.invoices.forEach(invoice => {
      // Generate 2-5 items per invoice
      const itemCount = Math.floor(Math.random() * 4) + 2;

      for (let i = 0; i < itemCount; i++) {
        const categories = ['Office Supplies', 'Software', 'Equipment', 'Services', 'Marketing', 'Utilities'];
        const category = categories[Math.floor(Math.random() * categories.length)];

        const itemNames: Record<string, string[]> = {
          'Office Supplies': ['Printer Paper', 'Pens', 'Notebooks', 'Staplers', 'Folders'],
          'Software': ['Microsoft License', 'Adobe Subscription', 'Slack License', 'Zoom License'],
          'Equipment': ['Laptop', 'Monitor', 'Keyboard', 'Mouse', 'Desk Chair'],
          'Services': ['Consulting', 'Marketing Services', 'Legal Services', 'Cloud Hosting'],
          'Marketing': ['Social Media Ads', 'Google Ads', 'Print Materials', 'Event Sponsorship'],
          'Utilities': ['Internet Service', 'Phone Service', 'Electricity', 'Water']
        };

        const itemName = itemNames[category][Math.floor(Math.random() * itemNames[category].length)];
        const quantity = Math.floor(Math.random() * 10) + 1;
        const unitPrice = parseFloat((Math.random() * 500 + 10).toFixed(2));

        items.push({
          id: `item-${idCounter++}`,
          name: itemName,
          category,
          vendor: invoice.vendorName,
          quantity,
          unitPrice,
          totalPrice: quantity * unitPrice,
          purchaseDate: invoice.issueDate,
          invoiceNumber: invoice.invoiceNumber,
          frequency: 1,
          lastPurchased: invoice.issueDate
        });
      }
    });

    // Calculate frequency of purchases
    const itemFrequency = items.reduce((acc, item) => {
      const key = `${item.name}-${item.vendor}`;
      if (!acc[key]) {
        acc[key] = { ...item, frequency: 0, lastPurchased: item.purchaseDate };
      }
      acc[key].frequency++;
      if (new Date(item.purchaseDate) > new Date(acc[key].lastPurchased)) {
        acc[key].lastPurchased = item.purchaseDate;
      }
      return acc;
    }, {} as Record<string, PurchaseItem>);

    const frequentPurchases = Object.values(itemFrequency)
      .filter(item => item.frequency > 2)
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);

    // Filter items
    let filtered = items;
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.vendor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    if (selectedVendor !== 'all') {
      filtered = filtered.filter(item => item.vendor === selectedVendor);
    }

    const totalSpent = filtered.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalItems = filtered.reduce((sum, item) => sum + item.quantity, 0);

    // Top categories
    const categoryTotals = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.totalPrice;
      return acc;
    }, {} as Record<string, number>);

    const topCategories = Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Top vendors
    const vendorTotals = items.reduce((acc, item) => {
      acc[item.vendor] = (acc[item.vendor] || 0) + item.totalPrice;
      return acc;
    }, {} as Record<string, number>);

    const topVendors = Object.entries(vendorTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Monthly trend
    const monthlyData = items.reduce((acc, item) => {
      const month = dayjs(item.purchaseDate).format('MMM YY');
      acc[month] = (acc[month] || 0) + item.totalPrice;
      return acc;
    }, {} as Record<string, number>);

    const monthlyTrend = [{
      id: 'Purchases',
      data: Object.entries(monthlyData).map(([month, value]) => ({ x: month, y: value }))
    }];

    // Category hierarchy for tree map
    const categoryHierarchy = {
      name: 'Purchases',
      children: Object.entries(categoryTotals).map(([category, value]) => ({
        name: category,
        value,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`
      }))
    };

    return {
      items: filtered,
      totalSpent,
      totalItems,
      topCategories,
      topVendors,
      monthlyTrend,
      frequentPurchases,
      categoryHierarchy,
      categories: Object.keys(categoryTotals),
      vendors: Object.keys(vendorTotals)
    };
  }, [isDemoMode, demoData, searchTerm, selectedCategory, selectedVendor]);

  const columns = [
    {
      title: 'Item',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: PurchaseItem) => (
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-xs text-gray-500">{record.category}</div>
        </div>
      ),
    },
    {
      title: 'Vendor',
      dataIndex: 'vendor',
      key: 'vendor',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (qty: number) => <Badge count={qty} showZero color="blue" />,
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Total',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price: number) => <span className="font-semibold">${price.toFixed(2)}</span>,
      sorter: (a: PurchaseItem, b: PurchaseItem) => a.totalPrice - b.totalPrice,
    },
    {
      title: 'Purchase Date',
      dataIndex: 'purchaseDate',
      key: 'purchaseDate',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
      sorter: (a: PurchaseItem, b: PurchaseItem) =>
        new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime(),
    },
    {
      title: 'Invoice',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      render: (num: string) => <Tag color="purple">{num}</Tag>,
    },
  ];

  const springProps = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
  });

  if (!isDemoMode) {
    return (
      <div className="p-6">
        <p>Enable Demo Mode to view purchase tracking.</p>
      </div>
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
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          Purchase & Item Tracking
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Detailed insights into your purchasing patterns
        </p>
      </motion.div>

      {/* Metrics */}
      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="Total Spent"
            value={purchaseData.totalSpent}
            prefix="$"
            icon={<DollarOutlined />}
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="Total Items"
            value={purchaseData.totalItems}
            icon={<ShoppingCartOutlined />}
            gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="Unique Products"
            value={purchaseData.frequentPurchases.length}
            icon={<TrophyOutlined />}
            gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="Categories"
            value={purchaseData.categories?.length || 0}
            icon={<BarChartOutlined />}
            gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
          />
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-6 shadow-lg">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Search
              placeholder="Search items or vendors..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} md={8}>
            <Select
              placeholder="Filter by Category"
              value={selectedCategory}
              onChange={setSelectedCategory}
              className="w-full"
              options={[
                { label: 'All Categories', value: 'all' },
                ...(purchaseData.categories || []).map(cat => ({ label: cat, value: cat }))
              ]}
            />
          </Col>
          <Col xs={24} md={8}>
            <Select
              placeholder="Filter by Vendor"
              value={selectedVendor}
              onChange={setSelectedVendor}
              className="w-full"
              options={[
                { label: 'All Vendors', value: 'all' },
                ...(purchaseData.vendors || []).map(v => ({ label: v, value: v }))
              ]}
            />
          </Col>
        </Row>
      </Card>

      {/* Visualizations */}
      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} lg={12}>
          <Card title="Purchase Trend (Last 6 Months)" className="shadow-lg">
            <div style={{ height: 300 }}>
              <ResponsiveLine
                data={purchaseData.monthlyTrend}
                margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear' }}
                curve="cardinal"
                axisBottom={{ tickRotation: -45 }}
                axisLeft={{ format: (value) => `$${(value / 1000).toFixed(0)}k` }}
                enablePoints={true}
                pointSize={10}
                pointBorderWidth={2}
                enableArea={true}
                areaOpacity={0.2}
                colors={['#667eea']}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Spending by Category" className="shadow-lg">
            <div style={{ height: 300 }}>
              <ResponsiveTreeMap
                data={purchaseData.categoryHierarchy || { name: 'root', children: [] }}
                identity="name"
                value="value"
                margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                labelSkipSize={12}
                labelTextColor="#ffffff"
                colors={{ scheme: 'nivo' }}
                borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Top Categories and Vendors */}
      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} lg={12}>
          <Card title="Top Categories" className="shadow-lg">
            <div style={{ height: 300 }}>
              <ResponsiveBar
                data={purchaseData.topCategories}
                keys={['value']}
                indexBy="name"
                margin={{ top: 20, right: 20, bottom: 100, left: 80 }}
                padding={0.3}
                valueScale={{ type: 'linear' }}
                colors={{ scheme: 'set2' }}
                borderRadius={8}
                axisBottom={{ tickRotation: -45 }}
                axisLeft={{ format: (value) => `$${(value / 1000).toFixed(0)}k` }}
                labelSkipWidth={12}
                labelSkipHeight={12}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Top Vendors" className="shadow-lg">
            <div style={{ height: 300 }}>
              <ResponsiveBar
                data={purchaseData.topVendors}
                keys={['value']}
                indexBy="name"
                margin={{ top: 20, right: 20, bottom: 100, left: 80 }}
                padding={0.3}
                layout="horizontal"
                valueScale={{ type: 'linear' }}
                colors={{ scheme: 'set3' }}
                borderRadius={8}
                axisBottom={{ format: (value) => `$${(value / 1000).toFixed(0)}k` }}
                labelSkipWidth={12}
                labelSkipHeight={12}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Frequent Purchases */}
      {purchaseData.frequentPurchases.length > 0 && (
        <Card title={<span><TrophyOutlined className="mr-2" />Frequently Purchased Items</span>} className="mb-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {purchaseData.frequentPurchases.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 border-2 border-purple-200 dark:border-purple-800 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">{item.name}</h4>
                  <Badge count={item.frequency} color="gold" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.vendor}</p>
                <div className="mt-3 flex justify-between items-center">
                  <Statistic
                    value={item.unitPrice}
                    prefix="$"
                    precision={2}
                    valueStyle={{ fontSize: '18px', color: '#667eea' }}
                  />
                  <Tag color="blue">{item.category}</Tag>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Purchase Details Table */}
      <Card title="All Purchases" className="shadow-lg">
        <Table
          columns={columns}
          dataSource={purchaseData.items}
          rowKey="id"
          pagination={{ pageSize: 15, showSizeChanger: true }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </animated.div>
  );
}
