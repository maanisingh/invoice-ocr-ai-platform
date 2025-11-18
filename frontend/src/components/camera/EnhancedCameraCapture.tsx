import { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Button, Card, Space, message, Progress, Typography, Divider, Modal } from 'antd';
import {
  CameraOutlined,
  ReloadOutlined,
  CheckOutlined,
  PlusOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { CaptureMode, CapturedImage, DEFAULT_CAMERA_SETTINGS } from '@/types/capture';
import CaptureModeSelector from './CaptureModeSelector';
import ImageGallery from './ImageGallery';
import { motion, AnimatePresence } from 'framer-motion';

const { Text, Title } = Typography;

interface EnhancedCameraCaptureProps {
  onComplete: (images: CapturedImage[]) => void;
  onCancel?: () => void;
  initialMode?: CaptureMode;
}

export default function EnhancedCameraCapture({
  onComplete,
  onCancel,
  initialMode = 'single',
}: EnhancedCameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [mode, setMode] = useState<CaptureMode>(initialMode);
  const [currentPreview, setCurrentPreview] = useState<string | null>(null);
  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>(
    DEFAULT_CAMERA_SETTINGS.facingMode
  );
  const [processing, setProcessing] = useState(false);
  const [previewModal, setPreviewModal] = useState<CapturedImage | null>(null);

  // Simulate OCR preview (in real app, this would call backend)
  const simulateOCRPreview = useCallback((_imageData: string): CapturedImage['ocrPreview'] => {
    const vendors = ['Starbucks', 'Amazon', 'Target', 'Walmart', 'Shell'];
    const amounts = [15.99, 23.45, 89.99, 5.50, 45.00];

    return {
      vendor: vendors[Math.floor(Math.random() * vendors.length)],
      amount: amounts[Math.floor(Math.random() * amounts.length)],
      date: new Date().toISOString().split('T')[0],
      confidence: 0.85 + Math.random() * 0.15,
    };
  }, []);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      message.error('Failed to capture image');
      return;
    }

    setCurrentPreview(imageSrc);
  }, []);

  const confirmCapture = useCallback(() => {
    if (!currentPreview) return;

    const newImage: CapturedImage = {
      id: Date.now().toString(),
      dataUrl: currentPreview,
      timestamp: Date.now(),
      ocrPreview: simulateOCRPreview(currentPreview),
    };

    if (mode === 'single') {
      // Single mode: complete immediately
      onComplete([newImage]);
    } else {
      // Batch/Multipage: add to collection
      setCapturedImages((prev) => [...prev, newImage]);
      setCurrentPreview(null);
      message.success(
        mode === 'batch'
          ? `Receipt ${capturedImages.length + 1} captured`
          : `Page ${capturedImages.length + 1} added`
      );
    }
  }, [currentPreview, mode, capturedImages.length, onComplete, simulateOCRPreview]);

  const retake = useCallback(() => {
    setCurrentPreview(null);
  }, []);

  const switchCamera = useCallback(() => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  }, []);

  const removeImage = useCallback((id: string) => {
    setCapturedImages((prev) => prev.filter((img) => img.id !== id));
    message.info('Image removed');
  }, []);

  const handleComplete = useCallback(async () => {
    if (capturedImages.length === 0) {
      message.warning('Please capture at least one image');
      return;
    }

    setProcessing(true);
    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onComplete(capturedImages);
    } catch (error) {
      message.error('Processing failed');
    } finally {
      setProcessing(false);
    }
  }, [capturedImages, onComplete]);

  const clearAll = useCallback(() => {
    setCapturedImages([]);
    setCurrentPreview(null);
    message.info('All images cleared');
  }, []);

  const handleModeChange = useCallback((newMode: CaptureMode) => {
    setMode(newMode);
    setCapturedImages([]);
    setCurrentPreview(null);
  }, []);

  const capturingInProgress = currentPreview !== null;
  const hasImages = capturedImages.length > 0;

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Mode Selector */}
      <CaptureModeSelector
        mode={mode}
        onChange={handleModeChange}
        disabled={capturingInProgress || hasImages}
      />

      {/* Camera View or Preview */}
      <Card className="w-full max-w-3xl mx-auto shadow-sm">
        <AnimatePresence mode="wait">
          {!capturingInProgress ? (
            <motion.div
              key="camera"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Camera Instructions - Minimal on Mobile */}
              <div className="text-center mb-2 sm:mb-4">
                <Title level={5} className="mb-0 sm:mb-2 text-sm sm:text-lg font-semibold">
                  {mode === 'single' && 'Position receipt'}
                  {mode === 'batch' && `Receipt ${capturedImages.length + 1}`}
                  {mode === 'multipage' && `Page ${capturedImages.length + 1}`}
                </Title>
                <Text type="secondary" className="hidden sm:block text-sm mt-1">
                  {mode === 'single' && 'Make sure the entire receipt is visible and in focus'}
                  {mode === 'batch' && 'After each capture, you can continue adding more'}
                  {mode === 'multipage' && 'Pages will be combined into one document'}
                </Text>
              </div>

              {/* Camera Feed */}
              <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  screenshotQuality={DEFAULT_CAMERA_SETTINGS.quality}
                  videoConstraints={{
                    facingMode,
                    width: DEFAULT_CAMERA_SETTINGS.resolution.width,
                    height: DEFAULT_CAMERA_SETTINGS.resolution.height,
                  }}
                  className="w-full"
                />

                {/* Camera Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="w-full h-full flex items-center justify-center">
                    <div
                      className="border-2 border-white border-dashed rounded-lg"
                      style={{
                        width: '80%',
                        height: '70%',
                        boxShadow: '0 0 0 9999px rgba(0,0,0,0.3)',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Camera Controls - Mobile Optimized */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                <Button
                  size="large"
                  icon={<ReloadOutlined />}
                  onClick={switchCamera}
                  className="w-full sm:w-auto"
                >
                  <span className="hidden sm:inline">Switch Camera</span>
                  <span className="sm:hidden">Switch</span>
                </Button>
                <Button
                  type="primary"
                  size="large"
                  icon={<CameraOutlined />}
                  onClick={capture}
                  className="w-full sm:w-auto sm:px-8"
                >
                  Capture
                </Button>
                {onCancel && (
                  <Button size="large" onClick={onCancel} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              {/* Preview - Minimal on Mobile */}
              <div className="text-center mb-2 sm:mb-4">
                <Title level={5} className="mb-0 sm:mb-2 text-sm sm:text-lg font-semibold">
                  Review Capture
                </Title>
                <Text type="secondary" className="hidden sm:block text-sm">Check if the image is clear and readable</Text>
              </div>

              <div className="relative bg-black rounded-lg overflow-hidden mb-3 sm:mb-4">
                <img src={currentPreview} alt="Captured" className="w-full" />
              </div>

              {/* Preview Controls - Mobile Optimized */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                <Button
                  size="large"
                  icon={<ReloadOutlined />}
                  onClick={retake}
                  className="w-full sm:w-auto"
                >
                  Retake
                </Button>
                <Button
                  type="primary"
                  size="large"
                  icon={<CheckOutlined />}
                  onClick={confirmCapture}
                  className="w-full sm:w-auto sm:px-8"
                >
                  {mode === 'single' ? 'Confirm' : 'Add to Collection'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Image Gallery */}
      {hasImages && (
        <>
          <ImageGallery
            images={capturedImages}
            onRemove={removeImage}
            onPreview={setPreviewModal}
            mode={mode}
          />

          <Divider />

          {/* Batch/Multipage Actions - App-like Mobile */}
          <Card className="shadow-sm border-0 sm:border" size="small">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <div className="flex-1">
                <Title level={5} className="mb-0 sm:mb-1 text-sm sm:text-lg">
                  {mode === 'batch'
                    ? `${capturedImages.length} Receipt${capturedImages.length > 1 ? 's' : ''}`
                    : `${capturedImages.length} Page${capturedImages.length > 1 ? 's' : ''}`}
                </Title>
                <Text type="secondary" className="hidden sm:block text-sm">
                  {mode === 'batch'
                    ? 'Each will be processed individually'
                    : 'Will be merged into one document'}
                </Text>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  icon={<DeleteOutlined />}
                  onClick={clearAll}
                  danger
                  size="small"
                  className="sm:size-default"
                >
                  <span className="hidden sm:inline">Clear All</span>
                  <span className="sm:hidden">Clear</span>
                </Button>
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => setCurrentPreview(null)}
                  size="small"
                  className="sm:size-default"
                >
                  <span className="hidden sm:inline">Add More</span>
                  <span className="sm:hidden">Add</span>
                </Button>
                <Button
                  type="primary"
                  size="large"
                  icon={<CloudUploadOutlined />}
                  onClick={handleComplete}
                  loading={processing}
                  className="w-full sm:w-auto sm:px-8"
                >
                  <span className="sm:hidden">Upload ({capturedImages.length})</span>
                  <span className="hidden sm:inline">Upload & Process ({capturedImages.length})</span>
                </Button>
              </div>
            </div>

            {processing && (
              <div className="mt-4">
                <Progress
                  percent={66}
                  status="active"
                  strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                />
                <Text type="secondary" className="text-sm">
                  Processing images with AI...
                </Text>
              </div>
            )}
          </Card>
        </>
      )}

      {/* Preview Modal */}
      <Modal
        open={!!previewModal}
        onCancel={() => setPreviewModal(null)}
        footer={null}
        width={800}
        centered
      >
        {previewModal && (
          <div>
            <img
              src={previewModal.dataUrl}
              alt="Preview"
              className="w-full rounded-lg"
            />
            {previewModal.ocrPreview && (
              <Card className="mt-4" size="small">
                <Space direction="vertical" className="w-full">
                  <div>
                    <Text type="secondary" className="text-xs">
                      Detected Vendor
                    </Text>
                    <div className="font-semibold">{previewModal.ocrPreview.vendor}</div>
                  </div>
                  <div>
                    <Text type="secondary" className="text-xs">
                      Amount
                    </Text>
                    <div className="font-semibold text-lg">
                      ${previewModal.ocrPreview.amount?.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <Text type="secondary" className="text-xs">
                      Confidence
                    </Text>
                    <Progress
                      percent={Math.round((previewModal.ocrPreview.confidence || 0) * 100)}
                      size="small"
                    />
                  </div>
                </Space>
              </Card>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
