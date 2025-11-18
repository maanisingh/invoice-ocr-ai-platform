// Capture mode types and interfaces

export type CaptureMode = 'single' | 'batch' | 'multipage';

export interface CapturedImage {
  id: string;
  dataUrl: string;
  timestamp: number;
  processed?: boolean;
  ocrPreview?: {
    vendor?: string;
    amount?: number;
    date?: string;
    confidence?: number;
  };
}

export interface CaptureModeConfig {
  mode: CaptureMode;
  label: string;
  description: string;
  icon: string;
  color: string;
}

export const CAPTURE_MODES: CaptureModeConfig[] = [
  {
    mode: 'single',
    label: 'Single Capture',
    description: 'Capture one receipt or invoice at a time',
    icon: 'camera',
    color: '#1677ff',
  },
  {
    mode: 'batch',
    label: 'Batch Capture',
    description: 'Capture multiple receipts in succession',
    icon: 'picture',
    color: '#52c41a',
  },
  {
    mode: 'multipage',
    label: 'Multi-Page',
    description: 'Combine multiple pages into one document',
    icon: 'file',
    color: '#722ed1',
  },
];

export interface CameraSettings {
  facingMode: 'user' | 'environment';
  resolution: {
    width: number;
    height: number;
  };
  quality: number;
}

export const DEFAULT_CAMERA_SETTINGS: CameraSettings = {
  facingMode: 'environment',
  resolution: {
    width: 1280,
    height: 720,
  },
  quality: 0.85,
};
