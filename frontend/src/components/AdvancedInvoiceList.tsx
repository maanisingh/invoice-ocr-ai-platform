import React, { useState, useMemo } from 'react';
import {
  Table,
  Input,
  Select,
  DatePicker,
  Tag,
  Button,
  Badge,
  Tooltip,
  Dropdown,
  Progress,
  Modal,
  Image,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  FileImageOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import type { ColumnsType } from 'antd/es/table';
import { useDemoMode } from '../contexts/DemoModeContext';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface Invoice {
  id: string;
  invoiceNumber: string;
  vendorName: string;
  total: number;
  status: string;
  issueDate: string;
  dueDate: string;
  category: string;
  aiConfidence: {
    overall: number;
  };
  imageUrl: string;
}

const AdvancedInvoiceList: React.FC = () => {
  const { isDemoMode, demoData } = useDemoMode();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const invoices: Invoice[] = isDemoMode ? demoData.invoices : [];

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      // Search filter
      const searchMatch =
        searchText === '' ||
        invoice.invoiceNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        invoice.vendorName.toLowerCase().includes(searchText.toLowerCase());

      // Status filter
      const statusMatch = statusFilter === 'all' || invoice.status === statusFilter;

      // Category filter
      const categoryMatch = categoryFilter === 'all' || invoice.category === categoryFilter;

      // Date range filter
      let dateMatch = true;
      if (dateRange && dateRange.length === 2) {
        const invoiceDate = dayjs(invoice.issueDate);
        dateMatch = invoiceDate.isAfter(dateRange[0]) && invoiceDate.isBefore(dateRange[1]);
      }

      return searchMatch && statusMatch && categoryMatch && dateMatch;
    });
  }, [invoices, searchText, statusFilter, categoryFilter, dateRange]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(invoices.map((inv) => inv.category));
    return Array.from(cats);
  }, [invoices]);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      Paid: 'success',
      Pending: 'processing',
      Overdue: 'error',
      Draft: 'default',
      Cancelled: 'default',
      Processing: 'warning',
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      Paid: <CheckCircleOutlined />,
      Pending: <ClockCircleOutlined />,
      Overdue: <WarningOutlined />,
    };
    return icons[status];
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.95) return '#52c41a';
    if (confidence >= 0.85) return '#faad14';
    return '#ff4d4f';
  };

  const columns: ColumnsType<Invoice> = [
    {
      title: 'Invoice #',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      width: 150,
      fixed: 'left',
      render: (text) => (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono font-semibold text-purple-600 dark:text-purple-400"
        >
          {text}
        </motion.div>
      ),
    },
    {
      title: 'Vendor',
      dataIndex: 'vendorName',
      key: 'vendorName',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Amount',
      dataIndex: 'total',
      key: 'total',
      width: 130,
      sorter: (a, b) => a.total - b.total,
      render: (amount) => (
        <span className="font-semibold text-lg">
          ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      filters: [
        { text: 'Paid', value: 'Paid' },
        { text: 'Pending', value: 'Pending' },
        { text: 'Overdue', value: 'Overdue' },
        { text: 'Draft', value: 'Draft' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <motion.div whileHover={{ scale: 1.05 }}>
          <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
            {status.toUpperCase()}
          </Tag>
        </motion.div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 180,
      ellipsis: true,
      render: (category) => (
        <Tag color="blue" className="rounded-full">
          {category}
        </Tag>
      ),
    },
    {
      title: 'Issue Date',
      dataIndex: 'issueDate',
      key: 'issueDate',
      width: 130,
      sorter: (a, b) => new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime(),
      render: (date) => dayjs(date).format('MMM D, YYYY'),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 130,
      render: (date, record) => {
        const isOverdue = new Date(date) < new Date() && record.status !== 'Paid';
        return (
          <span className={isOverdue ? 'text-red-600 font-semibold' : ''}>
            {dayjs(date).format('MMM D, YYYY')}
          </span>
        );
      },
    },
    {
      title: 'AI Confidence',
      dataIndex: ['aiConfidence', 'overall'],
      key: 'aiConfidence',
      width: 150,
      sorter: (a, b) => a.aiConfidence.overall - b.aiConfidence.overall,
      render: (confidence) => (
        <Tooltip title={`AI Confidence: ${(confidence * 100).toFixed(1)}%`}>
          <div className="flex items-center gap-2">
            <RobotOutlined style={{ color: getConfidenceColor(confidence) }} />
            <Progress
              percent={confidence * 100}
              size="small"
              strokeColor={getConfidenceColor(confidence)}
              showInfo={false}
              style={{ width: 60 }}
            />
            <span className="text-xs">{(confidence * 100).toFixed(0)}%</span>
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Image',
      key: 'image',
      width: 80,
      render: (_, record) => (
        <Button
          type="link"
          icon={<FileImageOutlined />}
          onClick={() => setSelectedImage(record.imageUrl)}
        >
          View
        </Button>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render: () => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'view',
                label: 'View Details',
                icon: <EyeOutlined />,
              },
              {
                key: 'edit',
                label: 'Edit',
                icon: <EditOutlined />,
              },
              {
                key: 'download',
                label: 'Download',
                icon: <DownloadOutlined />,
              },
              {
                type: 'divider',
              },
              {
                key: 'delete',
                label: 'Delete',
                icon: <DeleteOutlined />,
                danger: true,
              },
            ],
          }}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Invoices</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Manage and track all your invoices with AI-powered insights
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <Input
            placeholder="Search by invoice # or vendor..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-64"
            allowClear
          />

          <Select
            placeholder="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-40"
            options={[
              { label: 'All Status', value: 'all' },
              { label: 'Paid', value: 'Paid' },
              { label: 'Pending', value: 'Pending' },
              { label: 'Overdue', value: 'Overdue' },
              { label: 'Draft', value: 'Draft' },
            ]}
          />

          <Select
            placeholder="Category"
            value={categoryFilter}
            onChange={setCategoryFilter}
            className="w-52"
            options={[
              { label: 'All Categories', value: 'all' },
              ...categories.map((cat) => ({ label: cat, value: cat })),
            ]}
          />

          <RangePicker
            value={dateRange}
            onChange={setDateRange}
            format="MMM D, YYYY"
          />

          <Button icon={<FilterOutlined />}>More Filters</Button>
        </div>

        {/* Summary */}
        <div className="flex gap-6 text-sm">
          <Badge count={filteredInvoices.length} showZero color="purple">
            <span className="text-gray-600 dark:text-gray-400 mr-2">Total:</span>
          </Badge>
          <span className="text-gray-600 dark:text-gray-400">
            Amount:{' '}
            <span className="font-semibold text-purple-600">
              $
              {filteredInvoices
                .reduce((sum, inv) => sum + inv.total, 0)
                .toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </span>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Table
          columns={columns}
          dataSource={filteredInvoices}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} invoices`,
          }}
          scroll={{ x: 1500 }}
          className="shadow-lg rounded-xl overflow-hidden"
        />
      </motion.div>

      {/* Image Preview Modal */}
      <Modal
        open={selectedImage !== null}
        onCancel={() => setSelectedImage(null)}
        footer={null}
        width={800}
        centered
      >
        {selectedImage && (
          <Image
            src={selectedImage}
            alt="Invoice"
            style={{ width: '100%' }}
            preview={false}
          />
        )}
      </Modal>
    </div>
  );
};

export default AdvancedInvoiceList;
