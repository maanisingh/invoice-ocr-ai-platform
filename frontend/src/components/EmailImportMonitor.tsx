import { useMemo } from 'react';
import { Row, Col, Card, Table, Tag, Progress, Alert, Button, Steps, Tooltip, Input } from 'antd';
import {
  MailOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import AnimatedMetricCard from './AnimatedMetricCard';
import { useDemoMode } from '@/contexts/DemoModeContext';
import QRCode from 'qrcode.react';

dayjs.extend(relativeTime);

export default function EmailImportMonitor() {
  const { isDemoMode, demoEmailImports } = useDemoMode();

  const emailData = useMemo(() => {
    if (!isDemoMode) return { imports: [], stats: {} };

    const imports = demoEmailImports;
    const processed = imports.filter((e) => e.status === 'Processed').length;
    const processing = imports.filter((e) => e.status === 'Processing').length;
    const failed = imports.filter((e) => e.status === 'Failed').length;
    const pending = imports.filter((e) => e.status === 'Pending').length;

    const avgProcessingTime =
      imports.filter((e) => e.processingTime).reduce((sum, e) => sum + (e.processingTime || 0), 0) /
      imports.filter((e) => e.processingTime).length;

    const avgConfidence =
      imports.filter((e) => e.confidence).reduce((sum, e) => sum + (e.confidence || 0), 0) /
      imports.filter((e) => e.confidence).length;

    return {
      imports,
      stats: {
        total: imports.length,
        processed,
        processing,
        failed,
        pending,
        successRate: (processed / imports.length) * 100,
        avgProcessingTime,
        avgConfidence: avgConfidence * 100,
      },
    };
  }, [isDemoMode, demoEmailImports]);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      Processed: 'success',
      Processing: 'processing',
      Failed: 'error',
      Pending: 'warning',
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: any } = {
      Processed: <CheckCircleOutlined />,
      Processing: <LoadingOutlined />,
      Failed: <CloseCircleOutlined />,
      Pending: <ClockCircleOutlined />,
    };
    return icons[status];
  };

  const columns = [
    {
      title: 'Received',
      dataIndex: 'receivedAt',
      key: 'receivedAt',
      width: 150,
      sorter: (a: any, b: any) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime(),
      render: (date: string) => (
        <Tooltip title={dayjs(date).format('YYYY-MM-DD HH:mm:ss')}>
          <span>{dayjs(date).fromNow()}</span>
        </Tooltip>
      ),
    },
    {
      title: 'From',
      dataIndex: 'from',
      key: 'from',
      width: 220,
      ellipsis: true,
      render: (email: string) => <span className="text-sm">{email}</span>,
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      ellipsis: true,
      render: (subject: string) => <span className="font-semibold">{subject}</span>,
    },
    {
      title: 'Attachments',
      dataIndex: 'attachmentCount',
      key: 'attachmentCount',
      width: 120,
      render: (count: number) => <Tag color="blue">{count} file{count > 1 ? 's' : ''}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: string) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Confidence',
      dataIndex: 'confidence',
      key: 'confidence',
      width: 120,
      render: (confidence: number) =>
        confidence ? (
          <div className="flex items-center gap-2">
            <Progress
              percent={confidence * 100}
              size="small"
              strokeColor={confidence >= 0.9 ? '#10b981' : confidence >= 0.75 ? '#f59e0b' : '#ef4444'}
              showInfo={false}
              style={{ width: 60 }}
            />
            <span className="text-xs">{(confidence * 100).toFixed(0)}%</span>
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      title: 'Processing Time',
      dataIndex: 'processingTime',
      key: 'processingTime',
      width: 140,
      render: (time: number) => (time ? `${time.toFixed(1)}s` : '-'),
    },
    {
      title: 'Invoice ID',
      dataIndex: 'extractedInvoiceId',
      key: 'extractedInvoiceId',
      width: 140,
      render: (id: string) =>
        id ? <span className="font-mono text-xs text-purple-600">{id}</span> : <span className="text-gray-400">-</span>,
    },
    {
      title: 'Errors',
      dataIndex: 'errors',
      key: 'errors',
      width: 100,
      render: (errors: string[]) =>
        errors && errors.length > 0 ? (
          <Tooltip title={errors.join(', ')}>
            <Tag color="red">{errors.length} error{errors.length > 1 ? 's' : ''}</Tag>
          </Tooltip>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
  ];

  // Demo email address for forwarding
  const demoEmailAddress = 'invoices@demo.alexandratechlab.com';

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          Email-to-Invoice Processing
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Automatic invoice extraction from email attachments
        </p>
      </motion.div>

      {/* Metrics */}
      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="Total Processed"
            value={emailData.stats.processed || 0}
            icon={<CheckCircleOutlined />}
            gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="Processing"
            value={emailData.stats.processing || 0}
            icon={<LoadingOutlined />}
            gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="Success Rate"
            value={emailData.stats.successRate || 0}
            suffix="%"
            icon={<ThunderboltOutlined />}
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AnimatedMetricCard
            title="Avg Processing"
            value={emailData.stats.avgProcessingTime || 0}
            suffix="s"
            icon={<ClockCircleOutlined />}
            gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
          />
        </Col>
      </Row>

      {/* Setup Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Card title={<span><MailOutlined className="mr-2" />Email Setup</span>} className="shadow-lg rounded-xl">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Alert
                message="Forward invoices to this email address for automatic processing"
                description={
                  <div className="mt-3">
                    <div className="flex items-center gap-3 mb-4">
                      <Input
                        value={demoEmailAddress}
                        readOnly
                        size="large"
                        className="font-mono"
                        addonAfter={
                          <Button
                            type="link"
                            icon={<CopyOutlined />}
                            onClick={() => {
                              navigator.clipboard.writeText(demoEmailAddress);
                            }}
                          >
                            Copy
                          </Button>
                        }
                      />
                    </div>
                    <Steps
                      size="small"
                      current={-1}
                      items={[
                        {
                          title: 'Forward Email',
                          description: 'Send invoice to the address above',
                        },
                        {
                          title: 'AI Extraction',
                          description: 'OCR processes the attachment',
                        },
                        {
                          title: 'Auto-Import',
                          description: 'Invoice appears in your dashboard',
                        },
                      ]}
                    />
                  </div>
                }
                type="info"
                showIcon
              />
            </Col>
            <Col xs={24} lg={8}>
              <div className="flex flex-col items-center">
                <p className="mb-3 text-sm font-semibold">Scan QR Code (Mobile)</p>
                <QRCode value={demoEmailAddress} size={150} />
                <p className="mt-2 text-xs text-gray-500">Scan to add to contacts</p>
              </div>
            </Col>
          </Row>
        </Card>
      </motion.div>

      {/* Email Import Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card
          title={
            <span>
              <MailOutlined className="mr-2 text-blue-500" />
              Email Import History ({emailData.imports.length} emails)
            </span>
          }
          className="shadow-lg rounded-xl"
        >
          {!isDemoMode && emailData.imports.length === 0 ? (
            <Alert
              message="Enable Demo Mode"
              description="Enable demo mode in the top right to see sample email import data. In production, this will show emails processed from your configured inbox."
              type="info"
              showIcon
            />
          ) : (
            <Table
              columns={columns}
              dataSource={emailData.imports}
              rowKey="id"
              pagination={{
                pageSize: 15,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} emails`,
              }}
              scroll={{ x: 1400 }}
            />
          )}
        </Card>
      </motion.div>
    </div>
  );
}
