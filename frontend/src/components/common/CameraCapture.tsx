import { useRef, useState, useCallback } from 'react'
import Webcam from 'react-webcam'
import { Button, Card, Space, message } from 'antd'
import { CameraOutlined, ReloadOutlined, CheckOutlined } from '@ant-design/icons'

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void
  onCancel?: () => void
}

export default function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null)
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      setImgSrc(imageSrc)
    } else {
      message.error('Failed to capture image')
    }
  }, [webcamRef])

  const retake = () => {
    setImgSrc(null)
  }

  const confirm = () => {
    if (imgSrc) {
      onCapture(imgSrc)
    }
  }

  const switchCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto p-4 md:p-6">
      <div className="text-center">
        {!imgSrc ? (
          <>
            <div className="relative bg-black rounded-lg overflow-hidden mb-4 aspect-video">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  facingMode,
                  width: 1280,
                  height: 720,
                }}
                className="w-full h-full object-cover"
              />
            </div>
            <Space direction="vertical" size="middle" className="md:flex-row md:space-x-2 md:space-y-0">
              <Button
                size="large"
                icon={<ReloadOutlined />}
                onClick={switchCamera}
                className="w-full md:w-auto"
              >
                Switch Camera
              </Button>
              <Button
                type="primary"
                size="large"
                icon={<CameraOutlined />}
                onClick={capture}
                className="w-full md:w-auto"
              >
                Capture Photo
              </Button>
              {onCancel && (
                <Button size="large" onClick={onCancel} className="w-full md:w-auto">
                  Cancel
                </Button>
              )}
            </Space>
          </>
        ) : (
          <>
            <div className="relative bg-black rounded-lg overflow-hidden mb-4 aspect-video">
              <img src={imgSrc} alt="Captured" className="w-full h-full object-cover" />
            </div>
            <Space direction="vertical" size="middle" className="md:flex-row md:space-x-2 md:space-y-0">
              <Button
                size="large"
                icon={<ReloadOutlined />}
                onClick={retake}
                className="w-full md:w-auto"
              >
                Retake
              </Button>
              <Button
                type="primary"
                size="large"
                icon={<CheckOutlined />}
                onClick={confirm}
                className="w-full md:w-auto"
              >
                Confirm & Upload
              </Button>
            </Space>
          </>
        )}
      </div>
    </Card>
  )
}
