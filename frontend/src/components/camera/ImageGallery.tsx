import { Card, Badge, Button, Space, Typography, Row, Col, Tooltip } from 'antd';
import { DeleteOutlined, EyeOutlined, CheckCircleFilled } from '@ant-design/icons';
import { CapturedImage } from '@/types/capture';
import { motion, AnimatePresence } from 'framer-motion';

const { Text } = Typography;

interface ImageGalleryProps {
  images: CapturedImage[];
  onRemove: (id: string) => void;
  onPreview?: (image: CapturedImage) => void;
  mode: 'single' | 'batch' | 'multipage';
}

export default function ImageGallery({ images, onRemove, onPreview, mode }: ImageGalleryProps) {
  if (images.length === 0) return null;

  return (
    <Card
      title={
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
          <span className="text-sm sm:text-base font-semibold">
            {mode === 'batch' ? 'Captured Receipts' : 'Captured Pages'} ({images.length})
          </span>
          {mode === 'batch' && (
            <Text type="secondary" className="text-xs sm:text-sm font-normal">
              Each image will be processed separately
            </Text>
          )}
          {mode === 'multipage' && (
            <Text type="secondary" className="text-xs sm:text-sm font-normal">
              Pages will be combined into one document
            </Text>
          )}
        </div>
      }
      className="mt-3 sm:mt-4 shadow-sm"
    >
      <Row gutter={[8, 8]}>
        <AnimatePresence>
          {images.map((image, index) => (
            <Col xs={12} sm={12} md={8} lg={6} key={image.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Badge
                  count={mode === 'multipage' ? `Page ${index + 1}` : index + 1}
                  style={{
                    backgroundColor: mode === 'multipage' ? '#722ed1' : '#52c41a',
                    fontSize: '10px',
                    padding: '0 4px',
                    minWidth: '20px',
                    height: '20px',
                    lineHeight: '20px',
                  }}
                >
                  <Card
                    hoverable
                    size="small"
                    bodyStyle={{ padding: '8px' }}
                    cover={
                      <div className="relative">
                        <img
                          alt={`Capture ${index + 1}`}
                          src={image.dataUrl}
                          className="w-full h-32 sm:h-48 object-cover"
                        />
                        {image.processed && (
                          <div className="absolute top-2 right-2">
                            <CheckCircleFilled style={{ fontSize: 24, color: '#52c41a' }} />
                          </div>
                        )}
                      </div>
                    }
                    actions={[
                      <Tooltip title="Preview">
                        <Button
                          type="text"
                          icon={<EyeOutlined />}
                          onClick={() => onPreview?.(image)}
                          size="small"
                        />
                      </Tooltip>,
                      <Tooltip title="Remove">
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => onRemove(image.id)}
                          size="small"
                        />
                      </Tooltip>,
                    ]}
                  >
                    {image.ocrPreview && (
                      <div className="text-xs">
                        <Space direction="vertical" size={0} className="w-full">
                          {image.ocrPreview.vendor && (
                            <Text ellipsis className="font-semibold text-xs">
                              {image.ocrPreview.vendor}
                            </Text>
                          )}
                          {image.ocrPreview.amount && (
                            <Text type="secondary" className="text-xs">
                              ${image.ocrPreview.amount.toFixed(2)}
                            </Text>
                          )}
                          {image.ocrPreview.confidence && (
                            <Text type="secondary" style={{ fontSize: '10px' }}>
                              {Math.round(image.ocrPreview.confidence * 100)}% conf.
                            </Text>
                          )}
                        </Space>
                      </div>
                    )}
                  </Card>
                </Badge>
              </motion.div>
            </Col>
          ))}
        </AnimatePresence>
      </Row>
    </Card>
  );
}
