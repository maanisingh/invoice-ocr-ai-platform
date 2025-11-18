import React from 'react';
import { Card, Progress, Tooltip, Tag, Row, Col } from 'antd';
import {
  RobotOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface AIConfidenceVisualizerProps {
  confidence: {
    overall: number;
    invoiceNumber: number;
    vendor: number;
    total: number;
    date: number;
    lineItems: number;
  };
  processingTime?: number;
  extractedFields?: number;
  validationErrors?: number;
}

const AIConfidenceVisualizer: React.FC<AIConfidenceVisualizerProps> = ({
  confidence,
  processingTime = 2.5,
  extractedFields = 25,
  validationErrors = 0,
}) => {
  const getConfidenceColor = (score: number) => {
    if (score >= 0.95) return '#52c41a';
    if (score >= 0.85) return '#faad14';
    if (score >= 0.75) return '#ff7a45';
    return '#ff4d4f';
  };

  const getConfidenceLabel = (score: number) => {
    if (score >= 0.95) return 'Excellent';
    if (score >= 0.85) return 'Good';
    if (score >= 0.75) return 'Fair';
    return 'Needs Review';
  };

  const getConfidenceIcon = (score: number) => {
    if (score >= 0.85) return <CheckCircleOutlined />;
    return <WarningOutlined />;
  };

  const radialData = [
    {
      name: 'Overall',
      value: confidence.overall * 100,
      fill: getConfidenceColor(confidence.overall),
    },
  ];

  const fieldConfidence = [
    { name: 'Invoice #', score: confidence.invoiceNumber, key: 'invoiceNumber' },
    { name: 'Vendor', score: confidence.vendor, key: 'vendor' },
    { name: 'Total', score: confidence.total, key: 'total' },
    { name: 'Date', score: confidence.date, key: 'date' },
    { name: 'Line Items', score: confidence.lineItems, key: 'lineItems' },
  ];

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <RobotOutlined className="text-purple-600" />
          <span>AI Extraction Analysis</span>
        </div>
      }
      className="shadow-lg rounded-xl"
    >
      <Row gutter={[24, 24]}>
        {/* Overall Confidence - Radial Chart */}
        <Col xs={24} md={12}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <h4 className="text-lg font-semibold mb-4">Overall Confidence</h4>
              <ResponsiveContainer width="100%" height={200}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="100%"
                  data={radialData}
                  startAngle={180}
                  endAngle={0}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar
                    background
                    dataKey="value"
                    cornerRadius={10}
                    fill={getConfidenceColor(confidence.overall)}
                  />
                </RadialBarChart>
              </ResponsiveContainer>

              <div className="mt-4">
                <div className="text-4xl font-bold" style={{ color: getConfidenceColor(confidence.overall) }}>
                  {(confidence.overall * 100).toFixed(1)}%
                </div>
                <Tag
                  color={getConfidenceColor(confidence.overall)}
                  icon={getConfidenceIcon(confidence.overall)}
                  className="mt-2"
                >
                  {getConfidenceLabel(confidence.overall)}
                </Tag>
              </div>
            </div>
          </motion.div>
        </Col>

        {/* Field-by-Field Confidence */}
        <Col xs={24} md={12}>
          <div>
            <h4 className="text-lg font-semibold mb-4">Field Confidence</h4>
            <div className="space-y-4">
              {fieldConfidence.map((field, index) => (
                <motion.div
                  key={field.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{field.name}</span>
                    <Tooltip title={`${(field.score * 100).toFixed(1)}% confidence`}>
                      <Tag
                        color={getConfidenceColor(field.score)}
                        className="font-mono"
                      >
                        {(field.score * 100).toFixed(0)}%
                      </Tag>
                    </Tooltip>
                  </div>
                  <Progress
                    percent={field.score * 100}
                    strokeColor={getConfidenceColor(field.score)}
                    showInfo={false}
                    strokeWidth={8}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </Col>

        {/* Processing Stats */}
        <Col xs={24}>
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <div className="text-2xl font-bold text-purple-600">
                {processingTime.toFixed(1)}s
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Processing Time
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <div className="text-2xl font-bold text-blue-600">
                {extractedFields}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Fields Extracted
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-center"
            >
              <div className={`text-2xl font-bold ${validationErrors > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {validationErrors}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Validation Errors
              </div>
            </motion.div>
          </div>
        </Col>

        {/* AI Insights */}
        <Col xs={24}>
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start gap-3">
              <InfoCircleOutlined className="text-blue-600 text-xl mt-1" />
              <div>
                <h5 className="font-semibold mb-2">AI Insights</h5>
                <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                  {confidence.overall >= 0.95 && (
                    <li>✓ High confidence - No manual review needed</li>
                  )}
                  {confidence.lineItems < 0.85 && (
                    <li>⚠ Line items may need verification</li>
                  )}
                  {processingTime < 3 && (
                    <li>⚡ Fast processing achieved</li>
                  )}
                  {extractedFields > 20 && (
                    <li>✓ Comprehensive data extraction completed</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default AIConfidenceVisualizer;
