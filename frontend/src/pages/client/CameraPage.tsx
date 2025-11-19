import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, message } from 'antd';
import EnhancedCameraCapture from '@/components/camera/EnhancedCameraCapture';
import OfflineIndicator from '@/components/camera/OfflineIndicator';
import { CapturedImage } from '@/types/capture';

const { TextArea } = Input;

export default function ClientCameraPage() {
  const navigate = useNavigate();
  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();

  const handleCaptureComplete = (images: CapturedImage[]) => {
    setCapturedImages(images);
    message.success(`${images.length} image(s) captured successfully!`);
  };

  const handleSubmit = async (values: any) => {
    if (capturedImages.length === 0) {
      message.warning('Please capture at least one image');
      return;
    }

    setUploading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log('Uploading:', {
        images: capturedImages.length,
        notes: values.notes,
      });

      message.success(
        `Successfully uploaded ${capturedImages.length} invoice(s)! OCR processing started.`
      );
      navigate('/client/invoices');
    } catch (error) {
      message.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    if (capturedImages.length > 0) {
      message.info('Captures cleared');
      setCapturedImages([]);
    } else {
      navigate('/client/invoices');
    }
  };

  return (
    <>
      <OfflineIndicator queueCount={0} />

      <div className="w-full px-0 sm:px-4 md:px-6 lg:max-w-6xl lg:mx-auto space-y-3 sm:space-y-6 pb-20 lg:pb-8">
        {/* Desktop Header Only */}
        <div className="hidden lg:flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">📸 Upload Invoice</h1>
            <p className="text-gray-500 mt-1">
              Capture receipts and invoices with enhanced modes
            </p>
          </div>
        </div>

        {/* Enhanced Camera Component */}
        <EnhancedCameraCapture
          onComplete={handleCaptureComplete}
          onCancel={handleCancel}
          initialMode="single"
        />

        {/* Upload Form - App-like Mobile */}
        {capturedImages.length > 0 && (
          <div className="px-3 sm:px-0">
            <Card
              title={<span className="text-sm sm:text-base">Invoice Details</span>}
              className="shadow-sm border-0 sm:border"
              size="small"
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                  notes: '',
                }}
              >
                <Form.Item label={<span className="text-xs sm:text-sm">Notes (Optional)</span>} name="notes" className="mb-3">
                  <TextArea
                    rows={2}
                    placeholder="Add notes..."
                    className="text-sm"
                  />
                </Form.Item>

                <Form.Item className="mb-0">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      loading={uploading}
                      block
                      className="w-full sm:w-auto sm:px-8"
                    >
                      Upload ({capturedImages.length})
                    </Button>
                    <Button
                      size="large"
                      onClick={handleCancel}
                      block
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </Card>
          </div>
        )}

        {/* AI Features Info - Hidden on Mobile for App-like Experience */}
        <div className="hidden sm:block px-3 sm:px-0">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-none shadow-md">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🤖</div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">Enhanced Capture Modes</h3>
                <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0">✓</span>
                    <span><strong>Single Mode:</strong> Capture one receipt at a time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0">✓</span>
                    <span><strong>Batch Mode:</strong> Capture multiple receipts in succession</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0">✓</span>
                    <span><strong>Multi-Page Mode:</strong> Combine pages into one document</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0">✓</span>
                    <span>Live OCR preview with vendor and amount detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0">✓</span>
                    <span>Offline support - captures sync when back online</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
