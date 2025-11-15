import { Tag, Tooltip } from 'antd'
import { CheckCircleOutlined, WarningOutlined, InfoCircleOutlined } from '@ant-design/icons'

interface ConfidenceBadgeProps {
  confidence: number
}

export default function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  const percentage = Math.round(confidence * 100)

  let color = 'success'
  let icon = <CheckCircleOutlined />
  let text = 'High'

  if (confidence < 0.7) {
    color = 'error'
    icon = <WarningOutlined />
    text = 'Low'
  } else if (confidence < 0.85) {
    color = 'warning'
    icon = <InfoCircleOutlined />
    text = 'Medium'
  }

  return (
    <Tooltip title={`OCR Confidence: ${percentage}%`} placement="top">
      <Tag color={color} icon={icon}>
        <span className="text-xs md:text-sm font-medium">
          {text} ({percentage}%)
        </span>
      </Tag>
    </Tooltip>
  )
}
