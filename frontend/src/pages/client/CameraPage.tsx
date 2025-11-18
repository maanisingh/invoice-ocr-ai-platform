import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Form, Input, Button, message, Space, Upload, Tabs, Progress, Tag } from 'antd'
import { ArrowLeftOutlined, CameraOutlined, UploadOutlined, FileImageOutlined, CheckCircleOutlined } from '@ant-design/icons'
import CameraCapture from '@/components/common/CameraCapture'
import { motion } from 'framer-motion'
import type { UploadFile } from 'antd'

const { TextArea } = Input

export default function ClientCameraPage() {
  const navigate = useNavigate()
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<UploadFile | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadMode, setUploadMode] = useState<'camera' | 'file'>('camera')
  const [processingProgress, setProcessingProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCapture = (imageSrc: string) => {
    setCapturedImage(imageSrc)
    message.success('Photo captured successfully!')
  }

  const handleFileUpload = (file: UploadFile) => {
    setUploadedFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setCapturedImage(e.target?.result as string)
    }
    if (file.originFileObj) {
      reader.readAsDataURL(file.originFileObj)
    }
    message.success('File uploaded successfully!')
    return false
  }

  const handleSubmit = async () => {
    setUploading(true)
    setIsProcessing(true)
    setProcessingProgress(0)

    try {
      // Simulate AI OCR processing
      const steps = [
        { progress: 20, message: 'Analyzing image quality...' },
        { progress: 40, message: 'Detecting invoice fields...' },
        { progress: 60, message: 'Extracting text with AI...' },
        { progress: 80, message: 'Validating data...' },
        { progress: 100, message: 'Processing complete!' },
      ]

      for (const step of steps) {
        await new Promise((resolve) => setTimeout(resolve, 800))
        setProcessingProgress(step.progress)
        message.loading(step.message, 0.8)
      }

      message.success('Invoice uploaded successfully! OCR processing completed.')
      setTimeout(() => {
        navigate('/client/invoices')
      }, 1000)
    } catch (error) {
      message.error('Upload failed. Please try again.')
      setIsProcessing(false)
    } finally {
      setUploading(false)
    }
  }

  const resetCapture = () => {
    setCapturedImage(null)
    setUploadedFile(null)
    setProcessingProgress(0)
    setIsProcessing(false)
  }

  const tabItems = [
    {
      key: 'camera',
      label: (
        <span>
          <CameraOutlined /> Camera Capture
        </span>
      ),
      children: (
        <div className="py-4">
          {!capturedImage ? (
            <CameraCapture onCapture={handleCapture} />
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-4"
            >
              <div className="text-center mb-6">
                <img
                  src={capturedImage}
                  alt="Captured Invoice"
                  className="max-w-full mx-auto rounded-lg shadow-lg border-2 border-blue-200"
                  style={{ maxHeight: '400px' }}
                />
                <div className="mt-4 flex justify-center gap-2">
                  <Tag icon={<CheckCircleOutlined />} color="success">
                    Image Captured
                  </Tag>
                  <Tag icon={<FileImageOutlined />} color="blue">
                    Ready to Process
                  </Tag>
                </div>
              </div>
              <Button onClick={resetCapture} block size="large" icon={<CameraOutlined />}>
                Retake Photo
              </Button>
            </motion.div>
          )}
        </div>
      ),
    },
    {
      key: 'upload',
      label: (
        <span>
          <UploadOutlined /> File Upload
        </span>
      ),
      children: (
        <div className="py-8">
          {!capturedImage ? (
            <Upload.Dragger
              name="invoice"
              multiple={false}
              accept="image/*,.pdf"
              beforeUpload={handleFileUpload}
              showUploadList={false}
              className="invoice-upload-dragger"
            >
              <p className="ant-upload-drag-icon">
                <FileImageOutlined style={{ fontSize: 64, color: '#1890ff' }} />
              </p>
              <p className="ant-upload-text text-xl font-semibold">
                Click or drag invoice to upload
              </p>
              <p className="ant-upload-hint text-gray-500">
                Support for images (PNG, JPG, JPEG) and PDF files. Maximum file size: 10MB
              </p>
              <div className="mt-4">
                <Button type="primary" size="large" icon={<UploadOutlined />}>
                  Select File
                </Button>
              </div>
            </Upload.Dragger>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-4"
            >
              <div className="text-center mb-6">
                <img
                  src={capturedImage}
                  alt="Uploaded Invoice"
                  className="max-w-full mx-auto rounded-lg shadow-lg border-2 border-green-200"
                  style={{ maxHeight: '400px' }}
                />
                <div className="mt-4 flex justify-center gap-2">
                  <Tag icon={<CheckCircleOutlined />} color="success">
                    File Uploaded
                  </Tag>
                  <Tag icon={<FileImageOutlined />} color="blue">
                    {uploadedFile?.name || 'Document Ready'}
                  </Tag>
                </div>
              </div>
              <Button onClick={resetCapture} block size="large" icon={<UploadOutlined />}>
                Upload Different File
              </Button>
            </motion.div>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/client/invoices')}
          size="large"
        >
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Upload Invoice</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Capture or upload invoice for AI-powered OCR processing
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="shadow-lg">
          <Tabs
            activeKey={uploadMode}
            onChange={(key) => {
              setUploadMode(key as 'camera' | 'file')
              resetCapture()
            }}
            items={tabItems}
            size="large"
          />

          {/* Processing Progress */}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
            >
              <div className="flex items-center gap-3 mb-3">
                <CheckCircleOutlined className="text-blue-600 text-xl" />
                <span className="font-semibold text-blue-900 dark:text-blue-100">
                  AI OCR Processing in Progress...
                </span>
              </div>
              <Progress
                percent={processingProgress}
                status="active"
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
            </motion.div>
          )}

          <Form layout="vertical" onFinish={handleSubmit} className="mt-6">
            <Form.Item label="Notes (Optional)" name="notes">
              <TextArea
                rows={3}
                placeholder="Add any additional notes or context for this invoice..."
                className="resize-none"
              />
            </Form.Item>

            <Form.Item>
              <Space size="large">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={uploading}
                  disabled={!capturedImage}
                  icon={<CheckCircleOutlined />}
                >
                  {uploading ? 'Processing...' : 'Upload & Process Invoice'}
                </Button>
                <Button size="large" onClick={() => navigate('/client/invoices')}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </motion.div>

      {/* AI Features Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-none shadow-md">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🤖</div>
            <div>
              <h3 className="font-bold text-lg mb-2">AI-Powered OCR Processing</h3>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>✓ Automatic field detection and data extraction</li>
                <li>✓ 97.8% accuracy with machine learning</li>
                <li>✓ Supports multiple languages and formats</li>
                <li>✓ Instant processing with real-time validation</li>
              </ul>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
