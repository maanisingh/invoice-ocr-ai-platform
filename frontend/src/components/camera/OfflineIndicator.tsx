import { useEffect, useState } from 'react';
import { Alert, Badge, Typography } from 'antd';
import { WifiOutlined, CloudUploadOutlined, SyncOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

const { Text } = Typography;

interface OfflineIndicatorProps {
  queueCount?: number;
  onSync?: () => void;
}

export default function OfflineIndicator({ queueCount = 0, onSync }: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);

      // Auto-sync when back online
      if (onSync) {
        onSync();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowAlert(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [onSync]);

  return (
    <>
      {/* Connection Status Badge */}
      <div className="fixed top-4 right-4 z-50">
        <Badge
          count={queueCount}
          offset={[-8, 8]}
          style={{ backgroundColor: '#faad14' }}
        >
          <div
            className="px-3 py-2 rounded-lg shadow-lg flex items-center gap-2"
            style={{
              backgroundColor: isOnline ? '#f6ffed' : '#fff2e8',
              border: `1px solid ${isOnline ? '#b7eb8f' : '#ffbb96'}`,
            }}
          >
            {isOnline ? (
              <>
                <WifiOutlined style={{ color: '#52c41a', fontSize: 16 }} />
                <Text style={{ color: '#52c41a', fontSize: 12, fontWeight: 500 }}>
                  Online
                </Text>
              </>
            ) : (
              <>
                <CloudUploadOutlined style={{ color: '#fa8c16', fontSize: 16 }} />
                <Text style={{ color: '#fa8c16', fontSize: 12, fontWeight: 500 }}>
                  Offline Mode
                </Text>
              </>
            )}
          </div>
        </Badge>
      </div>

      {/* Alert Messages */}
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50"
            style={{ maxWidth: 400 }}
          >
            {isOnline ? (
              <Alert
                message="Back Online"
                description={
                  queueCount > 0
                    ? `Syncing ${queueCount} pending upload${queueCount > 1 ? 's' : ''}...`
                    : 'Connection restored'
                }
                type="success"
                icon={<SyncOutlined spin={queueCount > 0} />}
                showIcon
                closable
                onClose={() => setShowAlert(false)}
              />
            ) : (
              <Alert
                message="You're Offline"
                description="Don't worry! You can still capture receipts. They'll upload automatically when you're back online."
                type="warning"
                showIcon
                closable
                onClose={() => setShowAlert(false)}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
