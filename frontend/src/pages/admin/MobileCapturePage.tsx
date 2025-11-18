import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Select, Form, Input, Button, message, Space, Divider } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import EnhancedCameraCapture from '@/components/camera/EnhancedCameraCapture';
import OfflineIndicator from '@/components/camera/OfflineIndicator';
import { CapturedImage } from '@/types/capture';
import { mockClients } from '@/utils/mockData';

const { Option } = Select;
const { TextArea } = Input;

export default function MobileCapturePage() {
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
        clientId: values.clientId,
        notes: values.notes,
      });

      message.success(
        `Successfully uploaded ${capturedImages.length} invoice(s)! OCR processing started.`
      );
      navigate('/admin/invoices');
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
      navigate('/admin/invoices');
    }
  };

  return (
    <>
      <OfflineIndicator queueCount={0} />

      <div className="max-w-6xl mx-auto space-y-6 pb-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/invoices')}>
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">📸 Mobile Capture</h1>
            <p className="text-gray-500 mt-1">
              Capture receipts and invoices with enhanced modes
            </p>
          </div>
        </div>

        {/* Enhanced Camera Component */}
        <EnhancedCameraCapture
          onComplete={handleCaptureComplete}
          onCancel={handleCancel}
          initialMode="batch"
        />

        {/* Upload Form */}
        {capturedImages.length > 0 && (
          <>
            <Divider />

            <Card title="📋 Invoice Details">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                  clientId: undefined,
                  notes: '',
                }}
              >
                <Form.Item
                  label="Select Client"
                  name="clientId"
                  rules={[{ required: true, message: 'Please select a client' }]}
                >
                  <Select
                    size="large"
                    placeholder="Choose client for this invoice"
                    showSearch
                    optionFilterProp="children"
                  >
                    {mockClients.map((client) => (
                      <Option key={client.id} value={client.id}>
                        {client.name} - {client.email}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label="Notes (Optional)" name="notes">
                  <TextArea
                    rows={3}
                    placeholder="Add any additional notes or context for this invoice..."
                  />
                </Form.Item>

                <Form.Item>
                  <Space size="large">
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      loading={uploading}
                      className="px-8"
                    >
                      Upload & Process ({capturedImages.length})
                    </Button>
                    <Button size="large" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
