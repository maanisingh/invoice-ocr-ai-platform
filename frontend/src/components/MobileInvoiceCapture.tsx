import React, { useState, useRef } from 'react';
import { Card, Button, Upload, Progress, Steps, Result, Space, Tag, Alert } from 'antd';
import {
  CameraOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  RobotOutlined,
  FileImageOutlined,
  ScanOutlined,
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import Confetti from 'react-confetti';
import toast from 'react-hot-toast';

const { Step } = Steps;

interface CaptureResult {
  invoiceNumber: string;
  vendor: string;
  total: number;
  confidence: number;
  extractedFields: number;
}

const MobileInvoiceCapture: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const [, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<CaptureResult | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [useCamera, setUseCamera] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setImage(imageSrc);
        setUseCamera(false);
        setCurrentStep(1);
        toast.success('Image captured successfully!');
      }
    }
  };

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setCurrentStep(1);
      toast.success('Image uploaded successfully!');
    };
    reader.readAsDataURL(file);
    return false; // Prevent default upload
  };

  const processInvoice = async () => {
    setProcessing(true);
    setProgress(0);
    setCurrentStep(2);

    // Simulate OCR processing
    const steps = [
      { progress: 20, message: 'Analyzing image quality...' },
      { progress: 40, message: 'Detecting invoice fields...' },
      { progress: 60, message: 'Extracting text with AI...' },
      { progress: 80, message: 'Validating data...' },
      { progress: 100, message: 'Processing complete!' },
    ];

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setProgress(step.progress);
      toast.loading(step.message, { duration: 800 });
    }

    // Mock result
    const mockResult: CaptureResult = {
      invoiceNumber: `INV-${Math.floor(Math.random() * 100000)}`,
      vendor: 'Demo Vendor Inc.',
      total: Math.random() * 10000 + 1000,
      confidence: 0.95 + Math.random() * 0.04,
      extractedFields: Math.floor(Math.random() * 10) + 20,
    };

    setResult(mockResult);
    setProcessing(false);
    setCurrentStep(3);
    setShowConfetti(true);
    toast.success('Invoice processed successfully!');

    setTimeout(() => setShowConfetti(false), 5000);
  };

  const reset = () => {
    setCurrentStep(0);
    setImage(null);
    setProcessing(false);
    setProgress(0);
    setResult(null);
    setShowConfetti(false);
    setUseCamera(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Upload Invoice</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Capture or upload invoice images for instant AI-powered data extraction
        </p>
      </motion.div>

      {/* Progress Steps */}
      <Card className="mb-6 shadow-lg rounded-xl">
        <Steps current={currentStep}>
          <Step title="Capture" icon={<CameraOutlined />} />
          <Step title="Preview" icon={<FileImageOutlined />} />
          <Step title="Process" icon={<ScanOutlined />} />
          <Step title="Complete" icon={<CheckCircleOutlined />} />
        </Steps>
      </Card>

      <AnimatePresence mode="wait">
        {/* Step 0: Capture/Upload */}
        {currentStep === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Card className="shadow-lg rounded-xl">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-6">Choose Input Method</h3>

                {useCamera ? (
                  <div className="relative">
                    <Webcam
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="rounded-lg w-full max-w-md mx-auto"
                      videoConstraints={{
                        facingMode: 'environment',
                      }}
                    />
                    <div className="mt-4 flex gap-4 justify-center">
                      <Button
                        type="primary"
                        size="large"
                        icon={<CameraOutlined />}
                        onClick={captureImage}
                      >
                        Capture Photo
                      </Button>
                      <Button size="large" onClick={() => setUseCamera(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card
                        hoverable
                        className="h-64 flex flex-col items-center justify-center cursor-pointer bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20"
                        onClick={() => setUseCamera(true)}
                      >
                        <CameraOutlined className="text-6xl text-purple-600 mb-4" />
                        <h4 className="text-lg font-semibold mb-2">Use Camera</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          Capture invoice photo directly
                        </p>
                      </Card>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Upload beforeUpload={handleUpload} showUploadList={false}>
                        <Card
                          hoverable
                          className="h-64 flex flex-col items-center justify-center cursor-pointer bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20"
                        >
                          <UploadOutlined className="text-6xl text-blue-600 mb-4" />
                          <h4 className="text-lg font-semibold mb-2">Upload File</h4>
                          <p className="text-gray-600 dark:text-gray-400">
                            Select from your device
                          </p>
                        </Card>
                      </Upload>
                    </motion.div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 1: Preview */}
        {currentStep === 1 && image && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Card className="shadow-lg rounded-xl">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-6">Preview Invoice Image</h3>
                <img
                  src={image}
                  alt="Invoice preview"
                  className="max-w-full max-h-96 mx-auto rounded-lg shadow-md mb-6"
                />
                <Space>
                  <Button
                    type="primary"
                    size="large"
                    icon={<RobotOutlined />}
                    onClick={processInvoice}
                  >
                    Process with AI
                  </Button>
                  <Button size="large" onClick={reset}>
                    Retake
                  </Button>
                </Space>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Processing */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Card className="shadow-lg rounded-xl">
              <div className="text-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="inline-block mb-6"
                >
                  <LoadingOutlined className="text-6xl text-purple-600" />
                </motion.div>
                <h3 className="text-2xl font-semibold mb-6">Processing Invoice...</h3>
                <Progress
                  percent={progress}
                  strokeColor={{
                    '0%': '#8b5cf6',
                    '100%': '#3b82f6',
                  }}
                  className="max-w-md mx-auto"
                />
                <p className="text-gray-600 dark:text-gray-400 mt-4">
                  AI is extracting data from your invoice
                </p>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Results */}
        {currentStep === 3 && result && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Card className="shadow-lg rounded-xl">
              <Result
                status="success"
                title="Invoice Processed Successfully!"
                subTitle="AI has extracted the following information"
                extra={[
                  <Button type="primary" key="save">
                    Save to Database
                  </Button>,
                  <Button key="new" onClick={reset}>
                    Process Another
                  </Button>,
                ]}
              />

              <div className="max-w-2xl mx-auto mt-6">
                <Alert
                  message={
                    <div className="flex items-center justify-between">
                      <span>AI Confidence Score</span>
                      <Tag color="green" className="text-lg">
                        {(result.confidence * 100).toFixed(1)}%
                      </Tag>
                    </div>
                  }
                  type="success"
                  className="mb-4"
                />

                <Card className="bg-gray-50 dark:bg-gray-800">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-3">
                      <span className="text-gray-600 dark:text-gray-400">Invoice Number:</span>
                      <span className="font-semibold text-lg">{result.invoiceNumber}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-3">
                      <span className="text-gray-600 dark:text-gray-400">Vendor:</span>
                      <span className="font-semibold">{result.vendor}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-3">
                      <span className="text-gray-600 dark:text-gray-400">Total Amount:</span>
                      <span className="font-semibold text-xl text-purple-600">
                        ${result.total.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Fields Extracted:</span>
                      <Tag color="blue">{result.extractedFields} fields</Tag>
                    </div>
                  </div>
                </Card>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileInvoiceCapture;
