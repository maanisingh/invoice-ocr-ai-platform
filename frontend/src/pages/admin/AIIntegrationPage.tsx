import { useState } from 'react';
import { Row, Col, Card, Form, Input, Switch, Button, Select, Tag, Divider, Alert, Tabs, Space, Statistic } from 'antd';
import {
  RobotOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  ThunderboltOutlined,
  ApiOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { TabPane } = Tabs;

export default function AIIntegrationPage() {
  const [form] = Form.useForm();
  const [aiEnabled, setAiEnabled] = useState(true);

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          AI Integration Settings
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Configure AI-powered features and integrations
        </p>
      </motion.div>

      {/* Status Cards */}
      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="AI Status"
              value={aiEnabled ? "Active" : "Disabled"}
              valueStyle={{ color: aiEnabled ? '#3f8600' : '#cf1322' }}
              prefix={aiEnabled ? <CheckCircleOutlined /> : <WarningOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="OCR Accuracy"
              value={97.8}
              precision={1}
              suffix="%"
              valueStyle={{ color: '#3f8600' }}
              prefix={<ThunderboltOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="API Calls (Today)"
              value={1284}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ApiOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Cost Savings"
              value={3450}
              prefix="$"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Configuration Tabs */}
      <Card className="shadow-lg">
        <Tabs defaultActiveKey="1">
          <TabPane tab={<span><RobotOutlined />OCR Settings</span>} key="1">
            <Form form={form} layout="vertical">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Enable AI OCR"
                    name="ocrEnabled"
                    valuePropName="checked"
                    initialValue={true}
                  >
                    <Switch checked={aiEnabled} onChange={setAiEnabled} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="OCR Engine"
                    name="ocrEngine"
                    initialValue="google-vision"
                  >
                    <Select
                      options={[
                        { label: 'Google Vision AI', value: 'google-vision' },
                        { label: 'Amazon Textract', value: 'amazon-textract' },
                        { label: 'Azure Computer Vision', value: 'azure-vision' },
                        { label: 'Tesseract (Open Source)', value: 'tesseract' }
                      ]}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label="API Key"
                    name="apiKey"
                    initialValue="sk-proj-••••••••••••••••••••••••••••••••"
                  >
                    <Input.Password prefix={<LockOutlined />} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Confidence Threshold"
                    name="threshold"
                    initialValue={85}
                  >
                    <Select
                      options={[
                        { label: '70% - More invoices', value: 70 },
                        { label: '80% - Balanced', value: 80 },
                        { label: '85% - Recommended', value: 85 },
                        { label: '90% - High precision', value: 90 },
                        { label: '95% - Maximum accuracy', value: 95 }
                      ]}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Language Support"
                    name="languages"
                    initialValue={['en', 'es']}
                  >
                    <Select
                      mode="multiple"
                      options={[
                        { label: 'English', value: 'en' },
                        { label: 'Spanish', value: 'es' },
                        { label: 'French', value: 'fr' },
                        { label: 'German', value: 'de' },
                        { label: 'Chinese', value: 'zh' }
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            <Divider />

            <Alert
              message="OCR Performance"
              description="Current OCR accuracy: 97.8% | Average processing time: 2.3s | Monthly API calls: 38,520"
              type="success"
              showIcon
              className="mb-4"
            />

            <Space>
              <Button type="primary" icon={<CheckCircleOutlined />}>
                Save Settings
              </Button>
              <Button>Test Connection</Button>
            </Space>
          </TabPane>

          <TabPane tab={<span><ThunderboltOutlined />AI Features</span>} key="2">
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">Automatic Categorization</h4>
                  <p className="text-sm text-gray-500">AI automatically categorizes invoices based on content</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">Duplicate Detection</h4>
                  <p className="text-sm text-gray-500">Detect and flag duplicate invoices automatically</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">Fraud Detection</h4>
                  <p className="text-sm text-gray-500">AI-powered fraud pattern recognition</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">Smart Vendor Matching</h4>
                  <p className="text-sm text-gray-500">Automatically match invoices to vendor records</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">Predictive Analytics</h4>
                  <p className="text-sm text-gray-500">Generate spending forecasts and trends</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">Email Auto-Import</h4>
                  <p className="text-sm text-gray-500">Extract invoices from emails automatically</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <Divider />

            <Space>
              <Button type="primary">Save Configuration</Button>
              <Button>Reset to Default</Button>
            </Space>
          </TabPane>

          <TabPane tab={<span><ApiOutlined />API & Webhooks</span>} key="3">
            <Alert
              message="API Integration"
              description="Connect external services and automate workflows"
              type="info"
              showIcon
              className="mb-6"
            />

            <Form layout="vertical">
              <Form.Item label="Webhook URL" name="webhookUrl">
                <Input placeholder="https://your-domain.com/webhook" />
              </Form.Item>

              <Form.Item label="Events to Subscribe" name="events">
                <Select
                  mode="multiple"
                  placeholder="Select events"
                  options={[
                    { label: 'Invoice Created', value: 'invoice.created' },
                    { label: 'Invoice Approved', value: 'invoice.approved' },
                    { label: 'Payment Received', value: 'payment.received' },
                    { label: 'Duplicate Detected', value: 'duplicate.detected' },
                    { label: 'Fraud Alert', value: 'fraud.alert' }
                  ]}
                />
              </Form.Item>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded mb-4">
                <h4 className="font-semibold mb-2">API Keys</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <code className="text-sm">prod_key_••••••••••••••••••••</code>
                    <Tag color="green">Active</Tag>
                  </div>
                  <div className="flex justify-between items-center">
                    <code className="text-sm">test_key_••••••••••••••••••••</code>
                    <Tag color="blue">Test</Tag>
                  </div>
                </div>
                <Button type="link" className="mt-2 p-0">
                  Generate New Key
                </Button>
              </div>

              <Space>
                <Button type="primary">Update Webhook</Button>
                <Button>Test Webhook</Button>
              </Space>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}
