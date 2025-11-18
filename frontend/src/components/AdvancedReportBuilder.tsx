import { useState, useMemo } from 'react';
import { Row, Col, Card, Select, Button, DatePicker, Table, Space, Radio, Checkbox, Statistic } from 'antd';
import {
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  DownloadOutlined,
  PrinterOutlined,
  ShareAltOutlined,
  FilterOutlined,
  CalendarOutlined,
  DollarOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveCalendar } from '@nivo/calendar';
import { motion } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import { useDemoMode } from '@/contexts/DemoModeContext';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(quarterOfYear);
dayjs.extend(weekOfYear);

const { RangePicker } = DatePicker;

interface ReportConfig {
  type: 'financial' | 'vendor' | 'category' | 'payment' | 'custom';
  visualization: 'bar' | 'line' | 'pie' | 'table' | 'calendar';
  dateRange: [dayjs.Dayjs, dayjs.Dayjs] | null;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  groupBy: 'vendor' | 'category' | 'status' | 'payment_method';
  metrics: string[];
  filters: {
    status?: string[];
    vendors?: string[];
    categories?: string[];
    minAmount?: number;
    maxAmount?: number;
  };
}

export default function AdvancedReportBuilder({ isAdmin = false }: { isAdmin?: boolean }) {
  const { isDemoMode, demoData } = useDemoMode();
  const [config, setConfig] = useState<ReportConfig>({
    type: 'financial',
    visualization: 'bar',
    dateRange: [dayjs().subtract(6, 'months'), dayjs()],
    period: 'monthly',
    groupBy: 'category',
    metrics: ['total', 'count'],
    filters: {}
  });

  // Process report data based on configuration
  const reportData = useMemo(() => {
    if (!isDemoMode) return { chartData: [], tableData: [], summary: {} };

    let invoices = [...demoData.invoices];

    // Apply date range filter
    if (config.dateRange) {
      const [start, end] = config.dateRange;
      invoices = invoices.filter(inv =>
        dayjs(inv.issueDate).isAfter(start) && dayjs(inv.issueDate).isBefore(end.add(1, 'day'))
      );
    }

    // Apply status filter
    if (config.filters.status && config.filters.status.length > 0) {
      invoices = invoices.filter(inv => config.filters.status?.includes(inv.status));
    }

    // Apply amount filters
    if (config.filters.minAmount) {
      invoices = invoices.filter(inv => inv.total >= (config.filters.minAmount || 0));
    }
    if (config.filters.maxAmount) {
      invoices = invoices.filter(inv => inv.total <= (config.filters.maxAmount || Infinity));
    }

    // Group data by selected dimension
    const grouped = invoices.reduce((acc, inv) => {
      let key: string;
      switch (config.groupBy) {
        case 'vendor':
          key = inv.vendorName;
          break;
        case 'category':
          key = inv.category;
          break;
        case 'status':
          key = inv.status;
          break;
        case 'payment_method':
          key = inv.paymentMethod;
          break;
        default:
          key = 'Unknown';
      }

      if (!acc[key]) {
        acc[key] = { total: 0, count: 0, invoices: [] };
      }
      acc[key].total += inv.total;
      acc[key].count++;
      acc[key].invoices.push(inv);
      return acc;
    }, {} as Record<string, { total: number; count: number; invoices: any[] }>);

    // Generate chart data
    const chartData = Object.entries(grouped).map(([key, data]) => ({
      id: key,
      label: key,
      value: config.metrics.includes('total') ? data.total : data.count,
      total: data.total,
      count: data.count,
      average: data.total / data.count
    })).sort((a, b) => b.total - a.total).slice(0, 15);

    // Time-series data
    const timeSeriesData = invoices.reduce((acc, inv) => {
      const date = dayjs(inv.issueDate);
      let key: string;

      switch (config.period) {
        case 'daily':
          key = date.format('YYYY-MM-DD');
          break;
        case 'weekly':
          key = `${date.year()}-W${date.week()}`;
          break;
        case 'monthly':
          key = date.format('MMM YY');
          break;
        case 'quarterly':
          key = `Q${date.quarter()} ${date.year()}`;
          break;
        case 'yearly':
          key = date.format('YYYY');
          break;
        default:
          key = date.format('MMM YY');
      }

      if (!acc[key]) {
        acc[key] = { total: 0, count: 0 };
      }
      acc[key].total += inv.total;
      acc[key].count++;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    const lineChartData = [{
      id: 'Revenue',
      data: Object.entries(timeSeriesData).map(([date, data]) => ({
        x: date,
        y: data.total
      }))
    }];

    // Table data
    const tableData = Object.entries(grouped).map(([key, data], index) => ({
      key: `row-${index}`,
      dimension: key,
      total: data.total,
      count: data.count,
      average: data.total / data.count,
      percentage: (data.total / invoices.reduce((sum, inv) => sum + inv.total, 0)) * 100
    })).sort((a, b) => b.total - a.total);

    // Summary statistics
    const summary = {
      totalRevenue: invoices.reduce((sum, inv) => sum + inv.total, 0),
      totalInvoices: invoices.length,
      averageInvoice: invoices.reduce((sum, inv) => sum + inv.total, 0) / invoices.length,
      paidAmount: invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.total, 0),
      pendingAmount: invoices.filter(inv => inv.status === 'Pending').reduce((sum, inv) => sum + inv.total, 0),
      overdueAmount: invoices.filter(inv => inv.status === 'Overdue').reduce((sum, inv) => sum + inv.total, 0),
    };

    // Calendar heatmap data
    const calendarData = invoices.map(inv => ({
      day: dayjs(inv.issueDate).format('YYYY-MM-DD'),
      value: inv.total
    }));

    return { chartData, lineChartData, tableData, summary, calendarData };
  }, [isDemoMode, demoData, config]);

  const springProps = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 600 }
  });

  const tableColumns = [
    {
      title: config.groupBy.charAt(0).toUpperCase() + config.groupBy.slice(1),
      dataIndex: 'dimension',
      key: 'dimension',
      render: (text: string) => <span className="font-semibold">{text}</span>,
    },
    {
      title: 'Total Revenue',
      dataIndex: 'total',
      key: 'total',
      render: (val: number) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      sorter: (a: any, b: any) => a.total - b.total,
    },
    {
      title: 'Invoice Count',
      dataIndex: 'count',
      key: 'count',
      sorter: (a: any, b: any) => a.count - b.count,
    },
    {
      title: 'Average',
      dataIndex: 'average',
      key: 'average',
      render: (val: number) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      sorter: (a: any, b: any) => a.average - b.average,
    },
    {
      title: '% of Total',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (val: number) => `${val.toFixed(1)}%`,
      sorter: (a: any, b: any) => a.percentage - b.percentage,
    },
  ];

  if (!isDemoMode) {
    return (
      <div className="p-6">
        <p>Enable Demo Mode to use the Advanced Report Builder.</p>
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
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {isAdmin ? 'Advanced Report Builder' : 'My Reports'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Create custom reports with advanced visualizations
            </p>
          </div>
          <Space>
            <Button icon={<DownloadOutlined />} type="primary">
              Export PDF
            </Button>
            <Button icon={<PrinterOutlined />}>Print</Button>
            <Button icon={<ShareAltOutlined />}>Share</Button>
          </Space>
        </div>
      </motion.div>

      {/* Configuration Panel */}
      <Card title={<span><FilterOutlined className="mr-2" />Report Configuration</span>} className="mb-6 shadow-lg">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div className="mb-2 font-semibold">Report Type</div>
            <Select
              value={config.type}
              onChange={(value) => setConfig({ ...config, type: value })}
              className="w-full"
              options={[
                { label: 'Financial Summary', value: 'financial' },
                { label: 'Vendor Analysis', value: 'vendor' },
                { label: 'Category Breakdown', value: 'category' },
                { label: 'Payment Analysis', value: 'payment' },
                { label: 'Custom Report', value: 'custom' }
              ]}
            />
          </Col>

          <Col xs={24} md={8}>
            <div className="mb-2 font-semibold">Date Range</div>
            <RangePicker
              value={config.dateRange}
              onChange={(dates) => setConfig({ ...config, dateRange: dates as [dayjs.Dayjs, dayjs.Dayjs] })}
              className="w-full"
              format="MMM DD, YYYY"
            />
          </Col>

          <Col xs={24} md={8}>
            <div className="mb-2 font-semibold">Period</div>
            <Select
              value={config.period}
              onChange={(value) => setConfig({ ...config, period: value })}
              className="w-full"
              options={[
                { label: 'Daily', value: 'daily' },
                { label: 'Weekly', value: 'weekly' },
                { label: 'Monthly', value: 'monthly' },
                { label: 'Quarterly', value: 'quarterly' },
                { label: 'Yearly', value: 'yearly' }
              ]}
            />
          </Col>

          <Col xs={24} md={8}>
            <div className="mb-2 font-semibold">Group By</div>
            <Select
              value={config.groupBy}
              onChange={(value) => setConfig({ ...config, groupBy: value })}
              className="w-full"
              options={[
                { label: 'Vendor', value: 'vendor' },
                { label: 'Category', value: 'category' },
                { label: 'Status', value: 'status' },
                { label: 'Payment Method', value: 'payment_method' }
              ]}
            />
          </Col>

          <Col xs={24} md={8}>
            <div className="mb-2 font-semibold">Visualization</div>
            <Radio.Group
              value={config.visualization}
              onChange={(e) => setConfig({ ...config, visualization: e.target.value })}
              buttonStyle="solid"
            >
              <Radio.Button value="bar"><BarChartOutlined /></Radio.Button>
              <Radio.Button value="line"><LineChartOutlined /></Radio.Button>
              <Radio.Button value="pie"><PieChartOutlined /></Radio.Button>
              <Radio.Button value="calendar"><CalendarOutlined /></Radio.Button>
              <Radio.Button value="table"><FileTextOutlined /></Radio.Button>
            </Radio.Group>
          </Col>

          <Col xs={24} md={8}>
            <div className="mb-2 font-semibold">Metrics</div>
            <Checkbox.Group
              value={config.metrics}
              onChange={(values) => setConfig({ ...config, metrics: values as string[] })}
              options={[
                { label: 'Total', value: 'total' },
                { label: 'Count', value: 'count' },
                { label: 'Average', value: 'average' }
              ]}
            />
          </Col>
        </Row>
      </Card>

      {/* Summary Statistics */}
      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md">
            <Statistic
              title="Total Revenue"
              value={'totalRevenue' in reportData.summary ? reportData.summary.totalRevenue : 0}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              suffix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md">
            <Statistic
              title="Total Invoices"
              value={'totalInvoices' in reportData.summary ? reportData.summary.totalInvoices : 0}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md">
            <Statistic
              title="Average Invoice"
              value={'averageInvoice' in reportData.summary ? reportData.summary.averageInvoice : 0}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md">
            <Statistic
              title="Pending Amount"
              value={'pendingAmount' in reportData.summary ? reportData.summary.pendingAmount : 0}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Visualization */}
      <Card title="Report Visualization" className="mb-6 shadow-lg">
        {config.visualization === 'bar' && (
          <div style={{ height: 500 }}>
            <ResponsiveBar
              data={reportData.chartData}
              keys={['total']}
              indexBy="id"
              margin={{ top: 50, right: 130, bottom: 100, left: 80 }}
              padding={0.3}
              valueScale={{ type: 'linear' }}
              colors={{ scheme: 'nivo' }}
              borderRadius={8}
              axisBottom={{
                tickRotation: -45,
              }}
              axisLeft={{
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
            />
          </div>
        )}

        {config.visualization === 'line' && (
          <div style={{ height: 500 }}>
            <ResponsiveLine
              data={reportData.lineChartData || []}
              margin={{ top: 50, right: 110, bottom: 100, left: 80 }}
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear' }}
              curve="catmullRom"
              axisBottom={{ tickRotation: -45 }}
              axisLeft={{ format: (value) => `$${(value / 1000).toFixed(0)}k` }}
              enablePoints={true}
              pointSize={10}
              pointBorderWidth={2}
              enableArea={true}
              areaOpacity={0.15}
              colors={{ scheme: 'category10' }}
              legends={[
                {
                  anchor: 'bottom-right',
                  direction: 'column',
                  translateX: 100,
                  itemWidth: 80,
                  itemHeight: 20,
                }
              ]}
            />
          </div>
        )}

        {config.visualization === 'pie' && (
          <div style={{ height: 500 }}>
            <ResponsivePie
              data={reportData.chartData.slice(0, 8)}
              margin={{ top: 40, right: 120, bottom: 80, left: 120 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              colors={{ scheme: 'paired' }}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
              legends={[
                {
                  anchor: 'right',
                  direction: 'column',
                  translateX: 100,
                  itemWidth: 100,
                  itemHeight: 20,
                }
              ]}
            />
          </div>
        )}

        {config.visualization === 'calendar' && (
          <div style={{ height: 400 }}>
            <ResponsiveCalendar
              data={reportData.calendarData || []}
              from={config.dateRange?.[0].format('YYYY-MM-DD') || '2024-01-01'}
              to={config.dateRange?.[1].format('YYYY-MM-DD') || '2024-12-31'}
              emptyColor="#eeeeee"
              colors={['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']}
              margin={{ top: 20, right: 40, bottom: 20, left: 40 }}
              yearSpacing={40}
              monthBorderColor="#ffffff"
              dayBorderWidth={2}
              dayBorderColor="#ffffff"
            />
          </div>
        )}

        {config.visualization === 'table' && (
          <Table
            columns={tableColumns}
            dataSource={reportData.tableData}
            pagination={{ pageSize: 15 }}
            scroll={{ x: 1000 }}
          />
        )}
      </Card>

      {/* Detailed Table */}
      {config.visualization !== 'table' && (
        <Card title="Detailed Breakdown" className="shadow-lg">
          <Table
            columns={tableColumns}
            dataSource={reportData.tableData}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1000 }}
          />
        </Card>
      )}
    </animated.div>
  );
}
