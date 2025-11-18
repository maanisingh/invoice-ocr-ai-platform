import { Card, Radio, Space, Typography } from 'antd';
import { CameraOutlined, PictureOutlined, FileImageOutlined } from '@ant-design/icons';
import { CaptureMode, CAPTURE_MODES } from '@/types/capture';

const { Text } = Typography;

interface CaptureModeSelectorProps {
  mode: CaptureMode;
  onChange: (mode: CaptureMode) => void;
  disabled?: boolean;
}

const ICON_MAP = {
  camera: CameraOutlined,
  picture: PictureOutlined,
  file: FileImageOutlined,
};

export default function CaptureModeSelector({ mode, onChange, disabled }: CaptureModeSelectorProps) {
  return (
    <Card className="mb-4" size="small">
      <Radio.Group
        value={mode}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full"
      >
        <Space direction="vertical" className="w-full" size="small">
          {CAPTURE_MODES.map((config) => {
            const IconComponent = ICON_MAP[config.icon as keyof typeof ICON_MAP];

            return (
              <Radio.Button
                key={config.mode}
                value={config.mode}
                className="w-full text-left h-auto py-3 px-4"
                style={{
                  borderColor: mode === config.mode ? config.color : undefined,
                  backgroundColor: mode === config.mode ? `${config.color}10` : undefined,
                }}
              >
                <div className="flex items-start gap-3">
                  <IconComponent
                    style={{
                      fontSize: 24,
                      color: mode === config.mode ? config.color : '#8c8c8c',
                    }}
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-base">{config.label}</div>
                    <Text type="secondary" className="text-sm">
                      {config.description}
                    </Text>
                  </div>
                </div>
              </Radio.Button>
            );
          })}
        </Space>
      </Radio.Group>
    </Card>
  );
}
