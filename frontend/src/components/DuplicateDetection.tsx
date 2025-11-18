import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Tooltip, Alert, Progress, Modal } from 'antd';
import {
  WarningOutlined,
  EyeOutlined,
  LinkOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

interface DuplicateGroup {
  id: string;
  invoices: {
    id: string;
    invoiceNumber: string;
    vendor: string;
    total: number;
    date: string;
    similarity: number;
  }[];
  riskScore: number;
  matchedFields: string[];
}

const DuplicateDetection: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<DuplicateGroup | null>(null);

  // Mock duplicate groups
  const duplicateGroups: DuplicateGroup[] = [
    {
      id: 'dup-1',
      invoices: [
        {
          id: 'inv-001',
          invoiceNumber: 'INV-2024-001',
          vendor: 'Tech Solutions Inc',
          total: 5000.00,
          date: '2024-01-15',
          similarity: 0.98,
        },
        {
          id: 'inv-002',
          invoiceNumber: 'INV-2024-001',
          vendor: 'Tech Solutions Inc',
          total: 5000.00,
          date: '2024-01-15',
          similarity: 0.98,
        },
      ],
      riskScore: 0.98,
      matchedFields: ['Invoice Number', 'Vendor', 'Total Amount', 'Date'],
    },
    {
      id: 'dup-2',
      invoices: [
        {
          id: 'inv-003',
          invoiceNumber: 'INV-2024-045',
          vendor: 'Office Supplies Co',
          total: 1250.50,
          date: '2024-02-10',
          similarity: 0.85,
        },
        {
          id: 'inv-004',
          invoiceNumber: 'INV-2024-046',
          vendor: 'Office Supplies Co',
          total: 1250.00,
          date: '2024-02-10',
          similarity: 0.85,
        },
      ],
      riskScore: 0.85,
      matchedFields: ['Vendor', 'Total Amount', 'Date'],
    },
    {
      id: 'dup-3',
      invoices: [
        {
          id: 'inv-005',
          invoiceNumber: 'SVC-789',
          vendor: 'Consulting Services Ltd',
          total: 8500.00,
          date: '2024-03-05',
          similarity: 0.75,
        },
        {
          id: 'inv-006',
          invoiceNumber: 'SVC-790',
          vendor: 'Consulting Services Ltd',
          total: 8500.00,
          date: '2024-03-06',
          similarity: 0.75,
        },
      ],
      riskScore: 0.75,
      matchedFields: ['Vendor', 'Total Amount'],
    },
  ];

  const getRiskColor = (risk: number) => {
    if (risk >= 0.9) return '#ff4d4f';
    if (risk >= 0.75) return '#faad14';
    return '#52c41a';
  };

  const getRiskLabel = (risk: number) => {
    if (risk >= 0.9) return 'High Risk';
    if (risk >= 0.75) return 'Medium Risk';
    return 'Low Risk';
  };

  const columns: ColumnsType<DuplicateGroup> = [
    {
      title: 'Risk Score',
      dataIndex: 'riskScore',
      key: 'riskScore',
      width: 150,
      sorter: (a, b) => b.riskScore - a.riskScore,
      render: (risk) => (
        <div>
          <Progress
            percent={risk * 100}
            strokeColor={getRiskColor(risk)}
            size="small"
            format={(percent) => `${percent?.toFixed(0)}%`}
          />
          <Tag
            color={getRiskColor(risk)}
            icon={<WarningOutlined />}
            className="mt-2"
          >
            {getRiskLabel(risk)}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Duplicate Count',
      dataIndex: 'invoices',
      key: 'count',
      width: 130,
      render: (invoices) => (
        <Tag color="red" className="text-lg font-semibold">
          {invoices.length} invoices
        </Tag>
      ),
    },
    {
      title: 'Matched Fields',
      dataIndex: 'matchedFields',
      key: 'matchedFields',
      render: (fields) => (
        <div className="flex flex-wrap gap-1">
          {fields.map((field: string) => (
            <Tag key={field} color="blue" className="text-xs">
              {field}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Vendor',
      key: 'vendor',
      render: (_, record) => (
        <span className="font-medium">
          {record.invoices[0].vendor}
        </span>
      ),
    },
    {
      title: 'Total Amount',
      key: 'total',
      render: (_, record) => (
        <span className="font-semibold text-purple-600">
          ${record.invoices[0].total.toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => setSelectedGroup(record)}
          >
            Review
          </Button>
          <Tooltip title="Merge duplicates">
            <Button type="link" icon={<LinkOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const invoiceColumns: ColumnsType<DuplicateGroup['invoices'][0]> = [
    {
      title: 'Invoice #',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      render: (text) => <span className="font-mono font-semibold">{text}</span>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('MMM D, YYYY'),
    },
    {
      title: 'Amount',
      dataIndex: 'total',
      key: 'total',
      render: (amount) => `$${amount.toFixed(2)}`,
    },
    {
      title: 'Similarity',
      dataIndex: 'similarity',
      key: 'similarity',
      render: (similarity) => (
        <Progress
          percent={similarity * 100}
          strokeColor={getRiskColor(similarity)}
          size="small"
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" icon={<EyeOutlined />}>
            View
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Duplicate Detection</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          AI-powered detection to prevent double payments
        </p>
      </motion.div>

      {/* Summary Alert */}
      <Alert
        message={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ExclamationCircleOutlined className="text-xl" />
              <span className="font-semibold">
                {duplicateGroups.length} potential duplicate groups detected
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm">
                Total duplicates: {duplicateGroups.reduce((sum, g) => sum + g.invoices.length, 0)}
              </span>
              <Button type="primary" size="small">
                Review All
              </Button>
            </div>
          </div>
        }
        type="warning"
        showIcon={false}
        className="mb-6"
      />

      {/* Duplicate Groups Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="shadow-lg rounded-xl">
          <Table
            columns={columns}
            dataSource={duplicateGroups}
            rowKey="id"
            pagination={false}
          />
        </Card>
      </motion.div>

      {/* Detail Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <WarningOutlined className="text-red-600" />
            <span>Duplicate Invoice Group Details</span>
          </div>
        }
        open={selectedGroup !== null}
        onCancel={() => setSelectedGroup(null)}
        width={900}
        footer={[
          <Button key="merge" type="primary">
            Merge & Keep One
          </Button>,
          <Button key="ignore">
            Mark as Not Duplicate
          </Button>,
          <Button key="close" onClick={() => setSelectedGroup(null)}>
            Close
          </Button>,
        ]}
      >
        {selectedGroup && (
          <div>
            <Alert
              message={
                <div>
                  <strong>Risk Analysis:</strong> These invoices have a{' '}
                  <Tag color={getRiskColor(selectedGroup.riskScore)}>
                    {(selectedGroup.riskScore * 100).toFixed(0)}%
                  </Tag>{' '}
                  similarity score
                </div>
              }
              description={
                <div className="mt-2">
                  <strong>Matched Fields:</strong>{' '}
                  {selectedGroup.matchedFields.join(', ')}
                </div>
              }
              type="warning"
              className="mb-4"
            />

            <h4 className="font-semibold mb-3">Invoices in this group:</h4>
            <Table
              columns={invoiceColumns}
              dataSource={selectedGroup.invoices}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DuplicateDetection;
